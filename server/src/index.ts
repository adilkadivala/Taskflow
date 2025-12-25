import env from "dotenv";
env.config();

import express, { Request, Response } from "express";
import { connectDB } from "./config/db";
import cors from "cors";
import router from "./routes";
import { initCommentWS } from "./ws/comments.ws";
import { errorMiddleware } from "./middleware/error-handler";
import aiRouter from "./ai/route/ai.prompt";

const SERVER_PORT = process.env.server_port;

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(router);
app.use(aiRouter);
app.use(errorMiddleware);

app.get("/", (req: Request, res: Response) => {
  return res.json("hello from server");
});

// for local development
connectDB
  .then(() => {
    console.log("database connected successfully");
    initCommentWS();
    app.listen(SERVER_PORT, () => {
      console.log(`server is running at http://localhost:${SERVER_PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

// for deploying on vercel
export default app;
