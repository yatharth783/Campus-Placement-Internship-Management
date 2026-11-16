import React from 'react';
import { Building2, MapPin, IndianRupee, Calendar, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';
import Badge from '../common/Badge';

const JobCard = ({ job, onApply, onCheckEligibility, onSkillGap, isApplied = false }) => {
  const companyName = job.companyId?.companyName || 'Verified Recruiter';
  const location = job.location || 'Multiple Locations';
  const deadline = job.applicationDeadline
    ? new Date(job.applicationDeadline).toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : 'Open';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md hover:border-brand-200 transition-all flex flex-col justify-between">
      <div>
        {/* Top Company & Type Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-navy-50 border border-navy-100 flex items-center justify-center text-navy-800 font-bold text-lg">
              {companyName[0]}
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900 leading-snug hover:text-brand-600 transition">
                {job.title}
              </h4>
              <p className="text-xs font-medium text-slate-500 flex items-center gap-1 mt-0.5">
                <Building2 className="w-3.5 h-3.5" />
                {companyName}
              </p>
            </div>
          </div>
          <Badge variant={job.jobType === 'Internship' ? 'indigo' : 'primary'}>
            {job.jobType}
          </Badge>
        </div>

        {/* Key Job Metadata */}
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span className="truncate">{location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-semibold text-slate-800 truncate">{job.salary}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Deadline: {deadline}</span>
          </div>
          {job.minimumCGPA > 0 && (
            <div className="flex items-center gap-1.5 text-amber-700 font-medium">
              <span>Min CGPA: {job.minimumCGPA.toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* Required Skills Chips */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {job.requiredSkills?.slice(0, 4).map((skill, idx) => (
            <span
              key={idx}
              className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 capitalize"
            >
              {skill}
            </span>
          ))}
          {job.requiredSkills?.length > 4 && (
            <span className="text-[11px] text-slate-400 font-medium px-1.5 py-0.5">
              +{job.requiredSkills.length - 4} more
            </span>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {onCheckEligibility && (
            <button
              onClick={() => onCheckEligibility(job)}
              className="text-xs font-semibold text-slate-600 hover:text-brand-700 hover:bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200 transition"
            >
              Check Criteria
            </button>
          )}
          {onSkillGap && (
            <button
              onClick={() => onSkillGap(job)}
              className="text-xs font-semibold text-brand-700 hover:bg-brand-50 px-2.5 py-1.5 rounded-lg border border-brand-200 transition flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Skill Gap
            </button>
          )}
        </div>

        {isApplied ? (
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Applied
          </span>
        ) : (
          <button
            onClick={() => onApply(job)}
            className="text-xs font-semibold px-4 py-1.5 rounded-lg bg-navy-800 hover:bg-navy-900 text-white shadow-sm transition flex items-center gap-1"
          >
            Apply Now
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default JobCard;
