import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();


const generateToken = async (payload : any ) => {
    try{

        const token = jwt.sign(payload, process.env.JWT_SECRET!, {
            expiresIn : "1d",
        });

        return token;
    } catch (error : any){
        console.log(error);
        throw new Error("Something Went Wrong!");
    }   
}


const register = async (req : Request, res: Response) => {
    try {
        const {email, name, employee_id, password, confirmPassword, contactNumber} = req.body;

        if(!name || !employee_id || !password || !email || !contactNumber){
            return res.status(400).json({
                success : false,
                message : "Provide all required fields",
            })
        }         

        if(password != confirmPassword){
            return res.status(400).json({
                success : false,
                message : "Password and Confirm password does not match"
            })
        }

        const user = await prisma.admin.findFirst({
            where: {
                employee_id : employee_id,
            }
        })

        if(user){
            console.log(user)
            return res.status(403).json({
                success : false,
                message : "User already exist",
            })
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        // TODO : Sent verification email
        const newUser = await prisma.admin.create({
            data : {
                name,
                email,
                password : hashPassword,
                employee_id,
                contactnumber : contactNumber,
            }
        })

        return res.status(200).json({
            success : true,
            message : "User created successfully",
        })


    } catch (error) {
        return res.status(401).json({
            success : false,
            error: error,
            message : "Internal Server Error!",
        })
    }
}


const login = async(req: Request, res: Response) => {
    try {

        const {employee_id, password} = req.body;

        if(!employee_id || !password){
            return res.status(400).json({
                message : "Please provide all the required fields",
            })
        }

        let user : any;

        await prisma.admin.findFirst({
            where : {
                employee_id : employee_id,
            }
        }).then((data) => {
            user =  data;
        });

        if(!user){
            return res.status(404).json({
                sucess : false,
                message : "User not found!"
            })
        }

        const payload = {
            'employee_id' : user.employee_id.toString(),
            'email' : user.email,
            'name' : user.name,
            'contact' : user.contactnumber.toString()
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(isMatch){
            
            const token = await generateToken(payload);

            return res.cookie('token', token).status(200).json({
                success : true,
                message : "Login Successful"
            })

        } else {
            return res.status(400).json({
                success : true,
                message : "Incorrect Password!"
            });
        }


        
    } catch (error) {
        return res.status(400).json({
            success : false,
            message : "Internal Server Error!"
        })
    }
}

const sendVerificationMail = async(req : Request, res: Response) => {
    try {
    } catch (error) {
        
    }
}

const sendMail = async(req : Request, res : Response) => {
    try {
        
    } catch (error) {
        return res.status(400).json({
            success : false,
            message : "Internal server error!",
        })
    }
}

const verify = async(req: Request, res: Response) => {
    try {
        
    } catch (error) {
        
    }
}




export default {register, login, sendVerificationMail, verify};