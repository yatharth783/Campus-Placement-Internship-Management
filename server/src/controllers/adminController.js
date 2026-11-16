const User = require('../models/User');
const Company = require('../models/Company');
const Job = require('../models/Job');
const Application = require('../models/Application');

// @desc    Get Comprehensive Placement Analytics & Stats
// @route   GET /api/admin/stats
// @access  Private (Admin)
const getStats = async (req, res, next) => {
  try {
    const [
      totalStudents,
      totalRecruiters,
      totalJobs,
      activeJobs,
      totalApplications,
      shortlistedCount,
      selectedCount,
      rejectedCount
    ] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'recruiter' }),
      Job.countDocuments(),
      Job.countDocuments({ status: 'active' }),
      Application.countDocuments(),
      Application.countDocuments({ status: 'Shortlisted' }),
      Application.countDocuments({ status: 'Selected' }),
      Application.countDocuments({ status: 'Rejected' })
    ]);

    // Status Breakdown Chart Data
    const statusBreakdown = [
      { name: 'Applied', value: await Application.countDocuments({ status: 'Applied' }), color: '#3b82f6' },
      { name: 'Under Review', value: await Application.countDocuments({ status: 'Under Review' }), color: '#f59e0b' },
      { name: 'Shortlisted', value: shortlistedCount, color: '#8b5cf6' },
      { name: 'Selected', value: selectedCount, color: '#10b981' },
      { name: 'Rejected', value: rejectedCount, color: '#ef4444' }
    ];

    // Branch Distribution Chart Data
    const branchStats = await User.aggregate([
      { $match: { role: 'student' } },
      { $group: { _id: '$branch', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const formattedBranches = branchStats.map((b) => ({
      branch: b._id || 'General Engineering',
      students: b.count
    }));

    // Top Recruiting Companies
    const topCompanies = await Job.aggregate([
      { $group: { _id: '$companyId', jobsCount: { $sum: 1 } } },
      { $sort: { jobsCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'companies',
          localField: '_id',
          foreignField: '_id',
          as: 'company'
        }
      },
      { $unwind: '$company' },
      {
        $project: {
          companyName: '$company.companyName',
          industry: '$company.industry',
          jobsCount: 1
        }
      }
    ]);

    // Recent System Activity
    const recentApplications = await Application.find()
      .populate('studentId', 'name email branch')
      .populate({
        path: 'jobId',
        select: 'title companyId',
        populate: { path: 'companyId', select: 'companyName' }
      })
      .sort({ createdAt: -1 })
      .limit(6);

    res.status(200).json({
      success: true,
      stats: {
        totalStudents,
        totalRecruiters,
        totalJobs,
        activeJobs,
        totalApplications,
        shortlistedCount,
        selectedCount,
        placementRate:
          totalStudents > 0
            ? Math.round((selectedCount / totalStudents) * 100 * 10) / 10
            : 0
      },
      charts: {
        statusBreakdown,
        branchDistribution: formattedBranches,
        topCompanies
      },
      recentApplications
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get All Users with Filters
// @route   GET /api/admin/users
// @access  Private (Admin)
const getUsers = async (req, res, next) => {
  try {
    const { role, search } = req.query;
    const query = {};

    if (role) {
      query.role = role;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { branch: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Recruiter Verification Status (Approve/Reject)
// @route   PATCH /api/admin/recruiters/:companyId/status
// @access  Private (Admin)
const updateRecruiterStatus = async (req, res, next) => {
  try {
    const { status, remarks } = req.body;
    const valid = ['verified', 'pending', 'rejected'];

    if (!valid.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${valid.join(', ')}`
      });
    }

    const company = await Company.findByIdAndUpdate(
      req.params.companyId,
      {
        verificationStatus: status,
        verificationRemarks: remarks || ''
      },
      { new: true }
    );

    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found.' });
    }

    res.status(200).json({
      success: true,
      message: `Recruiter company status updated to '${status}'.`,
      company
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Moderate / Remove Job Posting
// @route   DELETE /api/admin/jobs/:id
// @access  Private (Admin)
const removeJobPosting = async (req, res, next) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found.' });
    }

    // Also remove associated applications
    await Application.deleteMany({ jobId: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Job posting and associated applications removed by administrator.'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStats,
  getUsers,
  updateRecruiterStatus,
  removeJobPosting
};
