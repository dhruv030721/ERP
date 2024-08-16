import { Request, Response } from "express";

export const AssignSubject = async (req: Request, res: Response) => {
    try {
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internval Server Error!"
        })
    }
}