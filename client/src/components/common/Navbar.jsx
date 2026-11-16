
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  GraduationCap,
  Sparkles,
  Briefcase,
  User,
  LogOut,
  Menu,
  X,
  ChevronDown,
  LayoutDashboard
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, role, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (role === 'admin') return '/admin/dashboard';
    if (role === 'recruiter') return '/recruiter/dashboard';
    return '/student/dashboard';
  };

  const isActive = (path) => location.pathname === path;

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          {/* Project Logo and Branding */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group min-w-0"
          >
            <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-tr from-navy-800 to-brand-600 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>

            <div className="min-w-0">
              <p className="text-sm sm:text-base font-extrabold tracking-tight text-slate-900 group-hover:text-brand-700 transition leading-tight">
                Campus Placement
              </p>
              <p className="text-[10px] sm:text-[11px] font-semibold text-brand-600 tracking-wide">
                & Internship Management System
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">

            <Link
              to="/"
              className={`text-sm font-medium transition ${
                isActive('/')
                  ? 'text-brand-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Home
            </Link>

            <Link
              to="/jobs"
              className={`text-sm font-medium transition flex items-center gap-1.5 ${
                isActive('/jobs')
                  ? 'text-brand-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              Opportunities
            </Link>

            <Link
              to="/about"
              className={`text-sm font-medium transition ${
                isActive('/about')
                  ? 'text-brand-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              About
            </Link>

            {role === 'student' && (
              <Link
                to="/student/ml-assistant"
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-full bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-sm hover:shadow-md hover:scale-105 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Career Assistant
              </Link>
            )}
          </div>

          {/* Desktop Authentication */}
          <div className="hidden md:flex items-center gap-3">

            {isAuthenticated ? (
              <div className="relative">

                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pl-3 rounded-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition"
                >
                  <div className="text-right">
                    <p className="text-xs font-semibold text-slate-900">
                      {user?.name?.split(' ')[0] || 'User'}
                    </p>
                    <p className="text-[10px] text-slate-500 capitalize">
                      {role}
                    </p>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 font-semibold flex items-center justify-center text-xs">
                    {user?.name ? user.name[0].toUpperCase() : 'U'}
                  </div>

                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50">

                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="text-xs font-semibold text-slate-900 truncate">
                        {user?.name}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        {user?.email}
                      </p>
                    </div>

                    <Link
                      to={getDashboardLink()}
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>

                    {role === 'student' && (
                      <>
                        <Link
                          to="/student/profile"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          <User className="w-4 h-4" />
                          My Profile & Resume
                        </Link>

                        <Link
                          to="/student/ml-assistant"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-brand-700 hover:bg-brand-50"
                        >
                          <Sparkles className="w-4 h-4" />
                          Career Assistant
                        </Link>
                      </>
                    )}

                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>

                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">

                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-brand-600 transition"
                >
                  Sign In
                </Link>

                <Link
                  to="/register-recruiter"
                  className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-brand-600 transition"
                >
                  Recruiter
                </Link>

                <Link
                  to="/register-student"
                  className="px-4 py-2 rounded-xl text-sm font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow-sm transition"
                >
                  Student Register
                </Link>

              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen
                ? <X className="w-6 h-6" />
                : <Menu className="w-6 h-6" />
              }
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2">

          <Link
            to="/"
            onClick={closeMobileMenu}
            className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Home
          </Link>

          <Link
            to="/jobs"
            onClick={closeMobileMenu}
            className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Browse Opportunities
          </Link>

          <Link
            to="/about"
            onClick={closeMobileMenu}
            className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            About Portal
          </Link>

          {isAuthenticated ? (
            <div className="border-t border-slate-100 pt-3 space-y-2">

              <Link
                to={getDashboardLink()}
                onClick={closeMobileMenu}
                className="block px-3 py-2.5 rounded-lg text-sm font-semibold text-brand-600 bg-brand-50"
              >
                Go to Dashboard
              </Link>

              {role === 'student' && (
                <Link
                  to="/student/ml-assistant"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-brand-700 hover:bg-brand-50"
                >
                  <Sparkles className="w-4 h-4" />
                  Career Assistant
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50"
              >
                Sign Out
              </button>

            </div>
          ) : (
            <div className="border-t border-slate-100 pt-3 flex flex-col gap-2">

              <Link
                to="/login"
                onClick={closeMobileMenu}
                className="text-center px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-semibold text-slate-700"
              >
                Sign In
              </Link>

              <Link
                to="/register-student"
                onClick={closeMobileMenu}
                className="text-center px-4 py-2.5 rounded-lg bg-brand-600 text-white text-sm font-semibold"
              >
                Register as Student
              </Link>

              <Link
                to="/register-recruiter"
                onClick={closeMobileMenu}
                className="text-center px-4 py-2.5 rounded-lg border border-brand-200 text-brand-700 text-sm font-semibold"
              >
                Register as Recruiter
              </Link>

            </div>
          )}

        </div>
      )}
    </nav>
  );
};

export default Navbar;
