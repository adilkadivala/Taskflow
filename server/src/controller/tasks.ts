import { Activity } from "../models/activity";
import { Comment } from "../models/comments";
import { Notification } from "../models/notification";
import { Task } from "../models/tasks";
import { Team } from "../models/team";
import { taskSchema, updateTaskSchema } from "../models/validator/tasks";
import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";

// create
const createTask = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const { title, description, priority, status, dueDate } = req.body;
    // @ts-ignore
    const userId = req.userId;
    const { success } = taskSchema.safeParse(req.body);
    if (!success) {
      return res.status(422).json({
        message: "Incorrect input",
      });
    }

    const newTask = await Task.create({
      title,
      description,
      priority,
      status,
      dueDate,
      userId,
    });

    // create activity
    await Activity.create({
      taskId: newTask._id,
      userId,
      action: "CREATED",
      details: `Task "${title}" was created`,
    });

    return res
      .status(200)
      .json({ message: "task created successfully", data: newTask });
  } catch (error: any) {
    next(error);
    return res.status(409).json({
      success: true,
      message: "task with this title already exists for this user",
    });
  }
};

// get all tasks of a user
const getTasks = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    // @ts-ignore
    const userId = req.userId;
    const tasks = await Task.find({ userId });
    if (!tasks) {
      return res
        .status(403)
        .json({ message: "no any task availabke to display" });
    }
    return res.status(200).json({ message: "Your tasks", tasks });
  } catch (error: any) {
    return next(error);
  }
};

// get a specific task of a user
const getSpecificTask = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const { taskId } = req.params;
    // @ts-ignore
    const userId = req.userId;
    const task = await Task.findOne({ _id: taskId, userId });
    if (!task) {
      return res.status(404).json({ message: "no task availabke to display" });
    }
    return res.status(200).json({ message: "Your tasks", task });
  } catch (error: any) {
    return next(error);
  }
};

// update
const updateTask = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const body = req.body;
    const { taskId } = req.params;

    if (!taskId) {
      return res.status(400).json({ message: "params not provided" });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({
        message: "task not found,",
      });
    }
    // @ts-ignore
    if (task.userId.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this task" });
    }

    const { success } = updateTaskSchema.safeParse(req.body);
    if (!success) {
      return res.status(422).json({
        message: "Incorrect input",
      });
    }

    const updatedTask = await Task.findByIdAndUpdate(taskId, body, {
      new: true,
    });

    // create activity
    await Activity.create({
      taskId,
      userId: task.userId,
      action: "UPDATED",
      details: `Task "${task.title}" was updated`,
    });
    return res
      .status(200)
      .json({ message: "task updated successfully", data: updatedTask });
  } catch (error: any) {
    return next(error);
  }
};

// delete a specific
const deleteTask = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const { taskId } = req.params;

    if (!taskId) {
      return res.status(402).json({ message: "params not provided" });
    }

    const task = await Task.findById({
      _id: taskId,
    });

    if (!task) {
      return res.status(404).json({
        message: "task not found,",
      });
    }

    // @ts-ignore
    if (task.userId.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this task" });
    }

    await Comment.deleteMany({ taskId });
    await Notification.deleteMany({ taskId });
    await Activity.deleteMany({ taskId });
    await Task.findByIdAndDelete(taskId);

    await Activity.create({
      taskId,
      userId: task.userId,
      action: "DELETED",
      details: `Task "${task.title}" was deleted`,
    });

    return res.status(200).json({ message: "task deleted successfully" });
  } catch (error: any) {
    return next(error);
  }
};

// delete all taska
const deleteAllTasks = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    // @ts-ignore
    const userId = req.userId;
    const { taskIds } = req.body;

    if (!Array.isArray(taskIds) || taskIds.length === 0) {
      return res.status(400).json({ message: "tasks not provided to delete" });
    }

    const isTasksExist = await Task.find({
      _id: { $in: taskIds },
      userId,
    });

    if (!isTasksExist.length) {
      return res.status(404).json({
        message: "tasks not found,",
      });
    }

    await Comment.deleteMany({ taskId: { $in: taskIds } });
    await Notification.deleteMany({ taskId: { $in: taskIds } });
    await Activity.deleteMany({ taskId: { $in: taskIds } });

    const deletedTasks = await Task.deleteMany({
      _id: { $in: taskIds },
      userId: userId,
    });

    await Activity.create({
      taskId: taskIds,
      userId,
      action: "DELETED",
      details: `Task "${deletedTasks.deletedCount}" are deleted`,
    });

    return res.status(200).json({
      message: `Task "${deletedTasks.deletedCount}" are deleted`,
    });
  } catch (error: any) {
    return next(error);
  }
};

