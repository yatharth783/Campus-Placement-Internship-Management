import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import ResumeUploader from '../../components/student/ResumeUploader';
import { User, Mail, Phone, BookOpen, Calendar, Award, Sparkles, Plus, X, Save, FileText, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

const StudentProfile = () => {
  const { user, updateUser } = useAuth();
  const { showSuccess, showError } = useNotification();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    branch: '',
    graduationYear: 2026,
    cgpa: 0,
    skills: [],
    bio: '',
    experience: ''
  });

  const [skillInput, setSkillInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const branches = [
    'Computer Science',
    'Information Technology',
    'Electronics & Communication',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Chemical Engineering',
    'Data Science & AI'
  ];

  const popularSkills = [
    'Python',
    'React',
    'Node.js',
    'SQL',
    'MongoDB',
    'Docker',
    'Machine Learning',
    'Java',
    'AWS',
    'Tailwind CSS'
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await api.get('/student/profile');
        const s = res.data.student;
        setForm({
          name: s.name || '',
          email: s.email || '',
          phone: s.phone || '',
          branch: s.branch || 'Computer Science',
          graduationYear: s.graduationYear || 2026,
          cgpa: s.cgpa || 0,
          skills: s.skills || [],
          bio: s.bio || '',
          experience: s.experience || ''
        });
      } catch (err) {
        showError(err.message || 'Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleAddSkill = (skillToAdd) => {
    const s = (skillToAdd || skillInput).trim().toLowerCase();
    if (s && !form.skills.includes(s)) {
      setForm({ ...form, skills: [...form.skills, s] });
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setForm({ ...form, skills: form.skills.filter((s) => s !== skillToRemove) });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await api.put('/student/profile', {
        ...form,
        cgpa: parseFloat(form.cgpa),
        graduationYear: parseInt(form.graduationYear)
      });
      showSuccess('Profile details updated successfully!');
      updateUser(res.data.student);
    } catch (err) {
      showError(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Student Profile">
        <div className="py-24 flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-3 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
          <p className="text-sm text-slate-500 font-medium">Loading profile details...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Student Profile & Academic Record"
      subtitle="Keep your academic achievements, technical skills, and resume updated for placement drives."
    >
      <div className="space-y-8 max-w-4xl">
        {/* PDF Resume Uploader Component */}
        <ResumeUploader
          onUploadSuccess={(data) => {
            if (data.skills) {
              setForm((prev) => ({
                ...prev,
                skills: Array.from(new Set([...prev.skills, ...data.skills]))
              }));
            }
          }}
        />

        {/* Existing Resume Active Pill */}
        {user?.resumePath && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">
                  {user.resumeOriginalName || 'Uploaded Resume.pdf'}
                </p>
                <p className="text-[11px] text-slate-500">Stored safely on server for recruiter verification</p>
              </div>
            </div>
            <a
              href={`http://localhost:5000/${user.resumePath}`}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-white text-slate-700 transition"
            >
              View Document &rarr;
            </a>
          </div>
        )}

        {/* Profile Edit Form */}
        <form onSubmit={handleSaveProfile} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">Academic & Personal Details</h3>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-sm transition disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Full Legal Name
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Email Address (Read-only)
              </label>
              <input
                type="email"
                disabled
                value={form.email}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Contact Phone
              </label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Engineering Branch
              </label>
              <select
                value={form.branch}
                onChange={(e) => setForm({ ...form, branch: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white"
              >
                {branches.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Cumulative CGPA (10.0 scale)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                required
                value={form.cgpa}
                onChange={(e) => setForm({ ...form, cgpa: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Graduation Batch
              </label>
              <input
                type="number"
                required
                value={form.graduationYear}
                onChange={(e) => setForm({ ...form, graduationYear: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Short Professional Bio
            </label>
            <input
              type="text"
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              placeholder="e.g. Aspiring full-stack developer passionate about cloud-native distributed systems"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Project & Work Experience Summary
            </label>
            <textarea
              rows={3}
              value={form.experience}
              onChange={(e) => setForm({ ...form, experience: e.target.value })}
              placeholder="Highlight notable internships, major projects, and engineering achievements..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          {/* Technical Skills Manager */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Technical Skills Portfolio ({form.skills.length})
              </label>
              <p className="text-xs text-slate-400 mt-0.5">
                These skills are matched against recruiter job descriptions in real time.
              </p>
            </div>

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
                placeholder="Type skill name and press Enter..."
                className="flex-1 px-4 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
              <button
                type="button"
                onClick={() => handleAddSkill()}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 transition"
              >
                <Plus className="w-4 h-4" /> Add Skill
              </button>
            </div>

            {/* Popular quick add pills */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
              <span className="font-semibold text-slate-400">Popular:</span>
              {popularSkills.map((ps) => (
                <button
                  key={ps}
                  type="button"
                  onClick={() => handleAddSkill(ps)}
                  className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px]"
                >
                  +{ps}
                </button>
              ))}
            </div>

            {/* Active Skills Badges */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {form.skills.map((s, idx) => (
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

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-md shadow-brand-500/20 transition disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Updating...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default StudentProfile;
