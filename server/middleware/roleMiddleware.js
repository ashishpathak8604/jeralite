const Project = require('../models/Project');

const requireAdmin = async (req, res, next) => {
  try {
    const projectId = req.params.projectId || req.params.id; // handle different route param names
    
    if (!projectId) {
      return res.status(400).json({ message: 'Project ID required to check admin role' });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const member = project.members.find(
      (m) => m.user.toString() === req.user._id.toString()
    );

    if (member && member.role === 'admin') {
      next();
    } else {
      res.status(403).json({ message: 'Not authorized as admin for this project' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error checking roles' });
  }
};

module.exports = { requireAdmin };
