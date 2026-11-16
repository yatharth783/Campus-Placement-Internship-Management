const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const { getJobRecommendations } = require('../services/mlService');

// @desc    Apply for a Job / Internship
// @route   POST /api/applications/apply/:jobId
// @access  Private (Student)
const applyForJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const studentId = req.user._id;

    const job = await Job.findById(jobId).populate('companyId', 'companyName');
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job posting not found.' });
    }

    if (job.status === 'closed') {
      return res.status(400).json({ success: false, message: 'This job posting is closed for applications.' });
    }

    if (job.applicationDeadline && new Date() > new Date(job.applicationDeadline)) {
      return res.status(400).json({ success: false, message: 'The application deadline has passed.' });
    }

    // Check if already applied
    const existing = await Application.findOne({ studentId, jobId });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted an application for this position.'
      });
    }

    // Calculate decision-support match score via ML service
    let similarityScore = null;
    try {
      const mlRecs = await getJobRecommendations(req.user, [job], 1);
      if (mlRecs && mlRecs.recommendations && mlRecs.recommendations.length > 0) {
        similarityScore = mlRecs.recommendations[0].similarity_score;
      }
    } catch (e) {
      console.warn('Could not compute ML match score on apply:', e.message);
    }

    const application = await Application.create({
      studentId,
      jobId,
      resumePath: req.user.resumePath || '',
      status: 'Applied',
      similarityScore
    });

    const populated = await Application.findById(application._id).populate({
      path: 'jobId',
      select: 'title companyId location salary jobType',
      populate: { path: 'companyId', select: 'companyName' }
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully!',
      application: populated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Student's Own Applications
// @route   GET /api/applications/my-applications
// @access  Private (Student)
const getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ studentId: req.user._id })
      .populate({
        path: 'jobId',
        select: 'title companyId location salary jobType applicationDeadline status',
        populate: { path: 'companyId', select: 'companyName location website' }
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Applicants for a Specific Job
// @route   GET /api/applications/job/:jobId
// @access  Private (Recruiter / Admin)
const getJobApplicants = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found.' });
    }

    if (job.recruiterId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view applicants for this job.'
      });
    }

    const applications = await Application.find({ jobId })
      .populate('studentId', 'name email branch cgpa graduationYear skills resumePath resumeOriginalName phone experience')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      jobTitle: job.title,
      applications
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Application Status & Remarks
// @route   PATCH /api/applications/:id/status
// @access  Private (Recruiter / Admin)
const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, recruiterRemarks } = req.body;
    const validStatuses = ['Applied', 'Under Review', 'Shortlisted', 'Rejected', 'Selected'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const application = await Application.findById(req.params.id).populate('jobId');
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    // Check authorization: recruiter must own the job or be admin
    if (
      application.jobId.recruiterId.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update status for this application.'
      });
    }

    application.status = status;
    if (recruiterRemarks !== undefined) {
      application.recruiterRemarks = recruiterRemarks;
    }

    await application.save();

    res.status(200).json({
      success: true,
      message: `Application marked as '${status}' successfully.`,
      application
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  applyForJob,
  getMyApplications,
  getJobApplicants,
  updateApplicationStatus
};
