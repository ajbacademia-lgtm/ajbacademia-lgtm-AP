import React from 'react';
import { Cookie, ShieldCheck, Settings, Check, X, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCookieConsent } from '../../context/CookieConsentContext';

export const CookieBanner: React.FC = () => {
  const { isBannerVisible, acceptAll, rejectNonEssential, openPreferences } = useCookieConsent();

  if (!isBannerVisible) {
    return null;
  }

  return (
    <aside 
      aria-label="Cookie consent banner"
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-xl z-[999] animate-in fade-in slide-in-from-bottom-6 duration-500"
    >
      <div className="bg-white text-brand-navy p-6 md:p-7 rounded-lg shadow-2xl border-2 border-[#0052cc] relative overflow-hidden ring-4 ring-[#0052cc]/10">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-brand-action border border-emerald-100 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
            <Cookie size={22} />
          </div>

          <div className="flex-grow min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <h3 className="text-base font-serif font-bold text-brand-navy tracking-tight">
                Academic Privacy & Cookie Notice
              </h3>
              <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded">
                ePrivacy / GDPR
              </span>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed mb-4">
              We use cookies and telemetry identifiers to maintain scholarly session security, measure article readership & PDF downloads, and optimize our peer-reviewed journal experience.
            </p>

            <div className="flex flex-wrap items-center gap-2 mb-4 text-[11px] text-gray-500">
              <span className="flex items-center gap-1 font-medium text-emerald-700">
                <ShieldCheck size={13} className="text-emerald-600" /> Essential Locked
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 font-medium text-indigo-700">
                <Cookie size={13} className="text-indigo-600" /> Analytics Active
              </span>
              <span>•</span>
              <Link to="/cookies" className="underline hover:text-brand-action transition-colors flex items-center gap-0.5 text-gray-600 font-medium">
                Full Policy <ExternalLink size={10} />
              </Link>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <button
                type="button"
                onClick={() => acceptAll()}
                className="px-5 py-2.5 bg-brand-action hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider rounded-sm shadow transition-all flex items-center justify-center gap-1.5"
              >
                <Check size={14} /> Accept All Cookies
              </button>

              <button
                type="button"
                onClick={() => rejectNonEssential()}
                className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-brand-navy font-semibold text-xs rounded-sm transition-all text-center border border-gray-200/60"
              >
                Essential Only
              </button>

              <button
                type="button"
                onClick={() => openPreferences()}
                className="px-4 py-2.5 text-gray-600 hover:text-brand-navy text-xs font-semibold underline underline-offset-4 flex items-center justify-center gap-1.5 transition-colors sm:ml-auto"
              >
                <Settings size={13} /> Customize
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
