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

        console.log(data);

        for (let i = 2; i < data['Students'].length; i++) {

            await prisma.student.create({
                data: {
                    enrollmentNo: data['Students'][i]['A'].toString(),
                    name: data['Students'][i]['B'].toString(),
                    mobileNumber: data['Students'][i]['C'].toString(),
                    branchId: data['Students'][i]['I'].toString(),
                    sem: data['Students'][i]['J'],
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