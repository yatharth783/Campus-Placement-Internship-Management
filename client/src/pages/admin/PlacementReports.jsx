import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Award, Printer, TrendingUp, Users, Building2, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';
import { useNotification } from '../../context/NotificationContext';

const PlacementReports = () => {
  const { showError } = useNotification();
  const [stats, setStats] = useState(null);
  const [charts, setCharts] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const res = await api.get('/admin/stats');
        setStats(res.data.stats);
        setCharts(res.data.charts);
      } catch (err) {
        showError(err.message || 'Failed to load report data.');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <DashboardLayout title="Placement Reports">
        <div className="py-24 flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-3 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
          <p className="text-sm text-slate-500 font-medium">Generating official placement report...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Annual Campus Placement Report"
      subtitle="Official placement statistics, recruiter participation, and branch conversion metrics."
      action={
        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-sm transition"
        >
          <Printer className="w-4 h-4" />
          Print / Export Report
        </button>
      }
    >
      <div className="space-y-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm print:border-none print:shadow-none">
        {/* Report Header */}
        <div className="pb-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">
              CampusConnect University Placement Summary
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Academic Year 2025-2026 • Verified Institutional Record
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-slate-400">Generated on</span>
            <p className="text-xs font-semibold text-slate-700">
              {new Date().toLocaleDateString('en-IN', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </p>
          </div>
        </div>

        {/* Executive Highlights Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Total Candidates</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-1">{stats?.totalStudents || 0}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Offers Accepted</p>
            <p className="text-2xl font-extrabold text-emerald-600 mt-1">{stats?.selectedCount || 0}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Placement Rate</p>
            <p className="text-2xl font-extrabold text-brand-600 mt-1">{stats?.placementRate || 0}%</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">Corporate Drives</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-1">{stats?.totalJobs || 0}</p>
          </div>
        </div>

        {/* Branch-wise Breakdown Table */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Branch-wise Student Registration & Engagement
          </h3>
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3">Academic Department</th>
                  <th className="px-6 py-3">Enrolled Students</th>
                  <th className="px-6 py-3">Batch Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {charts?.branchDistribution?.map((b, i) => {
                  const share =
                    stats?.totalStudents > 0
                      ? Math.round((b.students / stats.totalStudents) * 100)
                      : 0;
                  return (
                    <tr key={i} className="hover:bg-slate-50/50">
                      <td className="px-6 py-3.5 font-bold text-slate-900">{b.branch}</td>
                      <td className="px-6 py-3.5">{b.students} candidates</td>
                      <td className="px-6 py-3.5 font-semibold text-brand-700">{share}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recruiter Participation Summary */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Top Participating Corporate Employers
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {charts?.topCompanies?.map((comp, i) => (
              <div key={i} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
                <p className="text-sm font-bold text-slate-900">{comp.companyName}</p>
                <p className="text-xs text-slate-500">{comp.industry}</p>
                <p className="text-xs font-semibold text-brand-700 pt-1">
                  {comp.jobsCount} Opportunities Posted
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Official Sign-off */}
        <div className="pt-8 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div>
            <p className="font-bold text-slate-800">Training & Placement Cell</p>
            <p>Directorate of Corporate Relations</p>
          </div>
          <div className="text-right">
            <span className="font-semibold text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Digitally Certified by CampusConnect
            </span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PlacementReports;
