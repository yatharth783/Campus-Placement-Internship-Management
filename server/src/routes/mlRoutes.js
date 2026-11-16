const express = require('express');
const router = express.Router();
const {
  getRecommendations,
  runSkillGap,
  runResumeFeedback
} = require('../controllers/mlController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('student'));

router.get('/recommendations', getRecommendations);
router.post('/skill-gap', runSkillGap);
router.post('/resume-feedback', runResumeFeedback);

module.exports = router;
