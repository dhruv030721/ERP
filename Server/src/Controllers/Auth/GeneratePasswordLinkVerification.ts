import { Request, Response } from "express"
import logger from "../../Utils/logger";
import prisma from "../../Utils/prisma";

const GeneratePasswordLinkVerification = async (req: Request, res: Response) => {
    try {

        const { mobileNumber } = req.body;

        if (!mobileNumber) {
            return res.status(400).json({
                success: false,
                message: "Validation Error!"
            })
        }

        const token = await prisma.token.findFirst({
            where: {
                id: mobileNumber
            }
        })

        if (token) {
            return res.status(200).json({
                success: true,
                message: "Token found!"
            })
        } else {
            return res.status(404).json({
                success: false,
                message: "Token not found!"
            })
        }


    } catch (error) {
        logger.error(error);
        return res.status(500).json({
            success: false,
            message: "Interval Server Error!"
        })
    }
}

export default GeneratePasswordLinkVerification;