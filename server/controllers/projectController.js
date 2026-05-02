const Project = require('../models/Project');
const User = require('../models/User');

const createProject = async (req, res) => {
  try {
    const { title, description } = req.body;
    const project = await Project.create({
      title,
      description,
      owner: req.user._id,
      members: [{ user: req.user._id, role: 'admin' }],
    });
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getProjects = async (req, res) => {
  try {
    // Find projects where user is a member
    const projects = await Project.find({ 'members.user': req.user._id });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('members.user', 'name email');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Ensure user is member
    const isMember = project.members.some((m) => m.user._id.toString() === req.user._id.toString());
    if (!isMember) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteProject = async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    // TODO: cascade delete tasks associated with this project
    res.json({ message: 'Project removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const addMember = async (req, res) => {
  try {
    const { email } = req.body;
    const project = await Project.findById(req.params.id);
    
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const userToAdd = await User.findOne({ email });
    if (!userToAdd) return res.status(404).json({ message: 'User not found in system' });

    const alreadyMember = project.members.find((m) => m.user.toString() === userToAdd._id.toString());
    if (alreadyMember) return res.status(400).json({ message: 'User already a member' });

    project.members.push({ user: userToAdd._id, role: 'member' });
    await project.save();

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const removeMember = async (req, res) => {
    try {
      const { userId } = req.params;
      const project = await Project.findById(req.params.id);
      
      if (!project) return res.status(404).json({ message: 'Project not found' });
  
      // Don't let owner remove themselves this way
      if (project.owner.toString() === userId) {
          return res.status(400).json({ message: 'Owner cannot be removed' });
      }
  
      project.members = project.members.filter((m) => m.user.toString() !== userId);
      await project.save();
  
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember
};
