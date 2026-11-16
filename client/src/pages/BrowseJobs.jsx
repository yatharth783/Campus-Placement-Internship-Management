import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import JobCard from '../components/student/JobCard';
import EligibilityModal from '../components/student/EligibilityModal';
import Modal from '../components/common/Modal';
import { Search, Filter, Briefcase, Sparkles, CheckCircle2, AlertCircle, X, ChevronRight } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

const BrowseJobs = () => {
  const { user, isAuthenticated, role } = useAuth();
  const { showSuccess, showError } = useNotification();

  const [jobs, setJobs] = useState([]);
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [jobType, setJobType] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');

  // Modals
  const [eligibilityJob, setEligibilityJob] = useState(null);
  const [isEligibilityOpen, setIsEligibilityOpen] = useState(false);

  // Skill Gap Modal State
  const [skillGapJob, setSkillGapJob] = useState(null);
  const [skillGapData, setSkillGapData] = useState(null);
  const [skillGapLoading, setSkillGapLoading] = useState(false);
  const [isSkillGapOpen, setIsSkillGapOpen] = useState(false);

  const branches = [
    'Computer Science',
    'Information Technology',
    'Electronics & Communication',
    'Electrical Engineering',
    'Mechanical Engineering'
  ];

  // Fetch Jobs and User Applications
  const fetchData = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (jobType) params.jobType = jobType;
      if (selectedBranch) params.branch = selectedBranch;

      const jobsRes = await api.get('/jobs', { params });
      setJobs(jobsRes.data.jobs || []);

      if (isAuthenticated && role === 'student') {
        const appsRes = await api.get('/applications/my-applications');
        const appliedIds = new Set((appsRes.data.applications || []).map((a) => a.jobId?._id || a.jobId));
        setAppliedJobIds(appliedIds);
      }
    } catch (err) {
      showError(err.message || 'Failed to load job listings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search, jobType, selectedBranch]);

  // Handle Apply
  const handleApply = async (job) => {
    if (!isAuthenticated) {
      showError('Please sign in as a student to apply.');
      return;
    }
    if (role !== 'student') {
      showError('Only student accounts can apply for recruitment drives.');
      return;
    }

    try {
      const res = await api.post(`/applications/apply/${job._id}`);
      showSuccess(`Successfully applied for "${job.title}"!`);
      setAppliedJobIds((prev) => new Set([...prev, job._id]));
      if (isEligibilityOpen) setIsEligibilityOpen(false);
    } catch (err) {
      showError(err.message || 'Failed to submit application.');
    }
  };

  // Trigger Skill Gap Analysis Modal
  const handleOpenSkillGap = async (job) => {
    if (!isAuthenticated || role !== 'student') {
      showError('Please log in with a student account to view ML skill gap analysis.');
      return;
    }

    setSkillGapJob(job);
    setIsSkillGapOpen(true);
    setSkillGapLoading(true);

    try {
      const res = await api.post('/ml/skill-gap', { jobId: job._id });
      setSkillGapData(res.data.result);
    } catch (err) {
      showError(err.message || 'Could not analyze skill gap.');
    } finally {
      setSkillGapLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar />

      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        {/* Banner */}
        <div className="mb-8 rounded-3xl bg-gradient-to-r from-navy-900 via-brand-900 to-indigo-900 p-8 text-white shadow-lg">
          <div className="max-w-2xl space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-brand-200 text-xs font-semibold backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Verified Campus Drives
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight">Browse Placement & Internship Opportunities</h1>
            <p className="text-sm text-slate-300">
              Apply to verified recruitment drives, verify academic eligibility against recruiter criteria, and run instant ML skill gap analyses.
            </p>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-sm mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-5 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by job title, skill, or keywords..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>

            <div className="md:col-span-3">
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white"
              >
                <option value="">All Job Types</option>
                <option value="Full-time">Full-time Roles</option>
                <option value="Internship">Internships</option>
              </select>
            </div>

            <div className="md:col-span-4">
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white"
              >
                <option value="">All Engineering Branches</option>
                {branches.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {(search || jobType || selectedBranch) && (
            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
              <span>Active filters applied</span>
              <button
                onClick={() => {
                  setSearch('');
                  setJobType('');
                  setSelectedBranch('');
                }}
                className="text-brand-600 font-semibold hover:underline flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" /> Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Available Positions ({jobs.length})
          </p>
          {role === 'student' && (
            <Link
              to="/student/ml-assistant"
              className="text-xs font-semibold text-brand-600 hover:text-brand-800 flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              View TF-IDF Ranked Matches &rarr;
            </Link>
          )}
        </div>

        {/* Jobs Grid */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 border-3 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
            <p className="text-sm text-slate-500 font-medium">Loading placement opportunities...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No Opportunities Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              We couldn't find any job postings matching your current filter criteria. Try adjusting your search keywords.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                isApplied={appliedJobIds.has(job._id)}
                onApply={() => handleApply(job)}
                onCheckEligibility={(targetJob) => {
                  setEligibilityJob(targetJob);
                  setIsEligibilityOpen(true);
                }}
                onSkillGap={handleOpenSkillGap}
              />
            ))}
          </div>
        )}
      </main>

      {/* Recruiter Eligibility Modal */}
      {eligibilityJob && (
        <EligibilityModal
          isOpen={isEligibilityOpen}
          onClose={() => setIsEligibilityOpen(false)}
          job={eligibilityJob}
          onApply={() => handleApply(eligibilityJob)}
        />
      )}

      {/* Skill Gap Analysis Modal */}
      <Modal
        isOpen={isSkillGapOpen}
        onClose={() => setIsSkillGapOpen(false)}
        title="ML Skill Gap Analysis"
      >
        {skillGapJob && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <h4 className="text-sm font-bold text-slate-900">{skillGapJob.title}</h4>
              <p className="text-xs text-slate-500">
                {skillGapJob.companyId?.companyName || 'Verified Partner'}
              </p>
            </div>

            {skillGapLoading ? (
              <div className="py-8 flex flex-col items-center justify-center gap-2">
                <div className="w-8 h-8 border-3 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
                <p className="text-xs text-slate-500">Evaluating skill overlap & profile coverage...</p>
              </div>
            ) : skillGapData ? (
              <div className="space-y-4">
                {/* Coverage Meter */}
                <div className="p-4 rounded-xl bg-brand-50/50 border border-brand-100 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-700">Skill Alignment Coverage</span>
                    <span className="text-brand-700 font-bold">
                      {skillGapData.skill_coverage_percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-brand-100 rounded-full h-2">
                    <div
                      className="bg-brand-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(skillGapData.skill_coverage_percentage, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Matching Skills */}
                <div>
                  <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Verified Matching Skills ({skillGapData.matching_skills?.length || 0})
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {skillGapData.matching_skills?.length > 0 ? (
                      skillGapData.matching_skills.map((s, idx) => (
                        <span
                          key={idx}
                          className="text-xs font-medium px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 capitalize flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          {s}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400">None detected in student profile.</span>
                    )}
                  </div>
                </div>

                {/* Skills Not Found in Profile */}
                <div>
                  <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Skills Not Found in Student Profile ({skillGapData.skills_not_found_in_profile?.length || 0})
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {skillGapData.skills_not_found_in_profile?.length > 0 ? (
                      skillGapData.skills_not_found_in_profile.map((s, idx) => (
                        <span
                          key={idx}
                          className="text-xs font-medium px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 capitalize flex items-center gap-1"
                        >
                          <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                          {s}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-emerald-700 font-medium">All required skills present!</span>
                    )}
                  </div>
                </div>

                {/* Actionable Suggestions */}
                {skillGapData.recommendation_actions?.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <p className="text-xs font-semibold text-slate-800">Targeted Learning Advice:</p>
                    <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                      {skillGapData.recommendation_actions.map((act, i) => (
                        <li key={i}>{act}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : null}

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setIsSkillGapOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      <Footer />
    </div>
  );
};

export default BrowseJobs;
