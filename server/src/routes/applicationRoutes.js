const express = require('express');
const router = express.Router();
const {
  applyForJob,
  getMyApplications,
  getJobApplicants,
  updateApplicationStatus
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/apply/:jobId', authorize('student'), applyForJob);
router.get('/my-applications', authorize('student'), getMyApplications);
router.get('/job/:jobId', authorize('recruiter', 'admin'), getJobApplicants);
router.patch('/:id/status', authorize('recruiter', 'admin'), updateApplicationStatus);

module.exports = router;
