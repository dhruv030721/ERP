import { Request, Response } from "express";
import prisma from "../../../Utils/prisma";
import excelToJson from 'convert-excel-to-json';
import logger from "../../../Utils/logger";
import fs from "fs";

const BATCH_SIZE = 10; // Process 10 records at a time

export const ImportStudentdata = async (req: Request, res: Response) => {
    let file: Express.Multer.File | undefined;

    try {
        file = req.file;

        if (!file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded!"
            });
        }

        const data = excelToJson({
            sourceFile: file.path
        });

        // Validate data structure
        if (!data['Students'] || data['Students'].length < 2) {
            return res.status(400).json({
                success: false,
                message: "Invalid Excel file format or empty data"
            });
        }

        const students = data['Students'].slice(2); // Remove header rows
        const totalStudents = students.length;
        const batches = Math.ceil(totalStudents / BATCH_SIZE);
        const results = {
            success: 0,
            failed: 0,
            errors: [] as string[]
        };

        // Process in batches
        for (let batchIndex = 0; batchIndex < batches; batchIndex++) {
            const start = batchIndex * BATCH_SIZE;
            const end = Math.min(start + BATCH_SIZE, totalStudents);
            const currentBatch = students.slice(start, end);

            try {
                await prisma.$transaction(async (tx) => {
                    for (const entry of currentBatch) {
                        try {
                            // Check if user or student already exists
                            const existingUser = await tx.user.findUnique({
                                where: { user_id: entry['C'].toString() }
                            });

                            const existingStudent = await tx.student.findUnique({
                                where: { enrollmentNo: entry['A'].toString() }
                            });

                            if (existingUser || existingStudent) {
                                throw new Error(`Duplicate entry found for enrollment ${entry['A']} or mobile ${entry['C']}`);
                            }

                            // Create user and student in transaction
                            await tx.user.create({
                                data: {
                                    user_id: entry['C'].toString(),
                                    role: "STUDENT"
                                }
                            });

                            await tx.student.create({
                                data: {
                                    enrollmentNo: entry['A'].toString(),
                                    name: entry['B'].toString(),
                                    mobileNumber: entry['C'].toString(),
                                    sem: entry['D'],
                                    branchId: entry['E'],
                                    batch: entry['F']
                                }
                            });

                            results.success++;
                            logger.info(`${entry['B']} Entry Added!`);
                        } catch (error: any) {
                            results.failed++;
                            results.errors.push(`Error processing student ${entry['B']}: ${error.message}`);
                            logger.error(`Failed to process student ${entry['B']}: ${error.message}`);
                            throw error; // Rollback the transaction
                        }
                    }
                }, {
                    maxWait: 15000,
                    timeout: 30000,
                    isolationLevel: 'ReadCommitted' // Add isolation level
                });
            } catch (error: any) {
                logger.error(`Batch ${batchIndex + 1} failed: ${error.message}`);
                // Continue with next batch instead of stopping completely
                continue;
            }

            // Add a small delay between batches to prevent overloading
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // Clean up the file
        if (file.path && fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
        }

        return res.status(200).json({
            success: true,
            message: "Data Upload Completed",
            details: {
                totalProcessed: totalStudents,
                successful: results.success,
                failed: results.failed,
                errors: results.errors
            }
        });

    } catch (error: any) {
        logger.error(`Import failed: ${error.message}`);

        if (file?.path && fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
        }

        return res.status(400).json({
            success: false,
            message: "Import failed",
            error: error.message
        });
    }
};