const express = require('express');
const router = express.Router();
const {
  registerStudent,
  registerRecruiter,
  login,
  getMe
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register-student', registerStudent);
router.post('/register-recruiter', registerRecruiter);
router.post('/login', login);
router.get('/me', protect, getMe);

module.exports = router;
