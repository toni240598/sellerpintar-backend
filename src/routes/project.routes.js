import express from "express";
import { body } from "express-validator";
import {
    handleCreateProject,
    handleCreateTask,
    handleDeleteProject,
    handleGetMyProjects,
    handleGetProjectDetail,
    handleInviteMember,
    handleUpdateTaskContent,
    handleUpdateTaskStatusOrAssignee,
    handleGetTasksByProject,
} from "../controllers/projectController.js";
import validateRequest from "../middlewares/validateRequest.js";

const router = express.Router();

router.post(
    "/project",
    [body("name").notEmpty().withMessage("Nama project wajib diisi"), validateRequest],
    handleCreateProject
);

router.post(
    "/project/invite",
    [
        body("projectId").notEmpty().withMessage("ProjectId wajib diisi"),
        body("email").isEmail().withMessage("Email valid wajib diisi"),
        validateRequest,
    ],
    handleInviteMember
);
router.get("/project", handleGetMyProjects);
router.delete("/project/:id", handleDeleteProject);
router.get("/project/:projectId", handleGetProjectDetail);

router.get("/task/project/:projectId", handleGetTasksByProject);
router.post(
  "/task",
  [
    body("title").notEmpty().withMessage("title wajib diisi"),
    body("description").notEmpty().withMessage("description wajib diisi"),
    body("projectId").notEmpty().withMessage("projectId wajib diisi"),
    validateRequest,
  ],
  handleCreateTask
);
router.put(
  "/task/:taskId/status",
  [
    body("status").notEmpty().withMessage("status wajib diisi"),
    validateRequest,
  ],
  handleUpdateTaskStatusOrAssignee
);
router.put(
  "/task/:taskId/content",
  [
    body("title").optional(),
    body("description").optional(),
    validateRequest,
  ],
  handleUpdateTaskContent
);

export default router;
