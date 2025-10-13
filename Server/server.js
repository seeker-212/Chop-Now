import express from 'express';
import dotenv from 'dotenv'
dotenv.config()
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import authRouter from './routes/authRoute.js';
import cors from 'cors'
import userRouter from './routes/userRoutes.js';
import shopRouter from './routes/shopRoute.js';
import itemRouter from './routes/itemRoute.js';
import orderRouter from './routes/orderRoutes.js';
import http from 'http'
import { Server } from 'socket.io';

// Making Necessary connections
connectDB()

//Creating the necessary Variables
const app = express()
const server = http.createServer(app)

//Implementing socket io
const io = new Server(server, {
    cors :{
    origin: "http://localhost:5173",
    credentials: true,
    methods: ['POST', 'GET']
}
})

app.set('io', io)

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
app.use('/api/shop', shopRouter)
app.use('/api/item', itemRouter)
app.use('/api/order', orderRouter)

//Check if Api is working
app.use('/', (req, res) => (res.send('Api is working')))

//Listen for the active PORT
server.listen(port, (req, res) => (console.log(`Server is running on port:${port}`)))