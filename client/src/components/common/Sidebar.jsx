import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  User,
  Sparkles,
  FileText,
  Briefcase,
  PlusCircle,
  Users,
  BarChart3,
  Building,
  ShieldCheck,
  CheckSquare
} from 'lucide-react';

const Sidebar = () => {
  const { role, user } = useAuth();

  const studentLinks = [
    { to: '/student/dashboard', icon: LayoutDashboard, label: 'Overview' },
    { to: '/student/ml-assistant', icon: Sparkles, label: 'ML Career Assistant', highlight: true },
    { to: '/student/profile', icon: User, label: 'Profile & Resume' },
    { to: '/student/applications', icon: CheckSquare, label: 'My Applications' },
    { to: '/jobs', icon: Briefcase, label: 'Browse Jobs' }
  ];

  const recruiterLinks = [
    { to: '/recruiter/dashboard', icon: LayoutDashboard, label: 'Overview' },
    { to: '/recruiter/manage-jobs', icon: Briefcase, label: 'Manage Jobs' },
    { to: '/recruiter/post-job', icon: PlusCircle, label: 'Post New Opportunity' },
    { to: '/recruiter/applicants', icon: Users, label: 'Review Applicants' },
    { to: '/recruiter/profile', icon: Building, label: 'Company Profile' }
  ];

  const adminLinks = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Analytics Dashboard' },
    { to: '/admin/users', icon: Users, label: 'Manage Students & Recruiters' },
    { to: '/admin/jobs', icon: Briefcase, label: 'Job Moderation' },
    { to: '/admin/analytics', icon: BarChart3, label: 'Placement Trends' }
  ];

  const links =
    role === 'admin' ? adminLinks : role === 'recruiter' ? recruiterLinks : studentLinks;

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between hidden md:flex">
      <div>
        {/* Role Badge Card */}
        <div className="mb-6 p-3 rounded-xl bg-slate-50 border border-slate-200/60">
          <p className="text-[11px] font-semibold tracking-wider uppercase text-slate-400">
            Authenticated As
          </p>
          <p className="text-sm font-bold text-slate-800 capitalize mt-0.5">
            {role === 'admin'
              ? 'Placement Officer'
              : role === 'recruiter'
              ? user?.company?.companyName || 'Corporate Recruiter'
              : `${user?.branch || 'Student'} Batch`}
          </p>
          {role === 'student' && user?.cgpa > 0 && (
            <p className="text-xs text-brand-700 font-medium mt-1">
              CGPA: {user.cgpa.toFixed(2)} / 10.0
            </p>
          )}
        </div>

        {/* Navigation Item List */}
        <nav className="space-y-1.5">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? link.highlight
                        ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-sm shadow-brand-500/20'
                        : 'bg-brand-50 text-brand-700 font-semibold'
                      : link.highlight
                      ? 'text-brand-700 hover:bg-brand-50 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`w-4 h-4 ${
                        isActive
                          ? link.highlight
                            ? 'text-amber-300'
                            : 'text-brand-600'
                          : link.highlight
                          ? 'text-brand-600'
                          : 'text-slate-400'
                      }`}
                    />
                    <span>{link.label}</span>
                    {link.highlight && (
                      <span className="ml-auto text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-700 border border-amber-300/40">
                        AI
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer Note */}
      <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400 text-center">
        CampusConnect v1.0 • Minor Project
      </div>
    </aside>
  );
};

export default Sidebar;
