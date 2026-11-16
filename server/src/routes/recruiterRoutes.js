const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  getMyJobs,
  getDashboardStats
} = require('../controllers/recruiterController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('recruiter'));

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/my-jobs', getMyJobs);
router.get('/dashboard-stats', getDashboardStats);

module.exports = router;
