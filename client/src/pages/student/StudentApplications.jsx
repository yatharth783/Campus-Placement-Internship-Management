import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { StatusBadge } from '../../components/common/Badge';
import { Briefcase, Building2, Calendar, IndianRupee, MapPin, Sparkles, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import { useNotification } from '../../context/NotificationContext';

const StudentApplications = () => {
  const { showError } = useNotification();
  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const res = await api.get('/applications/my-applications');
        setApplications(res.data.applications || []);
      } catch (err) {
        showError(err.message || 'Failed to load applications.');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const statuses = ['ALL', 'Applied', 'Under Review', 'Shortlisted', 'Selected', 'Rejected'];

  const filteredApps = applications.filter((app) => {
    if (filter === 'ALL') return true;
    return app.status === filter;
  });

  return (
    <DashboardLayout
      title="My Campus Placement Applications"
      subtitle="Track your submission status, ML match evaluation, and corporate recruiter feedback."
    >
      <div className="space-y-6">
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-slate-200">
          {statuses.map((s) => {
            const count =
              s === 'ALL'
                ? applications.length
                : applications.filter((a) => a.status === s).length;
            return (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                  filter === s
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {s} ({count})
              </button>
            );
          })}
        </div>

        {/* Content */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 border-3 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
            <p className="text-sm text-slate-500 font-medium">Loading applications history...</p>
          </div>
        ) : filteredApps.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No Applications Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {filter === 'ALL'
                ? "You haven't submitted any job or internship applications yet."
                : `No applications currently have the status "${filter}".`}
            </p>
            <Link
              to="/jobs"
              className="inline-block mt-2 px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-semibold hover:bg-brand-700 transition"
            >
              Browse Open Opportunities &rarr;
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApps.map((app) => {
              const job = app.jobId || {};
              const companyName = job.companyId?.companyName || 'Verified Corporate Partner';
              const appliedDate = new Date(app.createdAt).toLocaleDateString('en-IN', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              });

              return (
                <div
                  key={app._id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {job.jobType || 'Full-time'}
                        </span>
                        <span className="text-xs text-slate-400">Applied on {appliedDate}</span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">{job.title || 'Recruitment Opening'}</h3>
                      <p className="text-xs font-medium text-slate-600 flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          {companyName}
                        </span>
                        {job.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            {job.location}
                          </span>
                        )}
                        {job.salary && (
                          <span className="flex items-center gap-1 font-semibold text-slate-800">
                            <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
                            {job.salary}
                          </span>
                        )}
                      </p>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end gap-2">
                      <StatusBadge status={app.status} />
                      {app.similarityScore && (
                        <span className="text-xs font-bold text-brand-700 bg-brand-50 border border-brand-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-500" />
                          {app.similarityScore.toFixed(1)}% Match
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Recruiter Remarks Box if present */}
                  {app.recruiterRemarks && (
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                      <p className="font-semibold text-slate-700 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-brand-600" />
                        Recruiter Feedback & Status Notes:
                      </p>
                      <p className="text-slate-600 italic">"{app.recruiterRemarks}"</p>
                    </div>
                  )}

                  {/* Progress Stepper Visual */}
                  <div className="pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
                      <span className={app.status !== 'Rejected' ? 'text-brand-600 font-bold' : ''}>
                        1. Applied
                      </span>
                      <span>&rarr;</span>
                      <span
                        className={
                          ['Under Review', 'Shortlisted', 'Selected'].includes(app.status)
                            ? 'text-brand-600 font-bold'
                            : ''
                        }
                      >
                        2. Under Review
                      </span>
                      <span>&rarr;</span>
                      <span
                        className={
                          ['Shortlisted', 'Selected'].includes(app.status)
                            ? 'text-purple-600 font-bold'
                            : ''
                        }
                      >
                        3. Shortlisted
                      </span>
                      <span>&rarr;</span>
                      <span
                        className={
                          app.status === 'Selected'
                            ? 'text-emerald-600 font-bold'
                            : app.status === 'Rejected'
                            ? 'text-rose-600 font-bold'
                            : ''
                        }
                      >
                        {app.status === 'Rejected' ? 'Rejected' : '4. Selected'}
                      </span>
                    </div>
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

export default StudentApplications;