// filter
const filterTask = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const { status, priority } = req.query;
    // @ts-ignore
    const userId = req.userId;
    const filter: Record<string, any> = { userId };

    if (status) filter.status = new RegExp(status.toString(), "i");
    if (priority) filter.priority = new RegExp(priority.toString(), "i");

    if (typeof status !== "string" && typeof priority !== "string") {
      return res.status(400).json({
        message: "Invalid query parameters. Use ?status=Todo or ?priority=High",
      });
    }

    if (!status && !priority) {
      return res
        .status(404)
        .json({ message: "Please provide status or priority to filter" });
    }

    const tasks = await Task.find(filter).sort({ updatedAt: -1 });

    if (!tasks.length) {
      return res.status(404).json({ message: "No tasks found" });
    }

    return res.status(200).json({
      message: "Tasks fetched successfully",
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

// search
const searchTask = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const { title, description } = req.query;
    // @ts-ignore
    const userId = req.userId;
    const search: Record<string, any> = { userId };
    if (title) search.title = new RegExp(title.toString(), "i");
    if (description)
      search.description = new RegExp(description.toString(), "i");

    if (!title && !description) {
      return res
        .status(402)
        .json({ message: "Please provide title or description to search" });
    }

    const tasks = await Task.find(search);

    if (!tasks.length) {
      return res.status(404).json({ message: "No tasks found" });
    }

    return res.status(200).json({
      message: "Tasks fetched successfully",
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

// create a task of team
const createTaskOfTeam = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    // @ts-ignore
    const userId = req.userId;
    const { teamId } = req.params;
    const { title, description, priority, status, dueDate } = req.body;

    console.log(req.body);

    // checking team
    const isTeamExist = await Team.findById(teamId);

    if (!isTeamExist) {
      return res.status(400).json({ message: "team not found" });
    }

    const { success } = taskSchema.safeParse(req.body);
    if (!success) {
      return res.status(422).json({ message: "Invalid task input" });
    }

    const newTask = await Task.create({
      title,
      description,
      priority,
      status,
      dueDate,
      teamId,
      userId,
      assignedTo: null,
    });

    await Team.findByIdAndUpdate(teamId, {
      $addToSet: { tasks: newTask._id },
    });

    return res.status(200).json({
      message: "Task created successfully for team",
      data: newTask,
    });
  } catch (error) {
    next(error);
  }
};

// get all task of team
const getTasksOfTeam = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const { teamId } = req.params;

    // @ts-ignore
    const userId = req.userId;

    // checking team
    const isTeamExist = await Team.findById(teamId);

    if (!isTeamExist) {
      return res.status(404).json({ message: "team not found" });
    }

    // is user member of the team
    const isUserMemberOfTheTeam = await Team.findOne({
      _id: teamId,
      members: userId,
    });

    if (!isUserMemberOfTheTeam) {
      return res
        .status(401)
        .json({ message: "you're not member to see task of team," });
    }

    // check the task is exist in a team or not
    const getAllTasks = await Task.find({ teamId }).populate(
      "assignedTo",
      "_id name email"
    );

    if (!getAllTasks) {
      return res
        .status(403)
        .json({ message: "no tasks available in the team" });
    }

    return res.status(200).json({
      message: "all tasks of the team",
      data: getAllTasks,
    });
  } catch (error) {
    next(error);
  }
};

// get a specific task of team
const getSpecificTaskOfTeam = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const { teamId, taskId } = req.params;

    // @ts-ignore
    const userId = req.userId;

    // checking team
    const isTeamExist = await Team.findById(teamId);

    if (!isTeamExist) {
      return res.status(404).json({ message: "team not found" });
    }

    // is user member of the team
    const isUserMemberOfTheTeam = await Team.findOne({
      _id: teamId,
      members: userId,
    });

    if (!isUserMemberOfTheTeam) {
      return res
        .status(401)
        .json({ message: "you're not member of the to see this task," });
    }

    // check the task is exist in a team or not
    const getSpecificTask = await Task.findOne({
      _id: taskId,
      teamId,
    }).populate("assignedTo", "name email");

    if (!getSpecificTask) {
      return res
        .status(403)
        .json({ message: "task not available in the team" });
    }

    return res.status(200).json({
      message: "here is your specific task",
      task: getSpecificTask,
    });
  } catch (error) {
    next(error);
  }
};

// update a task of team
const updateTaskOfTeam = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const { teamId, taskId } = req.params;
    const body = req.body;

    // @ts-ignore
    const userId = req.userId;

    // checking team
    const isTeamExist = await Team.find({ _id: teamId, createdBy: userId });

    if (!isTeamExist) {
      return res.status(400).json({ message: "team not found" });
    }

    const { success } = updateTaskSchema.safeParse(req.body);
    if (!success) {
      return res.status(422).json({ message: "Invalid task input" });
    }

    // check the task is exist in a team or not
    const isTaskExist = await Team.find({ _id: teamId, tasks: taskId });
    if (!isTaskExist) {
      return res.status(403).json({ message: "task not found in the team" });
    }

    const updateTask = await Task.findByIdAndUpdate(taskId, body, {
      new: true,
    });

    return res.status(200).json({
      message: "Task updated successfully for team",
      data: updateTask,
    });
  } catch (error) {
    next(error);
  }
};

