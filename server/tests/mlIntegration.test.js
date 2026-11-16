const assert = require('assert');
const http = require('http');
const { connectDB, disconnectDB } = require('../src/config/db');
const app = require('../src/app');
const { checkMLHealth, getJobRecommendations, getSkillGapAnalysis, getResumeFeedback } = require('../src/services/mlService');
const User = require('../src/models/User');
const Job = require('../src/models/Job');

const runIntegrationTest = async () => {
  console.log('--- Testing Backend <-> ML Service Integration & Fallback Resilience ---');

  try {
    await connectDB();

    // 1. Check ML Health
    const health = await checkMLHealth();
    console.log('[ML Service Health Probe]:', health);

    // 2. Fetch sample student and job
    const student = await User.findOne({ email: 'yash.student@campusconnect.edu' });
    const jobs = await Job.find({ status: 'active' });
    assert(student, 'Student Yash must exist');
    assert(jobs.length > 0, 'Active jobs must exist');

    // 3. Test Recommendations (works with live ML service or graceful fallback)
    const recs = await getJobRecommendations(student, jobs, 3);
    assert(recs, 'Recommendations response should not be null');
    assert(Array.isArray(recs.recommendations), 'Should return recommendations array');
    console.log(`[PASS] Job Recommendations returned ${recs.recommendations.length} ranked opportunities!`);
    if (recs.recommendations.length > 0) {
      console.log(`   Top Match: "${recs.recommendations[0].title}" (${recs.recommendations[0].similarity_score}% similarity)`);
    }

    // 4. Test Skill Gap Analysis
    const gap = await getSkillGapAnalysis(student.skills, student.resumeText, jobs[0]);
    assert(gap, 'Skill gap response should not be null');
    assert(gap.skill_coverage_percentage !== undefined, 'Coverage percentage must be present');
    console.log(`[PASS] Skill Gap Analysis for "${jobs[0].title}": ${gap.skill_coverage_percentage}% coverage.`);

    // 5. Test Resume Feedback
    const feedback = await getResumeFeedback(student.resumeText, jobs[0]);
    assert(feedback, 'Feedback response should not be null');
    assert(Array.isArray(feedback.practical_suggestions), 'Suggestions should be an array');
    console.log(`[PASS] Resume Feedback returned ${feedback.practical_suggestions.length} actionable suggestions!`);

    console.log('\n=============================================================');
    console.log('🎉 ML SERVICE INTEGRATION & FALLBACK CONTRACT FULLY VERIFIED!');
    console.log('=============================================================\n');
  } catch (err) {
    console.error('❌ ML Integration test failed:', err);
    process.exit(1);
  } finally {
    await disconnectDB();
    process.exit(0);
  }
};

runIntegrationTest();
