import express from 'express';
import { config } from 'dotenv';
config();
import cors from 'cors';
import appRouter from './routes/router';

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

app.use('/api', appRouter);

export default app;
