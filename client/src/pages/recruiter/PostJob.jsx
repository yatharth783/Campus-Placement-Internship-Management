import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Briefcase, Plus, X, ArrowRight, Sparkles } from 'lucide-react';
import api from '../../services/api';
import { useNotification } from '../../context/NotificationContext';

const PostJob = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();

  const [form, setForm] = useState({
    title: '',
    jobType: 'Full-time',
    location: 'Bangalore, India (Hybrid)',
    salary: '₹14,00,000 - ₹18,00,000 per annum',
    applicationDeadline: '',
    minimumCGPA: 7.0,
    graduationYear: 2026,
    eligibleBranches: ['Computer Science', 'Information Technology'],
    requiredSkills: ['react', 'node.js', 'javascript', 'docker'],
    description: ''
  });

  const [skillInput, setSkillInput] = useState('');
  const [loading, setLoading] = useState(false);

  const branches = [
    'Computer Science',
    'Information Technology',
    'Electronics & Communication',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Civil Engineering'
  ];

  const handleBranchToggle = (branch) => {
    if (form.eligibleBranches.includes(branch)) {
      setForm({ ...form, eligibleBranches: form.eligibleBranches.filter((b) => b !== branch) });
    } else {
      setForm({ ...form, eligibleBranches: [...form.eligibleBranches, branch] });
    }
  };

  const handleAddSkill = () => {
    const s = skillInput.trim().toLowerCase();
    if (s && !form.requiredSkills.includes(s)) {
      setForm({ ...form, requiredSkills: [...form.requiredSkills, s] });
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setForm({
      ...form,
      requiredSkills: form.requiredSkills.filter((s) => s !== skillToRemove)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.requiredSkills.length === 0) {
      showError('Please add at least one required skill to enable ML candidate matching.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/jobs', {
        ...form,
        minimumCGPA: parseFloat(form.minimumCGPA),
        graduationYear: form.graduationYear ? parseInt(form.graduationYear) : null
      });
      showSuccess('Job opportunity published successfully!');
      navigate('/recruiter/manage-jobs');
    } catch (err) {
      showError(err.message || 'Failed to post job opportunity.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout
      title="Create New Campus Recruitment Posting"
      subtitle="Define role specifications, eligibility constraints, and required technical skills."
    >
      <form onSubmit={handleSubmit} className="max-w-4xl bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
            Position Overview
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Job / Internship Title *
              </label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Software Engineer (Full-Stack)"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Opportunity Type *
              </label>
              <select
                value={form.jobType}
                onChange={(e) => setForm({ ...form, jobType: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white"
              >
                <option value="Full-time">Full-time Position</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Location / Work Mode *
              </label>
              <input
                type="text"
                required
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="e.g. Bangalore, India (Hybrid) or Remote"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Compensation / Stipend *
              </label>
              <input
                type="text"
                required
                value={form.salary}
                onChange={(e) => setForm({ ...form, salary: e.target.value })}
                placeholder="e.g. ₹16,00,000 - ₹20,00,000 per annum"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Application Deadline
              </label>
              <input
                type="date"
                value={form.applicationDeadline}
                onChange={(e) => setForm({ ...form, applicationDeadline: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Target Graduation Batch
              </label>
              <input
                type="number"
                value={form.graduationYear}
                onChange={(e) => setForm({ ...form, graduationYear: e.target.value })}
                placeholder="2026"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>
          </div>
        </div>

        {/* Eligibility Criteria */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
            Academic Eligibility Constraints
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Minimum CGPA Requirement (10.0 scale)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={form.minimumCGPA}
                onChange={(e) => setForm({ ...form, minimumCGPA: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">Set to 0 if open to all CGPAs.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Eligible Engineering Branches
              </label>
              <div className="flex flex-wrap gap-1.5">
                {branches.map((b) => {
                  const isChecked = form.eligibleBranches.includes(b);
                  return (
                    <button
                      key={b}
                      type="button"
                      onClick={() => handleBranchToggle(b)}
                      className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition ${
                        isChecked
                          ? 'bg-brand-50 border-brand-300 text-brand-700 font-bold'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {isChecked ? '✓ ' : '+ '}
                      {b}
                    </button>
                  );
                })}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                If none selected, posting is open to all university branches.
              </p>
            </div>
          </div>
        </div>

        {/* Required Skills (Powers ML) */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Required Technical Skills
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            These skills power the TF-IDF recommendation engine and automated candidate skill-gap scoring.
          </p>

          <div className="flex gap-2">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSkill();
                }
              }}
              placeholder="e.g. Python, React, PostgreSQL, Docker (Press Enter to add)"
              className="flex-1 px-4 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 transition"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {form.requiredSkills.map((s, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-brand-50 text-brand-700 border border-brand-200 text-xs font-semibold capitalize"
              >
                {s}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(s)}
                  className="text-brand-400 hover:text-brand-800"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Detailed Description */}
        <div className="space-y-2 pt-4 border-t border-slate-100">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Job Description & Responsibilities *
          </label>
          <textarea
            required
            rows={5}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Outline day-to-day responsibilities, project scopes, team culture, and hiring process..."
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-md shadow-brand-500/20 transition disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Publishing Opportunity...</span>
              </>
            ) : (
              <>
                <span>Publish Recruitment Posting</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </DashboardLayout>
  );
};

export default PostJob;
