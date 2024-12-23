import { Request, Response } from "express";
import prisma from "../../../Utils/prisma";
import { Batch } from "@prisma/client";

// Enum values based on Prisma schema
const validBatches = ["A", "B", "C"];


interface assignSubject {
    sem: number;
    branch: string;
    subject: number;
    faculty: string;
    type: any;
    batch: Batch;
}

export const AssignSubject = async (req: Request, res: Response) => {
    try {
        const { branch, faculty, sem, subject, type, batch }: assignSubject = req.body;

        // Check for missing fields
        if (!branch || !faculty || !sem || !subject || !batch) {
            return res.status(400).json({
                success: false,
                message: "Validation failed, Provide all fields!"
            });
        }

        // Validate batch value
        if (!validBatches.includes(batch)) {
            return res.status(400).json({
                success: false,
                message: `Invalid batch value! Valid values are: ${validBatches.join(", ")}`
            });
        }

        // Check if subject is already assigned
        const AssignSubjectToFaculty = await prisma.assignSubject.findFirst({
            where: {
                branchId: branch,
                facultyId: faculty,
                subjectCode: subject,
            }
        });

        if (AssignSubjectToFaculty) {
            return res.status(409).json({
                success: false,
                message: "Subject already assigned to faculty!"
            });
        }

        // Create assignment
        await prisma.assignSubject.create({
            data: {
                sem,
                branchId: branch,
                subjectCode: subject,
                facultyId: faculty,
                type,
                batch
            }
        });

        return res.status(200).json({
            success: true,
            message: "Subject Assigned Successfully!"
        });

    } catch (error) {
        console.error("Error in AssignSubject:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error!"
        });
    }
};