// delete a specific task of team
const deleteTaskOfTeam = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    // @ts-ignore
    const userId = req.userId;
    const { teamId, taskId } = req.params;

    // checking team
    const isTeamExist = await Team.find({ _id: teamId, createdBy: userId });

    if (!isTeamExist) {
      return res.status(404).json({ message: "team not found" });
    }

    // check the task is exist in a team or not
    const isTaskInTeam = await Team.findOne({ _id: teamId, tasks: taskId });
    if (!isTaskInTeam) {
      return res.status(403).json({ message: "task not found in the team" });
    }

    // cascade
    await Comment.deleteMany({ taskId });
    await Notification.deleteMany({ taskId });
    await Activity.deleteMany({ taskId });

    // delete a task of team
    await Task.findByIdAndDelete(taskId);
    await Team.findByIdAndUpdate(teamId, { $pull: { tasks: taskId } });

    return res.status(200).json({
      message: "Task deleted successfully for team",
    });
  } catch (error) {
    next(error);
  }
};

// delete a task of team
const deleteAllTaskOfTeam = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    // @ts-ignore
    const userId = req.userId;
    const { teamId } = req.params;
    const taskIds = req.body;

    if (!Array.isArray(taskIds) || taskIds.length === 0) {
      return res.status(400).json({ message: "tasks not provided to delete" });
    }

    // checking team
    const isTeamExist = await Team.findById(teamId);

    if (!isTeamExist) {
      return res.status(404).json({ message: "team not found" });
    }

    // check the task is exist in a team or not
    const isTasksExist = await Task.find({
      _id: { $in: taskIds },
      userId,
      teamId,
    });

    if (!isTasksExist.length) {
      return res.status(404).json({
        message: "tasks not found in the team,",
      });
    }

    await Comment.deleteMany({ taskId: { $in: taskIds } });
    await Notification.deleteMany({ taskId: { $in: taskIds } });
    await Activity.deleteMany({ taskId: { $in: taskIds } });

    // delete all task of team
    const deletedTasks = await Task.deleteMany({
      _id: { $in: taskIds },
      userId: userId,
      teamId,
    });

    await Activity.create({
      taskId: taskIds,
      userId,
      action: "DELETED",
      details: `Tasks "${deletedTasks.deletedCount}" are deleted by "${userId}"`,
    });

    return res.status(200).json({
      message: `Task "${deletedTasks.deletedCount}" are deleted`,
    });
  } catch (error) {
    next(error);
  }
};

// assign a task
const assignTask = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const { taskId, teamId, memberId } = req.params;

    // @ts-ignore
    const userId = req.userId;

    // checking a task
    const isTaskExist = await Task.findOne({ _id: taskId, teamId });

    if (!isTaskExist) {
      return res.status(400).json({ message: "task not found" });
    }
    if (isTaskExist.status === "Completed") {
      return res.status(409).json({ message: "task already completed !!" });
    }

    // checking team
    const isTeamExist = await Team.findOne({ _id: teamId, createdBy: userId });

    if (!isTeamExist) {
      return res.status(401).json({ message: "team not found" });
    }

    const isTaskInTeam = isTeamExist.tasks.some((t) => t.toString() === taskId);
    if (!isTaskInTeam) {
      return res.status(402).json({ message: "Task not found in this team" });
    }

    if (isTaskExist.assignedTo?._id.toString() === memberId) {
      return res.status(403).json({
        message: "Task already assigned to this member",
        assignee: isTaskExist,
      });
    }

    // checking member
    const isTeamMemberInTeam = isTeamExist.members.some(
      (m) => m.toString() === memberId
    );
    if (!isTeamMemberInTeam) {
      return res.status(404).json({ message: "Member not exists in the team" });
    }

    const assignee = await Task.findByIdAndUpdate(
      taskId,
      {
        assignedTo: memberId,
        teamId,
        status: "Progress",
      },
      { new: true }
    ).populate("assignedTo", "name email");

    await Team.findByIdAndUpdate(teamId, { $addToSet: { tasks: taskId } });

    await Activity.create({
      taskId,
      userId,
      action: "ASSIGNED",
      details: `Task assigned to user ${memberId}`,
    });

    return res.status(200).json({
      message: "Task assigned successfully",
      assignedTo: assignee,
    });
  } catch (error) {
    next(error);
  }
};

