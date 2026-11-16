import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatCard from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/Badge';
import {
  Briefcase,
  FileText,
  Clock,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Building2,
  MapPin,
  TrendingUp,
  UserCheck
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

const StudentDashboard = () => {
  const { user } = useAuth();
  const { showError } = useNotification();

  const [stats, setStats] = useState(null);
  const [recentApplications, setRecentApplications] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch student dashboard stats
        const statsRes = await api.get('/student/dashboard-stats');
        setStats(statsRes.data.stats);
        setRecentApplications(statsRes.data.recentApplications || []);

        // Fetch top ML recommendations
        try {
          const mlRes = await api.get('/ml/recommendations?limit=3');
          setRecommendations(mlRes.data.recommendations || []);
        } catch {
          // ML recommendations fail gracefully
        }
      } catch (err) {
        showError(err.message || 'Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout title="Student Overview">
        <div className="py-24 flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-3 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
          <p className="text-sm text-slate-500 font-medium">Loading placement analytics...</p>
        </div>
      </DashboardLayout>
    );
  }

  // Calculate profile completion metrics
  const completionPercentage = stats?.profileCompletionPercentage || 75;

  return (
    <DashboardLayout
      title={`Welcome back, ${user?.name || 'Student'}!`}
      subtitle={`${user?.branch || 'Engineering'} • Graduation Batch ${user?.graduationYear || '2026'}`}
      action={
        <Link
          to="/student/ml-assistant"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-semibold text-xs shadow-md shadow-brand-500/20 hover:scale-105 transition-transform"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          ML Career Assistant
        </Link>
      }
    >
      <div className="space-y-8">
        {/* KPI Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            title="Total Applied"
            value={stats?.totalApplied || 0}
            icon={FileText}
            color="indigo"
            subtitle="Campus Drives"
          />
          <StatCard
            title="Under Review"
            value={stats?.underReview || 0}
            icon={Clock}
            color="amber"
            subtitle="Pending Recruiter Action"
          />
          <StatCard
            title="Shortlisted"
            value={stats?.shortlisted || 0}
            icon={Sparkles}
            color="purple"
            subtitle="Interview Rounds"
          />
          <StatCard
            title="Selected Offers"
            value={stats?.selected || 0}
            icon={CheckCircle2}
            color="emerald"
            subtitle="Final Offer Received"
          />
        </div>

        {/* Profile Completion & ML Assistant Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Profile Completion Bar */}
          <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Profile Readiness</h3>
                <p className="text-xs text-slate-500">Boost recruiter visibility & ML match accuracy</p>
              </div>
              <span className="text-base font-extrabold text-brand-600">
                {completionPercentage}%
              </span>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-2.5">
              <div
                className="bg-brand-600 h-2.5 rounded-full transition-all duration-700"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Academic CGPA: {user?.cgpa || '8.85'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Branch: {user?.branch || 'CS'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                {user?.resumePath ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                )}
                <span>PDF Resume {user?.resumePath ? 'Uploaded' : 'Pending'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{user?.skills?.length || 0} Skills Detected</span>
              </div>
            </div>

            <div className="pt-1">
              <Link
                to="/student/profile"
                className="text-xs font-semibold text-brand-600 hover:text-brand-800 flex items-center gap-1"
              >
                Update Profile & Resume &rarr;
              </Link>
            </div>
          </div>

          {/* ML Assistant Highlight Card */}
          <div className="lg:col-span-6 bg-gradient-to-tr from-brand-900 to-navy-900 p-6 rounded-2xl text-white shadow-md flex flex-col justify-between">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-brand-200 text-[11px] font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                TF-IDF Cosine Similarity Engine
              </div>
              <h3 className="text-lg font-bold">AI/ML Job Recommendations</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                The CampusConnect ML microservice automatically vectorizes your PDF resume text and extracted skills, ranking jobs by similarity percentage to streamline your placement preparation.
              </p>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-white/10">
              <span className="text-xs text-brand-200">
                {stats?.activeJobsCount || 5} active drives analyzed
              </span>
              <Link
                to="/student/ml-assistant"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white text-navy-900 text-xs font-bold hover:bg-brand-50 transition"
              >
                Explore Matches <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Top Recommended Opportunities Preview */}
        {recommendations.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Top ML Recommended Positions
              </h3>
              <Link
                to="/student/ml-assistant"
                className="text-xs font-semibold text-brand-600 hover:underline"
              >
                View All Ranked Jobs &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recommendations.map((rec) => (
                <div
                  key={rec.job_id}
                  className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-brand-300 transition-all space-y-2.5"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 truncate">{rec.title}</h4>
                      <p className="text-xs text-slate-500">{rec.company_name}</p>
                    </div>
                    <span className="text-xs font-extrabold px-2 py-0.5 rounded-md bg-brand-50 text-brand-700 border border-brand-200">
                      {rec.similarity_score}% Match
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2">{rec.job_description}</p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span
                      className={`font-semibold ${
                        rec.explanation?.is_eligible ? 'text-emerald-700' : 'text-amber-700'
                      }`}
                    >
                      {rec.explanation?.is_eligible ? 'Eligible' : 'Check Criteria'}
                    </span>
                    <Link
                      to="/jobs"
                      className="text-brand-600 font-semibold hover:underline"
                    >
                      View & Apply &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Applications Pipeline */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Recent Applications</h3>
              <p className="text-xs text-slate-500">Track real-time status and recruiter remarks</p>
            </div>
            <Link
              to="/student/applications"
              className="text-xs font-semibold text-brand-600 hover:underline"
            >
              View Full History ({stats?.totalApplied || 0}) &rarr;
            </Link>
          </div>

          {recentApplications.length === 0 ? (
            <div className="py-8 text-center space-y-2">
              <FileText className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-500">No applications submitted yet.</p>
              <Link
                to="/jobs"
                className="inline-block text-xs font-semibold text-brand-600 hover:underline"
              >
                Browse open opportunities &rarr;
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentApplications.map((app) => (
                <div key={app._id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-900">{app.jobId?.title || 'Position'}</p>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5" />
                      {app.jobId?.companyId?.companyName || 'Recruiter'} • Applied on{' '}
                      {new Date(app.createdAt).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {app.similarityScore && (
                      <span className="text-xs font-semibold text-slate-600">
                        {app.similarityScore.toFixed(1)}% Match
                      </span>
                    )}
                    <StatusBadge status={app.status} />
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

export default StudentDashboard;
