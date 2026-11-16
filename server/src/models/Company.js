const mongoose = require('mongoose');

const companySchema = new mongoose.Schema(
  {
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    companyName: {
      type: String,
      required: [true, 'Please provide company name'],
      trim: true,
      maxlength: [120, 'Company name cannot exceed 120 characters']
    },
    description: {
      type: String,
      default: '',
      trim: true
    },
    website: {
      type: String,
      default: '',
      trim: true
    },
    location: {
      type: String,
      default: '',
      trim: true
    },
    industry: {
      type: String,
      default: 'Information Technology',
      trim: true
    },
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'verified' // Auto-verified for ease of testing in college demo, admin can change
    },
    verificationRemarks: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Company', companySchema);
