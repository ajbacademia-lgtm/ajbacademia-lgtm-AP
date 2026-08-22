import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { MockService } from '../services/mockDb';
import { User, Lock, Check, ShieldCheck, Eye, EyeOff } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const cleanEmail = email.trim();
      const cleanPassword = password.trim();
      const user = await authService.login(cleanEmail, cleanPassword);
      if (user) {
        login(user);
        if (user.role === 'admin' || user.role === 'editor') {
          navigate('/admindashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError('Invalid email or password');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      const user = await authService.loginWithGoogle();
      if (user) {
        login(user);
        if (user.role === 'admin' || user.role === 'editor') {
          navigate('/admindashboard');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      setError(err.message || 'Google Sign-In failed');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#222222] relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      {/* Background diagonal effect */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 to-transparent transform -skew-y-12 origin-top-left"></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-serif font-bold text-white tracking-tight">Sign In</h2>
          <p className="mt-2 text-sm text-gray-400 italic">
             Access your researcher dashboard or editorial panel
          </p>
        </div>

        <div className="bg-[#1a1a1a] p-8 rounded-sm border border-white/5 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-brand-action">Email Address</label>
                <input
                  type="email"
                  required
                  className="bg-[#111111] text-white px-5 py-3 border border-white/5 rounded-sm outline-none placeholder-gray-600 text-sm focus:border-brand-action transition-all"
                  placeholder="Email Address"
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
                    className="w-full bg-[#111111] text-white pl-5 pr-12 py-3 border border-white/5 rounded-sm outline-none placeholder-gray-600 text-sm focus:border-brand-action transition-all"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    tabIndex={0}
                    onClick={() => setShowPassword(p => !p)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-white/10 bg-[#111111] checked:bg-brand-action"
                />
                <span className="text-[11px] text-gray-400 group-hover:text-white transition-colors">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-[11px] text-brand-action hover:underline">Forgot password?</Link>
            </div>

            {error && (
              <div className="text-red-500 text-[10px] uppercase font-bold tracking-widest text-center mt-2 animate-pulse">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full py-4 bg-brand-action text-white font-bold rounded-sm uppercase tracking-widest text-xs hover:bg-white hover:text-brand-navy transition-all disabled:opacity-50 mt-4 shadow-xl shadow-brand-action/10"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#181818] px-2 text-gray-400 text-[10px]">Or continue with</span></div>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading || googleLoading}
              className="w-full py-3 bg-white/5 border border-white/10 text-white font-semibold rounded-sm text-xs hover:bg-white/10 transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              {googleLoading ? 'Signing in...' : 'Sign in with Google'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-xs text-gray-500">
              Don't have an account? <Link to="/register" className="text-brand-action font-bold hover:underline">Register now</Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};