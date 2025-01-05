import { Request, Response } from "express";
import prisma from "../../../Utils/prisma";
import PdfDocument from "pdfkit";
import { format } from "date-fns";

interface reportParam {
    subject_code: number;
    sem: number;
    month: number;
}

export const AttendanceReport = async (req: Request, res: Response) => {
    try {
        const { subject_code, sem }: reportParam = req.params as unknown as reportParam;
        console.log('Received params:', { subject_code, sem }); // Debug log

        if (!subject_code || !sem) {
            return res.status(407).json({
                success: false,
                message: "Validation Error!"
            });
        }

        const subjectCode = Number(subject_code);
        const semester = Number(sem);

        if (isNaN(subjectCode) || isNaN(semester)) {
            return res.status(407).json({
                success: false,
                message: "Validation Error! subject_code and sem must be numbers."
            });
        }

        // Fetch attendance data
        const AttendanceData = await prisma.attendance.findMany({
            where: {
                subjectCode: subjectCode,
                sem: semester,
            },
            select: {
                date: true,
                studentEnrollmentNo: true,
                status: true
            }
        });

        const SubjectData = await prisma.subject.findUnique({
            where: {
                code: subjectCode
            }
        })

        console.log('Attendance Data count:', AttendanceData.length); // Debug log

        // Extract unique dates
        const uniqueDates = Array.from(new Set(AttendanceData.map(record => format(record.date, 'yyyy-MM-dd'))));
        const days = uniqueDates.map(dateStr => new Date(dateStr));
        console.log('Unique dates count:', days.length); // Debug log

        const StudentData = await prisma.student.findMany({
            where: {
                sem: semester
            },
            select: {
                enrollmentNo: true,
                name: true
            }
        });
        console.log('Student Data count:', StudentData.length); // Debug log

        const groupedData = AttendanceData.reduce((acc: any, record: any) => {
            const enrollmentNo = record.studentEnrollmentNo;
            if (!acc[enrollmentNo]) {
                acc[enrollmentNo] = [];
            }
            acc[enrollmentNo].push(record);
            return acc;
        }, {});

        // Buffer approach for PDF generation
        const chunks: Buffer[] = [];

        // Create PDF document
        const doc = new PdfDocument({
            size: 'A3',
            margin: 20,
            layout: 'landscape',
            bufferPages: true
        });

        // Handle document chunks
        doc.on('data', (chunk) => chunks.push(Buffer.from(chunk)));

        // Handle document end
        doc.on('end', () => {
            const pdfBuffer = Buffer.concat(chunks);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader(
                'Content-Disposition',
                `attachment; filename=AttendanceReport_${subjectCode}_${Date.now()}.pdf`
            );
            res.send(pdfBuffer);
        });

        // Add report title and metadata
        doc.fillColor("Black")
            .font("Helvetica-Bold")
            .fontSize(16)
            .text("Attendance Report", { align: 'center' });

        doc.font("Helvetica")
            .fillColor("Black")
            .fontSize(14)
            .text(`Subject: ${subjectCode} - (${SubjectData?.name})`, { align: 'center' })
            .text(`Semester: ${semester}`, { align: 'center' });

        doc.moveDown();

        // Table constants
        const columnWidth = 45;
        const rowHeight = 20;
        const fontSize = 10;
        const textHeight = fontSize;

        // Table header
        let tableTop = doc.y + 10;
        const tableLeft = 20;
        const enrollmentColumnLeft = tableLeft;
        const nameColumnLeft = enrollmentColumnLeft + 100;
        const dayColumnLeft = nameColumnLeft + 250;

        let verticalCenter = tableTop + (rowHeight / 2) - (textHeight / 2);

        // Draw header cells
        doc.font("Helvetica-Bold")
            .fontSize(fontSize);

        // Enrollment header
        doc.text("Enrollment No.", enrollmentColumnLeft, verticalCenter, { width: 100, align: 'center' })
            .rect(enrollmentColumnLeft, tableTop, 100, rowHeight)
            .stroke();

        // Name header
        doc.text("Name", nameColumnLeft, verticalCenter, { width: 300, align: 'center' })
            .rect(nameColumnLeft, tableTop, 250, rowHeight)
            .stroke();

        // Date headers
        days.forEach((day, index) => {
            const formattedDay = format(day, 'dd-MM');
            doc.text(formattedDay, dayColumnLeft + (index * columnWidth), verticalCenter, { width: columnWidth, align: 'center' })
                .rect(dayColumnLeft + (index * columnWidth), tableTop, columnWidth, rowHeight)
                .stroke();
        });

        // Percentage header
        doc.text("%", dayColumnLeft + (days.length * columnWidth), verticalCenter, { width: columnWidth, align: 'center' })
            .rect(dayColumnLeft + (days.length * columnWidth), tableTop, columnWidth, rowHeight)
            .stroke();

        tableTop += rowHeight;

        // Student rows
        const total_present: { [key: string]: number } = {};

        StudentData.forEach((data) => {
            // Check page overflow
            if (tableTop + rowHeight > doc.page.height - doc.page.margins.bottom) {
                doc.addPage();
                tableTop = doc.page.margins.top;
            }

            verticalCenter = tableTop + (rowHeight / 2) - (textHeight / 2);

            // Student info
            doc.font("Helvetica")
                .fontSize(fontSize)
                .text(`${data.enrollmentNo}`, enrollmentColumnLeft, verticalCenter, { width: 100, align: 'center' })
                .rect(enrollmentColumnLeft, tableTop, 100, rowHeight)
                .stroke()
                .text(data.name, nameColumnLeft + 10, verticalCenter, { width: 250, align: 'left' })
                .rect(nameColumnLeft, tableTop, 250, rowHeight)
                .stroke();

            let totalday = days.length;
            let presentDay = 0;

            // Attendance marks
            days.forEach((day, index) => {
                const formattedDay = format(day, 'yyyy-MM-dd');
                const attendanceRecord = groupedData[data.enrollmentNo]?.find(
                    (record: any) => format(record.date, 'yyyy-MM-dd') === formattedDay
                );

                const attendanceMark = attendanceRecord
                    ? attendanceRecord.status === "PRESENT"
                        ? 'P'
                        : attendanceRecord.status === "ABSENT"
                            ? 'A'
                            : 'L'
                    : 'A';

                if (attendanceMark === 'P') {
                    presentDay++;
                    total_present[formattedDay] = (total_present[formattedDay] || 0) + 1;
                }

                // Set color based on status
                doc.fillColor(
                    attendanceMark === 'P' ? 'green' :
                        attendanceMark === 'A' ? 'red' : 'blue'
                );

                doc.text(
                    attendanceMark,
                    dayColumnLeft + (index * columnWidth),
                    verticalCenter,
                    { width: columnWidth, align: 'center' }
                )
                    .rect(dayColumnLeft + (index * columnWidth), tableTop, columnWidth, rowHeight)
                    .stroke();

                doc.fillColor('black');
            });

            // Calculate and add percentage
            const average = ((presentDay / totalday) * 100).toFixed(1);
            doc.text(
                `${average}%`,
                dayColumnLeft + (days.length * columnWidth),
                verticalCenter,
                { width: columnWidth, align: 'center' }
            )
                .rect(dayColumnLeft + (days.length * columnWidth), tableTop, columnWidth, rowHeight)
                .stroke();

            tableTop += rowHeight;
        });

        // Total present row
        verticalCenter = tableTop + (rowHeight / 2) - (textHeight / 2);

        doc.font("Helvetica-Bold")
            .fontSize(fontSize)
            .text(
                "Total Present:",
                enrollmentColumnLeft,
                verticalCenter,
                { width: 350, align: 'center' }
            )
            .rect(enrollmentColumnLeft, tableTop, 350, rowHeight)
            .stroke();

        days.forEach((day, index) => {
            const formattedDay = format(day, 'yyyy-MM-dd');
            const total = total_present[formattedDay] || 0;

            doc.text(
                `${total}`,
                dayColumnLeft + (index * columnWidth),
                verticalCenter,
                { width: columnWidth, align: 'center' }
            )
                .rect(dayColumnLeft + (index * columnWidth), tableTop, columnWidth, rowHeight)
                .stroke();
        });

        // End the document
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