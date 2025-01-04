import { Request, Response } from "express";
import prisma from "../../../Utils/prisma";
import PdfDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { format } from "date-fns";

interface reportParam {
    subject_code: number;
    sem: number;
    month: number;
}

export const MonthlyAttendanceReport = async (req: Request, res: Response) => {
    try {
        const { subject_code, sem, month }: reportParam = req.params as unknown as reportParam;

        if (!subject_code || !sem || !month) {
            return res.status(407).json({
                success: false,
                message: "Validation Error!"
            });
        }

        // Convert sem and subject_code to numbers if they are strings
        const subjectCode = Number(subject_code);
        const semester = Number(sem);

        if (isNaN(subjectCode) || isNaN(semester)) {
            return res.status(407).json({
                success: false,
                message: "Validation Error! subject_code and sem must be numbers."
            });
        }

        // Convert month to zero-padded string
        const monthString = month.toString().padStart(2, '0');
        const year = new Date().getFullYear(); // You may need to adjust how you determine the year

        const startDate = new Date(`${year}-${monthString}-01`);
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 1);

        // Fetch attendance data
        const AttendanceData = await prisma.attendance.findMany({
            where: {
                subjectCode: subjectCode,
                sem: semester,
                date: {
                    gte: startDate,
                    lt: endDate
                },
            },
            select: {
                date: true,
                studentEnrollmentNo: true,
                status: true
            }
        });

        // Extract unique dates from attendance data
        const uniqueDates = Array.from(new Set(AttendanceData.map(record => format(record.date, 'yyyy-MM-dd'))));

        // Filter days to include only those with attendance records
        const days = uniqueDates.map(dateStr => new Date(dateStr));

        const StudentData = await prisma.student.findMany({
            where: {
                sem: semester
            },
            select: {
                enrollmentNo: true,
                name: true
            }
        });

        const groupedData = AttendanceData.reduce((acc: any, record: any) => {
            const enrollmentNo = record.studentEnrollmentNo;
            if (!acc[enrollmentNo]) {
                acc[enrollmentNo] = [];
            }
            acc[enrollmentNo].push(record);
            return acc;
        }, {});

        // Creating PDF 
        const doc = new PdfDocument({ size: 'A2', margin: 20, layout: 'landscape' });

        // Set the response headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=MonthlyAttendanceReport.pdf');

        const filePath = path.join(__dirname, `MonthlyAttendanceReport_${subjectCode}_${month}_${year}.pdf`);
        const fileStream = fs.createWriteStream(filePath);

        doc.pipe(fileStream);

        // Add report title and metadata
        doc.fillColor("Black").font("Helvetica-Bold").fontSize(16).text("Monthly Attendance Report", { align: 'center' });
        doc.font("Helvetica").fillColor("Black").fontSize(14).text(`Subject : ${subjectCode}`, { align: 'center' });
        doc.font("Helvetica").fillColor("Black").fontSize(12).text(`Month : ${month}`, { align: 'center' });
        doc.moveDown();

        const columnWidth = 45;
        const rowHeight = 20;
        const fontSize = 10;
        const textHeight = fontSize; // Approximate text height as the font size

        // Days header
        let tableTop = doc.y + 10;
        let tableLeft = 20;
        const enrollmentColumnLeft = tableLeft;
        const nameColumnLeft = enrollmentColumnLeft + 100;
        const dayColumnLeft = nameColumnLeft + 150;

        let verticalCenter = tableTop + (rowHeight / 2) - (textHeight / 2);

        doc.font("Helvetica-Bold").fontSize(fontSize).text("Enrollment No.", enrollmentColumnLeft, verticalCenter, { width: 100, align: 'center' });
        doc.rect(enrollmentColumnLeft, tableTop, 100, rowHeight).stroke();
        doc.font("Helvetica-Bold").fontSize(fontSize).text("Name", nameColumnLeft, verticalCenter, { width: 150, align: 'center' });
        doc.rect(nameColumnLeft, tableTop, 150, rowHeight).stroke();

        days.forEach((day, index) => {
            const formattedDay = format(day, 'd E');
            doc.font("Helvetica-Bold").fontSize(fontSize).text(formattedDay, dayColumnLeft + (index * columnWidth), verticalCenter, { width: columnWidth, align: 'center' });
            doc.rect(dayColumnLeft + (index * columnWidth), tableTop, columnWidth, rowHeight).stroke();
        });

        doc.font("Helvetica-Bold").fontSize(fontSize).text("%", dayColumnLeft + (days.length * columnWidth), verticalCenter, { width: columnWidth, align: 'center' });
        doc.rect(dayColumnLeft + (days.length * columnWidth), tableTop, columnWidth, rowHeight).stroke();

        tableTop += rowHeight;

        // Add attendance data
        const pageHeight = doc.page.height - doc.page.margins.bottom;

        const total_present: { [key: string]: number } = {};

        // Creating student enrollment no and name row
        StudentData.forEach((data) => {
            if (tableTop + rowHeight > pageHeight) {
                doc.addPage();
                tableTop = doc.y;
            }
            verticalCenter = tableTop + (rowHeight / 2) - (textHeight / 2); // Calculate vertical center for each row
            doc.font("Helvetica").fontSize(fontSize).text(`${data.enrollmentNo}`, enrollmentColumnLeft, verticalCenter, { width: 100, align: 'center' });
            doc.rect(enrollmentColumnLeft, tableTop, 100, rowHeight).stroke();
            doc.font("Helvetica").fontSize(fontSize).text(data.name, nameColumnLeft + 10, verticalCenter, { width: 150, align: 'left' });
            doc.rect(nameColumnLeft, tableTop, 150, rowHeight).stroke();

            let totalday = days.length;
            let presentDay = 0;
            // Add attendance marks for each day
            days.forEach((day, index) => {
                const formattedDay = format(day, 'yyyy-MM-dd');
                const attendanceRecord = groupedData[data.enrollmentNo]?.find((record: any) => format(record.date, 'yyyy-MM-dd') === formattedDay);
                const attendanceMark = attendanceRecord ? (attendanceRecord.status === "Present" ? 'P' : 'A') : 'A'; // Example: 'P' for present, 'A' for absent

                if (attendanceMark == 'P') {
                    presentDay++;
                    if (!total_present[formattedDay]) total_present[formattedDay] = 0;
                    total_present[formattedDay]++;
                }
                doc.font("Helvetica").fontSize(fontSize).text(attendanceMark, dayColumnLeft + (index * columnWidth), verticalCenter, { width: columnWidth, align: 'center' });
                doc.rect(dayColumnLeft + (index * columnWidth), tableTop, columnWidth, rowHeight).stroke();
            });

            let average = (presentDay / totalday) * 100;

            doc.font("Helvetica").fontSize(fontSize).text(`${average}%`, dayColumnLeft + (days.length * columnWidth), verticalCenter, { width: columnWidth, align: 'center' });
            doc.rect(dayColumnLeft + (days.length * columnWidth), tableTop, columnWidth, rowHeight).stroke();

            tableTop += rowHeight;
            doc.moveDown();
        });

        // Calculate new verticalCenter for the "Total Present" row
        verticalCenter = tableTop + (rowHeight / 2) - (textHeight / 2) + 2;

        doc.font("Helvetica").fontSize(fontSize).text(`Total Present:`, enrollmentColumnLeft, verticalCenter, { width: 250, align: 'center' });
        doc.rect(enrollmentColumnLeft, tableTop, 250, rowHeight).stroke();

        days.forEach((day, index) => {
            const formattedDay = format(day, 'yyyy-MM-dd');
            const total_present_record = total_present[formattedDay] || 0; // Default to 0 if no presents on that day

            doc.font("Helvetica").fontSize(fontSize).text(`${total_present_record}`, dayColumnLeft + (index * columnWidth), verticalCenter, { width: columnWidth, align: 'center' });
            doc.rect(dayColumnLeft + (index * columnWidth), tableTop, columnWidth, rowHeight).stroke();
        });

        // Finalize the PDF and end the stream
        doc.end();

        // Wait for the file to be fully written
        fileStream.on('finish', () => {
            // Stream the file to the client
            const fileStreamRead = fs.createReadStream(filePath);
            fileStreamRead.pipe(res);
        });

    } catch (error: any) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};
