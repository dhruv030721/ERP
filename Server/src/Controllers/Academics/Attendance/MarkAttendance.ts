import { Request, Response } from "express";
import prisma from "../../../Utils/prisma";
import logger from "../../../Utils/logger";
import { AttendanceType } from "@prisma/client";

const BATCH_SIZE = 10;

interface AttendanceRequestBody {
    subject: number;
    facultyId: string;
    time: string;
    day: string;
    attendance: { [studentEnrollmentNo: string]: AttendanceType };
    branch: string;
    sem: number;
    date: string;
}

export const MarkAttendance = async (req: Request<{}, {}, AttendanceRequestBody>, res: Response) => {
    try {
        const { subject, facultyId, time, day, attendance, branch, sem, date } = req.body;


        if (!subject || !facultyId || !time || !day || !attendance || !branch || !sem) {
            return res.status(403).json({
                success: false,
                message: "Validation failed!",
            });
        }

        const attendanceEntries = Object.entries(attendance);
        const totalAttendance = attendanceEntries.length;
        const batches = Math.ceil(totalAttendance / BATCH_SIZE);
        const results = {
            success: 0,
            failed: 0,
            errors: [] as string[]
        }

        console.log(`totalAttendance: ${totalAttendance}`)
        console.log(`Batches: ${batches}`)

        for (let batchIndex = 0; batchIndex < batches; batchIndex++) {
            const start = batchIndex * BATCH_SIZE;
            const end = Math.min(start + BATCH_SIZE, totalAttendance);
            const currentBatch = attendanceEntries.slice(start, end); // Slice the array of entries

            await prisma.$transaction(async (tx) => {
                for (const [studentEnrollmentNo, status] of currentBatch) {
                    try {
                        await tx.attendance.create({
                            data: {
                                branchId: parseInt(branch),
                                day,
                                sem,
                                time,
                                subjectCode: subject,
                                facultyEmployeeId: facultyId,
                                studentEnrollmentNo,
                                status,
                                date: date
                            }
                        });

                        logger.info(`${studentEnrollmentNo} -> ${subject} Attendance ${status} Marked ✅!`);
                        results.success++;
                    } catch (error) {
                        results.failed++;
                        results.errors.push(`Error processing attendance for ${studentEnrollmentNo}`);
                        logger.error(`${studentEnrollmentNo} -> ${subject} Attendance ${status} Failed ❌!`);
                        throw error; // Throw to rollback the batch if there's an error
                    }
                }
            }, {
                maxWait: 15000,
                timeout: 30000,
                isolationLevel: "ReadCommitted"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Attendance Marked Successfully!",
            result_matrix: results
        });


        return res.status(200).json({
            success: true,
            message: "Attendance Marked Successfully!",
            result_matrix: results
        });

    } catch (error) {
        logger.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error!",
        });
    }
}