// assign a task
const unassignTask = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const { taskId, teamId, memberId } = req.params;
    // @ts-ignore
    const userId = req.userId;

    // checking a task
    const isTaskExist = await Task.findOne({ _id: taskId, userId });

    if (!isTaskExist) {
      return res.status(400).json({ message: "task not found" });
    }
    if (isTaskExist.status === "Completed") {
      return res.status(409).json({ message: "task already completed !!" });
    }
    if (isTaskExist.status === "Todo") {
      return res
        .status(403)
        .json({ message: "task not Assigned to anyone !!" });
    }

    // checking team
    const isTeamExist = await Team.findById(teamId);

    if (!isTeamExist) {
      return res.status(401).json({ message: "team not found" });
    }

    const isTaskInTeam = isTeamExist.tasks.some((t) => t.toString() === taskId);
    if (!isTaskInTeam) {
      return res.status(402).json({ message: "Task not found in this team" });
    }

    // checking member
    const isTeamMemberInTeam = isTeamExist.members.some(
      (m) => m.toString() === memberId
    );
    if (!isTeamMemberInTeam) {
      return res.status(404).json({ message: "Member not exits in the team" });
    }

    const unAssigned = await Task.findByIdAndUpdate(
      taskId,
      {
        assignedTo: null,
        status: "Todo",
      },
      { new: true }
    ).populate("assignedTo", "name email");

    await Activity.create({
      taskId,
      userId,
      action: "UNASSIGNED",
      details: `Task unassigned from ${memberId}`,
    });

    return res.status(200).json({
      message: "Task unassigned successfully",
      task: unAssigned,
    });
  } catch (error) {
    next(error);
  }
};

// task stats
const taskStats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const { teamId } = req.query;
    // @ts-ignore
    const userId = req.userId;

    const filterStats = teamId
      ? { teamId: new mongoose.Types.ObjectId(teamId as string) }
      : { userId };

    const totalTasks = await Task.countDocuments(filterStats);

    if (totalTasks === 0) {
      return res
        .status(404)
        .json({ message: "no any task available to display stats" });
    }
    const completedTasks = await Task.countDocuments({
      ...filterStats,
      status: "Completed",
    });
    const todoTasks = await Task.countDocuments({
      ...filterStats,
      status: "Todo",
    });
    const inProgressTasks = await Task.countDocuments({
      ...filterStats,
      status: "Progress",
    });
    const lowPriorityTasks = await Task.countDocuments({
      ...filterStats,
      priority: "Low",
    });
    const mediumPriorityTasks = await Task.countDocuments({
      ...filterStats,
      priority: "Medium",
    });
    const highPriorityTasks = await Task.countDocuments({
      ...filterStats,
      priority: "High",
    });

    // completion rate
    const completionRate =
      totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(2) : 0;

    const stats = {
      totalTasks,
      completedTasks,
      todoTasks,
      inProgressTasks,
      lowPriorityTasks,
      mediumPriorityTasks,
      highPriorityTasks,
      completionRate,
    };

    return res.status(200).json({
      message: "your stats here",
      stats,
    });
  } catch (error) {
    next(error);
  }
};

// task recents
const taskRecents = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const { teamId } = req.query;
    // @ts-ignore
    const userId = req.userId;

    const filter = teamId
      ? { teamId: new mongoose.Types.ObjectId(teamId as string) }
      : { userId };

    const recentTasks = await Task.find(filter)
      .sort({ updatedAt: -1 })
      .limit(5)
      .populate("assignedTo", "name email")
      .populate("teamId", "name");

    if (!recentTasks.length) {
      return res
        .status(404)
        .json({ message: "no any recents task available to display stats" });
    }

    return res.status(200).json({
      message: "recently task data",
      total: recentTasks.length,
      recentTasks,
    });
  } catch (error) {
    next(error);
  }
};

// task recents  ---- why not team option
const getActivity = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const { taskId } = req.params;

    if (!taskId) {
      return res.status(402).json({ message: "params not privided" });
    }

    const activityLogs = await Activity.find({ taskId })
      .sort({ createdAt: -1 })
      .populate("userId", "name email");

    if (!activityLogs.length) {
      return res
        .status(404)
        .json({ message: "No activity found for this task" });
    }

    return res.status(200).json({
      message: "Activity history for this task",
      activity: activityLogs,
    });
  } catch (error) {
    next(error);
  }
};

export {
  createTask,
  getTasks,
  getSpecificTask,
  updateTask,
  deleteTask,
  deleteAllTasks,
  filterTask,
  searchTask,
  createTaskOfTeam,
  getTasksOfTeam,
  getSpecificTaskOfTeam,
  updateTaskOfTeam,
  deleteTaskOfTeam,
  deleteAllTaskOfTeam,
  assignTask,
  unassignTask,
  taskStats,
  taskRecents,
  getActivity,
};
