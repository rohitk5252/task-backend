const express = require('express')
const router = express.Router()
// controller functions
const { signupUser, loginUser, googleAuth } = require('../controllers/authController')


router.post('/google', googleAuth)

// Login Route 
router.post('/login', loginUser)

// Signup Route
router.post('/signup', signupUser)

// Login Route 

module.exports =  router;