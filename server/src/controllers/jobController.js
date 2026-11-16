const Job = require('../models/Job');
const Company = require('../models/Company');

// @desc    Get All Jobs with Search and Filters
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res, next) => {
  try {
    const { search, skill, branch, jobType, minCGPA, status } = req.query;

    const query = {};

    // Filter by status (default active for public browsing)
    if (status) {
      query.status = status;
    } else {
      query.status = 'active';
    }

    // Keyword search across title and description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by skill
    if (skill) {
      query.requiredSkills = { $in: [new RegExp(skill, 'i')] };
    }

    // Filter by job type
    if (jobType) {
      query.jobType = jobType;
    }

    // Filter by branch
    if (branch) {
      query.$or = [
        { eligibleBranches: { $size: 0 } }, // open to all
        { eligibleBranches: { $in: [new RegExp(branch, 'i')] } }
      ];
    }

    // Filter by minCGPA
    if (minCGPA) {
      query.minimumCGPA = { $lte: Number(minCGPA) };
    }

    const jobs = await Job.find(query)
      .populate('companyId', 'companyName website location industry')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Single Job Details
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('companyId', 'companyName description website location industry verificationStatus')
      .populate('recruiterId', 'name email');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found.'
      });
    }

    res.status(200).json({
      success: true,
      job
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create New Job Posting
// @route   POST /api/jobs
// @access  Private (Recruiter)
const createJob = async (req, res, next) => {
  try {
    const company = await Company.findOne({ recruiterId: req.user._id });
    if (!company) {
      return res.status(400).json({
        success: false,
        message: 'You must have an associated company profile to post job opportunities.'
      });
    }

    const {
      title,
      description,
      requiredSkills,
      minimumCGPA,
      eligibleBranches,
      graduationYear,
      location,
      jobType,
      salary,
      applicationDeadline
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Job title and description are required.'
      });
    }

    const parsedSkills = Array.isArray(requiredSkills)
      ? requiredSkills.map((s) => s.trim().toLowerCase()).filter(Boolean)
      : typeof requiredSkills === 'string'
      ? requiredSkills.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean)
      : [];

    const parsedBranches = Array.isArray(eligibleBranches)
      ? eligibleBranches.map((b) => b.trim()).filter(Boolean)
      : typeof eligibleBranches === 'string'
      ? eligibleBranches.split(',').map((b) => b.trim()).filter(Boolean)
      : [];

    const job = await Job.create({
      recruiterId: req.user._id,
      companyId: company._id,
      title,
      description,
      requiredSkills: parsedSkills,
      minimumCGPA: minimumCGPA ? Number(minimumCGPA) : 0,
      eligibleBranches: parsedBranches,
      graduationYear: graduationYear ? Number(graduationYear) : null,
      location: location || company.location || 'Bangalore, India',
      jobType: jobType || 'Full-time',
      salary: salary || 'Competitive Package',
      applicationDeadline: applicationDeadline ? new Date(applicationDeadline) : undefined,
      status: 'active'
    });

    const populatedJob = await Job.findById(job._id).populate('companyId', 'companyName location');

    res.status(201).json({
      success: true,
      message: 'Job opportunity created successfully!',
      job: populatedJob
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Job Posting
// @route   PUT /api/jobs/:id
// @access  Private (Recruiter)
const updateJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found.' });
    }

    // Verify ownership
    if (job.recruiterId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this job posting.'
      });
    }

    const {
      title,
      description,
      requiredSkills,
      minimumCGPA,
      eligibleBranches,
      graduationYear,
      location,
      jobType,
      salary,
      applicationDeadline,
      status
    } = req.body;

    if (title) job.title = title;
    if (description) job.description = description;
    if (location) job.location = location;
    if (jobType) job.jobType = jobType;
    if (salary) job.salary = salary;
    if (status) job.status = status;
    if (minimumCGPA !== undefined) job.minimumCGPA = Number(minimumCGPA);
    if (graduationYear !== undefined) job.graduationYear = graduationYear ? Number(graduationYear) : null;
    if (applicationDeadline) job.applicationDeadline = new Date(applicationDeadline);

    if (requiredSkills) {
      job.requiredSkills = Array.isArray(requiredSkills)
        ? requiredSkills.map((s) => s.trim().toLowerCase()).filter(Boolean)
        : requiredSkills.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
    }

    if (eligibleBranches) {
      job.eligibleBranches = Array.isArray(eligibleBranches)
        ? eligibleBranches.map((b) => b.trim()).filter(Boolean)
        : eligibleBranches.split(',').map((b) => b.trim()).filter(Boolean);
    }

    await job.save();

    res.status(200).json({
      success: true,
      message: 'Job posting updated successfully!',
      job
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete Job Posting
// @route   DELETE /api/jobs/:id
// @access  Private (Recruiter / Admin)
const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found.' });
    }

    if (job.recruiterId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this job posting.'
      });
    }

    await Job.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Job posting deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check Student Eligibility for Job
// @route   GET /api/jobs/:id/check-eligibility
// @access  Private (Student)
const checkEligibility = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found.' });
    }

    const student = req.user;
    const reasons = [];
    let isEligible = true;

    // CGPA
    if (job.minimumCGPA && job.minimumCGPA > 0) {
      const studentCGPA = student.cgpa || 0;
      if (studentCGPA < job.minimumCGPA) {
        isEligible = false;
        reasons.push(`Minimum CGPA requirement not met: Required ${job.minimumCGPA}, your CGPA is ${studentCGPA.toFixed(2)}.`);
      } else {
        reasons.push(`CGPA criteria satisfied (${studentCGPA.toFixed(2)} >= ${job.minimumCGPA}).`);
      }
    }

    // Branch
    if (job.eligibleBranches && job.eligibleBranches.length > 0) {
      const studentBranch = (student.branch || '').toLowerCase();
      const allowed = job.eligibleBranches.map((b) => b.toLowerCase());
      if (!allowed.includes(studentBranch)) {
        isEligible = false;
        reasons.push(`Branch mismatch: Job accepts [${job.eligibleBranches.join(', ')}], your branch is '${student.branch || 'Unassigned'}'.`);
      } else {
        reasons.push(`Branch eligibility verified (${student.branch}).`);
      }
    }

    // Graduation Year
    if (job.graduationYear && student.graduationYear) {
      if (student.graduationYear !== job.graduationYear) {
        isEligible = false;
        reasons.push(`Batch requirement: Targeted at ${job.graduationYear} batch, your graduation year is ${student.graduationYear}.`);
      } else {
        reasons.push(`Graduation year aligned (${student.graduationYear}).`);
      }
    }

    // Deadline
    if (job.applicationDeadline && new Date() > new Date(job.applicationDeadline)) {
      isEligible = false;
      reasons.push('The application deadline for this job posting has expired.');
    }

    res.status(200).json({
      success: true,
      isEligible,
      reasons: reasons.length > 0 ? reasons : ['All standard eligibility criteria met.']
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  checkEligibility
};
