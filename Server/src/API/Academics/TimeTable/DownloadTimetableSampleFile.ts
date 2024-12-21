import { Request, Response } from "express";
import path from "path";
import fs from "fs";

export const DownloadTimeTableSampleFile = async (req: Request, res: Response) => {
    try {
        const filePath = path.resolve(__dirname, "../../../DemoFiles/timetable_sample_file.xlsx");

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ success: false, message: "File not found!" });
        }

        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", "attachment; filename=timetable_sample_file.xlsx");

        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);

        fileStream.on('error', (error) => {
            console.error("Stream error:", error);
            res.status(500).end();
        });
    } catch (error) {
        console.error("Error while sending the file:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error!",
        });
    }
};
