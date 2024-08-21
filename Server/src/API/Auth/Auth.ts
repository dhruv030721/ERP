import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import logger from "../../Utils/logger";
import { GetFormattedDate } from "../../Utils/date";

const prisma = new PrismaClient();

const generateToken = async (payload: any) => {
    try {
        const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
            expiresIn: "1d",
        });

        return token;
    } catch (error: any) {
        logger.error(error);
        throw new Error("Something went wrong!");
    }
};

const register = async (req: Request, res: Response) => {
    try {
        const {
            employeeId,
            mobileNumber,
            email,
            first_name,
            middle_name,
            last_name,
            gender,
            dob
        } = req.body;

        if (!first_name || !middle_name || !last_name || !employeeId || !email || !mobileNumber || !dob) {
            return res.status(400).json({
                success: false,
                message: "Provide all required fields",
            });
        }


        const user = await prisma.faculty.findFirst({
            where: {
                employeeId: employeeId,
            },
        });

        if (user) {
            logger.info(`User already exists: ${user}`);
            return res.status(403).json({
                success: false,
                message: "User already exists",
            });
        }

        // TODO : Send verification email
        await prisma.faculty.create({
            data: {
                employeeId: employeeId,
                first_name,
                middle_name,
                last_name,
                gender,
                mobileNumber: mobileNumber,
                email,
                dob: GetFormattedDate(dob)
            },
        });

        return res.status(200).json({
            success: true,
            message: "User created successfully",
        });

    } catch (error: any) {
        logger.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error!",
        });
    }
};

const login = async (req: Request, res: Response) => {
    try {
        const { employeeId, password } = req.body;

        if (!employeeId || !password) {
            return res.status(400).json({
                message: "Please provide all the required fields",
            });
        }

        const user = await prisma.faculty
            .findFirst({
                where: {
                    employeeId: employeeId,
                },
            })

        if (!user) {
            return res.status(404).json({
                sucess: false,
                message: "User not found!",
            });
        }
        if (!user.password) {
            return res.status(401).json({
                success: false,
                message: "User not registered!"
            })
        }
        const isMatch = await bcrypt.compare(password, user.password);

        const username = user.first_name + " " + user.last_name;

        if (isMatch) {

            const payload = {
                employeeId: user.employeeId,
                email: user.email,
                name: username,
                mobileNumber: user.mobileNumber
            };

            const token = await generateToken(payload);

            return res.cookie("erp_auth_token", token).status(200).json({
                success: true,
                message: "Login Successful",
                data: {
                    employeeId: user.employeeId,
                    email: user.email,
                    name: username,
                    mobileNumber: user.mobileNumber,
                },
            });
        } else {
            return res.status(400).json({
                success: true,
                message: "Incorrect Password!",
            });
        }
    } catch (error) {
        logger.error(error);
        return res.status(400).json({
            success: false,
            message: "Internal Server Error!",
        });
    }
};

const UpdatePassword = async (req: Request, res: Response) => {

}

export default { register, login };
