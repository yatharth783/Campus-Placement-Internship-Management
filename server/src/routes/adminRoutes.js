const express = require('express');
const router = express.Router();
const {
  getStats,
  getUsers,
  updateRecruiterStatus,
  removeJobPosting
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getStats);
router.get('/users', getUsers);
router.patch('/recruiters/:companyId/status', updateRecruiterStatus);
router.delete('/jobs/:id', removeJobPosting);

module.exports = router;
