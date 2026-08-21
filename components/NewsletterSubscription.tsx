import React, { useState } from 'react';
import { Mail, CheckCircle2, AlertCircle, Sparkles, Loader2, ShieldCheck, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { NewsletterClientService } from '../src/services/newsletterClientService';
import { NewsletterFrequency } from '../types';

const SCHOLARLY_TOPICS = [
  'Medicine & Healthcare',
  'Computer Science & AI',
  'Engineering & Tech',
  'Life Sciences & Biology',
  'Social Sciences & Humanities',
  'Business & Economics',
  'All Disciplines & Research Updates'
];

interface NewsletterSubscriptionProps {
  variant?: 'banner' | 'card' | 'compact';
  source?: string;
  className?: string;
  defaultTopic?: string;
}

export const NewsletterSubscription: React.FC<NewsletterSubscriptionProps> = ({
  variant = 'banner',
  source = 'Website Newsletter Section',
  className = '',
  defaultTopic,
}) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [institution, setInstitution] = useState('');
  const [frequency, setFrequency] = useState<NewsletterFrequency>('Weekly');
  const [selectedTopics, setSelectedTopics] = useState<string[]>(
    defaultTopic ? [defaultTopic] : ['All Disciplines & Research Updates']
  );
  const [showPreferences, setShowPreferences] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const toggleTopic = (topic: string) => {
    if (topic === 'All Disciplines & Research Updates') {
      setSelectedTopics(['All Disciplines & Research Updates']);
      return;
    }

    let updated = selectedTopics.filter(t => t !== 'All Disciplines & Research Updates');
    if (updated.includes(topic)) {
      updated = updated.filter(t => t !== topic);
    } else {
      updated.push(topic);
    }

    if (updated.length === 0) {
      updated = ['All Disciplines & Research Updates'];
    }
    setSelectedTopics(updated);
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrorMessage('Please enter your scholarly email address.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setErrorMessage('Please enter a valid academic email address (e.g. name@university.edu).');
      return;
    }

    setIsLoading(true);
    try {
      const res = await NewsletterClientService.subscribe({
        email: trimmedEmail,
        name: name.trim() || undefined,
        institution: institution.trim() || undefined,
        frequency,
        topics: selectedTopics,
        source,
      });

      setIsSuccess(true);
      setSuccessMessage(res.message || 'Thank you for subscribing to Academic Publishing Group!');
    } catch (err: any) {
      setErrorMessage(err.message || 'Could not complete subscription. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setIsSuccess(false);
    setEmail('');
    setName('');
    setInstitution('');
    setErrorMessage('');
    setSuccessMessage('');
  };

  // Success State View
  if (isSuccess) {
    return (
      <div className={`bg-gradient-to-br from-emerald-900 via-brand-navy to-slate-900 text-white rounded-lg p-8 shadow-xl border border-emerald-500/30 ${className}`}>
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/40">
            <CheckCircle2 size={32} />
          </div>
          <h3 className="text-2xl font-serif font-bold text-white mb-2">Subscription Confirmed</h3>
          <p className="text-emerald-100 text-sm mb-6 leading-relaxed">
            {successMessage}
          </p>

          <div className="bg-white/10 backdrop-blur-md rounded-md p-4 mb-6 text-left border border-white/10 text-xs space-y-2">
            <div className="flex justify-between items-center text-white/80">
              <span className="font-semibold">Subscribed Email:</span>
              <span className="font-mono text-emerald-300">{email}</span>
            </div>
            <div className="flex justify-between items-center text-white/80">
              <span className="font-semibold">Delivery Frequency:</span>
              <span className="text-white font-medium">{frequency} Digest</span>
            </div>
            <div className="text-white/80">
              <span className="font-semibold block mb-1">Topics of Interest:</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {selectedTopics.map(t => (
                  <span key={t} className="px-2 py-0.5 bg-emerald-500/20 text-emerald-200 rounded text-[11px] border border-emerald-500/30">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={resetForm}
            type="button"
            className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider rounded transition-colors border border-white/20"
          >
            Subscribe Another Email / Manage
          </button>
        </div>
      </div>
    );
  }

  // Compact Variant
  if (variant === 'compact') {
    return (
      <div className={`bg-white border border-gray-200 rounded-lg p-5 shadow-sm ${className}`}>
        <div className="flex items-center gap-2 mb-2 text-brand-navy font-bold text-sm">
          <Mail size={16} className="text-brand-action" />
          <span>Subscribe to Research Alerts</span>
        </div>
        <p className="text-gray-600 text-xs mb-3">
          Get weekly summaries of peer-reviewed articles and calls for papers.
        </p>
        <form onSubmit={handleSubscribe} className="space-y-2">
          <input
            type="email"
            placeholder="Enter your academic email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            className="w-full px-3 py-2 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-brand-action focus:border-brand-action outline-none"
            required
          />
          {errorMessage && (
            <p className="text-red-600 text-[11px] flex items-center gap-1">
              <AlertCircle size={12} /> {errorMessage}
            </p>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 bg-brand-navy hover:bg-brand-navy-light text-white text-xs font-bold rounded flex items-center justify-center gap-1.5 transition-colors"
          >
            {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Mail size={14} />}
            <span>Subscribe</span>
          </button>
        </form>
      </div>
    );
  }

  // Banner / Full Section Variant (Default)
  return (
    <section className={`relative overflow-hidden bg-white text-gray-900 py-12 px-6 md:px-12 rounded-xl shadow-sm border border-gray-200 ${className}`}>
      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-4xl font-serif font-bold text-black tracking-tight">
            Subscribe to our Newsletter
          </h2>
        </div>

        <form onSubmit={handleSubscribe} className="bg-gray-50/70 rounded-xl p-6 md:p-8 border border-gray-200 shadow-sm">
          {/* Main Email Input Row */}
          <div className="flex flex-col md:flex-row gap-3 items-stretch mb-4">
            <div className="relative flex-1">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                placeholder="Enter your academic or institutional email (e.g. author@university.edu)"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                disabled={isLoading}
                className="w-full pl-11 pr-4 py-3.5 bg-white text-gray-900 placeholder-gray-500 rounded-lg text-sm font-medium border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-navy shadow-sm"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-3.5 bg-brand-navy hover:bg-[#001736] text-white font-bold text-sm uppercase tracking-wider rounded-lg shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all transform active:scale-95 whitespace-nowrap"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Subscribing...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>Subscribe Now</span>
                </>
              )}
            </button>
          </div>

          {errorMessage && (
            <div className="p-3 mb-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs flex items-center gap-2">
              <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Preferences Toggle Button */}
          <div className="flex justify-between items-center pt-2">
            <button
              type="button"
              onClick={() => setShowPreferences(!showPreferences)}
              className="inline-flex items-center gap-1.5 text-xs text-black hover:text-gray-700 font-semibold transition-colors underline-offset-2 hover:underline"
            >
              <span>{showPreferences ? 'Hide custom discipline & frequency preferences' : 'Customize research fields & delivery frequency'}</span>
              {showPreferences ? <ChevronUp size={14} className="text-black" /> : <ChevronDown size={14} className="text-black" />}
            </button>

            <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-black font-medium">
              <ShieldCheck size={14} className="text-emerald-600" />
              <span>No spam. Unsubscribe anytime with 1-click.</span>
            </div>
          </div>

          {/* Expandable Preferences Panel */}
          {showPreferences && (
            <div className="mt-6 pt-6 border-t border-gray-200 space-y-5 animate-fadeIn">
              {/* Name and Affiliation Optional Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-800 mb-1.5">
                    Full Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Prof. / Dr. / Scholar Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-md text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-navy"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-800 mb-1.5">
                    Institution / University (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Stanford University / Oxford"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-md text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-navy"
                  />
                </div>
              </div>

              {/* Research Disciplines / Topics Multi-select */}
              <div>
                <label className="block text-xs font-semibold text-gray-800 mb-2">
                  Select Research Disciplines & Topics:
                </label>
                <div className="flex flex-wrap gap-2">
                  {SCHOLARLY_TOPICS.map((topic) => {
                    const isSelected = selectedTopics.includes(topic);
                    return (
                      <button
                        key={topic}
                        type="button"
                        onClick={() => toggleTopic(topic)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 border ${
                          isSelected
                            ? 'bg-brand-navy text-white border-brand-navy font-semibold shadow-sm'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                        }`}
                      >
                        {isSelected && <Check size={12} />}
                        <span>{topic}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Delivery Frequency Selection */}
              <div>
                <label className="block text-xs font-semibold text-gray-800 mb-2">
                  Preferred Delivery Frequency:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['Weekly', 'Monthly', 'Breaking Alerts', 'Quarterly'] as NewsletterFrequency[]).map((freq) => (
                    <button
                      key={freq}
                      type="button"
                      onClick={() => setFrequency(freq)}
                      className={`p-2.5 rounded-lg text-xs font-semibold text-center border transition-all ${
                        frequency === freq
                          ? 'bg-brand-navy text-white border-brand-navy font-bold shadow-sm'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      {freq} {freq === 'Breaking Alerts' ? '' : 'Digest'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </section>
  );
};
