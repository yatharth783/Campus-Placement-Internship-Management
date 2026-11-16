const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Company = require('../models/Company');

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'campusconnect_jwt_super_secret_key_2026',
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// @desc    Register Student
// @route   POST /api/auth/register-student
// @access  Public
const registerStudent = async (req, res, next) => {
  try {
    const { name, email, password, branch, cgpa, graduationYear, skills } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required fields.'
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists.'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const parsedSkills = Array.isArray(skills)
      ? skills.map((s) => s.trim().toLowerCase()).filter(Boolean)
      : typeof skills === 'string'
      ? skills.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean)
      : [];

    const user = await User.create({
      name,
      email: email.toLowerCase().trim(),
      passwordHash,
      role: 'student',
      branch: branch || 'Computer Science',
      cgpa: Number(cgpa) || 0.0,
      graduationYear: Number(graduationYear) || new Date().getFullYear(),
      skills: parsedSkills,
      profileCompleted: true
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        branch: user.branch,
        cgpa: user.cgpa,
        graduationYear: user.graduationYear,
        skills: user.skills,
        profileCompletionPercentage: user.profileCompletionPercentage
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Register Recruiter & Create Company Profile
// @route   POST /api/auth/register-recruiter
// @access  Public
const registerRecruiter = async (req, res, next) => {
  try {
    const { name, email, password, companyName, description, website, location, industry } = req.body;

    if (!name || !email || !password || !companyName) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, password, and company name are required.'
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists.'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email: email.toLowerCase().trim(),
      passwordHash,
      role: 'recruiter'
    });

    const company = await Company.create({
      recruiterId: user._id,
      companyName,
      description: description || '',
      website: website || '',
      location: location || '',
      industry: industry || 'Technology',
      verificationStatus: 'verified' // Auto-verified for seamless college minor project evaluation
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: {
          id: company._id,
          companyName: company.companyName,
          verificationStatus: company.verificationStatus
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    User Login (Student, Recruiter, Admin)
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.'
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+passwordHash');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. User not found.'
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Password incorrect.'
      });
    }

    let company = null;
    if (user.role === 'recruiter') {
      company = await Company.findOne({ recruiterId: user._id });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        branch: user.branch,
        cgpa: user.cgpa,
        graduationYear: user.graduationYear,
        skills: user.skills,
        resumePath: user.resumePath,
        resumeOriginalName: user.resumeOriginalName,
        profileCompletionPercentage: user.profileCompletionPercentage,
        company: company ? {
          id: company._id,
          companyName: company.companyName,
          verificationStatus: company.verificationStatus,
          location: company.location,
          website: company.website,
          industry: company.industry
        } : null
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Current Logged-in User Profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    let company = null;
    if (user.role === 'recruiter') {
      company = await Company.findOne({ recruiterId: user._id });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        branch: user.branch,
        cgpa: user.cgpa,
        graduationYear: user.graduationYear,
        skills: user.skills,
        resumePath: user.resumePath,
        resumeOriginalName: user.resumeOriginalName,
        experience: user.experience,
        bio: user.bio,
        phone: user.phone,
        profileCompletionPercentage: user.profileCompletionPercentage,
        company
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerStudent,
  registerRecruiter,
  login,
  getMe
};
