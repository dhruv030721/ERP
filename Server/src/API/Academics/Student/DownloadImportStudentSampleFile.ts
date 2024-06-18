import { Request, Response } from "express";
import path from "path";



export const DownloadImportStudentSampleFile = async(req: Request, res: Response) => {
    try {
        const file = path.join(__dirname, "../../../Files/student_data.xlsx");
        res.download(file);
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            success : false,
            message : "Internal Server Error!"
        })
    }
}