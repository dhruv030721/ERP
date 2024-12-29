import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt, { Secret } from "jsonwebtoken";
import logger from "../../Utils/logger";
import { GetFormattedDate } from "../../Utils/date";
import SendMail from "./SendMail";
import Faculty from "../Academics/Faculty";
import path from "path";
import ejs from "ejs";

const prisma = new PrismaClient();

const generateToken = async (payload: any, expires: string = "1d") => {
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
            mobileNumber,
            email,
            first_name,
            middle_name,
            last_name,
            gender,
            dob
        } = req.body;

        if (!first_name || !middle_name || !last_name || !email || !mobileNumber || !dob) {
            return res.status(400).json({
                success: false,
                message: "Provide all required fields",
            });
        }


        const user = await prisma.faculty.findFirst({
            where: {
                mobileNumber
            },
        });

        if (user) {
            logger.info(`User already exists: ${user}`);
            return res.status(403).json({
                success: false,
                message: "User already exists",
            });
        }

        const user_token = await generateToken({
            mobileNumber,
            expires: "1h"
        })

        const mail_title = "Generate your ERP account password!";
        const templatePath = path.resolve(__dirname, "../../EmailTemplates/GeneratePassoword.ejs")
        const body = await ejs.renderFile(templatePath, { user_token })

        const response: any = await SendMail({ to: email, title: mail_title, body })

        console.log(GetFormattedDate(dob))

        if (response) {

            await prisma.user.create({
                data: {
                    user_id: mobileNumber,
                    role: "FACULTY"
                }
            });

            await prisma.token.create({
                data: {
                    id: mobileNumber,
                    token: user_token
                }
            })

            await prisma.faculty.create({
                data: {
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
        }

        return res.status(401).json({
            success: false,
            message: "Something went wrong!"
        })

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
        const { mobileNumber, password } = req.body;

        if (!mobileNumber || !password) {
            return res.status(400).json({
                message: "Please provide all the required fields",
            });
        }

        const user = await prisma.faculty
            .findFirst({
                where: {
                    mobileNumber: mobileNumber
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
                email: user.email,
                name: username,
                mobileNumber: user.mobileNumber
            };

            const token = await generateToken(payload);

            return res
                .status(200)
                .json({
                    success: true,
                    message: "Login Successful",
                    data: {
                        token: token,
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
        return res.status(500).json({
            success: false,
            message: "Internal Server Error!",
        });
    }
};

const UpdatePassword = async (req: Request, res: Response) => {
    try {
        const { mobileNumber, password, confirmpassword, token } = req.body;

        if (!mobileNumber || !password || !confirmpassword || !token) {
            return res.status(403).json({
                success: false,
                message: "Validation Error!"
            })
        }

        if (password !== confirmpassword) {
            return res.status(401).json({
                success: false,
                message: "Password and Confirmpassword is not equal!"
            })
        }

        const tokenVerification = jwt.verify(token, process.env.JWT_SECRET as string)

        if (!tokenVerification) {
            return res.status(401).json({
                success: false,
                message: "Authentication Failed!"
            })
        }

        const UserInstace = await prisma.faculty.findFirst({
            where: {
                mobileNumber
            }
        })

        if (!UserInstace) {
            return res.status(404).json({
                success: false,
                message: "User not found!"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.faculty.update({
            where: {
                mobileNumber
            },
            data: {
                password: hashedPassword
            }
        })

        // To Expire Link
        await prisma.token.delete({
            where: {
                id: mobileNumber
            }
        })

        return res.status(200).json({
            success: true,
            message: "Password generated successfully!"
        })

    } catch (error) {
        logger.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error!"
        })
    }
}

export default { register, login, UpdatePassword };

