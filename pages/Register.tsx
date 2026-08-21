import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { MockService } from '../services/mockDb';
import { ChevronRight, User, Mail, Lock, Building, UserCircle, Check, Eye, EyeOff } from 'lucide-react';

export const Register: React.FC = () => {
  // Profile State
  const [givenName, setGivenName] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [affiliation, setAffiliation] = useState('');

  // Login State
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Roles State
  const [isAuthor, setIsAuthor] = useState(false);
  const [isReviewer, setIsReviewer] = useState(false);
  const [isEditor, setIsEditor] = useState(false);
  const [subjectInterests, setSubjectInterests] = useState('');
  const [notifyMe, setNotifyMe] = useState(false);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const fullName = `${givenName} ${familyName}`.trim() || username || 'Registered Author';
      const role = isEditor ? 'editor' : (isReviewer ? 'reviewer' : 'author');

      let registeredUser;
      try {
        registeredUser = await authService.register(email, password, fullName, role, affiliation);
      } catch (authErr: any) {
        console.warn('Direct auth registration notice, using fallback:', authErr);
        registeredUser = await MockService.register(fullName, email, password);
      }

      login(registeredUser);
      navigate(`/registration-success?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#222222] min-h-screen relative overflow-hidden pb-20">
      {/* Background diagonal effect */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 to-transparent transform -skew-y-12 origin-top-left"></div>
      </div>

      {/* Breadcrumbs */}
      <div className="bg-white/5 border-b border-white/10 relative z-10">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={14} />
            <span className="text-white font-bold">Register</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 mt-10 relative z-10">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-serif font-bold text-white">Create Account</h1>
            <p className="text-sm text-gray-400 mt-2">
              Required fields are marked with an asterisk: <span className="text-red-500">*</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-12">
            {/* Profile Section */}
            <section>
              <h2 className="text-xl font-bold text-white mb-6 pb-2 border-b border-white/10">Profile</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Given Name */}
                <div className="flex items-stretch rounded-md overflow-hidden border border-white/10 shadow-2xl">
                  <div className="bg-[#b3b3b3] p-4 flex items-center justify-center w-14">
                    <User size={20} className="text-[#444444]" />
                  </div>
                  <input
                    type="text"
                    required
                    className="bg-[#111111] text-white px-4 py-3 flex-grow outline-none placeholder-gray-600 font-light"
                    placeholder="Given Name *"
                    value={givenName}
                    onChange={(e) => setGivenName(e.target.value)}
                  />
                </div>

                {/* Family Name */}
                <div className="flex items-stretch rounded-md overflow-hidden border border-white/10 shadow-2xl">
                  <div className="bg-[#b3b3b3] p-4 flex items-center justify-center w-14">
                    <User size={20} className="text-[#444444]" />
                  </div>
                  <input
                    type="text"
                    className="bg-[#111111] text-white px-4 py-3 flex-grow outline-none placeholder-gray-600 font-light"
                    placeholder="Family Name"
                    value={familyName}
                    onChange={(e) => setFamilyName(e.target.value)}
                  />
                </div>

                {/* Affiliation */}
                <div className="md:col-span-2 flex items-stretch rounded-md overflow-hidden border border-white/10 shadow-2xl">
                  <div className="bg-[#b3b3b3] p-4 flex items-center justify-center w-14">
                    <Building size={20} className="text-[#444444]" />
                  </div>
                  <input
                    type="text"
                    required
                    className="bg-[#111111] text-white px-4 py-3 flex-grow outline-none placeholder-gray-600 font-light"
                    placeholder="Affiliation (University, Institute, or Company) *"
                    value={affiliation}
                    onChange={(e) => setAffiliation(e.target.value)}
                  />
                </div>
              </div>
            </section>

            {/* Login Section */}
            <section>
              <h2 className="text-xl font-bold text-white mb-6 pb-2 border-b border-white/10">Login Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email */}
                <div className="md:col-span-2 flex items-stretch rounded-md overflow-hidden border border-white/10 shadow-2xl">
                  <div className="bg-[#b3b3b3] p-4 flex items-center justify-center w-14">
                    <Mail size={20} className="text-[#444444]" />
                  </div>
                  <input
                    type="email"
                    required
                    className="bg-[#111111] text-white px-4 py-3 flex-grow outline-none placeholder-gray-600 font-light"
                    placeholder="Email Address *"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                {/* Username */}
                <div className="md:col-span-2 flex items-stretch rounded-md overflow-hidden border border-white/10 shadow-2xl">
                  <div className="bg-[#b3b3b3] p-4 flex items-center justify-center w-14">
                    <UserCircle size={20} className="text-[#444444]" />
                  </div>
                  <input
                    type="text"
                    required
                    className="bg-[#111111] text-white px-4 py-3 flex-grow outline-none placeholder-gray-600 font-light"
                    placeholder="Username *"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>

                {/* Password */}
                <div className="flex items-stretch rounded-md overflow-hidden border border-white/10 shadow-2xl relative">
                  <div className="bg-[#b3b3b3] p-4 flex items-center justify-center w-14 shrink-0">
                    <Lock size={20} className="text-[#444444]" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="bg-[#111111] text-white pl-4 pr-12 py-3 flex-grow outline-none placeholder-gray-600 font-light"
                    placeholder="Password *"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    tabIndex={0}
                    onClick={() => setShowPassword(p => !p)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {/* Confirm Password */}
                <div className="flex items-stretch rounded-md overflow-hidden border border-white/10 shadow-2xl relative">
                  <div className="bg-[#b3b3b3] p-4 flex items-center justify-center w-14 shrink-0">
                    <Lock size={20} className="text-[#444444]" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    className="bg-[#111111] text-white pl-4 pr-12 py-3 flex-grow outline-none placeholder-gray-600 font-light"
                    placeholder="Repeat Password *"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    tabIndex={0}
                    onClick={() => setShowConfirmPassword(p => !p)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </section>

            {/* Roles Section */}
            <section className="space-y-8">
              <div className="flex flex-wrap gap-8 items-center">
                <span className="text-sm font-bold text-white uppercase tracking-widest">Register As</span>
                <div className="flex gap-6">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={isAuthor}
                        onChange={(e) => setIsAuthor(e.target.checked)}
                      />
                      <div className={`w-5 h-5 border border-white/20 rounded flex items-center justify-center transition-colors ${isAuthor ? 'bg-brand-action border-brand-action' : 'bg-transparent'}`}>
                        {isAuthor && <Check size={12} className="text-white" />}
                      </div>
                    </div>
                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors">Author</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={isReviewer}
                        onChange={(e) => setIsReviewer(e.target.checked)}
                      />
                      <div className={`w-5 h-5 border border-white/20 rounded flex items-center justify-center transition-colors ${isReviewer ? 'bg-brand-action border-brand-action' : 'bg-transparent'}`}>
                        {isReviewer && <Check size={12} className="text-white" />}
                      </div>
                    </div>
                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors">Reviewer</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={isEditor}
                        onChange={(e) => setIsEditor(e.target.checked)}
                      />
                      <div className={`w-5 h-5 border border-white/20 rounded flex items-center justify-center transition-colors ${isEditor ? 'bg-brand-action border-brand-action' : 'bg-transparent'}`}>
                        {isEditor && <Check size={12} className="text-white" />}
                      </div>
                    </div>
                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors">Editor</span>
                  </label>
                </div>
              </div>

              {isReviewer && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    If you requested to be a reviewer on any journal, please enter your subject interests.
                  </label>
                  <textarea
                    className="w-full bg-[#111111] text-white px-4 py-3 border border-white/10 rounded-md outline-none focus:border-brand-action transition-all placeholder-gray-700"
                    rows={3}
                    placeholder="e.g. Artificial Intelligence, Molecular Biology, Digital Humanities..."
                    value={subjectInterests}
                    onChange={(e) => setSubjectInterests(e.target.value)}
                  ></textarea>
                </div>
              )}

              <label className="flex items-start gap-3 cursor-pointer group max-w-2xl">
                <div className="relative mt-1">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={notifyMe}
                    onChange={(e) => setNotifyMe(e.target.checked)}
                  />
                  <div className={`w-5 h-5 border border-white/20 rounded flex items-center justify-center transition-colors ${notifyMe ? 'bg-brand-action border-brand-action' : 'bg-transparent'}`}>
                    {notifyMe && <Check size={12} className="text-white" />}
                  </div>
                </div>
                <span className="text-sm text-gray-400 group-hover:text-white transition-colors leading-relaxed">
                  Yes, I would like to be notified of new publications and announcements.
                </span>
              </label>
            </section>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-md text-sm text-center animate-in fade-in slide-in-from-top-1">
                {error}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-between gap-8 pt-10 border-t border-white/5">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-16 py-4 bg-gradient-to-b from-[#ffb347] to-[#ff8c00] text-[#222222] font-black rounded-md uppercase tracking-[0.2em] text-sm shadow-[0_10px_20px_rgba(255,140,0,0.3)] hover:from-[#ffc168] hover:to-[#ffa033] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Register'}
              </button>
              <p className="text-sm text-gray-400">
                Already have an account?{' '}
                <Link to="/login" className="font-bold text-white hover:text-[#ff8c00] transition-colors underline underline-offset-4">
                  Login
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
