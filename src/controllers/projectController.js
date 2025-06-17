import {
  createProject,
  deleteProject,
  getAllUserProjects,
  getProjectDetailWithMembers,
  inviteMemberToProject,
} from "../services/projectService.js";
import {
  getTasksByProjectId,
  createTask,
  updateTaskContent,
  updateTaskStatusOrAssignee,
} from "../services/taskService.js";


export const handleCreateProject = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name } = req.body;
    const project = await createProject(userId, name);
    res.status(201).json({ status: "success", data: project });
  } catch (err) {
    res.status(400).json({ status: "error", message: err.message });
  }
};

export const handleInviteMember = async (req, res) => {
  try {
    const { projectId, email } = req.body;
    const inviterId = req.user.id;

    const membership = await inviteMemberToProject(projectId, email, inviterId);
    res.status(200).json({ status: "success", data: membership });
  } catch (err) {
    res.status(400).json({ status: "error", message: err.message });
  }
};

export const handleGetMyProjects = async (req, res) => {
  try {
    const userId = req.user.id;
    const projects = await getAllUserProjects(userId);
    res.status(200).json({ status: "success", data: projects });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};


export const handleDeleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await deleteProject(id, userId);
    res.status(200).json({ status: "success", message: result.message });
  } catch (err) {
    res.status(403).json({ status: "error", message: err.message });
  }
};

export const handleGetProjectDetail = async (req, res) => {
  try {
    const userId = req.user.id;
    const { projectId } = req.params;

    const { project, members } = await getProjectDetailWithMembers(projectId, userId);

    res.status(200).json({
      status: "success",
      data: {
        project,
        members,
      },
    });
  } catch (err) {
    res.status(403).json({
      status: "error",
      message: err.message,
    });
  }
};

export const handleGetTasksByProject = async (req, res) => {
  try {
    const userId = req.user.id;
    const { projectId } = req.params;
    const tasks = await getTasksByProjectId(userId, projectId);
    res.status(200).json({
      status: "success",
      data: tasks,
    });
  } catch (err) {
    res.status(403).json({
      status: "error",
      message: err.message,
    });
  }
};

export const handleCreateTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const task = await createTask(userId, req.body);
    res.status(201).json({ status: "success", data: task });
  } catch (err) {
    res.status(400).json({ status: "error", message: err.message });
  }
};

export const handleUpdateTaskStatusOrAssignee = async (req, res) => {
  try {
    const userId = req.user.id;
    const { taskId } = req.params;
    const { status } = req.body;
    const updated = await updateTaskStatusOrAssignee(userId, taskId, status);
    res.status(200).json({ status: "success", data: updated });
  } catch (err) {
    res.status(400).json({ status: "error", message: err.message });
  }
};

export const handleUpdateTaskContent = async (req, res) => {
  try {
    const userId = req.user.id;
    const { taskId } = req.params;
    const updated = await updateTaskContent(userId, taskId, req.body);
    res.status(200).json({ status: "success", data: updated });
  } catch (err) {
    res.status(400).json({ status: "error", message: err.message });
  }
};
