import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import userRouter from "./routers/user";
import path from "path";

const server = express();
server.use(
  cors({
    origin: "*",
  })
);
server.use(express.json()); // To parse JSON request bodies

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => console.log("Mongo Connected"));

server.use("/files", express.static(path.join(__dirname, "../files")));
// Use the user routes
server.use("/api/users", userRouter);

server.listen(5200, () => console.log("Server Running"));
