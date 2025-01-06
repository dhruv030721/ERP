import { Request, Response } from "express";
import prisma from "../../../Utils/prisma";
import logger from "../../../Utils/logger";
import { AttendanceType, LectureType, Batch } from "@prisma/client";

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
    type: LectureType;
    batch: Batch
}

export const MarkAttendance = async (req: Request<{}, {}, AttendanceRequestBody>, res: Response) => {
    try {
        console.log(req.body);
        const { subject, facultyId, time, day, attendance, branch, sem, date, type, batch } = req.body;

        if (!subject || !facultyId || !time || !day || !attendance || !branch || !sem || !type) {
            return res.status(403).json({
                success: false,
                message: "Validation failed!",
            });
        }

        if (type == "LAB" && batch == null) {
            return res.status(407).json({
                success: false,
                message: "Validation Error!"
            })
        }

        const attendanceEntries = Object.entries(attendance);
        const totalAttendance = attendanceEntries.length;
        const batches = Math.ceil(totalAttendance / BATCH_SIZE);
        const results = {
            success: 0,
            failed: 0,
            errors: [] as string[]
        }

        for (let batchIndex = 0; batchIndex < batches; batchIndex++) {
            const start = batchIndex * BATCH_SIZE;
            const end = Math.min(start + BATCH_SIZE, totalAttendance);
            const currentBatch = attendanceEntries.slice(start, end);

            const attendanceData = currentBatch.map(([studentEnrollmentNo, status]) => ({
                branchId: parseInt(branch),
                day,
                sem,
                time,
                subjectCode: subject,
                facultyEmployeeId: facultyId,
                studentEnrollmentNo,
                status,
                date,
                type,
                batch: type === "LAB" ? batch : null, // Conditional batch assignment
            }));

            try {
                await prisma.$transaction(async (tx) => {
                    const result = await tx.attendance.createMany({
                        data: attendanceData,
                        skipDuplicates: true, // Optional: skips duplicates
                    });

                    results.success += result.count;
                    logger.info(`Batch ${batchIndex + 1} Attendance Marked ✅!`);
                }, {
                    maxWait: 15000, // Maximum wait time for acquiring a transaction
                    timeout: 30000, // Maximum execution time
                    isolationLevel: "ReadCommitted", // Optional: Define the isolation level
                });
            } catch (error) {
                results.failed += currentBatch.length;
                results.errors.push(`Error processing batch ${batchIndex + 1}`);
                logger.error(`Batch ${batchIndex + 1} Attendance Failed ❌!`);
            }
        }


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
