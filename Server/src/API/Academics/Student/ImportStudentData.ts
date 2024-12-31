import { Request, Response } from "express";
import prisma from "../../../Utils/prisma"
import excelToJson from 'convert-excel-to-json';

export const ImportStudentdata = async (req: Request, res: Response) => {
    try {
        const file: any = req.file;

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded!"
            });
        }

        const data = excelToJson({
            sourceFile: file.path
        })

        for (let i = 1; i < data['Students'].length; i++) {

            await prisma.student.create({
                data: {
                    enrollmentNo: data['Students'][i]['A'].toString(),
                    first_name: data['Students'][i]['B'].toString(),
                    middle_name: data['Students'][i]['C'].toString(),
                    last_name: data['Students'][i]['D'].toString(),
                    mobileNumber: data['Students'][i]['E'].toString(),
                    email: data['Students'][i]['F'],
                    parentMobileNumber: data['Students'][i]['G'].toString(),
                    branchId: data['Students'][i]['I'].toString(),
                    sem: data['Students'][i]['J'],
                    gender: data['Students'][i]['K'],
                }
            })
        }

        return res.status(200).json({
            success: true,
            message: "Data Uploaded Successfully!"
        })

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: "Internal Server Error!",
        })
    }
}