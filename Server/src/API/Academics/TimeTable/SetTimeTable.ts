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

        for (let i = 1; i < data['Timetable'].length; i++) {

            const faculty = await prisma.faculty.findUnique({
                where: {
                    mobileNumber: data['Timetable'][i]['E'].toString()
                }
            })

            // If faculty Exist
            if (faculty) {
                await prisma.timeTable.create({
                    data: {
                        time: data['Timetable'][i]['B'].toString(),
                        day: data['Timetable'][i]['C'].toString(),
                        subject: data['Timetable'][i]['D'].toString(),
                        facultyId: data['Timetable'][i]['E'].toString(),
                        lectureType: data['Timetable'][i]['F'].toString(),
                        batch: data['Timetable'][i]['G'] ? data['Timetable'].toString() : "",
                        branchId: data['Timetable'][i]['H'].toString(),
                        sem: data['Timetable'][i]['I'],
                    }
                })

                logger.info(`${data['Timetable'][i]['D'].toString()} - ${faculty.first_name} Entry Added!`)
            } else {
                logger.error(`${data['Timetable'][i]['E'].toString()} Not Found!`)
            }

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


