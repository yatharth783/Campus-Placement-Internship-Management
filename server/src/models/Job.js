const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true
    },
    title: {
      type: String,
      required: [true, 'Please provide job title'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Please provide detailed job description'],
      trim: true
    },
    requiredSkills: {
      type: [String],
      default: [],
      required: [true, 'Please provide at least one required skill']
    },
    minimumCGPA: {
      type: Number,
      default: 0.0,
      min: 0,
      max: 10
    },
    eligibleBranches: {
      type: [String],
      default: [] // Empty array signifies all engineering branches eligible
    },
    graduationYear: {
      type: Number,
      default: null // Null signifies all batches eligible
    },
    location: {
      type: String,
      default: 'Bangalore, India',
      trim: true
    },
    jobType: {
      type: String,
      enum: ['Full-time', 'Internship', 'Contract'],
      default: 'Full-time'
    },
    salary: {
      type: String,
      default: 'Best in Industry',
      trim: true
    },
    applicationDeadline: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // Default 30 days from now
    },
    status: {
      type: String,
      enum: ['active', 'closed'],
      default: 'active'
    }
  },
  {
    timestamps: true
  }
);

// Index for full-text search across title and description
jobSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Job', jobSchema);
