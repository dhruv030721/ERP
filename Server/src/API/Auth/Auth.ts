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
            name,
            mobileNumber,
            password,
            confirmPassword,
            email,
            branch,
            sem,
            dob
        } = req.body;

        if (!name || !employeeId || !password || !email || !mobileNumber || !branch || !sem || !dob) {
            return res.status(400).json({
                success: false,
                message: "Provide all required fields",
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password and confirm password do not match",
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

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        // TODO : Send verification email
        await prisma.faculty.create({
            data: {
                employeeId: employeeId,
                name,
                mobileNumber: mobileNumber,
                password: hashPassword,
                email,
                branch,
                sem: Number(sem),
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
        const isMatch = await bcrypt.compare(password, user.password);


        if (isMatch) {

            const payload = {
                employeeId: user.employeeId,
                email: user.email,
                name: user.name,
                mobileNumber: user.mobileNumber
            };

            const token = await generateToken(payload);

            return res.cookie("erp_auth_token", token).status(200).json({
                success: true,
                message: "Login Successful",
                data: {
                    employeeId: user.employeeId,
                    email: user.email,
                    name: user.name,
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

export default { register, login };
