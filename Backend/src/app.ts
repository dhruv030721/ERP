import { PrismaClient } from '@prisma/client';
import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import routes from './Utils/router';
const swaggerDocument  = require('../swagger.json');

dotenv.config();

const prisma = new PrismaClient();
const app: Application = express();
const PORT = process.env.PORT || 8888;

app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to Express & TypeScript Server');
});

app.listen(PORT, () => {
    console.log(`Server started successfully at ${PORT}`);
    prisma.$connect().then(()=> {
        console.log("Database connected successfully");
    })
    routes(app);
});