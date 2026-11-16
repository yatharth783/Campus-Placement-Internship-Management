
import React from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Terminal,
  Briefcase,
  Users,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Project Branding */}
          <div className="md:col-span-2 space-y-4">

            <Link to="/" className="flex items-center gap-3 group w-fit">
              <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition">
                <GraduationCap className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-white leading-tight">
                  Campus Placement
                </h3>
                <p className="text-xs font-semibold text-brand-400">
                  & Internship Management System
                </p>
              </div>
            </Link>

            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              A centralized platform connecting students, recruiters, and
              placement administrators. Discover job opportunities, manage
              applications, evaluate eligibility, and make smarter career
              decisions with AI-powered recommendations, resume feedback,
              and skill gap analysis.
            </p>

            <div className="flex items-center gap-2 text-xs text-brand-400 font-medium">
              <Terminal className="w-4 h-4 shrink-0" />
              <span>
                Full-Stack Development & Machine Learning Project
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
              Explore Portal
            </h4>

            <ul className="space-y-3 text-sm">

              <li>
                <Link to="/" className="hover:text-white transition">
                  Home
                </Link>
              </li>

              <li>
                <Link to="/jobs" className="hover:text-white transition">
                  Browse Opportunities
                </Link>
              </li>

              <li>
                <Link to="/about" className="hover:text-white transition">
                  About Project
                </Link>
              </li>

              <li>
                <Link to="/login" className="hover:text-white transition">
                  Portal Login
                </Link>
              </li>

            </ul>
          </div>

          {/* User Portals */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
              User Portals
            </h4>

            <ul className="space-y-3 text-sm">

              <li>
                <Link
                  to="/register-student"
                  className="flex items-center gap-2 hover:text-white transition"
                >
                  <Users className="w-4 h-4 text-brand-400" />
                  Student Registration
                </Link>
              </li>

              <li>
                <Link
                  to="/register-recruiter"
                  className="flex items-center gap-2 hover:text-white transition"
                >
                  <Briefcase className="w-4 h-4 text-brand-400" />
                  Recruiter Registration
                </Link>
              </li>

              <li>
                <Link
                  to="/login"
                  className="flex items-center gap-2 hover:text-white transition"
                >
                  <ShieldCheck className="w-4 h-4 text-brand-400" />
                  Admin & Placement Cell
                </Link>
              </li>

              <li>
                <Link
                  to="/student/ml-assistant"
                  className="flex items-center gap-2 hover:text-white transition"
                >
                  <Sparkles className="w-4 h-4 text-brand-400" />
                  AI Career Assistant
                </Link>
              </li>

            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">

          <p className="text-center sm:text-left">
            © {new Date().getFullYear()} Campus Placement & Internship
            Management System. All rights reserved.
          </p>

          <p className="text-center flex items-center gap-1">
            Built with React, Node.js, Express, MongoDB & Python FastAPI
          </p>

        </div>

      </div>
    </footer>
  );
};

export default Footer;
