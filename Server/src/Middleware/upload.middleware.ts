import multer from "multer";
import bucket from "../Config/bucketConfig";
import { Request } from "express";
import logger from "../Utils/logger";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

export const uploadFileToFirebase = async (file: any): Promise<string> => {
    try {
        const fileName = `temp_sheets/${Date.now()}-${file.originalname}`;
        const fileUpload = bucket.file(fileName);

        // Create a promise to handle the stream events
        return new Promise((resolve, reject) => {
            // Upload the file buffer to Firebase Storage
            const stream = fileUpload.createWriteStream({
                metadata: {
                    contentType: file.mimetype,
                },
            });

            stream.on("error", (error) => {
                console.error("Error uploading file:", error);
                reject(error);
            });

            stream.on("finish", async () => {
                try {
                    // Make the file publicly accessible or generate a signed URL
                    const [url] = await fileUpload.getSignedUrl({
                        action: "read",
                        expires: "03-17-2025", // Set an appropriate expiration date
                    });
                    resolve(url);
                } catch (error) {
                    reject(error);
                }
            });

            // Write the buffer to the stream
            stream.end(file.buffer);
        });
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
};

export default upload;