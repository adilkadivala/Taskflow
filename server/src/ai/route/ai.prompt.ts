import express from "express";
import { handleAICommand } from "../ai.controller";
import { authMiddleware } from "../../middleware/auth";

const aiRouter = express.Router();

aiRouter.post("/api/v1/ai/command", authMiddleware, handleAICommand);

export default aiRouter;
