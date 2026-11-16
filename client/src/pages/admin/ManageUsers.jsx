import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { StatusBadge } from '../../components/common/Badge';
import { Users, Building2, Search, CheckCircle2, XCircle, ShieldAlert, Mail, Award, Check, X } from 'lucide-react';
import api from '../../services/api';
import { useNotification } from '../../context/NotificationContext';

const ManageUsers = () => {
  const { showSuccess, showError } = useNotification();
  const [activeTab, setActiveTab] = useState('student'); // student | recruiter
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = { role: activeTab };
      if (search) params.search = search;
      const res = await api.get('/admin/users', { params });
      setUsers(res.data.users || []);
    } catch (err) {
      showError(err.message || 'Failed to load users list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [activeTab, search]);

  const handleUpdateRecruiterStatus = async (companyId, newStatus) => {
    try {
      await api.patch(`/admin/recruiters/${companyId}/status`, { status: newStatus });
      showSuccess(`Recruiter verification set to ${newStatus}!`);
      fetchUsers();
    } catch (err) {
      showError(err.message || 'Failed to update recruiter status.');
    }
  };

  return (
    <DashboardLayout
      title="User & Partner Account Management"
      subtitle="Verify corporate recruiter partners, monitor student profiles, and manage access."
    >
      <div className="space-y-6">
        {/* Tab & Search Bar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('student')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'student'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Users className="w-4 h-4" />
              Students ({activeTab === 'student' ? users.length : '...'})
            </button>
            <button
              onClick={() => setActiveTab('recruiter')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'recruiter'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Building2 className="w-4 h-4" />
              Corporate Recruiters ({activeTab === 'recruiter' ? users.length : '...'})
            </button>
          </div>

          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, branch..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
        </div>

        {/* User Table */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 border-3 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
            <p className="text-sm text-slate-500 font-medium">Loading user directory...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-2">
            <p className="text-sm font-bold text-slate-700">No Users Found</p>
            <p className="text-xs text-slate-400">No records matched your search query.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="px-6 py-3.5">Name / Identity</th>
                    <th className="px-6 py-3.5">Email</th>
                    {activeTab === 'student' ? (
                      <>
                        <th className="px-6 py-3.5">Branch & Batch</th>
                        <th className="px-6 py-3.5">CGPA</th>
                        <th className="px-6 py-3.5">Skills</th>
                        <th className="px-6 py-3.5">Resume</th>
                      </>
                    ) : (
                      <>
                        <th className="px-6 py-3.5">Account Role</th>
                        <th className="px-6 py-3.5">Joined Date</th>
                        <th className="px-6 py-3.5">Actions</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-slate-50/70 transition">
                      <td className="px-6 py-4 font-bold text-slate-900">{u.name}</td>
                      <td className="px-6 py-4 text-slate-500">{u.email}</td>
                      {activeTab === 'student' ? (
                        <>
                          <td className="px-6 py-4">
                            {u.branch || 'Unassigned'} ({u.graduationYear || '2026'})
                          </td>
                          <td className="px-6 py-4 font-bold text-brand-700">
                            {u.cgpa ? u.cgpa.toFixed(2) : 'N/A'}
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-semibold text-slate-600">
                              {u.skills?.length || 0} skills
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {u.resumePath ? (
                              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Uploaded
                              </span>
                            ) : (
                              <span className="text-slate-400">None</span>
                            )}
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-6 py-4">
                            <span className="capitalize font-semibold text-slate-800">
                              Corporate Recruiter
                            </span>
                          </td>
                          <td className="px-6 py-4 text-slate-400">
                            {new Date(u.createdAt).toLocaleDateString('en-IN', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Active Account
                            </span>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ManageUsers;
