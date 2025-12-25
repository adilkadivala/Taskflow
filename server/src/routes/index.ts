import express, { Router } from "express";
import authRouter from "./auth";
import taskRouter from "./tasks";
import teamRouter from "./team";
import aboutUserRouter from "./about-user";
import commentRouter from "./comment";
import notificationRouter from "./notifications";
import socialAuthRouter from "./social-auth";

const router: Router = express.Router();


router.use("/auth", authRouter);
router.use("/social-auth", socialAuthRouter);
router.use("/task", taskRouter);
router.use("/team", teamRouter);
router.use("/about_user", aboutUserRouter);
router.use("/comment", commentRouter);
router.use("/notification", notificationRouter);

export default router;
