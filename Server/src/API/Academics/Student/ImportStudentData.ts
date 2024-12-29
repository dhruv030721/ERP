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

        for (let i = 0; i < data['Sheet1'].length; i++) {
            if (i >= 1) {

                // const dob = GetFormattedDate(data['Sheet1'][i]['I']);

                await prisma.student.create({
                    data: {
                        enrollmentNo: data['Sheet1'][i]['A'].toString(),
                        first_name: data['Sheet1'][i]['B'].toString(),
                        middle_name: data['Sheet1'][i]['C'].toString(),
                        last_name: data['Sheet1'][i]['D'].toString(),
                        mobileNumber: data['Sheet1'][i]['E'].toString(),
                        email: data['Sheet1'][i]['F'],
                        parentMobileNumber: data['Sheet1'][i]['G'].toString(),
                        branch: data['Sheet1'][i]['H'],
                        sem: data['Sheet1'][i]['I'],
                        password: data['Sheet1'][i]['J'].toString(),
                        gender: data['Sheet1'][i]['K'].toString(),
                        // dob: dob
                    }
                })
            }
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