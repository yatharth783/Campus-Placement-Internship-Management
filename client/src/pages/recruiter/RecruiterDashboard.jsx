import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatCard from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/Badge';
import {
  Briefcase,
  Users,
  CheckCircle2,
  Clock,
  PlusCircle,
  Building2,
  ArrowRight,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

const RecruiterDashboard = () => {
  const { user } = useAuth();
  const { showError } = useNotification();

  const [stats, setStats] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [recentApplicants, setRecentApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        // Fetch recruiter jobs with applicant counts
        const jobsRes = await api.get('/recruiter/my-jobs');
        const recruiterJobs = jobsRes.data.jobs || [];
        setJobs(recruiterJobs);

        // Fetch company profile & applicant counts
        let totalApplicants = 0;
        let activeJobsCount = 0;
        recruiterJobs.forEach((j) => {
          totalApplicants += j.applicantCount || 0;
          if (j.status === 'active') activeJobsCount++;
        });

        setStats({
          totalJobs: recruiterJobs.length,
          activeJobs: activeJobsCount,
          totalApplicants
        });

        // If there are jobs, fetch applicants of first job for recent preview
        if (recruiterJobs.length > 0) {
          try {
            const appsRes = await api.get(`/applications/job/${recruiterJobs[0]._id}`);
            setRecentApplicants(appsRes.data.applications?.slice(0, 5) || []);
          } catch {
            // ignore if no applicants
          }
        }
      } catch (err) {
        showError(err.message || 'Failed to load recruiter dashboard.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <DashboardLayout title="Recruiter Dashboard">
        <div className="py-24 flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-3 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
          <p className="text-sm text-slate-500 font-medium">Loading recruitment portal data...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Recruiter Overview & Talent Pipeline"
      subtitle={`Corporate Partner Dashboard • ${user?.name || 'Recruiter'}`}
      action={
        <Link
          to="/recruiter/post-job"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-md shadow-brand-500/20 transition hover:scale-105"
        >
          <PlusCircle className="w-4 h-4" />
          Post New Opportunity
        </Link>
      }
    >
      <div className="space-y-8">
        {/* KPI Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            title="Total Jobs Posted"
            value={stats?.totalJobs || 0}
            icon={Briefcase}
            color="indigo"
            subtitle="Campus Drives"
          />
          <StatCard
            title="Active Job Openings"
            value={stats?.activeJobs || 0}
            icon={Building2}
            color="emerald"
            subtitle="Accepting Applications"
          />
          <StatCard
            title="Total Candidates"
            value={stats?.totalApplicants || 0}
            icon={Users}
            color="purple"
            subtitle="Submissions Received"
          />
          <StatCard
            title="Partner Status"
            value="Verified"
            icon={CheckCircle2}
            color="emerald"
            subtitle="Campus Approved"
          />
        </div>

        {/* Action Shortcuts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/recruiter/post-job"
            className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-brand-300 hover:shadow-md transition space-y-2 group"
          >
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <PlusCircle className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Post New Role</h4>
            <p className="text-xs text-slate-500">
              Create internship or full-time position with branch and CGPA requirements.
            </p>
          </Link>

          <Link
            to="/recruiter/applicants"
            className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-brand-300 hover:shadow-md transition space-y-2 group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Review Candidate Resumes</h4>
            <p className="text-xs text-slate-500">
              View candidate profiles, ML similarity scores, and shortlist top applicants.
            </p>
          </Link>

          <Link
            to="/recruiter/profile"
            className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-brand-300 hover:shadow-md transition space-y-2 group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Building2 className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Company Profile</h4>
            <p className="text-xs text-slate-500">
              Manage corporate branding, industry category, location, and website.
            </p>
          </Link>
        </div>

        {/* Active Job Drives Table */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Your Active Job Drives</h3>
              <p className="text-xs text-slate-500">Monitor applicant volume and toggle status</p>
            </div>
            <Link
              to="/recruiter/manage-jobs"
              className="text-xs font-semibold text-brand-600 hover:underline"
            >
              Manage All Drives ({jobs.length}) &rarr;
            </Link>
          </div>

          {jobs.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <Briefcase className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-700">No Job Openings Posted Yet</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Get started by creating your first campus placement opportunity.
              </p>
              <Link
                to="/recruiter/post-job"
                className="inline-block px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-semibold"
              >
                Post an Opportunity &rarr;
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {jobs.slice(0, 4).map((j) => (
                <div key={j._id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-800">{j.title}</span>
                      <StatusBadge status={j.status} />
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        {j.jobType}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      {j.location} • Min CGPA: {j.minimumCGPA ? j.minimumCGPA.toFixed(1) : 'Open'} • {j.salary}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-base font-bold text-brand-600">{j.applicantCount || 0}</span>
                      <p className="text-[10px] text-slate-400 font-semibold uppercase">Applicants</p>
                    </div>

                    <Link
                      to={`/recruiter/applicants?jobId=${j._id}`}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition"
                    >
                      View Candidates &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RecruiterDashboard;
