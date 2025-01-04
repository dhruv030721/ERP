import logger from "../../../Utils/logger"
import prisma from "../../../Utils/prisma";
import { Request, Response } from "express";

export const GetBranch = async (req: Request, res: Response) => {
    try {

        const BranchData = await prisma.branch.findMany({});

        if (!BranchData) {
            return res.status(404).json({
                success: false,
                message: "Branch data not found!"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Branch data fetched successfully!",
            data: BranchData
        })

    } catch (error) {
        logger.error(error);
    }
}