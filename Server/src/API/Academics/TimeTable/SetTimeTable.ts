import excelToJson from "convert-excel-to-json";
import logger from "../../../Utils/logger";
import { Request, Response } from "express";
import prisma from "../../../Utils/prisma";

export const SetTimeTable = async (req: Request, res: Response) => {
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

        console.log(data);

        for (let i = 0; i < data['Timetable_6sem'].length; i++) {
            await prisma.timeTable.create({
                data: {
                    time: data['Timetable_6sem'][i]['B'].toString(),
                    day: data['Timetable_6sem'][i]['C'].toString(),
                    subject: data['Timetable_6sem'][i]['D'].toString(),
                    facultyId: data['Timetable_6sem'][i]['E'].toString(),
                    lectureType: data['Timetable_6sem'][i]['F'].toString(),
                    batch: data['Timetable_6sem'][i]['G'] ? data['Timetable_6sem'].toString() : "",
                    branchId: data['Timetable_6sem'][i]['H'].toString(),
                    sem: data['Timetable_6sem'][i]['I'],
                }
            })
        }

        return res.status(200).json({
            success: true,
            message: "Timetable set successfully!"
        })

    } catch (error) {
        console.log(error);
        logger.error(error);
        return res.status(400).json({
            success: false,
            message: `Something went wrong : ${error}`
        })
    }
}


