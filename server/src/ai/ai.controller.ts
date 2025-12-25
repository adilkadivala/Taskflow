import { Request, Response, NextFunction } from "express";
import axios from "axios";
import { parseAICommand } from "./ai.service";
import { User } from "../models/user";
import { Team } from "../models/team";

export const handleAICommand = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { input } = req.body;
    console.log("input", input);
    // @ts-ignore
    const userId = req.userId;
    const token = req.headers.authorization;

    console.log(token, "token");

    if (!input || !userId) {
      return res.status(400).json({ message: "Invalid request" });
    }

    // 1️⃣ Parse instruction
    const command = await parseAICommand(input);

    console.log("command", command);

    if (command.error) {
      return res
        .status(400)
        .json({ message: "AI could not understand command" });
    }

    if (command.action !== "create_and_assign_task") {
      return res.status(400).json({ message: "Unsupported AI action" });
    }

    // 2️⃣ Resolve assignee
    const assignee = await User.findOne({
      name: new RegExp(`^${command.assignTo}$`, "i"),
    });

    console.log(assignee, "assignee");

    if (!assignee) {
      return res.status(404).json({ message: "User not found" });
    }

    // 3️⃣ Resolve team (admin’s team)
    const team = await Team.findOne({ createdBy: userId });

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    console.log(team, "team");

    const date = new Date().toLocaleDateString();

    // 4️⃣ Create task
    const taskRes = await axios.post(
      `http://localhost:8000/task/api/v1/create-task-of-team/${team._id}`,
      {
        title: command.task.title,
        description: command.task.description,
        priority: "Medium",
        status: "Todo",
        dueDate: date,
      },
      {
        headers: {
          Authorization: token!,
        },
      }
    );

    console.log(taskRes.status);

    const taskId = taskRes.data.data._id;

    // 5️⃣ Assign task
    const assignTask = await axios.post(
      `http://localhost:8000/task/api/v1/assign-task/${team._id}/${taskId}/${assignee._id}`,
      {},
      {
        headers: {
          Authorization: token!,
        },
      }
    );

    console.log(assignTask);

    return res.status(200).json({
      success: true,
      message: `Task '${command.task.title}' created and assigned to ${assignee.name}`,
    });
  } catch (error) {
    next(error);
  }
};
