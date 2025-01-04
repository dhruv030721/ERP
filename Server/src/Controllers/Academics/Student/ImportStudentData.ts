import { Request, Response } from "express";
import prisma from "../../../Utils/prisma";
import { uploadFileToFirebase } from "../../../Middleware/upload.middleware";
import { storage } from "../../../Config/firebaseConfig";
import { ref, getBytes } from "firebase/storage";
import * as XLSX from "xlsx";

export const ImportStudentdata = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded!",
            });
        }

        const file: any = req.file;

        const fileUrl: string = await uploadFileToFirebase(file);

        const fileRef = ref(storage, fileUrl);
        const fileBytes = await getBytes(fileRef);

        const workbook = XLSX.read(fileBytes, { type: "buffer" });

        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        if (!sheet) {
            return res.status(400).json({
                success: false,
                message: "No valid sheet found in the Excel file.",
            });
        }

        const data: any[] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        console.log("Parsed Data:", data);

        if (data.length < 2) {
            return res.status(400).json({
                success: false,
                message: "Excel file is empty or contains no data rows.",
            });
        }

        // Uncomment and modify according to your Excel structure
        // for (let i = 1; i < data.length; i++) {  // Start from 1 to skip header row
        //     const row = data[i];
        //     await prisma.student.create({
        //         data: {
        //             enrollmentNo: String(row[0] || ''),
        //             name: String(row[1] || ''),
        //             mobileNumber: String(row[2] || ''),
        //             branchId: String(row[8] || ''),
        //             sem: row[9] ? Number(row[9]) : null,
        //         },
        //     });
        // }

        return res.status(200).json({
            success: true,
            message: "Data Uploaded Successfully!",
        });
    } catch (error) {
        console.error("Error in ImportStudentdata:", error);
        return res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "Internal Server Error!",
        });
    }
};