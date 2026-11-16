import React, { useState } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import api from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';

const ResumeUploader = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const { showSuccess, showError } = useNotification();
  const { user, updateUser } = useAuth();

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      if (selected.type !== 'application/pdf') {
        showError('Please select a valid PDF document (.pdf).');
        return;
      }
      if (selected.size > 5 * 1024 * 1024) {
        showError('File size exceeds 5MB limit.');
        return;
      }
      setFile(selected);
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      showError('Please choose a PDF file to upload.');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const res = await api.post('/student/upload-resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      showSuccess('Resume uploaded and parsed via PyPDF successfully!');
      setResult(res.data.resume);
      updateUser({
        resumePath: res.data.resume.path,
        resumeOriginalName: res.data.resume.originalName,
        skills: res.data.skills
      });

      if (onUploadSuccess) onUploadSuccess(res.data);
    } catch (err) {
      showError(err.message || 'Failed to upload resume.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-base font-bold text-slate-900">PDF Resume Management</h4>
          <p className="text-xs text-slate-500">
            Upload your PDF resume to power the ML Career Assistant, skill matching, and recruiter applications.
          </p>
        </div>
        {user?.resumePath && (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Resume Active
          </span>
        )}
      </div>

      {/* Upload Drop Zone */}
      <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-brand-300 transition-colors bg-slate-50/50">
        <input
          type="file"
          id="resume-file"
          accept=".pdf"
          onChange={handleFileChange}
          className="hidden"
        />
        <label htmlFor="resume-file" className="cursor-pointer flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">
              {file ? file.name : 'Click to select or drag and drop your resume'}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">PDF documents only (up to 5MB)</p>
          </div>
        </label>
      </div>

      {/* Action button */}
      {file && (
        <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
            <FileText className="w-4 h-4 text-brand-600" />
            <span>{file.name}</span>
            <span className="text-slate-400">({(file.size / 1024).toFixed(0)} KB)</span>
          </div>
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow-sm transition flex items-center gap-1.5 disabled:opacity-50"
          >
            {uploading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Parsing via NLP...
              </>
            ) : (
              'Upload & Analyze'
            )}
          </button>
        </div>
      )}

      {/* Extraction Diagnostics Result */}
      {result && (
        <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 text-xs space-y-2">
          <div className="flex items-center justify-between font-semibold text-indigo-950">
            <span>ML Parser Analysis</span>
            <span>{result.wordCount} words extracted</span>
          </div>

          {result.warning && (
            <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <span>{result.warning}</span>
            </div>
          )}

          {result.detectedSkills && result.detectedSkills.length > 0 && (
            <div>
              <p className="font-medium text-slate-700 mb-1.5">
                Technical Skills Detected in Resume:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {result.detectedSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md bg-white border border-indigo-200 text-indigo-700 font-medium capitalize"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResumeUploader;
