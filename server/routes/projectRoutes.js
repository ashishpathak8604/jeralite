const express = require('express');
const router = express.Router();
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember
} = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/roleMiddleware');

router.route('/')
  .post(protect, createProject)
  .get(protect, getProjects);

router.route('/:id')
  .get(protect, getProjectById)
  .put(protect, requireAdmin, updateProject)
  .delete(protect, requireAdmin, deleteProject);

router.post('/:id/members', protect, requireAdmin, addMember);
router.delete('/:id/members/:userId', protect, requireAdmin, removeMember);

module.exports = router;
