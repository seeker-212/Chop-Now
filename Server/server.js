import express from "express";
import dotenv from "dotenv";
import http from "http";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";

import connectDB from "./config/db.js";
import { sockHandler } from "./socket.js";

import authRouter from "./routes/authRoute.js";
import userRouter from "./routes/userRoutes.js";
import shopRouter from "./routes/shopRoute.js";
import itemRouter from "./routes/itemRoute.js";
import orderRouter from "./routes/orderRoutes.js";

//  Load environment variables early
dotenv.config();

// Create Express app and HTTP server
const app = express();
const server = http.createServer(app);

//  Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST"],
  },
});

//  Make io accessible from controllers
app.set("io", io);

//  Middleware setup
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

//  API routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/shop", shopRouter);
app.use("/api/item", itemRouter);
app.use("/api/order", orderRouter);

//  Default route for testing
app.get("/", (req, res) => res.send("API is working "));

//  Start the server only after DB connection
const startServer = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await connectDB();

    console.log(" MongoDB connected successfully!");

    //  Start the socket handler AFTER DB connection
    sockHandler(io);

    const port = process.env.PORT || 5000;
    server.listen(port, () => console.log(` Server running on port ${port}`));
  } catch (error) {
    console.error(" Failed to start server:", error);
    process.exit(1);
  }
};

// Run startup
startServer();
