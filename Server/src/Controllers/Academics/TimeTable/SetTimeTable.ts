import excelToJson from "convert-excel-to-json";
import logger from "../../../Utils/logger";
import { Request, Response } from "express";
import prisma from "../../../Utils/prisma";
import fs from 'fs';

export const SetTimeTable = async (req: Request, res: Response) => {

    let file : Express.Multer.File | undefined;

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
        if (!data['Timetable'] || data['Timetable'].length < 2) {
            return res.status(400).json({
                success: false,
                message: "Invalid Excel file format or empty data"
            });
        }

        // Process all entries in a single transaction
        const result = await prisma.$transaction(async (tx) => {
            const results = [];

            for (let i = 2; i < data['Timetable'].length; i++) {
                const entry = data['Timetable'][i];
                const facultyId = entry['E']?.toString();

                if (!facultyId) continue;

                const faculty = await tx.faculty.findUnique({
                    where: {
                        mobileNumber: facultyId
                    }
                });

                if (faculty) {
                    const timeTableEntry = await tx.timeTable.create({
                        data: {
                            time: entry['B']?.toString() || "",
                            day: entry['C']?.toString() || "",
                            subject: entry['D']?.toString() || "",
                            facultyId: facultyId,
                            lectureType: entry['F']?.toString() || "",
                            batch: entry['G']?.toString() || "",
                            branchId: entry['H'],
                            sem: entry['I'],
                        }
                    });

                    results.push({
                        success: true,
                        subject: entry['D']?.toString(),
                        faculty: faculty.first_name
                    });

                    logger.info(`${entry['D']?.toString()} - ${faculty.first_name} Entry Added!`);
                } else {
                    results.push({
                        success: false,
                        facultyId: facultyId,
                        error: 'Faculty not found'
                    });
                    logger.error(`Faculty with ID ${facultyId} not found!`);
                }
            }

            return results;
        }, {
            maxWait: 15000, // Maximum time to wait for transaction to start
            timeout: 30000  // Maximum time for the transaction to complete
        });

        // Clean up the uploaded file
        if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
        }

        return res.status(200).json({
            success: true,
            message: "Timetable set successfully!",
            details: result
        });

    } catch (error: any) {
        logger.error(`Timetable upload error: ${error.message}`);

        // Clean up the uploaded file in case of error
        if (file && fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
        }

        return res.status(400).json({
            success: false,
            message: "Error processing timetable",
            error: error.message
        });
    }
};