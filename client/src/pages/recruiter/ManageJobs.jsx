import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { StatusBadge } from '../../components/common/Badge';
import { Briefcase, Users, PlusCircle, Trash2, Edit3, Power, Calendar, MapPin, IndianRupee } from 'lucide-react';
import api from '../../services/api';
import { useNotification } from '../../context/NotificationContext';

const ManageJobs = () => {
  const { showSuccess, showError } = useNotification();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/recruiter/my-jobs');
      setJobs(res.data.jobs || []);
    } catch (err) {
      showError(err.message || 'Failed to load jobs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleToggleStatus = async (job) => {
    const newStatus = job.status === 'active' ? 'closed' : 'active';
    try {
      await api.put(`/jobs/${job._id}`, { status: newStatus });
      showSuccess(`Job marked as ${newStatus}!`);
      setJobs((prev) =>
        prev.map((j) => (j._id === job._id ? { ...j, status: newStatus } : j))
      );
    } catch (err) {
      showError(err.message || 'Failed to update job status.');
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job posting? This action cannot be undone.')) {
      return;
    }

    try {
      await api.delete(`/jobs/${jobId}`);
      showSuccess('Job posting deleted.');
      setJobs((prev) => prev.filter((j) => j._id !== jobId));
    } catch (err) {
      showError(err.message || 'Failed to delete job.');
    }
  };

  return (
    <DashboardLayout
      title="Manage Job Openings"
      subtitle="Publish, close, edit, and review submissions for campus placement drives."
      action={
        <Link
          to="/recruiter/post-job"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-md shadow-brand-500/20 transition"
        >
          <PlusCircle className="w-4 h-4" />
          Create New Posting
        </Link>
      }
    >
      <div className="space-y-6">
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 border-3 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
            <p className="text-sm text-slate-500 font-medium">Loading company job postings...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
            <Briefcase className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No Job Postings Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Create your first recruitment drive to start receiving applications and ML candidate matches.
            </p>
            <Link
              to="/recruiter/post-job"
              className="inline-block px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-semibold"
            >
              Post Opportunity &rarr;
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => {
              const deadline = job.applicationDeadline
                ? new Date(job.applicationDeadline).toLocaleDateString('en-IN', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })
                : 'Open';

              return (
                <div
                  key={job._id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {job.jobType}
                        </span>
                        <StatusBadge status={job.status} />
                        <span className="text-xs text-slate-400">
                          Deadline: {deadline}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">{job.title}</h3>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1 font-semibold text-slate-700">
                          <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
                          {job.salary}
                        </span>
                        <span>Min CGPA: {job.minimumCGPA > 0 ? job.minimumCGPA.toFixed(1) : 'Open'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/recruiter/applicants?jobId=${job._id}`}
                        className="px-3.5 py-2 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-bold flex items-center gap-1.5 transition"
                      >
                        <Users className="w-4 h-4" />
                        Applicants ({job.applicantCount || 0})
                      </Link>

                      <button
                        onClick={() => handleToggleStatus(job)}
                        title={job.status === 'active' ? 'Close job' : 'Reactivate job'}
                        className={`p-2 rounded-xl border text-xs font-semibold transition ${
                          job.status === 'active'
                            ? 'border-slate-200 text-slate-600 hover:bg-slate-100'
                            : 'border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                        }`}
                      >
                        <Power className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteJob(job._id)}
                        title="Delete job posting"
                        className="p-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Skills badges */}
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
                    <span className="text-xs font-semibold text-slate-400">Required Skills:</span>
                    {job.requiredSkills?.map((skill, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 capitalize"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ManageJobs;
