import { Request, Response } from "express";
import prisma from "../../../Utils/prisma"
import logger from "../../../Utils/logger"

export const GetStudents = async (req: Request, res: Response) => {
    try {

        const { branch, sem } = req.body;


        if (!branch || !sem) {
            return res.status(403).json({
                success: false,
                message: "Validation failed!",
            })
        }

        const StudentData = await prisma.student.findMany({
            where: {
                sem: sem,
                branch: branch
            }
        });


        if (!StudentData) {
            return res.status(404).json({
                success: false,
                message: "No student data found!"
            })
        }



        return res.status(200).json({
            success: true,
            message: "Student Data Loaded!",
            data: StudentData
        });

    } catch (error) {
        logger.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error!",
        });
    }
}
