import React, { createContext, useContext, useState, useEffect } from 'react';
import { CookieCategoryPreferences, CookieConsentRecord } from '../types';
import { getVisitorId, getSessionId } from '../services/visitorTrackingService';

const CONSENT_STORAGE_KEY = '_ajp_cookie_consent';

interface CookieConsentContextType {
  consent: CookieCategoryPreferences;
  hasMadeChoice: boolean;
  isBannerVisible: boolean;
  isPreferencesModalOpen: boolean;
  openPreferences: () => void;
  closePreferences: () => void;
  acceptAll: () => Promise<void>;
  rejectNonEssential: () => Promise<void>;
  saveCustomPreferences: (preferences: CookieCategoryPreferences) => Promise<void>;
  resetConsent: () => void;
}

const DEFAULT_PREFERENCES: CookieCategoryPreferences = {
  essential: true,
  analytics: true,
  functional: true,
  marketing: false
};

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined);

export const CookieConsentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [consent, setConsent] = useState<CookieCategoryPreferences>(DEFAULT_PREFERENCES);
  const [hasMadeChoice, setHasMadeChoice] = useState<boolean>(false);
  const [isBannerVisible, setIsBannerVisible] = useState<boolean>(false);
  const [isPreferencesModalOpen, setIsPreferencesModalOpen] = useState<boolean>(false);

  // Initialize consent on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setConsent({
          essential: true,
          analytics: parsed.analytics ?? true,
          functional: parsed.functional ?? true,
          marketing: parsed.marketing ?? false
        });
        setHasMadeChoice(true);
        setIsBannerVisible(false);
      } else {
        // Show banner after brief delay so it slides in smoothly
        const timer = setTimeout(() => {
          setIsBannerVisible(true);
        }, 600);
        return () => clearTimeout(timer);
      }
    } catch {
      setIsBannerVisible(true);
    }
  }, []);

  // Listen to global openCookieSettings event (e.g. from footer links or Cookie page)
  useEffect(() => {
    const handleOpenModal = () => setIsPreferencesModalOpen(true);
    window.addEventListener('open-cookie-preferences', handleOpenModal);
    return () => window.removeEventListener('open-cookie-preferences', handleOpenModal);
  }, []);

  const syncConsentToBackend = async (
    prefs: CookieCategoryPreferences, 
    acceptedAll: boolean
  ) => {
    try {
      const payload: Partial<CookieConsentRecord> = {
        visitorId: getVisitorId(),
        sessionId: getSessionId(),
        acceptedAll,
        essential: true,
        analytics: prefs.analytics,
        functional: prefs.functional,
        marketing: prefs.marketing,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        version: '1.2.0'
      };

      await fetch('/api/cookie-consents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.warn('Could not sync consent to backend:', err);
    }
  };

  const acceptAll = async () => {
    const allOn: CookieCategoryPreferences = {
      essential: true,
      analytics: true,
      functional: true,
      marketing: true
    };
    setConsent(allOn);
    setHasMadeChoice(true);
    setIsBannerVisible(false);
    setIsPreferencesModalOpen(false);

    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(allOn));
    } catch {
      // ignore
    }

    await syncConsentToBackend(allOn, true);
  };

  const rejectNonEssential = async () => {
    const essentialOnly: CookieCategoryPreferences = {
      essential: true,
      analytics: false,
      functional: false,
      marketing: false
    };
    setConsent(essentialOnly);
    setHasMadeChoice(true);
    setIsBannerVisible(false);
    setIsPreferencesModalOpen(false);

    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(essentialOnly));
    } catch {
      // ignore
    }

    await syncConsentToBackend(essentialOnly, false);
  };

  const saveCustomPreferences = async (custom: CookieCategoryPreferences) => {
    const finalPrefs: CookieCategoryPreferences = {
      ...custom,
      essential: true // Always true
    };
    const isAllOn = finalPrefs.analytics && finalPrefs.functional && finalPrefs.marketing;
    setConsent(finalPrefs);
    setHasMadeChoice(true);
    setIsBannerVisible(false);
    setIsPreferencesModalOpen(false);

    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(finalPrefs));
    } catch {
      // ignore
    }

    await syncConsentToBackend(finalPrefs, isAllOn);
  };

  const resetConsent = () => {
    try {
      localStorage.removeItem(CONSENT_STORAGE_KEY);
    } catch {
      // ignore
    }
    setHasMadeChoice(false);
    setIsBannerVisible(true);
    setIsPreferencesModalOpen(false);
  };

  const openPreferences = () => setIsPreferencesModalOpen(true);
  const closePreferences = () => setIsPreferencesModalOpen(false);

  return (
    <CookieConsentContext.Provider
      value={{
        consent,
        hasMadeChoice,
        isBannerVisible,
        isPreferencesModalOpen,
        openPreferences,
        closePreferences,
        acceptAll,
        rejectNonEssential,
        saveCustomPreferences,
        resetConsent
      }}
    >
      {children}
    </CookieConsentContext.Provider>
  );
};

export const useCookieConsent = (): CookieConsentContextType => {
  const context = useContext(CookieConsentContext);
  if (!context) {
    throw new Error('useCookieConsent must be used within a CookieConsentProvider');
  }
  return context;
};
