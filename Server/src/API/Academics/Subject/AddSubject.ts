import excelToJson from "convert-excel-to-json";
import { Request, Response } from "express";
import prisma from "../../../Utils/prisma";

export const AddSubject = async (req: Request, res: Response) => {
    try {

        const file: any = req.file;

        if (!req.file) {
            return res.status(400).json({
                sucess: false,
                message: "No file uploaded!"
            })
        }

        const data = excelToJson({
            sourceFile: file.path
        })

        for (let i = 1; i < data['Sheet1'].length; i++) {
            if (await prisma.subject.findUnique({
                where: {
                    code: data['Sheet1'][i]['A']
                }
            })) {
                return res.status(409).json({
                    success: false,
                    message: "Subject already exist so remove that to resolve conflicts!"
                })
            }


            await prisma.subject.create({
                data: {
                    code: data['Sheet1'][i]['A'],
                    name: data['Sheet1'][i]['B'],
                    sem: data['Sheet1'][i]['C'],
                    branchId: data['Sheet1'][i]['D']
                }
            })
        }

        return res.status(200).json({
            success: true,
            message: "Subject added successfully!"
        })


    } catch (error: any) {
        console.log(error.stack);
        return res.status(500).json({
            success: false,
            message: "Internval Server Error!",
            error: error
        })
    }
}