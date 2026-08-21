import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Cookie, Settings, Megaphone, Check, Lock, Info, ExternalLink } from 'lucide-react';
import { useCookieConsent } from '../../context/CookieConsentContext';
import { Link } from 'react-router-dom';

export const CookiePreferencesModal: React.FC = () => {
  const {
    isPreferencesModalOpen,
    closePreferences,
    consent,
    saveCustomPreferences,
    acceptAll,
    rejectNonEssential
  } = useCookieConsent();

  const [analytics, setAnalytics] = useState(true);
  const [functional, setFunctional] = useState(true);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    if (isPreferencesModalOpen) {
      setAnalytics(consent.analytics);
      setFunctional(consent.functional);
      setMarketing(consent.marketing);
    }
  }, [isPreferencesModalOpen, consent]);

  if (!isPreferencesModalOpen) return null;

  const handleSave = () => {
    saveCustomPreferences({
      essential: true,
      analytics,
      functional,
      marketing
    });
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] flex flex-col rounded-sm shadow-2xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-white text-brand-navy px-6 py-5 flex items-center justify-between border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-brand-action border border-emerald-100 flex items-center justify-center shadow-xs">
              <Cookie size={20} />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-brand-navy tracking-tight">Cookie & Privacy Preferences</h2>
              <p className="text-[11px] text-gray-500">Customize how we store data in your browser for academic research services.</p>
            </div>
          </div>
          <button
            onClick={closePreferences}
            className="p-2 text-gray-400 hover:text-brand-navy rounded hover:bg-gray-100 transition-colors"
            title="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-grow text-brand-navy">
          <div className="bg-blue-50/70 border border-blue-100 rounded-sm p-4 text-xs text-blue-900 leading-relaxed flex items-start gap-3">
            <Info size={18} className="text-blue-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Transparent Telemetry Commitment:</span> We respect your privacy. Academic Publishing never sells author or researcher data to third-party data brokers. Detailed cookie purposes and lifespans are listed below.
            </div>
          </div>

          <div className="space-y-4">
            {/* 1. Essential Cookies */}
            <div className="p-4 border border-gray-200 rounded-sm bg-gray-50/60">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={18} className="text-brand-action shrink-0" />
                  <span className="font-bold text-sm text-brand-navy">Essential / Strictly Necessary</span>
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 bg-gray-200 text-gray-700 rounded-full flex items-center gap-1">
                  <Lock size={10} /> Always Active
                </span>
              </div>
              <p className="text-xs text-brand-navy/70 leading-relaxed mb-2">
                Required for core website security, authenticating editorial and author logins, processing payments, and preserving CSRF protection tokens.
              </p>
              <div className="text-[11px] font-mono text-brand-navy/50 bg-white p-2 border border-gray-100 rounded">
                Identifiers: <span className="text-brand-navy/80">_ajp_sid, _ajp_session, _ajp_uid, _ajp_csrf</span> (Duration: Session / 1 Year)
              </div>
            </div>

            {/* 2. Analytics Cookies */}
            <div className="p-4 border border-gray-200 rounded-sm hover:border-gray-300 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Cookie size={18} className="text-indigo-600 shrink-0" />
                  <div>
                    <span className="font-bold text-sm text-brand-navy">Analytics & Visitor Metrics</span>
                    <span className="ml-2 text-[10px] text-indigo-600 font-semibold">(Recommended)</span>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={analytics}
                    onChange={(e) => setAnalytics(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
              <p className="text-xs text-brand-navy/70 leading-relaxed mb-2">
                Allows us to monitor total readership volumes, calculate article views & manuscript PDF download counts, analyze popular search terms, and provide journal impact statistics.
              </p>
              <div className="text-[11px] font-mono text-brand-navy/50 bg-gray-50 p-2 border border-gray-100 rounded">
                Identifiers: <span className="text-brand-navy/80">_ajp_analytics, _ajp_read_metric</span> (Duration: 365 Days)
              </div>
            </div>

            {/* 3. Functional Cookies */}
            <div className="p-4 border border-gray-200 rounded-sm hover:border-gray-300 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Settings size={18} className="text-blue-600 shrink-0" />
                  <span className="font-bold text-sm text-brand-navy">Functional & Custom Preferences</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={functional}
                    onChange={(e) => setFunctional(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <p className="text-xs text-brand-navy/70 leading-relaxed mb-2">
                Remembers your preferred citation format (APA, MLA, BibTeX, Chicago), table view layouts, and collapsed search filters between visits.
              </p>
              <div className="text-[11px] font-mono text-brand-navy/50 bg-gray-50 p-2 border border-gray-100 rounded">
                Identifiers: <span className="text-brand-navy/80">_ajp_citation_pref, _ajp_layout_pref</span> (Duration: 180 Days)
              </div>
            </div>

            {/* 4. Marketing & Announcements */}
            <div className="p-4 border border-gray-200 rounded-sm hover:border-gray-300 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Megaphone size={18} className="text-amber-600 shrink-0" />
                  <span className="font-bold text-sm text-brand-navy">Announcements & Call for Papers</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={marketing}
                    onChange={(e) => setMarketing(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                </label>
              </div>
              <p className="text-xs text-brand-navy/70 leading-relaxed mb-2">
                Enables relevant special issue announcements, upcoming conference calls, and grant funding alerts across academic disciplines.
              </p>
              <div className="text-[11px] font-mono text-brand-navy/50 bg-gray-50 p-2 border border-gray-100 rounded">
                Identifiers: <span className="text-brand-navy/80">_ajp_call_for_papers</span> (Duration: 90 Days)
              </div>
            </div>
          </div>

          <div className="pt-2 text-center">
            <Link 
              to="/cookies" 
              onClick={closePreferences}
              className="text-xs text-brand-action hover:underline font-semibold inline-flex items-center gap-1"
            >
              Read our full Academic Cookie Policy & Compliance Guide <ExternalLink size={12} />
            </Link>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => rejectNonEssential()}
              className="w-full sm:w-auto px-4 py-2.5 bg-white border border-gray-300 hover:bg-gray-100 text-brand-navy text-xs font-semibold rounded-sm transition-colors"
            >
              Reject Non-Essential
            </button>
            <button
              type="button"
              onClick={() => acceptAll()}
              className="w-full sm:w-auto px-4 py-2.5 bg-brand-navy hover:bg-brand-navy/90 text-white text-xs font-semibold rounded-sm transition-colors"
            >
              Accept All
            </button>
          </div>

          <button
            type="button"
            onClick={handleSave}
            className="w-full sm:w-auto px-6 py-2.5 bg-brand-action hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider rounded-sm shadow transition-all flex items-center justify-center gap-1.5"
          >
            <Check size={14} /> Save My Preferences
          </button>
        </div>
      </div>
    </div>
  );
};
