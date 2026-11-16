import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import api from '../../services/api';
import { CheckCircle2, XCircle, AlertTriangle, Building, Briefcase } from 'lucide-react';

const EligibilityModal = ({ isOpen, onClose, job, onApply }) => {
  const [eligibility, setEligibility] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && job) {
      setLoading(true);
      api
        .get(`/jobs/${job._id}/check-eligibility`)
        .then((res) => {
          setEligibility(res.data);
          setLoading(false);
        })
        .catch((err) => {
          setEligibility({
            isEligible: false,
            reasons: [err.message || 'Could not verify eligibility.']
          });
          setLoading(false);
        });
    }
  }, [isOpen, job]);

  if (!job) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Recruiter Eligibility Verification">
      <div className="space-y-5">
        {/* Job Header Summary */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <h4 className="text-base font-bold text-slate-900">{job.title}</h4>
          <p className="text-xs text-slate-500 mt-0.5">
            {job.companyId?.companyName} • {job.location}
          </p>
        </div>

        {loading ? (
          <div className="py-8 flex flex-col items-center justify-center gap-2">
            <div className="w-8 h-8 border-3 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
            <p className="text-xs text-slate-500 font-medium">Evaluating criteria against student profile...</p>
          </div>
        ) : (
          <>
            {/* Overall Status Banner */}
            <div
              className={`p-4 rounded-xl border flex items-center gap-3 ${
                eligibility?.isEligible
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}
            >
              {eligibility?.isEligible ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
              ) : (
                <XCircle className="w-6 h-6 text-rose-600 flex-shrink-0" />
              )}
              <div>
                <p className="text-sm font-bold">
                  {eligibility?.isEligible
                    ? 'Eligible to Apply'
                    : 'Eligibility Criteria Requirement Mismatch'}
                </p>
                <p className="text-xs opacity-90 mt-0.5">
                  {eligibility?.isEligible
                    ? 'Your academic profile satisfies all recruiter-specified conditions.'
                    : 'Your profile does not meet one or more mandatory recruiter constraints.'}
                </p>
              </div>
            </div>

            {/* Checklist breakdown */}
            <div className="space-y-2">
              <h5 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Recruiter Criteria Breakdown
              </h5>
              <div className="space-y-1.5">
                {eligibility?.reasons?.map((reason, idx) => {
                  const isSuccess =
                    reason.toLowerCase().includes('met') ||
                    reason.toLowerCase().includes('eligible') ||
                    reason.toLowerCase().includes('satisfied');
                  return (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-start gap-2.5 text-xs"
                    >
                      {isSuccess ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                      )}
                      <span className="text-slate-800 font-medium">{reason}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
              >
                Close
              </button>
              {eligibility?.isEligible && onApply && (
                <button
                  onClick={() => {
                    onClose();
                    onApply(job);
                  }}
                  className="px-5 py-2 text-xs font-semibold rounded-lg bg-brand-600 hover:bg-brand-700 text-white shadow-sm transition"
                >
                  Proceed with Application
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default EligibilityModal;
