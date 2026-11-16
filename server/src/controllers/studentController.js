const path = require('path');
const User = require('../models/User');
const Application = require('../models/Application');
const Job = require('../models/Job');
const { extractTextFromPDF } = require('../services/mlService');

// @desc    Get Student Profile
// @route   GET /api/student/profile
// @access  Private (Student)
const getProfile = async (req, res, next) => {
  try {
    const student = await User.findById(req.user._id);
    res.status(200).json({
      success: true,
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        branch: student.branch,
        cgpa: student.cgpa,
        graduationYear: student.graduationYear,
        skills: student.skills,
        experience: student.experience,
        bio: student.bio,
        phone: student.phone,
        resumePath: student.resumePath,
        resumeOriginalName: student.resumeOriginalName,
        profileCompletionPercentage: student.profileCompletionPercentage
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Student Profile
// @route   PUT /api/student/profile
// @access  Private (Student)
const updateProfile = async (req, res, next) => {
  try {
    const { name, branch, cgpa, graduationYear, skills, experience, bio, phone } = req.body;

    const parsedSkills = Array.isArray(skills)
      ? skills.map((s) => s.trim().toLowerCase()).filter(Boolean)
      : typeof skills === 'string'
      ? skills.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean)
      : req.user.skills;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        name: name || req.user.name,
        branch: branch !== undefined ? branch : req.user.branch,
        cgpa: cgpa !== undefined ? Number(cgpa) : req.user.cgpa,
        graduationYear: graduationYear !== undefined ? Number(graduationYear) : req.user.graduationYear,
        skills: parsedSkills,
        experience: experience !== undefined ? experience : req.user.experience,
        bio: bio !== undefined ? bio : req.user.bio,
        phone: phone !== undefined ? phone : req.user.phone
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully!',
      student: updatedUser
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload PDF Resume & Extract Skills via ML Service
// @route   POST /api/student/upload-resume
// @access  Private (Student)
const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No resume PDF file uploaded.'
      });
    }

    const filePath = req.file.path;
    const relativePath = path.join('uploads', 'resumes', req.file.filename);

    // Call ML service to extract text and detected skills using PyPDF
    const extractionResult = await extractTextFromPDF(filePath);

    // Merge any new detected skills into student profile if student skills are empty or expand them
    const currentSkills = new Set(req.user.skills || []);
    if (extractionResult.detected_skills && extractionResult.detected_skills.length > 0) {
      extractionResult.detected_skills.forEach((s) => currentSkills.add(s.toLowerCase()));
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        resumePath: relativePath,
        resumeOriginalName: req.file.originalname,
        resumeText: extractionResult.extracted_text || '',
        skills: Array.from(currentSkills)
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Resume uploaded and analyzed successfully!',
      resume: {
        path: relativePath,
        originalName: req.file.originalname,
        wordCount: extractionResult.word_count,
        detectedSkills: extractionResult.detected_skills,
        warning: extractionResult.error_message
      },
      skills: updatedUser.skills,
      profileCompletionPercentage: updatedUser.profileCompletionPercentage
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Student Dashboard Statistics
// @route   GET /api/student/dashboard-stats
// @access  Private (Student)
const getDashboardStats = async (req, res, next) => {
  try {
    const studentId = req.user._id;

    const applications = await Application.find({ studentId }).populate({
      path: 'jobId',
      select: 'title companyId location salary jobType applicationDeadline',
      populate: { path: 'companyId', select: 'companyName' }
    });

    const totalApplied = applications.length;
    const underReview = applications.filter((a) => a.status === 'Under Review').length;
    const shortlisted = applications.filter((a) => a.status === 'Shortlisted').length;
    const selected = applications.filter((a) => a.status === 'Selected').length;
    const rejected = applications.filter((a) => a.status === 'Rejected').length;

    // Active jobs count
    const activeJobsCount = await Job.countDocuments({ status: 'active' });

    res.status(200).json({
      success: true,
      stats: {
        totalApplied,
        underReview,
        shortlisted,
        selected,
        rejected,
        activeJobsCount,
        profileCompletionPercentage: req.user.profileCompletionPercentage
      },
      recentApplications: applications.slice(0, 5)
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  uploadResume,
  getDashboardStats
};
