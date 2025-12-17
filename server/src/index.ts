import env from "dotenv";
env.config();

import express, { Request, Response } from "express";
import { connectDB } from "./config/db";
import cors from "cors";
import router from "./routes";
import { initCommentWS } from "./ws/comments.ws";
import { errorMiddleware } from "./middleware/error-handler";

const SERVER_PORT = process.env.server_port;

const app = express();
app.use(express.json());
app.use(cors());
app.use(router);
app.use(errorMiddleware);

app.get("/", (req: Request, res: Response) => {
  res.send("<p>hello from server</p>");
});

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
