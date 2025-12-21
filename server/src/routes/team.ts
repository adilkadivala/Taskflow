import express, { Router } from "express";
import {
  addMember,
  createTeam,
  deleteTeam,
  getMembers,
  getAllTeams,
  removeMember,
  updateTeam,
  getSpecificTeam,
} from "../controller/team";
import { authMiddleware } from "../middleware/auth";
import { requireAdmin } from "../middleware/role";

const teamRouter: Router = express.Router();
// create
teamRouter.route("/api/v1/create-team").post(authMiddleware, createTeam);
// read all
teamRouter.route("/api/v1/list-team").get(authMiddleware, getAllTeams);
// read specific team
teamRouter
  .route("/api/v1/list-team/:teamId")
  .get(authMiddleware, getSpecificTeam);
// update
teamRouter.route("/api/v1/update-team/:teamId").put(authMiddleware, updateTeam);
// delete
teamRouter
  .route("/api/v1/delete-team/:teamId")
  .delete(authMiddleware, deleteTeam);
// add member
teamRouter
  .route("/api/v1/add-member/:teamId")
  .post(authMiddleware, requireAdmin, addMember);
// remove member
teamRouter
  .route("/api/v1/remove-member/:teamId/:memberId")
  .delete(authMiddleware, requireAdmin, removeMember);
// get member
teamRouter
  .route("/api/v1/get-members/:teamId")
  .get(authMiddleware, requireAdmin, getMembers);

export default teamRouter;
