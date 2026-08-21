import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { MockService } from '../services/mockDb';
import { Lock, Eye, EyeOff, ShieldCheck, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [tokenEmail, setTokenEmail] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fn = async () => {
      if (!token) {
        setError('Security link missing. Please request a new recovery protocol.');
        setIsLoading(false);
        return;
      }
      try {
        const email = await MockService.verifyResetToken(token);
        if (email) {
          setTokenEmail(email);
        } else {
          setError('Security validation failed. This token has expired or is invalid.');
        }
      } catch (err) {
        setError('System timing out. Please restart the recovery cycle.');
      } finally {
        setIsLoading(false);
      }
    };
    fn();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setError(null);

    // Standard Validation
    if (password.length < 8) {
      setError('Password must be at least 8 characters for standard scholastic security.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      const ok = await MockService.resetPassword(token, password);
      if (ok) {
        setIsDone(true);
      } else {
        setError('Action expired. Please re-initiate password retrieval.');
      }
    } catch (err) {
      setError('Security storage error. Reset aborted.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#222222] flex items-center justify-center py-24 px-6 relative overflow-hidden">
      {/* Background diagonal effect */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 to-transparent transform -skew-y-12 origin-top-left"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-[#1a1a1a] p-10 rounded-sm border border-white/5 shadow-2xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-serif font-black tracking-tighter text-white mb-2">
              ACADEMIC<span className="text-brand-action">.</span>
            </h1>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-action">
              Security Node Retrieval
            </p>
          </div>

          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-4 text-center">
              <Loader2 size={36} className="animate-spin text-brand-action" />
              <p className="text-xs text-gray-400 font-mono">Running cryptographic verification...</p>
            </div>
          ) : error ? (
            <div className="space-y-6">
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold rounded-sm flex items-start gap-3">
                <AlertCircle size={20} className="shrink-0 mt-0.5" />
                <div>
                  <h4 className="uppercase tracking-wider font-extrabold mb-1 text-[10px]">Verification Error</h4>
                  <p className="text-gray-300 font-normal">{error}</p>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <Link
                  to="/forgot-password"
                  className="w-full py-4 text-center bg-brand-action text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-sm hover:opacity-90 transition-all shadow-lg"
                >
                  Initiate New Protocol
                </Link>
                <Link
                  to="/login"
                  className="w-full py-4 text-center bg-[#111111] border border-white/10 text-gray-400 hover:text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-sm transition-all"
                >
                  Back to Portal
                </Link>
              </div>
            </div>
          ) : isDone ? (
            <div className="space-y-6 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 size={32} />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-bold text-white mb-2">Credentials Restored</h3>
                <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto mb-6">
                  Your new hashed password is now securely stored in our encrypted active registry for node <span className="text-white font-semibold">{tokenEmail}</span>.
                </p>
              </div>
              <Link
                to="/login"
                className="w-full py-4 bg-gradient-to-b from-[#ffb347] to-[#ff8c00] text-[#222222] text-[10px] font-black uppercase tracking-[0.2em] rounded-sm hover:from-[#ffc168] hover:to-[#ffa033] transition-all shadow-xl block text-center"
              >
                Return to Entry Portal
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-300">
              <div className="p-4 bg-white/5 border border-white/10 rounded-sm">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-1">Target Account Node</p>
                <p className="text-sm font-black text-brand-action font-mono break-all">{tokenEmail}</p>
              </div>

              {/* Password */}
              <div className="space-y-1 text-left relative">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#ff8c00]">New Security Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 text-gray-500" size={16} />
                  <input
                    required
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min. 8 characters"
                    className="w-full bg-[#111111] text-white pl-12 pr-12 py-3 border border-white/5 rounded-sm outline-none placeholder-gray-600 text-sm focus:border-brand-action transition-all"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    tabIndex={0}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    onClick={() => setShowPassword(prev => !prev)}
                    className="absolute right-4 top-3 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1 text-left relative">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#ff8c00]">Verify Security Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 text-gray-500" size={16} />
                  <input
                    required
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Repeat password"
                    className="w-full bg-[#111111] text-white pl-12 pr-12 py-3 border border-white/5 rounded-sm outline-none placeholder-gray-600 text-sm focus:border-brand-action transition-all"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    tabIndex={0}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    onClick={() => setShowConfirmPassword(prev => !prev)}
                    className="absolute right-4 top-3 text-gray-400 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-gradient-to-b from-[#ffb347] to-[#ff8c00] text-[#222222] text-[10px] font-black uppercase tracking-[0.2em] rounded-sm hover:from-[#ffc168] hover:to-[#ffa033] active:scale-[0.98] transition-all disabled:opacity-50 shadow-[0_10px_20px_rgba(255,140,0,0.15)] flex items-center justify-center gap-3"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Completing Safe Reset...
                  </>
                ) : (
                  <>
                    <ShieldCheck size={16} /> Establish New Credentials
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
