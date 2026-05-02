const Task = require('../models/Task');
const Project = require('../models/Project');

const createTask = async (req, res) => {
  try {
    const { title, description, projectId, assignedTo, dueDate } = req.body;
    
    // Ensure project exists
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const task = await Task.create({
      title,
      description,
      project: projectId,
      assignedTo,
      createdBy: req.user._id,
      dueDate,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getTasksByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    
    // Check if user is member of project
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    
    const isMember = project.members.some((m) => m.user.toString() === req.user._id.toString());
    if (!isMember) return res.status(403).json({ message: 'Not authorized to view these tasks' });

    const tasks = await Task.find({ project: projectId })
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');
      
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getMyTasks = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. Find all projects where user is a member
    const projects = await Project.find({ 'members.user': userId });

    const adminProjectIds = [];
    const memberProjectIds = [];

    projects.forEach(p => {
      const memberInfo = p.members.find(m => m.user.toString() === userId.toString());
      if (memberInfo && memberInfo.role === 'admin') {
        adminProjectIds.push(p._id);
      } else {
        memberProjectIds.push(p._id);
      }
    });

    // 2. Build the task query
    // Show tasks where:
    // (A) Task is in a project where user is admin
    // OR (B) Task is in a project where user is member AND task is assigned to user
    const tasks = await Task.find({
      $or: [
        { project: { $in: adminProjectIds } },
        { project: { $in: memberProjectIds }, assignedTo: userId }
      ]
    })
      .populate('project', 'title')
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');

    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findById(req.params.id);
    
    if (!task) return res.status(404).json({ message: 'Task not found' });

    // Ensure user is member of the project
    const project = await Project.findById(task.project);
    const isMember = project.members.some((m) => m.user.toString() === req.user._id.toString());
    if (!isMember) return res.status(403).json({ message: 'Not authorized' });

    task.status = status;
    await task.save();

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createTask,
  getTasksByProject,
  getMyTasks,
  updateTask,
  updateTaskStatus,
  deleteTask
};
