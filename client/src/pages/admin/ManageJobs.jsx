import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { StatusBadge } from '../../components/common/Badge';
import { Briefcase, Building2, Trash2, Search, MapPin, IndianRupee, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import { useNotification } from '../../context/NotificationContext';

const ManageJobs = () => {
  const { showSuccess, showError } = useNotification();
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/jobs', { params: { search, status: '' } });
      setJobs(res.data.jobs || []);
    } catch (err) {
      showError(err.message || 'Failed to load campus job postings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [search]);

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to moderate and delete this job posting from the portal?')) {
      return;
    }

    try {
      await api.delete(`/admin/jobs/${jobId}`);
      showSuccess('Job opportunity and associated applications removed.');
      setJobs((prev) => prev.filter((j) => j._id !== jobId));
    } catch (err) {
      showError(err.message || 'Failed to delete job posting.');
    }
  };

  return (
    <DashboardLayout
      title="Campus Recruitment Opportunities Moderation"
      subtitle="Placement cell oversight of all postings, partner compliance, and active drives."
    >
      <div className="space-y-6">
        {/* Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-4">
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by title, company, or keyword..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
          <p className="text-xs font-semibold text-slate-500">Total Drives: {jobs.length}</p>
        </div>

        {/* Jobs List */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 border-3 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
            <p className="text-sm text-slate-500 font-medium">Loading opportunities...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-2">
            <Briefcase className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-700">No Job Openings</p>
          </div>
        ) : (
          <div className="space-y-3">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold text-slate-900">{job.title}</h4>
                    <StatusBadge status={job.status} />
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      {job.jobType}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 flex flex-wrap items-center gap-3">
                    <span className="flex items-center gap-1 font-semibold text-slate-700">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      {job.companyId?.companyName || 'Corporate Partner'}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-emerald-700">
                      <IndianRupee className="w-3.5 h-3.5" />
                      {job.salary}
                    </span>
                    <span>Min CGPA: {job.minimumCGPA > 0 ? job.minimumCGPA.toFixed(1) : 'Open'}</span>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleDeleteJob(job._id)}
                    className="px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold flex items-center gap-1 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Moderate / Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ManageJobs;
