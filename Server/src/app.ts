import { PrismaClient } from '@prisma/client';
import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import routes from './Utils/router';
import logger from "./Utils/logger";
import morgan from "morgan";

dotenv.config();
const prisma = new PrismaClient();
const app: Application = express();
const PORT = process.env.PORT || 8888;

app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to Express & TypeScript Server');
});

app.listen(PORT, () => {
    logger.info(`Server started successfully at ${PORT}`);
    prisma.$connect().then(() => {
        logger.info("Database connected successfully");
    })
    routes(app);
});