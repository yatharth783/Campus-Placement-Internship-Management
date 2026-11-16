import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { StatusBadge } from '../../components/common/Badge';
import { Users, FileText, Sparkles, CheckCircle2, Clock, Mail, Phone, BookOpen, Award, ExternalLink, Save } from 'lucide-react';
import api from '../../services/api';
import { useNotification } from '../../context/NotificationContext';

const ReviewApplicants = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { showSuccess, showError } = useNotification();

  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(searchParams.get('jobId') || '');
  const [applications, setApplications] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  // Load Recruiter's jobs list
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get('/recruiter/my-jobs');
        const list = res.data.jobs || [];
        setJobs(list);
        if (!selectedJobId && list.length > 0) {
          setSelectedJobId(list[0]._id);
        }
      } catch (err) {
        showError(err.message || 'Failed to load jobs list.');
      }
    };

    fetchJobs();
  }, []);

  // Fetch applicants whenever selectedJobId changes
  useEffect(() => {
    if (!selectedJobId) return;

    const fetchApplicants = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/applications/job/${selectedJobId}`);
        setApplications(res.data.applications || []);
      } catch (err) {
        showError(err.message || 'Failed to load applicants.');
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [selectedJobId]);

  // Handle Status Update
  const handleUpdateStatus = async (appId, newStatus, remarks) => {
    setUpdatingId(appId);
    try {
      await api.patch(`/applications/${appId}/status`, {
        status: newStatus,
        recruiterRemarks: remarks
      });
      showSuccess(`Application marked as '${newStatus}'!`);
      setApplications((prev) =>
        prev.map((a) =>
          a._id === appId ? { ...a, status: newStatus, recruiterRemarks: remarks } : a
        )
      );
    } catch (err) {
      showError(err.message || 'Failed to update application status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const statuses = ['ALL', 'Applied', 'Under Review', 'Shortlisted', 'Selected', 'Rejected'];

  const filteredApps = applications.filter((app) => {
    if (statusFilter === 'ALL') return true;
    return app.status === statusFilter;
  });

  return (
    <DashboardLayout
      title="Candidate Review & Shortlisting"
      subtitle="Examine student resumes, ML similarity rankings, and update application stages."
    >
      <div className="space-y-6">
        {/* Job Selector Bar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Selected Recruitment Opening
            </label>
            <select
              value={selectedJobId}
              onChange={(e) => {
                setSelectedJobId(e.target.value);
                setSearchParams({ jobId: e.target.value });
              }}
              className="px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 bg-white"
            >
              {jobs.map((j) => (
                <option key={j._id} value={j._id}>
                  {j.title} ({j.applicantCount || 0} applicants)
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {statuses.map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  statusFilter === s
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Applicants List */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 border-3 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
            <p className="text-sm text-slate-500 font-medium">Loading candidate applications...</p>
          </div>
        ) : filteredApps.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
            <Users className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No Candidates Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {statusFilter === 'ALL'
                ? 'No students have applied for this position yet.'
                : `No candidates currently under status "${statusFilter}".`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApps.map((app) => {
              const student = app.studentId || {};
              const isUpdating = updatingId === app._id;

              return (
                <div
                  key={app._id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-slate-900">{student.name || 'Candidate'}</h4>
                        <StatusBadge status={app.status} />
                      </div>
                      <p className="text-xs text-slate-500 flex flex-wrap items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          {student.email}
                        </span>
                        {student.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            {student.phone}
                          </span>
                        )}
                        <span className="flex items-center gap-1 text-slate-700 font-semibold">
                          <Award className="w-3.5 h-3.5 text-brand-600" />
                          CGPA: {student.cgpa ? student.cgpa.toFixed(2) : 'N/A'}
                        </span>
                        <span>{student.branch} • Batch {student.graduationYear || '2026'}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      {app.similarityScore && (
                        <div className="text-right">
                          <span className="text-xs font-bold text-brand-700 bg-brand-50 border border-brand-200 px-3 py-1 rounded-full flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-amber-500" />
                            {app.similarityScore.toFixed(1)}% Match
                          </span>
                        </div>
                      )}

                      {student.resumePath && (
                        <a
                          href={`http://localhost:5000/${student.resumePath}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3.5 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition"
                        >
                          <FileText className="w-3.5 h-3.5 text-brand-600" />
                          View Resume PDF
                          <ExternalLink className="w-3 h-3 text-slate-400" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Student Skills Badges */}
                  {student.skills?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
                      <span className="text-xs font-semibold text-slate-400">Skills:</span>
                      {student.skills.map((s, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700 capitalize"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Recruiter Action Strip */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-bold text-slate-700">Update Status:</label>
                      <select
                        value={app.status}
                        onChange={(e) =>
                          handleUpdateStatus(app._id, e.target.value, app.recruiterRemarks || '')
                        }
                        disabled={isUpdating}
                        className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                      >
                        <option value="Applied">Applied</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Selected">Selected</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>

                    <div className="flex-1 max-w-md flex items-center gap-2">
                      <input
                        type="text"
                        defaultValue={app.recruiterRemarks || ''}
                        onBlur={(e) => {
                          if (e.target.value !== app.recruiterRemarks) {
                            handleUpdateStatus(app._id, app.status, e.target.value);
                          }
                        }}
                        placeholder="Add candidate notes or interview feedback..."
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/20 bg-white"
                      />
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

export default ReviewApplicants;
