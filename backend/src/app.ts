import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db';
import authRoutes from "./routes/auth.routes";
import projectRoutes from "./routes/project.routes";
import taskRoutes from "./routes/task.routes";
import { auth } from './middleware/auth';
connectDB(process.env.MONGO_URI!);
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: '*' }));
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/project', auth,projectRoutes)
app.use('/api/v1/task', auth, taskRoutes)
app.get('/', (req,res) => {
    res.send('Hello, World!');
})

export default app;