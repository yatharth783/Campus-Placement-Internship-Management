import React from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import {
  GraduationCap,
  Sparkles,
  ShieldCheck,
  Building2,
  Server,
  Cpu,
  Layers,
  Code2,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar />

      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            University Placement Platform Architecture
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            About CampusConnect
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            CampusConnect is an end-to-end college placement and internship management platform engineered with modern full-stack best practices, role-based authorization, and an integrated Python FastAPI machine learning microservice.
          </p>
        </div>

        {/* Architecture Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <Code2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Modern Frontend</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Built with <strong>React.js</strong>, <strong>Vite</strong>, and <strong>Tailwind CSS</strong>. Provides SPA routing, responsive desktop/mobile dashboards, interactive Recharts visualizations, and modal dialogues. Vercel-ready with client-side rewrites.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-navy-50 text-navy-800 flex items-center justify-center">
              <Server className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">REST API Backend</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Powered by <strong>Node.js</strong> and <strong>Express.js</strong> with <strong>MongoDB Mongoose</strong> schemas. Implements bcrypt password hashing, JWT bearer tokens, role authorization middleware, multer PDF validation, and automated data seeding. Render-ready.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">ML Career Microservice</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Standalone <strong>Python FastAPI</strong> service utilizing <strong>PyPDF</strong> for text extraction, <strong>scikit-learn</strong> TF-IDF vectorization, cosine similarity ranking, NLP skill gap detection, and rule-based resume quality auditing.
            </p>
          </div>
        </div>

        {/* ML Engine Capabilities */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900">ML-Powered Career Assistant Features</h2>
            <p className="text-xs text-slate-500">
              Deterministic, explainable open-source NLP methods without third-party paid API dependencies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                1. TF-IDF Cosine Similarity Job Matching
              </h4>
              <p className="leading-relaxed">
                Transforms uploaded resume text and student skills into TF-IDF vector spaces alongside active recruiter postings. Calculates cosine similarity angles to rank top-aligned jobs with transparent keyword contribution logs.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                2. Automated Skill Gap Analysis
              </h4>
              <p className="leading-relaxed">
                Cross-references technical requirements with student resume extractions. Clearly distinguishes confirmed skills from missing technologies and returns structured learning recommendations.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                3. PyPDF Document Parsing & Extraction
              </h4>
              <p className="leading-relaxed">
                Extracts unformatted text directly from uploaded PDF resumes. Performs token-level regex normalizations against a dictionary of 100+ industry technologies without sending data to third parties.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                4. Objective Resume Feedback Engine
              </h4>
              <p className="leading-relaxed">
                Audits resume text for action verb usage, word density, keyword matching against target job openings, and section coverage, generating constructive suggestions.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-brand-900 to-navy-900 text-white text-center space-y-4">
          <h2 className="text-2xl font-extrabold">Ready to explore CampusConnect?</h2>
          <p className="text-xs text-brand-200 max-w-md mx-auto">
            Experience the placement platform as a Student, Corporate Recruiter, or Placement Officer.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link
              to="/jobs"
              className="px-5 py-2.5 rounded-xl bg-white text-navy-900 text-xs font-bold hover:bg-brand-50 transition"
            >
              Browse Open Jobs
            </Link>
            <Link
              to="/login"
              className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md transition"
            >
              Sign In to Portal
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
