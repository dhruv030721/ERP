import { Request, Response } from "express";
import prisma from "../../../Utils/prisma";
import PdfDocument from "pdfkit";
import { format } from "date-fns";
import { LectureType, Batch } from "@prisma/client";

interface ReportParam {
    subject_code: number;
    sem: number;
    type: LectureType;
    batch: Batch;
}

interface StudentAttendance {
    [key: string]: {
        name: string;
        attendance: { [date: string]: 'P' | 'A' | 'L' };
    };
}

export const AttendanceReport = async (req: Request, res: Response) => {
    try {
        const { subject_code, sem, type, batch }: ReportParam = req.body;

        // Validation checks
        if (!subject_code || !sem || !type || (type === "LAB" && !batch)) {
            return res.status(403).json({
                success: false,
                message: "Validation Error!"
            });
        }

        const subjectCode = Number(subject_code);
        const semester = Number(sem);

        if (isNaN(subjectCode) || isNaN(semester)) {
            return res.status(403).json({
                success: false,
                message: "Validation Error! subject_code and sem must be numbers."
            });
        }

        // Fetch attendance data
        const attendanceData = await prisma.attendance.findMany({
            where: {
                subjectCode,
                sem: semester,
                type,
                ...(type === "LAB" && { batch })
            },
            include: {
                enrollmentNo: true
            },
            orderBy: {
                date: 'asc'
            }
        });

        const subjectData = await prisma.subject.findUnique({
            where: { code: subjectCode }
        });

        // Process attendance data
        const uniqueDates = Array.from(new Set(attendanceData.map(record => 
            format(record.date, 'yyyy-MM-dd')
        ))).sort();
        
        // Organize data by student
        const studentAttendance: StudentAttendance = {};
        attendanceData.forEach(record => {
            const enrollmentNo = record.enrollmentNo.enrollmentNo;
            if (!studentAttendance[enrollmentNo]) {
                studentAttendance[enrollmentNo] = {
                    name: record.enrollmentNo.name,
                    attendance: {}
                };
            }
            const dateStr = format(record.date, 'yyyy-MM-dd');
            studentAttendance[enrollmentNo].attendance[dateStr] = 
                record.status === "PRESENT" ? 'P' : 
                record.status === "ABSENT" ? 'A' : 'L';
        });

        // PDF Generation
        const chunks: Buffer[] = [];
        const doc = new PdfDocument({
            size: 'A3',
            margin: 20,
            layout: 'landscape',
            bufferPages: true
        });

        doc.on('data', chunk => chunks.push(Buffer.from(chunk)));
        doc.on('end', () => {
            const pdfBuffer = Buffer.concat(chunks);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 
                `attachment; filename=AttendanceReport_${subjectCode}_${Date.now()}.pdf`);
            res.send(pdfBuffer);
        });

        // Table Settings
        const columnWidth = 45;
        const rowHeight = 20;
        const fontSize = 10;
        const tableLeft = 20;
        const enrollmentColumnWidth = 100;
        const nameColumnWidth = 250;
        let currentY = 20;  // Start position for the first page

        // Document Header (only on first page)
        doc.fillColor("Black")
            .font("Helvetica-Bold")
            .fontSize(16)
            .text("Attendance Report", { align: 'center' })
            .fontSize(14)
            .text(`Subject: ${subjectCode} - (${subjectData?.name}) ${type === "LAB" ? `Lab Batch - ${batch}` : "Lecture"}`, { align: 'center' })
            .text(`Semester: ${semester}`, { align: 'center' })
            .moveDown();

        currentY = doc.y + 10;  // Update starting position after headers

        // Draw Table Headers (only on first page)
        const drawHeaders = () => {
            doc.font("Helvetica-Bold").fontSize(fontSize);
            let currentX = tableLeft;

            // Enrollment and Name headers
            doc.rect(currentX, currentY, enrollmentColumnWidth, rowHeight).stroke()
               .text("Enrollment No.", currentX, currentY + 5, { width: enrollmentColumnWidth, align: 'center' });
            currentX += enrollmentColumnWidth;

            doc.rect(currentX, currentY, nameColumnWidth, rowHeight).stroke()
               .text("Name", currentX, currentY + 5, { width: nameColumnWidth, align: 'center' });
            currentX += nameColumnWidth;

            // Date headers
            uniqueDates.forEach(date => {
                doc.rect(currentX, currentY, columnWidth, rowHeight).stroke()
                   .text(format(new Date(date), 'dd-MM'), currentX, currentY + 5, 
                         { width: columnWidth, align: 'center' });
                currentX += columnWidth;
            });

            // Percentage header
            doc.rect(currentX, currentY, columnWidth, rowHeight).stroke()
               .text("%", currentX, currentY + 5, { width: columnWidth, align: 'center' });

            currentY += rowHeight;
        };

        // Draw Content
        const drawContent = () => {
            const dailyPresent: { [key: string]: number } = {};
            
            Object.entries(studentAttendance).forEach(([enrollmentNo, data]) => {
                if (currentY + rowHeight > doc.page.height - 50) {
                    doc.addPage();
                    currentY = 20;  // Start from top on new pages
                }

                let currentX = tableLeft;
                doc.font("Helvetica").fontSize(fontSize);

                // Enrollment and Name
                doc.rect(currentX, currentY, enrollmentColumnWidth, rowHeight).stroke()
                   .text(enrollmentNo, currentX, currentY + 5, 
                         { width: enrollmentColumnWidth, align: 'center' });
                currentX += enrollmentColumnWidth;

                doc.rect(currentX, currentY, nameColumnWidth, rowHeight).stroke()
                   .text(data.name, currentX + 5, currentY + 5, 
                         { width: nameColumnWidth - 10, align: 'left' });
                currentX += nameColumnWidth;

                // Attendance marks
                let presentCount = 0;
                uniqueDates.forEach(date => {
                    const status = data.attendance[date] || 'A';
                    if (status === 'P') {
                        presentCount++;
                        dailyPresent[date] = (dailyPresent[date] || 0) + 1;
                    }

                    doc.fillColor(status === 'P' ? 'green' : status === 'A' ? 'red' : 'blue')
                       .rect(currentX, currentY, columnWidth, rowHeight).stroke()
                       .text(status, currentX, currentY + 5, 
                            { width: columnWidth, align: 'center' });
                    currentX += columnWidth;
                });

                // Percentage
                const percentage = ((presentCount / uniqueDates.length) * 100).toFixed(1);
                doc.fillColor('black')
                   .rect(currentX, currentY, columnWidth, rowHeight).stroke()
                   .text(`${percentage}%`, currentX, currentY + 5, 
                         { width: columnWidth, align: 'center' });

                currentY += rowHeight;
            });

            // Total Present Row
            if (currentY + rowHeight > doc.page.height - 50) {
                doc.addPage();
                currentY = 20;
            }

            let currentX = tableLeft;
            doc.font("Helvetica-Bold").fontSize(fontSize);
            
            doc.rect(currentX, currentY, enrollmentColumnWidth + nameColumnWidth, rowHeight).stroke()
               .text("Total Present:", currentX, currentY + 5, 
                     { width: enrollmentColumnWidth + nameColumnWidth, align: 'center' });
            currentX += enrollmentColumnWidth + nameColumnWidth;

            uniqueDates.forEach(date => {
                doc.rect(currentX, currentY, columnWidth, rowHeight).stroke()
                   .text(`${dailyPresent[date] || 0}`, currentX, currentY + 5, 
                         { width: columnWidth, align: 'center' });
                currentX += columnWidth;
            });
        };

        // Draw the table only once
        drawHeaders();
        drawContent();
        doc.end();

    } catch (error: any) {
        console.error('Error generating PDF:', error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};