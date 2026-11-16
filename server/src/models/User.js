const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide full name'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Please provide a valid email address'
      ]
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
      minlength: 6,
      select: false
    },
    role: {
      type: String,
      enum: ['student', 'recruiter', 'admin'],
      default: 'student'
    },
    // Student-specific fields
    branch: {
      type: String,
      trim: true,
      default: ''
    },
    cgpa: {
      type: Number,
      min: [0, 'CGPA cannot be negative'],
      max: [10, 'CGPA cannot exceed 10.0'],
      default: 0.0
    },
    graduationYear: {
      type: Number,
      default: new Date().getFullYear()
    },
    skills: {
      type: [String],
      default: []
    },
    resumePath: {
      type: String,
      default: ''
    },
    resumeOriginalName: {
      type: String,
      default: ''
    },
    resumeText: {
      type: String,
      default: ''
    },
    experience: {
      type: String,
      default: ''
    },
    bio: {
      type: String,
      default: ''
    },
    phone: {
      type: String,
      default: ''
    },
    profileCompleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Virtual for calculating profile completion percentage
userSchema.virtual('profileCompletionPercentage').get(function () {
  if (this.role !== 'student') return 100;
  let score = 0;
  if (this.name) score += 15;
  if (this.email) score += 15;
  if (this.branch) score += 15;
  if (this.cgpa > 0) score += 15;
  if (this.skills && this.skills.length > 0) score += 20;
  if (this.resumePath) score += 20;
  return Math.min(score, 100);
});

userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('User', userSchema);
