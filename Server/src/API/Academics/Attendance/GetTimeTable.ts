import { Request, Response } from "express";
import prisma from "../../../Utils/prisma"
import { GetFormattedDate } from "../../../Utils/date"
import logger from "../../../Utils/logger"

export const GetTimeTable = async (req: Request, res: Response) => {
    try {
        const { employeeId } = req.params;

        if (!employeeId) {
            return res.status(403).json({
                success: false,
                message: "Please provide valid details!"
            })
        }

        const timeTable = await prisma.timeTable.findMany();

        const groupedByDay: any = {};

        for (const item of timeTable) {
            const day = item.day;
            const subject: any = await prisma.subject.findFirst({ where: { code: parseInt(item.subject) } });
            const faculty: any = await prisma.faculty.findFirst({ where: { employeeId: item.facultyId } });
            if (!groupedByDay[day]) {
                groupedByDay[day] = [];
            }
            item.facultyId = faculty.name;
            item.subject = subject ? subject.name : null;
            groupedByDay[day].push(item);
        }

        console.log(groupedByDay);

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
}
