import { Request, Response } from "express";
import prisma from "../../../Utils/prisma";

export const GetAssignSubject = async (req: Request, res: Response) => {
    try {
        const { facultyId } = req.body;

        if (!facultyId) {
            return res.status(400).json({
                success: false,
                message: "Validation failed, Provide all fields!"
            })
        }

        const Data = await prisma.assignSubject.findMany({
            where: {
                facultyId
            },
            include: {
                subject: true
            }
        })

        if (!Data) {
            return res.status(404).json({
                success: false,
                message: "Data not found!"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Data fetched successfully!",
            data: Data
        })


    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Interval Server Error!"
        })
    }
}