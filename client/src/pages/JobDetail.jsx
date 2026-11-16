import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import EligibilityModal from '../components/student/EligibilityModal';
import Modal from '../components/common/Modal';
import { StatusBadge } from '../components/common/Badge';
import {
  Building2,
  MapPin,
  IndianRupee,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowLeft,
  ExternalLink,
  Briefcase
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

const JobDetail = () => {
  const { id } = useParams();
  const { user, isAuthenticated, role } = useAuth();
  const { showSuccess, showError } = useNotification();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isApplied, setIsApplied] = useState(false);
  const [isEligibilityOpen, setIsEligibilityOpen] = useState(false);

  // Skill Gap Modal
  const [isSkillGapOpen, setIsSkillGapOpen] = useState(false);
  const [skillGapData, setSkillGapData] = useState(null);
  const [skillGapLoading, setSkillGapLoading] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/jobs/${id}`);
        setJob(res.data.job);

        // Check if student already applied
        if (isAuthenticated && role === 'student') {
          const appsRes = await api.get('/applications/my-applications');
          const applied = (appsRes.data.applications || []).some(
            (a) => (a.jobId?._id || a.jobId) === id
          );
          setIsApplied(applied);
        }
      } catch (err) {
        showError(err.message || 'Job opening not found.');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id, isAuthenticated]);

  const handleApply = async () => {
    if (!isAuthenticated) {
      showError('Please sign in as a student to apply.');
      return;
    }
    if (role !== 'student') {
      showError('Only students can apply for campus drives.');
      return;
    }

    try {
      await api.post(`/applications/apply/${job._id}`);
      showSuccess(`Successfully applied for "${job.title}"!`);
      setIsApplied(true);
      if (isEligibilityOpen) setIsEligibilityOpen(false);
    } catch (err) {
      showError(err.message || 'Failed to submit application.');
    }
  };

  const handleOpenSkillGap = async () => {
    if (!isAuthenticated || role !== 'student') {
      showError('Please log in with a student account to view ML skill gap analysis.');
      return;
    }

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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
        <Navbar />
        <div className="py-24 flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-3 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
          <p className="text-sm text-slate-500 font-medium">Loading position specifications...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
        <Navbar />
        <div className="max-w-md mx-auto py-24 text-center space-y-3">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900">Opportunity Not Found</h2>
          <p className="text-xs text-slate-500">
            This placement drive may have expired or was removed by the placement cell.
          </p>
          <Link
            to="/jobs"
            className="inline-block mt-2 px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-semibold"
          >
            Browse Other Openings &rarr;
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const deadline = job.applicationDeadline
    ? new Date(job.applicationDeadline).toLocaleDateString('en-IN', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      })
    : 'Open until filled';

  const company = job.companyId || {};

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar />

      <main className="max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 space-y-8">
        <Link
          to="/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-600 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to All Opportunities
        </Link>

        {/* Header Hero Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
                  {job.jobType}
                </span>
                <StatusBadge status={job.status} />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{job.title}</h1>
              <p className="text-sm font-semibold text-slate-600 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-slate-400" />
                {company.companyName || 'Corporate Partner'} • {job.location}
              </p>
            </div>

            <div className="flex flex-col sm:items-end gap-3">
              <span className="text-2xl font-black text-emerald-700">{job.salary}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsEligibilityOpen(true)}
                  className="px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition"
                >
                  Verify Criteria
                </button>
                <button
                  onClick={handleOpenSkillGap}
                  className="px-3.5 py-2 rounded-xl border border-brand-200 bg-brand-50 hover:bg-brand-100 text-xs font-semibold text-brand-700 flex items-center gap-1 transition"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Skill Gap
                </button>
                {isApplied ? (
                  <span className="px-5 py-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                    Already Applied
                  </span>
                ) : (
                  <button
                    onClick={handleApply}
                    className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-500/20 transition"
                  >
                    Apply Now
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
            <div>
              <p className="text-slate-400 font-semibold uppercase">Min Academic CGPA</p>
              <p className="text-slate-900 font-bold text-sm mt-0.5">
                {job.minimumCGPA > 0 ? `${job.minimumCGPA.toFixed(1)} / 10.0` : 'Open to all'}
              </p>
            </div>
            <div>
              <p className="text-slate-400 font-semibold uppercase">Graduation Batch</p>
              <p className="text-slate-900 font-bold text-sm mt-0.5">
                {job.graduationYear ? `${job.graduationYear} Batch` : 'Any Batch'}
              </p>
            </div>
            <div>
              <p className="text-slate-400 font-semibold uppercase">Application Deadline</p>
              <p className="text-slate-900 font-bold text-sm mt-0.5">{deadline}</p>
            </div>
            <div>
              <p className="text-slate-400 font-semibold uppercase">Recruiter Status</p>
              <p className="text-emerald-700 font-bold text-sm mt-0.5">Campus Certified</p>
            </div>
          </div>
        </div>

        {/* Detailed Description */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Role Description & Expectations
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 whitespace-pre-line leading-relaxed">
              {job.description}
            </p>
          </div>

          {/* Required Skills */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Required Technical Skills ({job.requiredSkills?.length || 0})
            </h3>
            <div className="flex flex-wrap gap-2">
              {job.requiredSkills?.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-semibold capitalize"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Eligible Branches */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Eligible Engineering Disciplines
            </h3>
            <div className="flex flex-wrap gap-2">
              {job.eligibleBranches?.length > 0 ? (
                job.eligibleBranches.map((branch, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-lg bg-brand-50 text-brand-700 border border-brand-200 text-xs font-medium"
                  >
                    {branch}
                  </span>
                ))
              ) : (
                <span className="text-xs font-semibold text-slate-500">
                  Open to all registered university departments.
                </span>
              )}
            </div>
          </div>

          {/* Company Information */}
          {company.description && (
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                About {company.companyName}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {company.description}
              </p>
              {company.website && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:underline pt-1"
                >
                  Visit Corporate Careers Site <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Recruiter Eligibility Modal */}
      {job && (
        <EligibilityModal
          isOpen={isEligibilityOpen}
          onClose={() => setIsEligibilityOpen(false)}
          job={job}
          onApply={handleApply}
        />
      )}

      {/* Skill Gap Analysis Modal */}
      <Modal
        isOpen={isSkillGapOpen}
        onClose={() => setIsSkillGapOpen(false)}
        title="ML Skill Gap Analysis"
      >
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <h4 className="text-sm font-bold text-slate-900">{job.title}</h4>
            <p className="text-xs text-slate-500">{company.companyName}</p>
          </div>

          {skillGapLoading ? (
            <div className="py-8 flex flex-col items-center justify-center gap-2">
              <div className="w-8 h-8 border-3 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
              <p className="text-xs text-slate-500">Evaluating skill overlap & profile coverage...</p>
            </div>
          ) : skillGapData ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-brand-50/50 border border-brand-100 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-700">Skill Alignment Coverage</span>
                  <span className="text-brand-700 font-bold">
                    {skillGapData.skill_coverage_percentage}%
                  </span>
                </div>
                <div className="w-full bg-brand-100 rounded-full h-2">
                  <div
                    className="bg-brand-600 h-2 rounded-full"
                    style={{ width: `${Math.min(skillGapData.skill_coverage_percentage, 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Matching Skills ({skillGapData.matching_skills?.length || 0})
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
                    <span className="text-xs text-slate-400">None detected.</span>
                  )}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Skills Not Found ({skillGapData.skills_not_found_in_profile?.length || 0})
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {skillGapData.skills_not_found_in_profile?.map((s, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-medium px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 capitalize flex items-center gap-1"
                    >
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                      {s}
                    </span>
                  ))}
                </div>
              </div>
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
      </Modal>

      <Footer />
    </div>
  );
};

export default JobDetail;
