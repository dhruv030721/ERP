import { Request, Response } from "express"
import logger from "../../../Utils/logger"
import prisma from "../../../Utils/prisma"

export const GetFaculty = async (req: Request, res: Response) => {
    try {

        const facultyData = await prisma.faculty.findMany({});

        if (!facultyData) {
            return res.status(404).json({
                success: false,
                message: "Faculty data not found!",
                data: facultyData
            })
        }

        return res.status(200).json({
            success: true,
            message: "Faculty data get successfully!",
            data: facultyData
        })

    } catch (error) {
        logger.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error!"
        })
    }
}
