import { Request, Response } from "express";
import prisma from "../../../Utils/prisma";
import logger from "../../../Utils/logger";

export const GetSubjects = async (req: Request, res: Response) => {
    try {

        const SubjectData = await prisma.subject.findMany({})

        return res.status(200).json({
            success: true,
            message: "Data Retrieved Successfully!",
            data: SubjectData
        });

    } catch (error) {
        logger.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error!",
        });
    }
};
