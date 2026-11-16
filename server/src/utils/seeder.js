const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/User');
const Company = require('../models/Company');
const Job = require('../models/Job');
const Application = require('../models/Application');

const seedDatabase = async (silent = false) => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      if (!silent) console.log('[Seeder] Database already contains records. Skipping seed.');
      return;
    }

    if (!silent) console.log('[Seeder] Clearing old collections and seeding initial data...');

    await User.deleteMany();
    await Company.deleteMany();
    await Job.deleteMany();
    await Application.deleteMany();

    const salt = await bcrypt.genSalt(10);
    const adminPass = await bcrypt.hash('Admin@123', salt);
    const recruiterPass = await bcrypt.hash('Recruiter@123', salt);
    const studentPass = await bcrypt.hash('Student@123', salt);

    // 1. Admin
    const admin = await User.create({
      name: 'Dr. Ramesh Sharma (Placement Director)',
      email: 'admin@campusconnect.edu',
      passwordHash: adminPass,
      role: 'admin',
      bio: 'Head of Training and Placement Cell'
    });

    // 2. Recruiters
    const recGoogleUser = await User.create({
      name: 'Pooja Agarwal (Tech Campus Lead)',
      email: 'recruiter.google@campusconnect.edu',
      passwordHash: recruiterPass,
      role: 'recruiter'
    });

    const googleCompany = await Company.create({
      recruiterId: recGoogleUser._id,
      companyName: 'Google India',
      description: 'Global technology leader specializing in search, cloud computing, artificial intelligence, and operating systems.',
      website: 'https://careers.google.com',
      location: 'Bangalore & Hyderabad',
      industry: 'Internet & Artificial Intelligence',
      verificationStatus: 'verified'
    });

    const recMsftUser = await User.create({
      name: 'Vikram Malhotra (Talent Partner)',
      email: 'recruiter.microsoft@campusconnect.edu',
      passwordHash: recruiterPass,
      role: 'recruiter'
    });

    const msftCompany = await Company.create({
      recruiterId: recMsftUser._id,
      companyName: 'Microsoft IDC',
      description: 'Enabling digital transformation for the era of an intelligent cloud and an intelligent edge.',
      website: 'https://careers.microsoft.com',
      location: 'Hyderabad & Bangalore',
      industry: 'Enterprise Software & Cloud',
      verificationStatus: 'verified'
    });

    const recInfosysUser = await User.create({
      name: 'Suresh Menon (Campus Relations)',
      email: 'recruiter.infosys@campusconnect.edu',
      passwordHash: recruiterPass,
      role: 'recruiter'
    });

    const infosysCompany = await Company.create({
      recruiterId: recInfosysUser._id,
      companyName: 'Infosys Limited',
      description: 'Global leader in next-generation digital services and consulting.',
      website: 'https://www.infosys.com/careers',
      location: 'Pune & Bangalore',
      industry: 'IT Consulting & Services',
      verificationStatus: 'verified'
    });

    // 3. Students
    const studentYash = await User.create({
      name: 'Yash Vardhan',
      email: 'yash.student@campusconnect.edu',
      passwordHash: studentPass,
      role: 'student',
      branch: 'Computer Science',
      cgpa: 8.85,
      graduationYear: 2026,
      skills: ['react', 'node.js', 'javascript', 'mongodb', 'docker', 'express', 'tailwind'],
      experience: 'Full Stack MERN Developer Intern at TechLabz. Engineered RESTful APIs and modern React dashboards.',
      resumeText: 'Yash Vardhan. Computer Science student. Proficient in React, Node.js, Express, MongoDB, Docker, and REST APIs. Built scalable web applications with 99.9% uptime and low latency. Experienced with Git, Tailwind CSS, and full-stack software development.',
      bio: 'Enthusiastic full-stack web developer and cloud computing enthusiast.',
      profileCompleted: true
    });

    const studentPriya = await User.create({
      name: 'Priya Sharma',
      email: 'priya.student@campusconnect.edu',
      passwordHash: studentPass,
      role: 'student',
      branch: 'Computer Science',
      cgpa: 9.2,
      graduationYear: 2026,
      skills: ['python', 'machine learning', 'tensorflow', 'scikit-learn', 'pandas', 'numpy', 'sql'],
      experience: 'AI Research Intern at DataLab. Trained convolutional and transformer models for NLP classification.',
      resumeText: 'Priya Sharma. CS Undergraduate specializing in Machine Learning, Deep Learning, TensorFlow, Scikit-learn, Python, Pandas, and NumPy. Published paper on TF-IDF cosine similarity text ranking.',
      bio: 'Aspiring Machine Learning Engineer passionate about NLP and Predictive Modeling.',
      profileCompleted: true
    });

    const studentRohit = await User.create({
      name: 'Rohit Verma',
      email: 'rohit.student@campusconnect.edu',
      passwordHash: studentPass,
      role: 'student',
      branch: 'Electronics & Communication',
      cgpa: 7.6,
      graduationYear: 2026,
      skills: ['c++', 'c', 'embedded systems', 'python', 'iot', 'rtos'],
      experience: 'Embedded systems project on IoT wireless sensor nodes with STM32 and Arduino.',
      resumeText: 'Rohit Verma. ECE engineering student with solid command over C, C++, Embedded Systems, Microcontrollers, and IoT protocols. Developed low-power smart sensors.',
      bio: 'Hardware-software co-designer interested in robotics and edge computing.',
      profileCompleted: true
    });

    const studentAnanya = await User.create({
      name: 'Ananya Gupta',
      email: 'ananya.student@campusconnect.edu',
      passwordHash: studentPass,
      role: 'student',
      branch: 'Information Technology',
      cgpa: 8.4,
      graduationYear: 2026,
      skills: ['java', 'spring boot', 'mysql', 'docker', 'aws', 'rest api'],
      experience: 'Backend developer on Spring Boot enterprise microservices with MySQL.',
      resumeText: 'Ananya Gupta. IT student proficient in Java, Spring Boot, MySQL, REST API design, AWS, and Docker containerization. Created microservices supporting concurrent requests.',
      bio: 'Backend Java engineer dedicated to high-performance distributed systems.',
      profileCompleted: true
    });

    // 4. Jobs
    const jobFullStack = await Job.create({
      recruiterId: recGoogleUser._id,
      companyId: googleCompany._id,
      title: 'Full Stack Software Engineer (MERN)',
      description: 'Google India is hiring software engineers to design, build, and deploy responsive web applications. Responsibilities include building scalable REST APIs in Node.js and Express, architecting frontend components using React and Tailwind CSS, and managing MongoDB document stores. Must collaborate effectively in agile teams.',
      requiredSkills: ['react', 'node.js', 'javascript', 'mongodb', 'express', 'docker'],
      minimumCGPA: 7.5,
      eligibleBranches: ['Computer Science', 'Information Technology', 'Electronics & Communication'],
      graduationYear: 2026,
      location: 'Bangalore, India (Hybrid)',
      jobType: 'Full-time',
      salary: '₹18,00,000 - ₹24,00,000 per annum',
      applicationDeadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      status: 'active'
    });

    const jobML = await Job.create({
      recruiterId: recGoogleUser._id,
      companyId: googleCompany._id,
      title: 'Machine Learning & AI Research Intern',
      description: 'Join the Google Research team in developing intelligent models. Candidate will preprocess text and unstructured datasets, implement TF-IDF and NLP embeddings, build models using Python, Scikit-learn, and TensorFlow, and benchmark machine learning algorithms.',
      requiredSkills: ['python', 'machine learning', 'scikit-learn', 'tensorflow', 'nlp', 'pandas'],
      minimumCGPA: 8.0,
      eligibleBranches: ['Computer Science', 'Information Technology'],
      graduationYear: 2026,
      location: 'Bangalore, India',
      jobType: 'Internship',
      salary: '₹85,000 / month Stipend',
      applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: 'active'
    });

    const jobCloudBackend = await Job.create({
      recruiterId: recMsftUser._id,
      companyId: msftCompany._id,
      title: 'Cloud Software Engineer (Azure Core)',
      description: 'Microsoft IDC is looking for backend cloud engineers to build distributed cloud services. Requirements include strong fundamentals in Java or C#, microservices architecture, Docker, Kubernetes, and relational databases. Will participate in DevOps CI/CD pipelines.',
      requiredSkills: ['java', 'spring boot', 'docker', 'kubernetes', 'aws', 'mysql', 'system design'],
      minimumCGPA: 7.8,
      eligibleBranches: ['Computer Science', 'Information Technology', 'Electronics & Communication'],
      graduationYear: 2026,
      location: 'Hyderabad, India',
      jobType: 'Full-time',
      salary: '₹16,00,000 - ₹22,00,000 per annum',
      applicationDeadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      status: 'active'
    });

    const jobFrontend = await Job.create({
      recruiterId: recMsftUser._id,
      companyId: msftCompany._id,
      title: 'Frontend UI/UX Web Developer',
      description: 'Craft responsive, intuitive user interfaces for Microsoft 365 web apps. Deep knowledge of modern React, TypeScript/JavaScript, CSS3, Tailwind CSS, and component state management. Passion for web accessibility and performance optimization.',
      requiredSkills: ['react', 'javascript', 'typescript', 'tailwind', 'html', 'css'],
      minimumCGPA: 7.0,
      eligibleBranches: [], // open to all
      graduationYear: 2026,
      location: 'Hyderabad, India (Remote Available)',
      jobType: 'Full-time',
      salary: '₹14,00,000 - ₹18,00,000 per annum',
      applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: 'active'
    });

    const jobAssociate = await Job.create({
      recruiterId: recInfosysUser._id,
      companyId: infosysCompany._id,
      title: 'Specialist Programmer (Digital Specialist)',
      description: 'Infosys Specialist Programmer role focused on high-demand digital skills including Java, Python, Web development, and Cloud Computing. Candidates will undergo rigorous bootcamp training before deployment onto global client initiatives.',
      requiredSkills: ['java', 'python', 'sql', 'data structures', 'javascript'],
      minimumCGPA: 6.5,
      eligibleBranches: [], // all branches
      graduationYear: 2026,
      location: 'Pune / Mysore, India',
      jobType: 'Full-time',
      salary: '₹9,50,000 per annum',
      applicationDeadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
      status: 'active'
    });

    // 5. Sample Applications
    await Application.create([
      {
        studentId: studentYash._id,
        jobId: jobFullStack._id,
        status: 'Shortlisted',
        similarityScore: 88.5,
        recruiterRemarks: 'Impressive MERN stack project portfolio. Strong skill alignment with required React and Node stack.'
      },
      {
        studentId: studentYash._id,
        jobId: jobFrontend._id,
        status: 'Under Review',
        similarityScore: 82.0,
        recruiterRemarks: 'Profile under review by engineering team.'
      },
      {
        studentId: studentPriya._id,
        jobId: jobML._id,
        status: 'Selected',
        similarityScore: 94.0,
        recruiterRemarks: 'Outstanding ML background, research experience, and high academic CGPA. Recommended for final offer.'
      },
      {
        studentId: studentAnanya._id,
        jobId: jobCloudBackend._id,
        status: 'Shortlisted',
        similarityScore: 85.5,
        recruiterRemarks: 'Good proficiency with Spring Boot and cloud microservices.'
      },
      {
        studentId: studentRohit._id,
        jobId: jobAssociate._id,
        status: 'Applied',
        similarityScore: 68.0,
        recruiterRemarks: 'Application received and queued for review.'
      }
    ]);

    if (!silent) {
      console.log('✅ [Seeder] Database successfully populated with initial records:');
      console.log('   - 1 Admin: admin@campusconnect.edu / Admin@123');
      console.log('   - 3 Recruiters: Google India, Microsoft IDC, Infosys Limited (Recruiter@123)');
      console.log('   - 4 Students: yash, priya, rohit, ananya (Student@123)');
      console.log('   - 5 Job Postings with realistic criteria');
      console.log('   - 5 Sample Applications across various stages');
    }
  } catch (error) {
    console.error('❌ [Seeder] Error seeding database:', error.message);
  }
};

// Allow standalone command line execution: `node src/utils/seeder.js`
if (require.main === module) {
  require('dotenv').config();
  const { connectDB, disconnectDB } = require('../config/db');

  (async () => {
    await connectDB();
    await seedDatabase(false);
    console.log('[Seeder] Finished.');
    process.exit(0);
  })();
}

module.exports = { seedDatabase };
