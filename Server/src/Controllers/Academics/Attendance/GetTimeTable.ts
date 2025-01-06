import { Request, Response } from "express";
import prisma from "../../../Utils/prisma";
import logger from "../../../Utils/logger";
import RedisClient from "../../../Config/RedisClient";

const redis = RedisClient.getInstance();

export const GetTimeTable = async (req: Request, res: Response) => {
    try {
        const { mobileNumber } = req.params;

        if (!mobileNumber) {
            return res.status(403).json({
                success: false,
                message: "Please provide valid details!"
            });
        }

        const cachedData = await redis.get(`timetable:${mobileNumber}`);
        if (cachedData) {
            return res.status(200).json({
                success: true,
                message: "Data Retrieved Successfully (from cache)!",
                data: JSON.parse(cachedData)
            });
        }

        const timeTable = await prisma.timeTable.findMany({
            where: {
                facultyId: mobileNumber
            }
        });

        if (!timeTable) {
            return res.status(404).json({
                success: false,
                message: "No timetable data found!"
            })
        }

        const faculty: any = await prisma.faculty.findFirst({ where: { mobileNumber } });

        if (!faculty) {
            return res.status(404).json({
                success: false,
                message: "No faculty data found!"
            })
        }

        const facultyName = `${faculty.first_name} ${faculty.last_name}`;

        const groupedByDay: any = {};

        for (const item of timeTable) {
            const day = item.day;
            const subject: any = await prisma.subject.findFirst({ where: { code: parseInt(item.subject) } });

            if (!groupedByDay[day]) {
                groupedByDay[day] = [];
            }

            const newItem = {
                ...item,
                facultyName: facultyName,
                subjectCode: subject ? subject.code : null,
                subject: subject ? subject.name : null,
            };

            groupedByDay[day].push(newItem);
        }

        // Save Formatted Data to Redis
        await redis.set(`timetable:${mobileNumber}`, JSON.stringify(groupedByDay), "EX", 3600); // Set TTL to 1 hour


        return res.status(200).json({
            success: true,
            message: "Data Retrieved Successfully!",
            data: groupedByDay
        });

    } catch (error) {
        logger.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error!",
        });
    }
};
