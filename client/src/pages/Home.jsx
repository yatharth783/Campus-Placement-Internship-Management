
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

import {
  GraduationCap,
  Briefcase,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Search,
  CheckCircle2,
  FileText,
  Users,
  Building2,
  Target,
  BrainCircuit,
  TrendingUp,
  Zap,
  ClipboardCheck,
  BarChart3,
  Rocket,
  ChevronRight
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated, role } = useAuth();

  const getDashboardPath = () => {
    if (role === 'admin') return '/admin/dashboard';
    if (role === 'recruiter') return '/recruiter/dashboard';
    return '/student/dashboard';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-slate-50 py-16 sm:py-24 border-b border-slate-200">

        <div className="absolute top-10 right-0 w-72 h-72 bg-brand-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-200/20 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-14 items-center">

            <div className="lg:col-span-7 space-y-7 text-center lg:text-left">

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Campus Placement & Internship Management
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Campus Placement &
                <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-indigo-600 to-indigo-800">
                  Internship Management
                </span>
                <span className="block text-2xl sm:text-3xl mt-4 text-slate-700">
                  Connecting Talent With Opportunities.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                A centralized platform designed to simplify campus placements
                and internship management. It connects students, recruiters,
                and placement administrators to discover opportunities,
                manage applications, evaluate eligibility, and streamline
                the recruitment process. With AI-powered job recommendations,
                skill gap analysis, and resume feedback, the platform helps
                students make informed career decisions.
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">

                {isAuthenticated ? (
                  <Link
                    to={getDashboardPath()}
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-lg transition-all hover:-translate-y-1"
                  >
                    Go to Dashboard
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/register-student"
                      className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-lg transition-all hover:-translate-y-1"
                    >
                      <GraduationCap className="w-4 h-4" />
                      Register as Student
                      <ArrowRight className="w-4 h-4" />
                    </Link>

                    <Link
                      to="/register-recruiter"
                      className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm border border-slate-300 transition"
                    >
                      <Building2 className="w-4 h-4" />
                      Register as Recruiter
                    </Link>
                  </>
                )}

                <Link
                  to="/jobs"
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-brand-700 font-semibold text-sm border border-brand-200 transition"
                >
                  <Search className="w-4 h-4" />
                  Explore Opportunities
                </Link>

              </div>

              <div className="pt-5 flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-3 text-xs text-slate-600 font-medium">

                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  AI-Powered Recommendations
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Jobs & Internships
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Application Tracking
                </div>

              </div>
            </div>

            {/* AI CAREER PREVIEW */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl shadow-indigo-900/10 border border-slate-200 space-y-5">

                <div className="flex items-center justify-between pb-5 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-brand-600">
                      <BrainCircuit className="w-6 h-6" />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        AI Career Assistant
                      </p>
                      <p className="text-xs text-slate-500">
                        Intelligent Career Support
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    AI Enabled
                  </span>
                </div>

                <div className="space-y-3">

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800">
                        Software Developer
                      </span>
                      <span className="font-semibold text-brand-600">
                        Job Match
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {['React', 'Node.js', 'MongoDB', 'Express'].map(skill => (
                        <span key={skill} className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-[10px] font-semibold">
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-500">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Relevant skills identified
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800">
                        Machine Learning Internship
                      </span>
                      <span className="font-semibold text-emerald-600">
                        Skill Match
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {['Python', 'Machine Learning', 'NLP', 'SQL'].map(skill => (
                        <span key={skill} className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-[10px] font-semibold">
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-500">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Skills compared with requirements
                    </div>
                  </div>

                </div>

                <div className="pt-3 flex items-center justify-between border-t border-slate-100">
                  <div>
                    <p className="text-xs font-semibold text-slate-800">
                      Build Your Career Profile
                    </p>
                    <p className="text-[10px] text-slate-500 mt-1">
                      Find opportunities matching your skills
                    </p>
                  </div>

                  <Link
                    to={isAuthenticated ? '/student/ml-assistant' : '/register-student'}
                    className="text-brand-600 font-bold text-xs hover:underline whitespace-nowrap"
                  >
                    Explore AI <ArrowRight className="w-3 h-3 inline" />
                  </Link>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* PLATFORM HIGHLIGHTS */}
      <section className="bg-slate-900 text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

            {[
              { icon: BrainCircuit, title: 'AI Powered', subtitle: 'Intelligent career assistance' },
              { icon: Briefcase, title: 'Opportunities', subtitle: 'Jobs and internships' },
              { icon: Users, title: 'Connected', subtitle: 'Students and recruiters' },
              { icon: TrendingUp, title: 'Career Growth', subtitle: 'Placement insights' }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="text-center space-y-2">
                  <Icon className="w-7 h-7 text-brand-400 mx-auto" />
                  <h3 className="text-sm sm:text-base font-bold">{item.title}</h3>
                  <p className="text-xs text-slate-400">{item.subtitle}</p>
                </div>
              );
            })}

          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-600">
              Simple. Smart. Connected.
            </p>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3">
              From Campus to Career in Three Steps
            </h2>

            <p className="text-slate-600 text-sm mt-4 leading-relaxed">
              A structured process that helps students discover opportunities,
              recruiters find suitable candidates, and placement teams
              coordinate recruitment activities.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                number: '01',
                icon: FileText,
                title: 'Create Your Profile',
                description: 'Register, add academic details and skills, and upload your professional resume.'
              },
              {
                number: '02',
                icon: Target,
                title: 'Find Opportunities',
                description: 'Explore jobs and internships, review eligibility criteria, and discover suitable opportunities.'
              },
              {
                number: '03',
                icon: Rocket,
                title: 'Apply & Track',
                description: 'Submit applications, track recruitment progress, and prepare for your career.'
              }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="relative p-7 rounded-3xl bg-slate-50 border border-slate-200 hover:border-brand-300 hover:shadow-xl transition-all">

                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-700 flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-3xl font-black text-slate-200">{item.number}</span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                  <p className="text-sm text-slate-600 mt-3 leading-relaxed">{item.description}</p>

                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* USER PORTALS */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-3xl mx-auto mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-600">
              One Platform. Three User Roles.
            </p>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3">
              Designed for Every Placement Stakeholder
            </h2>

            <p className="text-slate-600 text-sm mt-4 leading-relaxed">
              A centralized recruitment management solution for students,
              recruiters, and placement administrators.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">

            {/* STUDENT */}
            <div className="p-8 rounded-3xl bg-white border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-6">
                  <GraduationCap className="w-7 h-7" />
                </div>

                <span className="text-xs font-bold uppercase tracking-wider text-brand-600">For Students</span>

                <h3 className="text-xl font-extrabold text-slate-900 mt-2">
                  Discover Your Next Opportunity
                </h3>

                <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                  Create your profile, upload resumes, explore jobs and
                  internships, analyze skill gaps, and track applications.
                </p>

                <ul className="mt-5 space-y-3 text-xs text-slate-600">
                  {[
                    'AI-Based Job Recommendations',
                    'Resume Feedback',
                    'Academic Eligibility Checks',
                    'Application Tracking'
                  ].map(item => (
                    <li key={item} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-5 border-t border-slate-100">
                <Link to="/register-student" className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm transition">
                  Register as Student <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* RECRUITER */}
            <div className="p-8 rounded-3xl bg-white border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-violet-100 text-violet-700 flex items-center justify-center mb-6">
                  <Building2 className="w-7 h-7" />
                </div>

                <span className="text-xs font-bold uppercase tracking-wider text-violet-600">For Recruiters</span>

                <h3 className="text-xl font-extrabold text-slate-900 mt-2">
                  Connect With Skilled Candidates
                </h3>

                <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                  Publish job and internship opportunities, define eligibility
                  criteria, review applications, and manage candidates.
                </p>

                <ul className="mt-5 space-y-3 text-xs text-slate-600">
                  {[
                    'Create Job & Internship Openings',
                    'Review Candidate Resumes',
                    'Define Eligibility Criteria',
                    'Manage Applicants'
                  ].map(item => (
                    <li key={item} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-5 border-t border-slate-100">
                <Link to="/register-recruiter" className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition">
                  Register as Recruiter <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* ADMIN */}
            <div className="p-8 rounded-3xl bg-white border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-6">
                  <ShieldCheck className="w-7 h-7" />
                </div>

                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">For Placement Teams</span>

                <h3 className="text-xl font-extrabold text-slate-900 mt-2">
                  Manage Campus Recruitment
                </h3>

                <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                  Manage users, monitor job postings, oversee placement
                  activities, and review centralized placement insights.
                </p>

                <ul className="mt-5 space-y-3 text-xs text-slate-600">
                  {[
                    'Student & Recruiter Management',
                    'Job Moderation',
                    'Placement Analytics',
                    'Recruitment Monitoring'
                  ].map(item => (
                    <li key={item} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-5 border-t border-slate-100">
                <Link to="/admin/login" className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-sm transition">
                  Access Admin Portal <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* AI FEATURES */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid lg:grid-cols-2 gap-14 items-center">

            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-brand-600">
                Intelligent Career Assistance
              </p>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 leading-tight">
                Smarter Recruitment.
                <span className="block text-brand-600">Better Career Decisions.</span>
              </h2>

              <p className="text-sm text-slate-600 mt-5 leading-relaxed">
                The platform integrates machine learning capabilities
                with recruitment workflows to help students understand
                their skills, improve resumes, and identify relevant
                job and internship opportunities.
              </p>

              <Link
                to={isAuthenticated ? '/student/ml-assistant' : '/register-student'}
                className="inline-flex items-center gap-2 mt-7 px-5 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm transition"
              >
                Explore AI Career Assistant
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  icon: BrainCircuit,
                  title: 'AI Job Recommendations',
                  description: 'Identify relevant opportunities based on student skills and job requirements.'
                },
                {
                  icon: FileText,
                  title: 'Resume Feedback',
                  description: 'Analyze resume information and provide actionable improvement suggestions.'
                },
                {
                  icon: ClipboardCheck,
                  title: 'Skill Gap Analysis',
                  description: 'Identify missing skills and understand areas for improvement.'
                },
                {
                  icon: BarChart3,
                  title: 'Placement Analytics',
                  description: 'Monitor applications, recruitment activity, and placement progress.'
                }
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-brand-300 hover:shadow-md transition">
                    <div className="w-11 h-11 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">{item.description}</p>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 bg-gradient-to-br from-indigo-700 via-brand-700 to-indigo-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">

          <div className="w-14 h-14 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center mx-auto mb-6">
            <Zap className="w-7 h-7 text-yellow-300" />
          </div>

          <p className="text-xs font-bold uppercase tracking-widest text-indigo-200">
            Your Career Journey Starts Here
          </p>

          <h2 className="text-3xl sm:text-5xl font-extrabold mt-4 leading-tight">
            Take the Next Step Towards Your Career.
          </h2>

          <p className="text-sm sm:text-base text-indigo-100 mt-5 max-w-2xl mx-auto leading-relaxed">
            Explore campus placement drives, discover internships,
            connect with recruiters, and manage your recruitment journey
            through one integrated platform.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">

            <Link
              to={isAuthenticated ? getDashboardPath() : '/register-student'}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-brand-700 hover:bg-indigo-50 font-bold text-sm transition shadow-lg"
            >
              {isAuthenticated ? 'Open Dashboard' : 'Get Started'}
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/jobs"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 border border-white/30 hover:bg-white/20 text-white font-bold text-sm transition"
            >
              Explore Opportunities
              <ChevronRight className="w-4 h-4" />
            </Link>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
