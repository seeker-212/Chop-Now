import express from 'express';
import dotenv from 'dotenv'
dotenv.config()
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import authRouter from './routes/authRoute.js';
import cors from 'cors'
import userRouter from './routes/userRoutes.js';

// Making Necessary connections
connectDB()

//Creating the necessary Variables
const app = express()
const port = process.env.PORT || 5000

//Middlewares
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))
app.use(express.json())
app.use(cookieParser())

//Calling Endpoints
app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)

//Check if Api is working
app.use('/', (req, res) => (res.send('Api is working')))

//Listen for the active PORT
app.listen(port, (req, res) => (console.log(`Server is running on port:${port}`)))