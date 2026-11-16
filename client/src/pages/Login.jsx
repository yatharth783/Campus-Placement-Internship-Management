import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { LogIn, ShieldCheck, GraduationCap, Building2, Eye, EyeOff, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

const Login = ({ adminOnly = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { showSuccess, showError } = useNotification();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await login(email, password);
      showSuccess(`Welcome back, ${user.name}!`);

      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (user.role === 'recruiter') {
        navigate('/recruiter/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err) {
      showError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  // 1-Click Demo Credential Quick-Fill
  const fillCredentials = (type) => {
    if (type === 'student') {
      setEmail('yash.student@campusconnect.edu');
      setPassword('Student@123');
    } else if (type === 'recruiter') {
      setEmail('recruiter.google@campusconnect.edu');
      setPassword('Recruiter@123');
    } else if (type === 'admin') {
      setEmail('admin@campusconnect.edu');
      setPassword('Admin@123');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar />

      <div className="py-12 px-4 sm:px-6 lg:px-8 flex-1 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-slate-200/90 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-100 text-brand-600 flex items-center justify-center mx-auto">
              {adminOnly ? <ShieldCheck className="w-6 h-6 text-brand-700" /> : <LogIn className="w-6 h-6" />}
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {adminOnly ? 'Placement Officer Portal' : 'Sign in to CampusConnect'}
            </h2>
            <p className="text-xs text-slate-500">
              {adminOnly
                ? 'Authorized access only. Protected placement administration interface.'
                : 'Enter your registered credentials to access your dashboard.'}
            </p>
          </div>

          {/* Quick-Fill Demo Pills */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              1-Click Demo Accounts:
            </p>
            <div className="grid grid-cols-3 gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => fillCredentials('student')}
                className="px-2 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-brand-300 hover:text-brand-700 font-semibold text-slate-700 transition"
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => fillCredentials('recruiter')}
                className="px-2 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-brand-300 hover:text-brand-700 font-semibold text-slate-700 transition"
              >
                Recruiter
              </button>
              <button
                type="button"
                onClick={() => fillCredentials('admin')}
                className="px-2 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-brand-300 hover:text-brand-700 font-semibold text-slate-700 transition"
              >
                Admin
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@campusconnect.edu"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-md shadow-brand-500/20 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Navigation */}
          {!adminOnly && (
            <div className="pt-4 border-t border-slate-100 text-center space-y-2 text-xs text-slate-600">
              <p>
                Don't have an account?{' '}
                <Link to="/register-student" className="font-semibold text-brand-600 hover:underline">
                  Student Sign Up
                </Link>{' '}
                or{' '}
                <Link to="/register-recruiter" className="font-semibold text-brand-600 hover:underline">
                  Recruiter Sign Up
                </Link>
              </p>
              <p>
                <Link to="/admin/login" className="text-slate-400 hover:text-slate-600 font-medium">
                  Placement Officer Login &rarr;
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;
