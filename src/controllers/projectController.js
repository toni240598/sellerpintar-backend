import {
  createProject,
  deleteProject,
  getAllUserProjects,
  getProjectDetailWithMembers,
  inviteMemberToProject,
  updateProject,
} from "../services/projectService.js";
import {
  createTask,
  getTasksByProjectId,
  updateTaskContent,
  updateTaskStatusOrAssignee,
  updateAssigneeTask,
  getTaskStatsByUser,
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

export const handleEditProject = async (req, res, next) => {
  try {
    const userId = req.user.id
    const { projectId } = req.params
    const { name } = req.body

    const updatedProject = await updateProject(projectId, userId, name)
    res.json({ message: 'Project berhasil diperbarui', data: updatedProject })
  } catch (err) {
    res.status(400).json({ status: "error", message: err.message });
  }
}

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
      data: { ...project, members},
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

export const handleAssigneeTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const { taskId } = req.params;
    const data = await updateAssigneeTask(userId, taskId);
    res.status(200).json({status: 'success', data });
  } catch (err) {
    res.status(400).json({ status: "error", message: err.message });
  }
}

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

export const getUserTaskStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const stats = await getTaskStatsByUser(userId)
    res.json(stats)
  } catch (error) {
    res.status(500).json({ error: 'Failed to get task statistics' })
  }
}
