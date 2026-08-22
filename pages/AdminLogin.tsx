import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { Lock, ShieldCheck, ArrowRight, Eye, EyeOff, UserPlus } from 'lucide-react';
import { RequestAdminAccessModal } from '../components/RequestAdminAccessModal';

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await authService.login(email, password);
      // Ensure only admins and editors can login here
      if (user && (user.role === 'admin' || user.role === 'editor')) {
        login(user);
        navigate('/admindashboard');
      } else if (user) {
        setError('This portal is restricted to administrators and editorial staff.');
      } else {
        setError('Invalid admin credentials');
      }
    } catch (err: any) {
      setError(err?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-navy relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      {/* Abstract Background Design */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-brand-action rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#0052cc] rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center">
          <div className="w-20 h-20 bg-brand-action/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-brand-action/10 border border-brand-action/30">
            <ShieldCheck className="text-brand-action" size={40} />
          </div>
          <h2 className="text-3xl font-serif font-bold text-white tracking-tight">Admin Console</h2>
          <p className="mt-2 text-sm text-white/40 italic uppercase tracking-widest font-black">
             Goverance & Oversight Portal
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-md p-8 rounded-sm border border-white/10 shadow-2xl">
          <div className="mb-8">
             <h3 className="text-white font-bold mb-1">Web Admin Access</h3>
             <p className="text-xs text-white/50 leading-relaxed">
               Restricted portal for Academic Publishing administrative staff, section editors, and system architects.
             </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-brand-action">Email Address</label>
                <input
                  type="email"
                  required
                  className="bg-white/5 text-white px-4 py-3 border border-white/10 rounded-sm outline-none focus:border-brand-action focus:bg-white/10 transition-all text-sm"
                  placeholder="admin@academicpublishinggroup.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-brand-action">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="w-full bg-white/5 text-white pl-4 pr-12 py-3 border border-white/10 rounded-sm outline-none focus:border-brand-action focus:bg-white/10 transition-all text-sm"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    tabIndex={0}
                    onClick={() => setShowPassword(p => !p)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <div className="text-red-400 text-[10px] uppercase font-bold tracking-widest text-center animate-pulse">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-brand-action text-white font-bold rounded-sm uppercase tracking-widest text-xs hover:bg-white hover:text-brand-navy transition-all disabled:opacity-50 shadow-lg shadow-brand-action/20 flex items-center justify-center gap-2"
            >
              {loading ? 'Verifying Identity...' : (
                <>
                  Authenticate <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 flex flex-col gap-3 text-center">
             <button
               type="button"
               onClick={() => setShowRequestModal(true)}
               className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-sm uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2 border border-white/10"
             >
               <UserPlus size={14} className="text-brand-action" /> Request Admin Access
             </button>

             <Link to="/login" className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors mt-2">
               Return to Researcher Login
             </Link>
          </div>
        </div>

        <div className="text-center text-white/20 text-[10px] uppercase tracking-widest font-bold">
          © 2026 Academic Publishing Security Group
        </div>
      </div>

      {/* Admin Access Request Modal */}
      <RequestAdminAccessModal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        defaultEmail={email}
      />
    </div>
  );
};
