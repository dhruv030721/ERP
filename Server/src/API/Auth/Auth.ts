import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt, { Secret } from "jsonwebtoken";
import logger from "../../Utils/logger";
import { GetFormattedDate } from "../../Utils/date";
import SendMail from "./SendMail";
import Faculty from "../Academics/Faculty";

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
        const body = emailTemplate(user_token);

        const response: any = await SendMail({ to: email, title: mail_title, body })

        if (response) {
            
            await prisma.user.create({
                data: {
                    user_id: mobileNumber,
                    role: "ADMIN"
                }
            });
            
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

            return res.cookie("erp_auth_token", token, {
                maxAge: 24 * 60 * 60 * 1000
            }).status(200).json({
                success: true,
                message: "Login Successful",
                data: {
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


let emailTemplate = (user_token: string) => {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #004d99;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
        }
        .content {
            background-color: #ffffff;
            padding: 30px;
            border: 1px solid #dddddd;
            border-radius: 0 0 5px 5px;
        }
        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #004d99;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 12px;
            color: #666666;
        }
        .warning {
            background-color: #fff3cd;
            border: 1px solid #ffeeba;
            color: #856404;
            padding: 10px;
            border-radius: 5px;
            margin: 15px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to ERP System</h1>
        </div>
        <div class="content">
            <h2>Complete Your Account Setup</h2>
            <p>Dear Faculty Member,</p>
            
            <p>Your ERP account has been created successfully. To complete the registration process, you need to set up your password.</p>
            
            <p>Please click the button below to generate your password:</p>
            
            <center>
                <a href="http://37.27.81.8:4001/generate_password/${user_token}" class="button" style="color: white;">Generate Password</a>
            </center>
            
            <div class="warning">
                <strong>Important:</strong>
                <ul>
                    <li>This link will expire in 1 hour</li>
                    <li>For security reasons, please generate your password immediately</li>
                    <li>This link can only be used once</li>
                </ul>
            </div>
            
            <p>If you didn't request this account creation, please ignore this email or contact the IT support team.</p>
            
            <p>Best regards,<br>ERP System Administration Team</p>
        </div>
        <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>© 2024 ERP System. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;
} 