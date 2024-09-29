const express = require('express')
const router = express.Router()
// controller functions
const { updateUser } = require('../controllers/userController')
const requireAuth = require('../middleware/requireAuth')

router.use(requireAuth)

router.patch('/update', updateUser)

// Login Route 

module.exports =  router;