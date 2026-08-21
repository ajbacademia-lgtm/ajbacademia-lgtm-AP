import React, { useState } from 'react';
import { Cookie } from 'lucide-react';
import { useCookieConsent } from '../../context/CookieConsentContext';

export const CookieFloatingButton: React.FC = () => {
  const { openPreferences, isBannerVisible } = useCookieConsent();
  const [isHovered, setIsHovered] = useState(false);

  // If the initial banner is currently displayed, hide the floating button so they don't overlap
  if (isBannerVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 z-[900]">
      <button
        type="button"
        onClick={openPreferences}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label="Manage Cookie & Privacy Preferences"
        className="flex items-center gap-2 bg-white hover:bg-gray-50 text-brand-navy hover:text-brand-action px-3.5 py-2 rounded-full shadow-lg border border-gray-200 hover:border-brand-action transition-all duration-200 group text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-action ring-1 ring-black/5"
      >
        <div className="w-5 h-5 rounded-full bg-emerald-50 text-brand-action border border-emerald-100 flex items-center justify-center group-hover:rotate-12 transition-transform shadow-xs">
          <Cookie size={12} />
        </div>
        <span className="text-[11px] font-medium pr-1 text-gray-700 group-hover:text-brand-navy">Cookie Settings</span>
      </button>
    </div>
  );
};
