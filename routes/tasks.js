const express = require('express');
const taskController = require('../controllers/taskController');

const requireAuth = require('../middleware/requireAuth')

const router = express.Router();

// Require Auth for all task routes
router.use(requireAuth)

//  To get all tasks 
router.get('/', taskController.getTasks);

//  To get a single task
router.get('/:id', taskController.getTaskDetails);

// Post a new task
router.post('/', taskController.addTask);

// Delete a task
router.delete('/:id', taskController.deleteTask);

// Update a task
router.patch('/:id', taskController.updateTask);

module.exports = router;