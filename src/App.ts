import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { router } from './routes';
import { dbConnect } from './config/mongo';

const app = express();

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Listening in port: ${PORT}`);
    app.use(cors());
    app.use(express.json());
    app.use(router);
    dbConnect();
});