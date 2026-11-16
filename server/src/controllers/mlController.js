const User = require('../models/User');
const Job = require('../models/Job');
const {
  getJobRecommendations,
  getSkillGapAnalysis,
  getResumeFeedback
} = require('../services/mlService');

// @desc    Get ML-Powered Job Recommendations for Student
// @route   GET /api/ml/recommendations
// @access  Private (Student)
const getRecommendations = async (req, res, next) => {
  try {
    const student = await User.findById(req.user._id);
    const activeJobs = await Job.find({ status: 'active' }).populate(
      'companyId',
      'companyName location website'
    );

    if (!activeJobs || activeJobs.length === 0) {
      return res.status(200).json({
        success: true,
        recommendations: [],
        totalEvaluated: 0,
        summary: 'No active job postings available for ranking at this time.'
      });
    }

    const topN = req.query.limit ? parseInt(req.query.limit) : 10;
    const mlResponse = await getJobRecommendations(student, activeJobs, topN);

    // Merge full job details into the recommendations response
    const jobMap = {};
    activeJobs.forEach((j) => {
      jobMap[j._id.toString()] = j;
    });

    const enriched = (mlResponse.recommendations || []).map((rec) => {
      const fullJob = jobMap[rec.job_id];
      return {
        ...rec,
        jobDetails: fullJob || null
      };
    });

    res.status(200).json({
      success: true,
      recommendations: enriched,
      totalEvaluated: mlResponse.total_jobs_evaluated || activeJobs.length,
      summary: mlResponse.summary || 'Jobs ranked using TF-IDF and Cosine Similarity.'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Perform Skill Gap Analysis for Specific Job
// @route   POST /api/ml/skill-gap
// @access  Private (Student)
const runSkillGap = async (req, res, next) => {
  try {
    const { jobId } = req.body;
    if (!jobId) {
      return res.status(400).json({ success: false, message: 'Please provide a jobId.' });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Target job not found.' });
    }

    const student = await User.findById(req.user._id);
    const result = await getSkillGapAnalysis(
      student.skills,
      student.resumeText,
      job
    );

    res.status(200).json({
      success: true,
      result
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Resume Feedback Against a Job
// @route   POST /api/ml/resume-feedback
// @access  Private (Student)
const runResumeFeedback = async (req, res, next) => {
  try {
    const { jobId, customResumeText } = req.body;
    const student = await User.findById(req.user._id);

    const resumeTextToAnalyze = customResumeText || student.resumeText;
    if (!resumeTextToAnalyze || !resumeTextToAnalyze.trim()) {
      return res.status(400).json({
        success: false,
        message: 'No resume text available. Please upload a PDF resume first or provide resume text.'
      });
    }

    let job = null;
    if (jobId) {
      job = await Job.findById(jobId);
    }

    const feedback = await getResumeFeedback(resumeTextToAnalyze, job);

    res.status(200).json({
      success: true,
      feedback
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRecommendations,
  runSkillGap,
  runResumeFeedback
};
