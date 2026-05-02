const express = require('express');
const router = express.Router();
const {
  createTask,
  getTasksByProject,
  getMyTasks,
  updateTask,
  updateTaskStatus,
  deleteTask
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

// Note: requireAdmin is slightly complex here because task creation might require admin on the project.
// We'll handle basic role checks in the controller, or we can use a custom middleware.
// For now, let's just protect them and add deeper role checks if needed.

router.post('/', protect, createTask); // Ideally check if req.user is admin of req.body.projectId
router.get('/my-tasks', protect, getMyTasks);
router.get('/project/:projectId', protect, getTasksByProject);

router.route('/:id')
  .put(protect, updateTask) // Ideally check admin
  .delete(protect, deleteTask); // Ideally check admin

router.patch('/:id/status', protect, updateTaskStatus);

module.exports = router;
