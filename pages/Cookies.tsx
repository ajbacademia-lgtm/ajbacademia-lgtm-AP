import React, { useState, useEffect } from 'react';
import { Cookie, Settings, ShieldCheck, Megaphone, CheckCircle2, XCircle, RefreshCw, Sliders, ExternalLink, Info, Lock } from 'lucide-react';
import { useCookieConsent } from '../context/CookieConsentContext';
import { getVisitorId, getSessionId } from '../services/visitorTrackingService';
import { CookieSettings } from '../types';
import { safeFetchJson } from '../src/utils/safeApi';

export const CookiesPolicy: React.FC = () => {
  const { consent, openPreferences, resetConsent, acceptAll, rejectNonEssential } = useCookieConsent();
  const [visitorId, setVisitorId] = useState<string>('');
  const [sessionId, setSessionId] = useState<string>('');
  const [cookieSettings, setCookieSettings] = useState<CookieSettings | null>(null);

  useEffect(() => {
    setVisitorId(getVisitorId());
    setSessionId(getSessionId());

    // Fetch live cookie settings from backend
    safeFetchJson<CookieSettings>('/api/cookie-consents/settings')
      .then(data => {
        if (data) setCookieSettings(data);
      })
      .catch(() => console.debug('Using local default cookie policy text'));
  }, []);

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Header */}
      <section className="bg-brand-navy text-white py-16 border-b border-white/10">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-2 text-brand-action mb-3 font-mono text-xs uppercase tracking-widest">
            <Cookie size={16} /> Privacy & Compliance Standard
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Cookie Policy & Preferences</h1>
          <p className="text-xl text-white/70 max-w-3xl leading-relaxed">
            {cookieSettings?.bannerDescription || 
              'Transparency about how we use cookies, local storage, and anonymous telemetry to maintain platform security, measure readership, and deliver peer-reviewed scholarship.'}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="text-xs px-3 py-1 bg-white/10 rounded font-mono text-emerald-400">
              Policy Version: {cookieSettings?.policyVersion || '1.2.0'}
            </span>
            <span className="text-xs px-3 py-1 bg-white/10 rounded font-mono text-white/60">
              Last Updated: {cookieSettings?.updatedAt ? new Date(cookieSettings.updatedAt).toLocaleDateString() : 'August 2026'}
            </span>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-12 bg-gray-50/50">
        <div className="container mx-auto px-6 max-w-5xl">
          {/* Live Visitor Consent Card */}
          <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-6 md:p-8 mb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100 pb-6 mb-6">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-brand-action block mb-1">
                  Active Browser Profile
                </span>
                <h2 className="text-2xl font-serif font-bold text-brand-navy">Your Current Cookie Consent Status</h2>
                <p className="text-xs text-brand-navy/60 mt-1">
                  Review and customize the privacy permissions configured on this device.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={openPreferences}
                  className="px-5 py-2.5 bg-brand-navy hover:bg-brand-action text-white text-xs font-bold uppercase tracking-wider rounded-sm shadow transition-all flex items-center gap-2"
                >
                  <Sliders size={14} /> Customize Preferences
                </button>
                <button
                  type="button"
                  onClick={resetConsent}
                  className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-brand-navy text-xs font-semibold rounded-sm transition-colors flex items-center gap-1.5"
                >
                  <RefreshCw size={13} /> Reset All
                </button>
              </div>
            </div>

            {/* Grid of Active Categories */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* Essential */}
              <div className="p-4 bg-emerald-50/60 border border-emerald-100 rounded-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-emerald-950">Essential</span>
                  <CheckCircle2 size={16} className="text-emerald-600" />
                </div>
                <div className="text-[11px] text-emerald-800 font-semibold mb-1">Status: Active (Locked)</div>
                <div className="text-[10px] text-emerald-700/70">Session security & login authorization.</div>
              </div>

              {/* Analytics */}
              <div className={`p-4 rounded-sm border ${consent.analytics ? 'bg-indigo-50/60 border-indigo-100' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-brand-navy">Analytics</span>
                  {consent.analytics ? (
                    <CheckCircle2 size={16} className="text-indigo-600" />
                  ) : (
                    <XCircle size={16} className="text-gray-400" />
                  )}
                </div>
                <div className={`text-[11px] font-semibold mb-1 ${consent.analytics ? 'text-indigo-900' : 'text-gray-500'}`}>
                  Status: {consent.analytics ? 'Enabled' : 'Disabled'}
                </div>
                <div className="text-[10px] text-brand-navy/60">Article reads, downloads & searches.</div>
              </div>

              {/* Functional */}
              <div className={`p-4 rounded-sm border ${consent.functional ? 'bg-blue-50/60 border-blue-100' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-brand-navy">Functional</span>
                  {consent.functional ? (
                    <CheckCircle2 size={16} className="text-blue-600" />
                  ) : (
                    <XCircle size={16} className="text-gray-400" />
                  )}
                </div>
                <div className={`text-[11px] font-semibold mb-1 ${consent.functional ? 'text-blue-900' : 'text-gray-500'}`}>
                  Status: {consent.functional ? 'Enabled' : 'Disabled'}
                </div>
                <div className="text-[10px] text-brand-navy/60">Citation style & custom UI layout.</div>
              </div>

              {/* Marketing */}
              <div className={`p-4 rounded-sm border ${consent.marketing ? 'bg-amber-50/60 border-amber-100' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-brand-navy">Announcements</span>
                  {consent.marketing ? (
                    <CheckCircle2 size={16} className="text-amber-600" />
                  ) : (
                    <XCircle size={16} className="text-gray-400" />
                  )}
                </div>
                <div className={`text-[11px] font-semibold mb-1 ${consent.marketing ? 'text-amber-900' : 'text-gray-500'}`}>
                  Status: {consent.marketing ? 'Enabled' : 'Disabled'}
                </div>
                <div className="text-[10px] text-brand-navy/60">Call for papers & conference alerts.</div>
              </div>
            </div>

            {/* Telemetry Diagnostics Footer */}
            <div className="bg-gray-50 p-4 rounded border border-gray-100 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-brand-navy/60">
              <div className="flex items-center gap-2">
                <span>Visitor Token:</span>
                <span className="text-brand-navy font-bold bg-white px-2 py-0.5 border border-gray-200 rounded text-[11px]">
                  {visitorId || 'Loading...'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span>Active Session:</span>
                <span className="text-brand-navy font-bold bg-white px-2 py-0.5 border border-gray-200 rounded text-[11px]">
                  {sessionId || 'Loading...'}
                </span>
              </div>
            </div>
          </div>

          {/* Full Cookie Policy Explanations */}
          <div className="prose prose-slate max-w-none text-brand-navy space-y-10">
            <div>
              <h2 className="text-2xl font-serif font-bold text-brand-navy mb-4">1. What are Cookies and Telemetry Identifiers?</h2>
              <p className="text-brand-navy/70 leading-relaxed text-sm">
                Cookies are small text records placed on your computing device when accessing websites. They allow web platforms to remember authentication states, preserve user session consistency, and record anonymous interaction logs. We combine standard browser cookies with secure local storage keys to deliver reliable manuscript peer-review and scholarly publishing services.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-serif font-bold text-brand-navy mb-6">2. Detailed Category Breakdown</h2>
              
              <div className="space-y-6">
                <div className="border-l-4 border-emerald-500 pl-6 py-2 bg-white p-5 border border-gray-200 rounded-sm">
                  <h3 className="text-base font-bold text-brand-navy mb-2 flex items-center gap-2">
                    <ShieldCheck size={18} className="text-emerald-500" /> Essential & Strictly Necessary Cookies
                  </h3>
                  <p className="text-xs text-brand-navy/70 leading-relaxed mb-3">
                    These cookies are strictly required for security, user authentication, manuscript submission flows, and administrative governance. Without these cookies, services such as author account access, payment processing, and peer-review submissions cannot function.
                  </p>
                  <div className="bg-gray-50 p-2.5 rounded text-[11px] font-mono text-brand-navy/60 border border-gray-100">
                    Key Identifiers: <code className="text-emerald-700">_ajp_session</code>, <code className="text-emerald-700">_ajp_uid</code>, <code className="text-emerald-700">_ajp_csrf</code>, <code className="text-emerald-700">_ajp_cookie_consent</code>
                  </div>
                </div>

                <div className="border-l-4 border-indigo-500 pl-6 py-2 bg-white p-5 border border-gray-200 rounded-sm">
                  <h3 className="text-base font-bold text-brand-navy mb-2 flex items-center gap-2">
                    <Cookie size={18} className="text-indigo-500" /> Analytics & Scholarly Metrics Cookies
                  </h3>
                  <p className="text-xs text-brand-navy/70 leading-relaxed mb-3">
                    These cookies collect telemetry on how researchers interact with our journal platform. They measure article page views, manuscript PDF downloads, keyword searches, and reader geographic origins. This aggregated data helps editors evaluate journal reach and improve reader discovery.
                  </p>
                  <div className="bg-gray-50 p-2.5 rounded text-[11px] font-mono text-brand-navy/60 border border-gray-100">
                    Key Identifiers: <code className="text-indigo-700">_ajp_analytics</code>, <code className="text-indigo-700">_ajp_read_metric</code>, <code className="text-indigo-700">_ajp_search_log</code>
                  </div>
                </div>

                <div className="border-l-4 border-blue-500 pl-6 py-2 bg-white p-5 border border-gray-200 rounded-sm">
                  <h3 className="text-base font-bold text-brand-navy mb-2 flex items-center gap-2">
                    <Settings size={18} className="text-blue-500" /> Functional & Preference Cookies
                  </h3>
                  <p className="text-xs text-brand-navy/70 leading-relaxed mb-3">
                    These cookies store personalized UI preferences, such as selected citation style formats (APA 7th, MLA 9th, Chicago, Harvard, BibTeX), archive filter settings, and display density preferences.
                  </p>
                  <div className="bg-gray-50 p-2.5 rounded text-[11px] font-mono text-brand-navy/60 border border-gray-100">
                    Key Identifiers: <code className="text-blue-700">_ajp_citation_pref</code>, <code className="text-blue-700">_ajp_layout_pref</code>
                  </div>
                </div>

                <div className="border-l-4 border-amber-500 pl-6 py-2 bg-white p-5 border border-gray-200 rounded-sm">
                  <h3 className="text-base font-bold text-brand-navy mb-2 flex items-center gap-2">
                    <Megaphone size={18} className="text-amber-500" /> Announcement & Call for Papers Cookies
                  </h3>
                  <p className="text-xs text-brand-navy/70 leading-relaxed mb-3">
                    Used to remember which journal announcements or calls for papers you have already viewed, preventing redundant notifications during research browsing.
                  </p>
                  <div className="bg-gray-50 p-2.5 rounded text-[11px] font-mono text-brand-navy/60 border border-gray-100">
                    Key Identifiers: <code className="text-amber-700">_ajp_call_for_papers</code>, <code className="text-amber-700">_ajp_announcements_seen</code>
                  </div>
                </div>
              </div>
            </div>

            {/* Cookie Inventory Table */}
            <div>
              <h2 className="text-2xl font-serif font-bold text-brand-navy mb-4">3. Complete Cookie Inventory Matrix</h2>
              <div className="bg-white border border-gray-200 rounded-sm overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-gray-100 border-b border-gray-200 font-bold text-brand-navy">
                        <th className="p-3.5">Cookie Name</th>
                        <th className="p-3.5">Provider</th>
                        <th className="p-3.5">Category</th>
                        <th className="p-3.5">Lifespan</th>
                        <th className="p-3.5">Purpose</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-normal text-brand-navy/80">
                      <tr>
                        <td className="p-3.5 font-mono font-bold text-brand-navy">_ajp_uid</td>
                        <td className="p-3.5">Academic Publishing</td>
                        <td className="p-3.5"><span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold text-[10px]">Essential</span></td>
                        <td className="p-3.5">365 Days</td>
                        <td className="p-3.5">Persistent anonymous visitor tracking token for platform security.</td>
                      </tr>
                      <tr>
                        <td className="p-3.5 font-mono font-bold text-brand-navy">_ajp_sid</td>
                        <td className="p-3.5">Academic Publishing</td>
                        <td className="p-3.5"><span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold text-[10px]">Essential</span></td>
                        <td className="p-3.5">Session</td>
                        <td className="p-3.5">Session identifier for manuscript authoring and search continuity.</td>
                      </tr>
                      <tr>
                        <td className="p-3.5 font-mono font-bold text-brand-navy">_ajp_cookie_consent</td>
                        <td className="p-3.5">Academic Publishing</td>
                        <td className="p-3.5"><span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold text-[10px]">Essential</span></td>
                        <td className="p-3.5">365 Days</td>
                        <td className="p-3.5">Remembers your GDPR / ePrivacy category consent decisions.</td>
                      </tr>
                      <tr>
                        <td className="p-3.5 font-mono font-bold text-brand-navy">_ajp_analytics</td>
                        <td className="p-3.5">Academic Publishing</td>
                        <td className="p-3.5"><span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded font-semibold text-[10px]">Analytics</span></td>
                        <td className="p-3.5">365 Days</td>
                        <td className="p-3.5">Records scholarly article reads, keyword queries, and citations.</td>
                      </tr>
                      <tr>
                        <td className="p-3.5 font-mono font-bold text-brand-navy">_ajp_citation_pref</td>
                        <td className="p-3.5">Academic Publishing</td>
                        <td className="p-3.5"><span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-semibold text-[10px]">Functional</span></td>
                        <td className="p-3.5">180 Days</td>
                        <td className="p-3.5">Stores citation format preference (APA, MLA, BibTeX).</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* How to control browser settings */}
            <div>
              <h2 className="text-2xl font-serif font-bold text-brand-navy mb-4">4. Browser-Level Cookie Management</h2>
              <p className="text-brand-navy/70 leading-relaxed text-sm mb-6">
                In addition to our on-site preference manager, all major modern web browsers allow you to manage or block cookies through browser settings. Please refer to your browser documentation:
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <a
                  href="https://support.google.com/chrome/answer/95647"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white border border-gray-200 rounded text-center font-medium hover:border-brand-action hover:text-brand-action transition-colors flex items-center justify-center gap-1"
                >
                  Google Chrome <ExternalLink size={11} />
                </a>
                <a
                  href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white border border-gray-200 rounded text-center font-medium hover:border-brand-action hover:text-brand-action transition-colors flex items-center justify-center gap-1"
                >
                  Mozilla Firefox <ExternalLink size={11} />
                </a>
                <a
                  href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white border border-gray-200 rounded text-center font-medium hover:border-brand-action hover:text-brand-action transition-colors flex items-center justify-center gap-1"
                >
                  Apple Safari <ExternalLink size={11} />
                </a>
                <a
                  href="https://support.microsoft.com/en-us/windows/microsoft-edge-browsing-data-and-privacy-bb8174ba-9d73-dcf2-9b4a-9c82f4e43048"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white border border-gray-200 rounded text-center font-medium hover:border-brand-action hover:text-brand-action transition-colors flex items-center justify-center gap-1"
                >
                  Microsoft Edge <ExternalLink size={11} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
