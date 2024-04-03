import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import excelToJson from 'convert-excel-to-json';


const prisma = new PrismaClient();

const ImportStudentdata = async(req : Request, res : Response) => {
    try {

        const file : any = req.file;

        if(!req.file){
            return res.status(400).json({
                success : false,
                message : "No file uploaded!"
            });
        }

        const data = excelToJson({
            sourceFile : file.path
        })

        console.log(data);

        for(let i = 0; i < data['Sheet1'].length; i++){
            if(i >= 2){
                await prisma.student.create({
                    data : {
                        enrollment_no: data['Sheet1'][i]['A'],
                        name : data['Sheet1'][i]['B'],
                        email : data['Sheet1'][i]['C'],
                        contactnumber : data['Sheet1'][i]['D'],
                        semester : data['Sheet1'][i]['F'],
                        batch : data['Sheet1'][i]['G'],
                        password : data['Sheet1'][i]['B'],
                    }
                })
            }
        }

        return res.status(200).json({
            success : true,
            message: "File Uploaded Successfully!"
        })
        
    } catch (error) {
        return res.status(400).json({
            success : false,
            message : "Internal Server Error!",
        })
    }
}

const AddNewStudent = async() => {

}

export default {ImportStudentdata, AddNewStudent};