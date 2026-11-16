const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://127.0.0.1:8000';

/**
 * Health check on ML service
 */
const checkMLHealth = async () => {
  try {
    const response = await axios.get(`${ML_SERVICE_URL}/health`, { timeout: 3000 });
    return response.data;
  } catch (error) {
    return { status: 'offline', error: error.message };
  }
};

/**
 * Send student profile and available jobs to Python ML service for TF-IDF Cosine Similarity ranking
 */
const getJobRecommendations = async (student, jobs, topN = 10) => {
  try {
    const payload = {
      student: {
        student_id: String(student._id),
        skills: student.skills || [],
        resume_text: student.resumeText || '',
        branch: student.branch || '',
        cgpa: student.cgpa || 0,
        graduation_year: student.graduationYear || null,
        experience: student.experience || ''
      },
      jobs: jobs.map((j) => ({
        job_id: String(j._id),
        title: j.title,
        company_name: (j.companyId && typeof j.companyId === 'object' && j.companyId.companyName)
          ? j.companyId.companyName
          : (typeof j.companyName === 'string' ? j.companyName : 'Corporate Partner'),
        description: j.description,
        required_skills: j.requiredSkills || [],
        minimum_cgpa: j.minimumCGPA || 0,
        eligible_branches: j.eligibleBranches || [],
        graduation_year: j.graduationYear || null
      })),
      top_n: topN
    };

    const response = await axios.post(`${ML_SERVICE_URL}/recommend-jobs`, payload, {
      timeout: 10000
    });
    return response.data;
  } catch (error) {
    console.warn('[ML Service] /recommend-jobs call failed, using graceful fallback:', error.message);
    // Graceful fallback ranking
    return fallbackRecommendJobs(student, jobs, topN);
  }
};

/**
 * Perform Skill Gap Analysis
 */
const getSkillGapAnalysis = async (studentSkills, resumeText, job) => {
  try {
    const payload = {
      student_skills: studentSkills || [],
      resume_text: resumeText || '',
      job_title: job.title,
      job_description: job.description,
      required_skills: job.requiredSkills || []
    };

    const response = await axios.post(`${ML_SERVICE_URL}/skill-gap`, payload, {
      timeout: 5000
    });
    return response.data;
  } catch (error) {
    console.warn('[ML Service] /skill-gap call failed, using fallback:', error.message);
    return fallbackSkillGap(studentSkills, job);
  }
};

/**
 * Generate Resume Feedback
 */
const getResumeFeedback = async (resumeText, job) => {
  try {
    const payload = {
      resume_text: resumeText || '',
      job_title: job ? job.title : '',
      job_description: job ? job.description : '',
      required_skills: job ? job.requiredSkills || [] : []
    };

    const response = await axios.post(`${ML_SERVICE_URL}/resume-feedback`, payload, {
      timeout: 6000
    });
    return response.data;
  } catch (error) {
    console.warn('[ML Service] /resume-feedback call failed, using fallback:', error.message);
    return fallbackResumeFeedback(resumeText, job);
  }
};

/**
 * Extract PDF resume text by sending file stream to Python FastAPI service
 */
const extractTextFromPDF = async (filePath) => {
  try {
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));

    const response = await axios.post(`${ML_SERVICE_URL}/extract-resume`, form, {
      headers: form.getHeaders(),
      timeout: 10000
    });
    return response.data;
  } catch (error) {
    console.warn('[ML Service] /extract-resume call failed:', error.message);
    return {
      extracted_text: '',
      word_count: 0,
      detected_skills: [],
      page_count: 0,
      error_message: 'Could not extract text via ML service: ' + error.message
    };
  }
};

// --- Fallback Calculations if Python service is offline ---
const fallbackRecommendJobs = (student, jobs, topN) => {
  const sSkills = new Set((student.skills || []).map((s) => s.toLowerCase()));
  const sBranch = (student.branch || '').toLowerCase();
  const sCGPA = student.cgpa || 0;

  const ranked = jobs.map((j) => {
    const reqSkills = (j.requiredSkills || []).map((s) => s.toLowerCase());
    const matched = reqSkills.filter((s) => sSkills.has(s));
    const missing = reqSkills.filter((s) => !sSkills.has(s));
    const score = reqSkills.length > 0 ? (matched.length / reqSkills.length) * 100 : 50;

    let isEligible = true;
    const reasons = [];
    if (j.minimumCGPA && sCGPA < j.minimumCGPA) {
      isEligible = false;
      reasons.push(`CGPA (${sCGPA}) below requirement (${j.minimumCGPA})`);
    }
    if (j.eligibleBranches && j.eligibleBranches.length > 0) {
      const allowed = j.eligibleBranches.map((b) => b.toLowerCase());
      if (!allowed.includes(sBranch)) {
        isEligible = false;
        reasons.push(`Branch '${student.branch}' not in eligible branches`);
      }
    }

    return {
      job_id: String(j._id),
      title: j.title,
      company_name: j.companyId ? j.companyId.companyName : 'Tech Partner',
      similarity_score: Math.round(score * 10) / 10,
      explanation: {
        matched_skills: matched,
        missing_skills: missing,
        contributing_keywords: matched.slice(0, 3),
        is_eligible: isEligible,
        eligibility_reasons: reasons.length > 0 ? reasons : ['Eligible']
      }
    };
  });

  ranked.sort((a, b) => b.similarity_score - a.similarity_score);
  return {
    recommendations: ranked.slice(0, topN),
    total_jobs_evaluated: jobs.length,
    summary: `Evaluated ${jobs.length} jobs via fallback heuristic engine.`
  };
};

const fallbackSkillGap = (studentSkills, job) => {
  const sSkills = new Set((studentSkills || []).map((s) => s.toLowerCase()));
  const reqSkills = (job.requiredSkills || []).map((s) => s.toLowerCase());
  const matching = reqSkills.filter((s) => sSkills.has(s));
  const missing = reqSkills.filter((s) => !sSkills.has(s));
  const coverage = reqSkills.length > 0 ? Math.round((matching.length / reqSkills.length) * 100) : 100;

  return {
    job_title: job.title,
    matching_skills: matching,
    skills_not_found_in_profile: missing,
    skill_coverage_percentage: coverage,
    recommended_learning_topics: missing.map((s) => `${s.toUpperCase()}: Recommended learning roadmap.`),
    advice_note: coverage >= 70 ? 'Strong alignment with job requirements.' : 'Focus on bridging missing skills.'
  };
};

const fallbackResumeFeedback = (resumeText, job) => {
  const words = (resumeText || '').split(/\s+/).filter(Boolean);
  return {
    similarity_score: 50.0,
    detected_skills: [],
    missing_job_keywords: job ? job.requiredSkills || [] : [],
    word_count: words.length,
    readability_level: 'Standard length',
    practical_suggestions: [
      'Ensure standard section headers (Education, Skills, Experience, Projects).',
      'Begin bullet points with dynamic action verbs and quantify deliverables.'
    ],
    is_scanned_or_empty: words.length < 20
  };
};

module.exports = {
  checkMLHealth,
  getJobRecommendations,
  getSkillGapAnalysis,
  getResumeFeedback,
  extractTextFromPDF
};
