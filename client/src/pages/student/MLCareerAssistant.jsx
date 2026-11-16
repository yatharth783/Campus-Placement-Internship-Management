import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import {
  Sparkles,
  TrendingUp,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  FileText,
  Target,
  BookOpen,
  ArrowRight,
  ExternalLink,
  Info,
  Building2
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

const MLCareerAssistant = () => {
  const { user } = useAuth();
  const { showSuccess, showError } = useNotification();

  const [activeTab, setActiveTab] = useState('recommendations'); // recommendations | skill-gap | feedback
  const [jobs, setJobs] = useState([]);
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());

  // Recommendations State
  const [recommendations, setRecommendations] = useState([]);
  const [loadingRecs, setLoadingRecs] = useState(false);

  // Skill Gap State
  const [selectedJobId, setSelectedJobId] = useState('');
  const [skillGapResult, setSkillGapResult] = useState(null);
  const [loadingGap, setLoadingGap] = useState(false);

  // Resume Feedback State
  const [feedbackJobId, setFeedbackJobId] = useState('');
  const [customResumeText, setCustomResumeText] = useState('');
  const [feedbackResult, setFeedbackResult] = useState(null);
  const [loadingFeedback, setLoadingFeedback] = useState(false);

  // Initial Load of Active Jobs and Student Applications
  useEffect(() => {
    const initData = async () => {
      try {
        const jobsRes = await api.get('/jobs');
        const activeJobsList = jobsRes.data.jobs || [];
        setJobs(activeJobsList);
        if (activeJobsList.length > 0) {
          setSelectedJobId(activeJobsList[0]._id);
          setFeedbackJobId(activeJobsList[0]._id);
        }

        const appsRes = await api.get('/applications/my-applications');
        const ids = new Set((appsRes.data.applications || []).map((a) => a.jobId?._id || a.jobId));
        setAppliedJobIds(ids);

        // Fetch Recommendations by default
        fetchRecommendations();
      } catch (err) {
        showError(err.message || 'Failed to initialize ML assistant.');
      }
    };

    initData();
  }, []);

  // Fetch TF-IDF Job Recommendations
  const fetchRecommendations = async () => {
    setLoadingRecs(true);
    try {
      const res = await api.get('/ml/recommendations?limit=10');
      setRecommendations(res.data.recommendations || []);
    } catch (err) {
      showError(err.message || 'Failed to calculate job recommendations.');
    } finally {
      setLoadingRecs(false);
    }
  };

  // Run Skill Gap Analysis
  const handleRunSkillGap = async (jobIdToAnalyze) => {
    const id = jobIdToAnalyze || selectedJobId;
    if (!id) return;
    setLoadingGap(true);

    try {
      const res = await api.post('/ml/skill-gap', { jobId: id });
      setSkillGapResult(res.data.result);
    } catch (err) {
      showError(err.message || 'Skill gap calculation failed.');
    } finally {
      setLoadingGap(false);
    }
  };

  // Run Resume Feedback
  const handleRunFeedback = async () => {
    setLoadingFeedback(true);
    try {
      const payload = {
        jobId: feedbackJobId || undefined,
        customResumeText: customResumeText.trim() || undefined
      };
      const res = await api.post('/ml/resume-feedback', payload);
      setFeedbackResult(res.data.feedback);
      showSuccess('Resume evaluation completed!');
    } catch (err) {
      showError(err.message || 'Failed to generate resume feedback.');
    } finally {
      setLoadingFeedback(false);
    }
  };

  // Handle 1-Click Apply
  const handleApply = async (jobId, title) => {
    try {
      await api.post(`/applications/apply/${jobId}`);
      showSuccess(`Applied successfully for "${title}"!`);
      setAppliedJobIds((prev) => new Set([...prev, jobId]));
    } catch (err) {
      showError(err.message || 'Failed to apply.');
    }
  };

  return (
    <DashboardLayout
      title="ML-Powered Career Assistant"
      subtitle="Deterministic TF-IDF, Cosine Similarity & Natural Language Resume Evaluation"
    >
      <div className="space-y-6">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab('recommendations')}
            className={`flex items-center gap-2 px-6 py-3 font-semibold text-xs border-b-2 transition ${
              activeTab === 'recommendations'
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            Job Recommendations (TF-IDF)
          </button>
          <button
            onClick={() => {
              setActiveTab('skill-gap');
              if (!skillGapResult && selectedJobId) {
                handleRunSkillGap(selectedJobId);
              }
            }}
            className={`flex items-center gap-2 px-6 py-3 font-semibold text-xs border-b-2 transition ${
              activeTab === 'skill-gap'
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Target className="w-4 h-4 text-brand-600" />
            Skill Gap Analyzer
          </button>
          <button
            onClick={() => setActiveTab('feedback')}
            className={`flex items-center gap-2 px-6 py-3 font-semibold text-xs border-b-2 transition ${
              activeTab === 'feedback'
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4 text-indigo-600" />
            Resume Feedback & Quality
          </button>
        </div>

        {/* ============================================================ */}
        {/* TAB 1: SMART JOB RECOMMENDATIONS */}
        {/* ============================================================ */}
        {activeTab === 'recommendations' && (
          <div className="space-y-6">
            {/* Info Notice */}
            <div className="p-4 rounded-2xl bg-brand-50/70 border border-brand-200/80 flex items-start gap-3 text-xs text-brand-900">
              <Info className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Explainable TF-IDF Cosine Similarity Ranking</p>
                <p className="mt-0.5 text-brand-800 leading-relaxed">
                  Similarity scores represent text-vector semantic alignment between your profile/resume and job descriptions. They are similarity scores and do not guarantee selection or recruiter offers.
                </p>
              </div>
            </div>

            {loadingRecs ? (
              <div className="py-24 flex flex-col items-center justify-center gap-3">
                <div className="w-10 h-10 border-3 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
                <p className="text-sm text-slate-500 font-medium">
                  Vectorizing student resume and ranking active jobs...
                </p>
              </div>
            ) : recommendations.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-2">
                <p className="text-sm font-bold text-slate-800">No Recommendations Available</p>
                <p className="text-xs text-slate-500">
                  Please upload a PDF resume or add skills in your profile to generate matches.
                </p>
                <Link
                  to="/student/profile"
                  className="inline-block mt-3 px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-semibold"
                >
                  Update Profile & Resume &rarr;
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recommendations.map((rec, index) => {
                  const job = rec.jobDetails || {};
                  const isApplied = appliedJobIds.has(rec.job_id);

                  return (
                    <div
                      key={rec.job_id}
                      className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm hover:shadow-md transition space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-400">#{index + 1} Rank</span>
                            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                              {job.jobType || 'Full-time'}
                            </span>
                            {rec.explanation?.is_eligible ? (
                              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Eligible
                              </span>
                            ) : (
                              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" /> Branch/CGPA Constraint
                              </span>
                            )}
                          </div>
                          <h3 className="text-lg font-bold text-slate-900">{rec.title}</h3>
                          <p className="text-xs font-medium text-slate-500 flex items-center gap-2">
                            <Building2 className="w-3.5 h-3.5" />
                            {rec.company_name} • {job.location || 'Multiple Locations'} • {job.salary || 'Competitive'}
                          </p>
                        </div>

                        {/* Match Percentage Badge */}
                        <div className="text-right flex sm:flex-col items-center sm:items-end justify-between gap-1">
                          <span className="text-2xl font-black text-brand-600">
                            {rec.similarity_score}%
                          </span>
                          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                            Cosine Similarity
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {rec.job_description}
                      </p>

                      {/* Contributing Keywords */}
                      {rec.contributing_skills?.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
                          <span className="text-xs font-semibold text-slate-500">Matching Keywords:</span>
                          {rec.contributing_skills.map((s, idx) => (
                            <span
                              key={idx}
                              className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 capitalize"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Action Bar */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <button
                          onClick={() => {
                            setSelectedJobId(rec.job_id);
                            setActiveTab('skill-gap');
                            handleRunSkillGap(rec.job_id);
                          }}
                          className="text-xs font-semibold text-brand-700 hover:underline flex items-center gap-1"
                        >
                          <Target className="w-3.5 h-3.5" />
                          View Skill Gap Analysis &rarr;
                        </button>

                        <div>
                          {isApplied ? (
                            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
                              Already Applied
                            </span>
                          ) : (
                            <button
                              onClick={() => handleApply(rec.job_id, rec.title)}
                              className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-sm transition"
                            >
                              Apply Now
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 2: SKILL GAP ANALYZER */}
        {/* ============================================================ */}
        {activeTab === 'skill-gap' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Compare Profile with Target Job</h3>
                  <p className="text-xs text-slate-500">
                    Select any active job posting to analyze matching vs missing skills.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={selectedJobId}
                    onChange={(e) => {
                      setSelectedJobId(e.target.value);
                      handleRunSkillGap(e.target.value);
                    }}
                    className="px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 bg-white"
                  >
                    {jobs.map((j) => (
                      <option key={j._id} value={j._id}>
                        {j.title} ({j.companyId?.companyName || 'Recruiter'})
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => handleRunSkillGap(selectedJobId)}
                    disabled={loadingGap}
                    className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-sm transition"
                  >
                    {loadingGap ? 'Analyzing...' : 'Analyze'}
                  </button>
                </div>
              </div>
            </div>

            {loadingGap ? (
              <div className="py-20 flex flex-col items-center justify-center gap-3">
                <div className="w-8 h-8 border-3 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
                <p className="text-xs text-slate-500 font-medium">Running skill gap dictionary parser...</p>
              </div>
            ) : skillGapResult ? (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Left Overview Column */}
                <div className="md:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
                  <div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-brand-50 text-brand-700">
                      Evaluated Job
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-2">{skillGapResult.job_title}</h3>
                  </div>

                  {/* Coverage Percentage Gauge */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-700">Overall Skill Coverage</span>
                      <span className="text-brand-600 text-base">
                        {skillGapResult.skill_coverage_percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2.5">
                      <div
                        className="bg-brand-600 h-2.5 rounded-full transition-all duration-700"
                        style={{ width: `${Math.min(skillGapResult.skill_coverage_percentage, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Action Advice List */}
                  {skillGapResult.recommendation_actions?.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Tailored Action Steps
                      </h4>
                      <ul className="text-xs text-slate-600 space-y-2">
                        {skillGapResult.recommendation_actions.map((act, idx) => (
                          <li key={idx} className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                            <span className="text-brand-600 font-bold">•</span>
                            <span>{act}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Right Skills Grid Column */}
                <div className="md:col-span-7 space-y-6">
                  {/* Matching Skills */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Verified Matching Skills ({skillGapResult.matching_skills?.length || 0})
                      </h4>
                      <span className="text-xs text-emerald-700 font-semibold">Ready in profile</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {skillGapResult.matching_skills?.length > 0 ? (
                        skillGapResult.matching_skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold capitalize"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <p className="text-xs text-slate-400">
                          No direct required skills detected in your profile yet.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Skills Not Found in Profile */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 text-amber-500" />
                        Skills Not Found in Profile ({skillGapResult.skills_not_found_in_profile?.length || 0})
                      </h4>
                      <span className="text-xs text-amber-700 font-semibold">Priority learning topics</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {skillGapResult.skills_not_found_in_profile?.length > 0 ? (
                        skillGapResult.skills_not_found_in_profile.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold capitalize"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <p className="text-xs text-emerald-700 font-medium">
                          100% skill match! You possess all required technical skills for this role.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 3: RESUME FEEDBACK & QUALITY */}
        {/* ============================================================ */}
        {activeTab === 'feedback' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Deterministic Resume Evaluation</h3>
                  <p className="text-xs text-slate-500">
                    Rule-based text analysis evaluating keyword coverage, word count, and action verb strength.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={feedbackJobId}
                    onChange={(e) => setFeedbackJobId(e.target.value)}
                    className="px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 bg-white"
                  >
                    {jobs.map((j) => (
                      <option key={j._id} value={j._id}>
                        Target: {j.title}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={handleRunFeedback}
                    disabled={loadingFeedback}
                    className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-sm transition"
                  >
                    {loadingFeedback ? 'Evaluating...' : 'Evaluate Resume'}
                  </button>
                </div>
              </div>

              {/* Optional Custom Resume Textarea */}
              <div className="pt-2 border-t border-slate-100">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Custom Resume Text (Leave empty to use your uploaded PDF resume)
                </label>
                <textarea
                  rows={4}
                  value={customResumeText}
                  onChange={(e) => setCustomResumeText(e.target.value)}
                  placeholder="Paste resume text here to test draft updates before re-uploading your PDF..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>
            </div>

            {loadingFeedback ? (
              <div className="py-20 flex flex-col items-center justify-center gap-3">
                <div className="w-8 h-8 border-3 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
                <p className="text-xs text-slate-500 font-medium">Running Natural Language text feedback engine...</p>
              </div>
            ) : feedbackResult ? (
              <div className="space-y-6">
                {/* Metric Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-slate-200">
                    <p className="text-xs font-semibold text-slate-400 uppercase">Target Similarity</p>
                    <p className="text-2xl font-bold text-brand-600 mt-1">
                      {feedbackResult.similarity_score}%
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-200">
                    <p className="text-xs font-semibold text-slate-400 uppercase">Word Count</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">
                      {feedbackResult.word_count}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-200">
                    <p className="text-xs font-semibold text-slate-400 uppercase">Readability Index</p>
                    <p className="text-sm font-bold text-slate-800 mt-2 truncate">
                      {feedbackResult.readability_level}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-200">
                    <p className="text-xs font-semibold text-slate-400 uppercase">Missing Keywords</p>
                    <p className="text-2xl font-bold text-amber-600 mt-1">
                      {feedbackResult.missing_job_keywords?.length || 0}
                    </p>
                  </div>
                </div>

                {/* Practical Suggestions */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Constructive Rule-Based Suggestions
                  </h4>
                  <div className="space-y-2">
                    {feedbackResult.practical_suggestions?.map((sug, i) => (
                      <div
                        key={i}
                        className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed"
                      >
                        <Sparkles className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
                        <span>{sug}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-2">
                <FileText className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-sm font-bold text-slate-800">Ready for Resume Evaluation</p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Click 'Evaluate Resume' above to inspect keyword density, length, and suggestions against your chosen target job.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MLCareerAssistant;
