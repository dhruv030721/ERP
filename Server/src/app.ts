import { PrismaClient } from '@prisma/client';
import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import routes from './Utils/router';
import logger from "./Utils/logger";
import morgan from "morgan";
import cors from "cors";
import fs from 'fs';
import https from 'https';

dotenv.config();
const prisma = new PrismaClient();
const app: Application = express();
const PORT = process.env.PORT || 8888;

const sslOptions = {
    key: fs.readFileSync('./server.key'),
    cert: fs.readFileSync('./server.cert')
}
app.use(
    cors({
        origin: ["http://localhost:5173", "http://37.27.81.8:4001"],
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        credentials: true,
    })
);

app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to Express & TypeScript Server');
});

https.createServer(sslOptions, app).listen(PORT, () => {
    logger.info(`Server started successfully at ${PORT}`);
    prisma.$connect().then(() => {
        logger.info("Database connected successfully");
    })
    routes(app);
});