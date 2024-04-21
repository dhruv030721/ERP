import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import excelToJson from 'convert-excel-to-json';
import path from "path";


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

        for(let i = 0; i < data['Sheet1'].length; i++){
            if(i >= 1){ 
                await prisma.student.create({
                    data : {
                        enrollment_no: data['Sheet1'][i]['A'],
                        name : data['Sheet1'][i]['B'],
                        email : data['Sheet1'][i]['C'],
                        contactnumber : data['Sheet1'][i]['D'],
                        semester : data['Sheet1'][i]['E'],
                        batch : data['Sheet1'][i]['F'],
                        password : data['Sheet1'][i]['G'],
                    }
                })
            }
        }

        return res.status(200).json({
            success : true,
            message: "Data Uploaded Successfully!"
        })
        
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success : false,
            message : "Internal Server Error!",
        })
    }
}

const AddNewStudent = async() => {

}


const DownloadImportStudentSampleFile = async(req: Request, res: Response) => {
    try {
        const file = path.join(__dirname, "../../../../Uploads/import_student_demo_excel.xlsx");
        res.download(file);
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            success : false,
            message : "Internal Server Error!"
        })
    }
}

export default {ImportStudentdata, AddNewStudent, DownloadImportStudentSampleFile};