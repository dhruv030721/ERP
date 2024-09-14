import { Request, Response } from "express";
import prisma from "../../../Utils/prisma";

interface assignSubject {
    sem: number,
    branch: string,
    subject: number,
    faculty: string
}

export const AssignSubject = async (req: Request, res: Response) => {
    try {

        const { branch, faculty, sem, subject }: assignSubject = req.body;

        if (!branch || !faculty || !sem || !subject) {
            return res.status(400).json({
                success: false,
                message: "Validation failed, Provide all fields!"
            })
        }

        const AssignSubjectToFaculty = await prisma.assignSubject.findFirst({
            where: {
                branchId: branch,
                facultyId: faculty,
                subjectCode: subject
            }
        })

        if (AssignSubjectToFaculty) {
            return res.status(409).json({
                success: false,
                message: "Subject already assigned to faculty!"
            })
        }

        await prisma.assignSubject.create({
            data: {
                sem,
                branchId: branch,
                subjectCode: subject,
                facultyId: faculty,
            }
        })

        return res.status(200).json({
            success: true,
            message: "Subject Assigned Successfully!"
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internval Server Error!"
        })
    }
}