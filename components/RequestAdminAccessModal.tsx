import React, { useState } from 'react';
import { ShieldCheck, X, CheckCircle2, UserCheck, Building, Mail, FileText, Send } from 'lucide-react';
import { MockService } from '../services/mockDb';

interface RequestAdminAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultEmail?: string;
  defaultName?: string;
}

export const RequestAdminAccessModal: React.FC<RequestAdminAccessModalProps> = ({
  isOpen,
  onClose,
  defaultEmail = '',
  defaultName = ''
}) => {
  const [fullName, setFullName] = useState(defaultName);
  const [email, setEmail] = useState(defaultEmail);
  const [institution, setInstitution] = useState('');
  const [department, setDepartment] = useState('');
  const [requestedRole, setRequestedRole] = useState<'admin' | 'editor' | 'reviewer' | 'finance_admin'>('editor');
  const [orcidId, setOrcidId] = useState('');
  const [justification, setJustification] = useState('');
  const [loading, setLoading] = useState(false);
  const [submittedRequestId, setSubmittedRequestId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const created = await MockService.createAdminAccessRequest({
        fullName,
        email,
        institution,
        department,
        requestedRole,
        orcidId,
        justification
      });
      setSubmittedRequestId(created.id);
    } catch (err) {
      console.error('Failed to submit admin access request:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmittedRequestId(null);
    setJustification('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-md shadow-2xl max-w-xl w-full border border-gray-100 overflow-hidden relative">
        {/* Modal Header */}
        <div className="bg-brand-navy p-6 text-white flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-action/20 rounded-full flex items-center justify-center border border-brand-action/40">
              <ShieldCheck className="text-brand-action" size={22} />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-white">Request Admin Access</h3>
              <p className="text-[10px] text-white/50 uppercase tracking-widest font-black">
                Governance & Staff Privilege Portal
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {submittedRequestId ? (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 size={36} />
            </div>
            <div className="space-y-2">
              <h4 className="font-serif font-bold text-2xl text-brand-navy">Request Submitted Successfully</h4>
              <p className="text-xs text-brand-navy/60 max-w-md mx-auto leading-relaxed">
                Your request for administrative rights has been logged under reference{' '}
                <span className="font-mono font-bold text-brand-action bg-brand-action/10 px-2 py-0.5 rounded">{submittedRequestId}</span>.
                The Governance Committee will review your credentials and notify you via email.
              </p>
            </div>
            <div className="bg-gray-50 border border-gray-100 p-4 rounded-sm text-left text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-gray-400 font-bold uppercase text-[10px]">Applicant:</span>
                <span className="font-semibold text-brand-navy">{fullName} ({email})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-bold uppercase text-[10px]">Requested Role:</span>
                <span className="font-semibold text-brand-action uppercase">{requestedRole}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-bold uppercase text-[10px]">Institution:</span>
                <span className="font-semibold text-brand-navy">{institution}</span>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="w-full py-3.5 bg-brand-navy text-white text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-brand-action transition-all shadow-lg"
            >
              Done & Return
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Submit your institutional credentials and operational rationale to apply for section editor, managing editor, or administrative oversight permissions.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-700 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="Dr. Alexander Vance"
                    className="w-full border border-gray-300 rounded-sm px-3 py-2 text-xs outline-none focus:border-brand-action focus:ring-1 focus:ring-brand-action"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-700 mb-1">
                  Institutional Email *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="a.vance@university.edu"
                    className="w-full border border-gray-300 rounded-sm px-3 py-2 text-xs outline-none focus:border-brand-action focus:ring-1 focus:ring-brand-action"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-700 mb-1">
                  Institution / University *
                </label>
                <input
                  type="text"
                  required
                  value={institution}
                  onChange={e => setInstitution(e.target.value)}
                  placeholder="e.g. University of Cambridge"
                  className="w-full border border-gray-300 rounded-sm px-3 py-2 text-xs outline-none focus:border-brand-action focus:ring-1 focus:ring-brand-action"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-700 mb-1">
                  Department / Faculty
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={e => setDepartment(e.target.value)}
                  placeholder="e.g. Department of Physics"
                  className="w-full border border-gray-300 rounded-sm px-3 py-2 text-xs outline-none focus:border-brand-action focus:ring-1 focus:ring-brand-action"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-700 mb-1">
                  Requested Role *
                </label>
                <select
                  value={requestedRole}
                  onChange={e => setRequestedRole(e.target.value as any)}
                  className="w-full border border-gray-300 rounded-sm px-3 py-2 text-xs outline-none focus:border-brand-action focus:ring-1 focus:ring-brand-action bg-white"
                >
                  <option value="editor">Section Editor / Managing Editor</option>
                  <option value="admin">System Administrator</option>
                  <option value="finance_admin">Finance & Billing Manager</option>
                  <option value="reviewer">Peer Review Coordinator</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-700 mb-1">
                  ORCID iD / Profile Link (Optional)
                </label>
                <input
                  type="text"
                  value={orcidId}
                  onChange={e => setOrcidId(e.target.value)}
                  placeholder="0000-0002-1827-3645"
                  className="w-full border border-gray-300 rounded-sm px-3 py-2 text-xs outline-none focus:border-brand-action focus:ring-1 focus:ring-brand-action"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-700 mb-1">
                Justification & Scope of Work *
              </label>
              <textarea
                required
                rows={3}
                value={justification}
                onChange={e => setJustification(e.target.value)}
                placeholder="Explain why you require administrative access (e.g. appointed lead editor for Journal of Quantum Computing, managing manuscript reviews)."
                className="w-full border border-gray-300 rounded-sm px-3 py-2 text-xs outline-none focus:border-brand-action focus:ring-1 focus:ring-brand-action"
              ></textarea>
            </div>

            <div className="pt-3 flex items-center justify-end gap-3 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs text-slate-600 hover:bg-gray-100 rounded-sm transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-brand-action text-white text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-brand-navy transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? 'Submitting Request...' : (
                  <>
                    Submit Request <Send size={14} />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
