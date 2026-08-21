import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, ShieldCheck, CheckCircle2, Loader2, AlertCircle, Inbox, ExternalLink } from 'lucide-react';
import { MockService } from '../services/mockDb';

export const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await MockService.requestPasswordReset(email);
      if (response.success && response.token) {
        setResetToken(response.token);
        setIsSent(true);
      } else {
        setError('Cryptographic search failed: This email address is not affiliated with an active research node.');
      }
    } catch (err) {
      setError('An error occurred while processing your request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-24 px-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-action/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-navy/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white p-10 rounded-sm shadow-2xl border border-slate-100">
          <div className="mb-10 text-center">
            <Link to="/" className="inline-block mb-8">
              <h1 className="text-2xl font-serif font-black tracking-tighter text-brand-navy">
                ACADEMIC<span className="text-brand-action">.</span>
              </h1>
            </Link>
            
            {isSent ? (
              <div className="animate-in zoom-in duration-500 text-left">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={32} />
                </div>
                <h2 className="text-2xl font-serif font-black text-brand-navy mb-3 text-center">Recovery Dispatch Sent</h2>
                <p className="text-slate-500 text-sm leading-relaxed mb-6 text-center">
                  We have dispatched a secure reset link to <strong className="text-brand-navy font-mono text-xs">{email}</strong>. Check your school inbox or interact with the secure sandbox console below:
                </p>

                {/* Simulated University Mail Delivery Interceptor Panel */}
                <div className="bg-slate-900 text-white rounded-sm p-5 border border-slate-800 shadow-lg font-mono text-xs space-y-3 relative overflow-hidden animate-in slide-in-from-bottom duration-500">
                  <div className="absolute top-0 right-0 bg-brand-action/20 text-brand-action text-[8px] font-bold uppercase tracking-widest px-2 py-1 select-none border-l border-b border-brand-action/30">
                    SMTP SIMULATOR
                  </div>
                  <div className="border-b border-slate-800 pb-3 space-y-1 text-[11px] text-slate-400">
                    <div><span className="text-slate-500">FROM:</span> academicpublishinggroup.org</div>
                    <div><span className="text-slate-500">TO:</span> {email}</div>
                    <div><span className="text-slate-500">SUBJ:</span> Access Node Recovery Protocol #AJP-{resetToken?.substring(4, 9).toUpperCase()}</div>
                  </div>
                  <div className="py-2 text-slate-300 leading-relaxed space-y-3">
                    <p>Estimable Researcher,</p>
                    <p>A secure reset request has been received for your Academic Journal account. Use the tokenized URL below to establish fresh credentials: </p>
                    <div className="bg-[#111111] p-3 rounded-sm border border-slate-800 break-all text-[10px] text-slate-400 select-all font-semibold">
                      http://academicjp.com/#/reset-password?token={resetToken}
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-800">
                    <Link
                      to={`/reset-password?token=${resetToken}`}
                      className="w-full flex items-center justify-center gap-2 bg-brand-action hover:bg-brand-action/90 text-white text-[10px] font-black uppercase tracking-widest py-3 rounded-sm font-sans transition-all text-center"
                    >
                      Open Reset Shield <ExternalLink size={12} />
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="animate-in fade-in duration-500">
                <h2 className="text-2xl font-serif font-black text-brand-navy mb-3">Restore Access</h2>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Enter your registered research email to receive a secure password recovery protocol.
                </p>
              </div>
            )}
          </div>

          {!isSent ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold rounded-sm flex items-center gap-3">
                  <AlertCircle size={16} /> {error}
                </div>
              )}

              <div className="space-y-1 text-left">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Institutional Email</label>
                <div className="relative group">
                  <Mail className="absolute left-0 top-3 text-slate-300 group-focus-within:text-brand-action transition-colors" size={16} />
                  <input 
                    required
                    type="email" 
                    placeholder="name@university.edu"
                    className="w-full border-b border-slate-200 pl-8 py-3 outline-none focus:border-brand-action transition-colors text-sm font-bold bg-transparent"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-brand-navy text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-sm hover:bg-brand-action transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <ShieldCheck size={16} />
                )}
                Initiate Recovery
              </button>

              <Link 
                to="/login" 
                className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-brand-navy transition-all pt-4"
              >
                <ArrowLeft size={14} /> Back to Entry Portal
              </Link>
            </form>
          ) : (
            <div className="space-y-4 mt-8">
              <button 
                onClick={() => setIsSent(false)}
                className="w-full py-4 bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-sm hover:bg-slate-100 transition-all"
              >
                Try different email
              </button>
              <Link 
                to="/login" 
                className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-brand-action hover:underline pt-4"
              >
                Return to Login
              </Link>
            </div>
          )}
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">
            Secure Encryption: AES-256 Protocol Active
          </p>
        </div>
      </div>
    </div>
  );
};
