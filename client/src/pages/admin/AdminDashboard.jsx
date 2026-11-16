import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatCard from '../../components/common/StatCard';
import {
  Users,
  Building2,
  Briefcase,
  FileText,
  TrendingUp,
  Award,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import api from '../../services/api';
import { useNotification } from '../../context/NotificationContext';

const AdminDashboard = () => {
  const { showError } = useNotification();
  const [stats, setStats] = useState(null);
  const [charts, setCharts] = useState(null);
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        setLoading(true);
        const res = await api.get('/admin/stats');
        setStats(res.data.stats);
        setCharts(res.data.charts);
        setRecentApplications(res.data.recentApplications || []);
      } catch (err) {
        showError(err.message || 'Failed to load administrator statistics.');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  if (loading) {
    return (
      <DashboardLayout title="Admin Overview">
        <div className="py-24 flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-3 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
          <p className="text-sm text-slate-500 font-medium">Aggregating university placement statistics...</p>
        </div>
      </DashboardLayout>
    );
  }

  const COLORS = ['#3b82f6', '#f59e0b', '#8b5cf6', '#10b981', '#ef4444'];

  return (
    <DashboardLayout
      title="Placement Directorate & Administration"
      subtitle="Comprehensive campus recruitment analytics, partner moderation, and candidate pipelines."
      action={
        <div className="flex items-center gap-2">
          <Link
            to="/admin/users"
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-sm transition"
          >
            Manage Users
          </Link>
          <Link
            to="/admin/analytics"
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-sm transition"
          >
            Placement Reports &rarr;
          </Link>
        </div>
      }
    >
      <div className="space-y-8">
        {/* KPI Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <StatCard
            title="Registered Students"
            value={stats?.totalStudents || 0}
            icon={Users}
            color="indigo"
            subtitle="Batch Profiles"
          />
          <StatCard
            title="Partner Recruiters"
            value={stats?.totalRecruiters || 0}
            icon={Building2}
            color="purple"
            subtitle="Corporate Accounts"
          />
          <StatCard
            title="Active Job Drives"
            value={stats?.activeJobs || 0}
            icon={Briefcase}
            color="blue"
            subtitle={`Out of ${stats?.totalJobs || 0} total`}
          />
          <StatCard
            title="Total Applications"
            value={stats?.totalApplications || 0}
            icon={FileText}
            color="amber"
            subtitle="Submitted to Date"
          />
          <StatCard
            title="Offers Made"
            value={stats?.selectedCount || 0}
            icon={Award}
            color="emerald"
            subtitle={`${stats?.placementRate || 0}% Placement Rate`}
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Chart 1: Application Pipeline Status Breakdown */}
          <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Application Pipeline Breakdown
              </h3>
              <p className="text-xs text-slate-500">Distribution across recruitment stages</p>
            </div>

            <div className="h-64 w-full">
              {charts?.statusBreakdown && (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={charts.statusBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {charts.statusBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Chart 2: Branch-wise Student Distribution */}
          <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Branch-wise Student Distribution
              </h3>
              <p className="text-xs text-slate-500">Registered candidates across engineering departments</p>
            </div>

            <div className="h-64 w-full">
              {charts?.branchDistribution && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={charts.branchDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <XAxis
                      dataKey="branch"
                      tick={{ fontSize: 10 }}
                      interval={0}
                      angle={-20}
                      textAnchor="end"
                    />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="students" fill="#4f46e5" radius={[6, 6, 0, 0]} name="Students" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        {/* Top Companies and Recent Submissions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Top Recruiting Companies */}
          <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Top Corporate Partners
            </h3>
            <p className="text-xs text-slate-500">Organizations with most active recruitment postings</p>

            <div className="divide-y divide-slate-100">
              {charts?.topCompanies?.map((comp, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-navy-50 text-navy-800 font-bold flex items-center justify-center text-xs">
                      {comp.companyName ? comp.companyName[0] : 'C'}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">{comp.companyName}</p>
                      <p className="text-[11px] text-slate-400">{comp.industry}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {comp.jobsCount} Opportunities
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent System Activity Stream */}
          <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Recent Platform Submissions
                </h3>
                <p className="text-xs text-slate-500">Live feed of student applications</p>
              </div>
              <Link
                to="/admin/analytics"
                className="text-xs font-semibold text-brand-600 hover:underline"
              >
                View Analytics &rarr;
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {recentApplications.map((app) => (
                <div key={app._id} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <p className="font-bold text-slate-900">
                      {app.studentId?.name || 'Student'}{' '}
                      <span className="text-slate-400 font-normal">applied for</span>{' '}
                      {app.jobId?.title || 'Position'}
                    </p>
                    <p className="text-slate-500 text-[11px]">
                      {app.jobId?.companyId?.companyName || 'Recruiter'} • {app.studentId?.branch}
                    </p>
                  </div>
                  <span className="font-semibold text-slate-600 px-2 py-0.5 rounded bg-slate-100">
                    {app.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
