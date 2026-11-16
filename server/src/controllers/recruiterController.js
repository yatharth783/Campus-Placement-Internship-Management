const Company = require('../models/Company');
const Job = require('../models/Job');
const Application = require('../models/Application');
const User = require('../models/User');

// @desc    Get Recruiter Profile & Company Details
// @route   GET /api/recruiter/profile
// @access  Private (Recruiter)
const getProfile = async (req, res, next) => {
  try {
    const company = await Company.findOne({ recruiterId: req.user._id });
    res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role
      },
      company
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Recruiter & Company Profile
// @route   PUT /api/recruiter/profile
// @access  Private (Recruiter)
const updateProfile = async (req, res, next) => {
  try {
    const { name, companyName, description, website, location, industry } = req.body;

    if (name) {
      await User.findByIdAndUpdate(req.user._id, { name });
    }

    let company = await Company.findOne({ recruiterId: req.user._id });
    if (!company) {
      company = await Company.create({
        recruiterId: req.user._id,
        companyName: companyName || 'Company Profile'
      });
    }

    if (companyName) company.companyName = companyName;
    if (description !== undefined) company.description = description;
    if (website !== undefined) company.website = website;
    if (location !== undefined) company.location = location;
    if (industry !== undefined) company.industry = industry;

    await company.save();

    res.status(200).json({
      success: true,
      message: 'Company profile updated successfully.',
      company
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Recruiter Jobs with Applicant Counts
// @route   GET /api/recruiter/my-jobs
// @access  Private (Recruiter)
const getMyJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ recruiterId: req.user._id })
      .populate('companyId', 'companyName location')
      .sort({ createdAt: -1 });

    // Aggregate applicant counts for each job
    const jobIds = jobs.map((j) => j._id);
    const applicationCounts = await Application.aggregate([
      { $match: { jobId: { $in: jobIds } } },
      { $group: { _id: '$jobId', count: { $sum: 1 } } }
    ]);

    const countMap = {};
    applicationCounts.forEach((c) => {
      countMap[c._id.toString()] = c.count;
    });

    const enrichedJobs = jobs.map((j) => ({
      ...j.toObject(),
      applicantCount: countMap[j._id.toString()] || 0
    }));

    res.status(200).json({
      success: true,
      count: enrichedJobs.length,
      jobs: enrichedJobs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Recruiter Dashboard Stats
// @route   GET /api/recruiter/dashboard-stats
// @access  Private (Recruiter)
const getDashboardStats = async (req, res, next) => {
  try {
    const jobs = await Job.find({ recruiterId: req.user._id });
    const jobIds = jobs.map((j) => j._id);

    const applications = await Application.find({ jobId: { $in: jobIds } })
      .populate('studentId', 'name email branch cgpa skills')
      .populate('jobId', 'title')
      .sort({ createdAt: -1 });

    const totalJobs = jobs.length;
    const activeJobs = jobs.filter((j) => j.status === 'active').length;
    const totalApplicants = applications.length;
    const shortlistedCount = applications.filter((a) => a.status === 'Shortlisted').length;
    const selectedCount = applications.filter((a) => a.status === 'Selected').length;
    const underReviewCount = applications.filter((a) => a.status === 'Under Review').length;

    res.status(200).json({
      success: true,
      stats: {
        totalJobs,
        activeJobs,
        totalApplicants,
        shortlistedCount,
        selectedCount,
        underReviewCount
      },
      recentApplicants: applications.slice(0, 5)
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getMyJobs,
  getDashboardStats
};
