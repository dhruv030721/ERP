import { Request, Response } from "express";
import prisma from "../../../Utils/prisma";
import logger from "../../../Utils/logger";
import { getISTDateAndTime } from "../../../Utils/date";

export const MarkAttendance = async (req: Request, res: Response) => {
    try {
        const { subject, facultyId, time, day, attendance, branch, sem } = req.body;

        const date = getISTDateAndTime();

        if (!subject || !facultyId || !time || !day || !attendance || !branch || !sem) {
            return res.status(403).json({
                success: false,
                message: "Validation failed!",
            });
        }

        for (let Student in attendance) {
            await prisma.attendance.create({
                data: {
                    branch,
                    day,
                    sem,
                    time,
                    subjectCode: subject,
                    facultyEmployeeId: facultyId,
                    studentEnrollmentNo: Student,
                    status: attendance[Student],
                    date: date
                }
            });
        }

        return res.status(200).json({
            success: true,
            message: "Attendance Marked Successfully!",
        });

    } catch (error) {
        logger.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error!",
        });
    }
}
