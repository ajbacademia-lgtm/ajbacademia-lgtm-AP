import React, { createContext, useContext, useState, useEffect } from 'react';

export interface OfficeLocation {
  id: string;
  city: string;
  address: string;
  type: string;
  phone: string;
  email?: string;
}

export interface SocialLinksSettings {
  linkedinUrl: string;
  twitterUrl: string;
  youtubeUrl: string;
  facebookUrl: string;
  instagramUrl: string;
  researchgateUrl?: string;
}

export interface ContactPageSettings {
  title: string;
  subtitle: string;
  supportEmail: string;
  permissionsEmail: string;
  responseTimes: {
    email: string;
    quotes: string;
    tech: string;
  };
  offices: OfficeLocation[];
  faqSectionTitle?: string;
  faqSectionSubtitle?: string;
}

interface PageContent {
  title: string;
  content: string;
}

interface SystemSettings {
  logoUrl: string | null;
  faviconUrl: string | null;
  siteName: string;
  siteFooterInfo: string;
  copyrightYear: string;
  pages: {
    [pageId: string]: PageContent;
  };
  contactConfig: ContactPageSettings;
  socialLinks: SocialLinksSettings;
}

interface ConfigurationContextType {
  settings: SystemSettings;
  updateLogo: (url: string | null) => void;
  updateFavicon: (url: string | null) => void;
  updateSiteName: (name: string) => void;
  updateFooterInfo: (info: string) => void;
  updateCopyrightYear: (year: string) => void;
  updatePageContent: (pageId: string, content: PageContent) => void;
  updateContactConfig: (config: Partial<ContactPageSettings>) => void;
  updateSocialLinks: (social: Partial<SocialLinksSettings>) => void;
  addOfficeLocation: (office: Omit<OfficeLocation, 'id'>) => void;
  updateOfficeLocation: (id: string, office: Partial<OfficeLocation>) => void;
  deleteOfficeLocation: (id: string) => void;
}

export const DEFAULT_SOCIAL_LINKS: SocialLinksSettings = {
  linkedinUrl: 'https://www.linkedin.com/company/academic-publishing-group',
  twitterUrl: 'https://twitter.com/AcademicPubGrp',
  youtubeUrl: 'https://www.youtube.com/@AcademicPublishingGroup',
  facebookUrl: 'https://www.facebook.com/AcademicPublishingGroup',
  instagramUrl: 'https://www.instagram.com/academicpublishing'
};

export const DEFAULT_CONTACT_CONFIG: ContactPageSettings = {
  title: 'Contact Us',
  subtitle: 'Our global team is here to support your research journey. Whether you are an author, reviewer, or librarian, we are ready to assist.',
  supportEmail: 'support@academicpublishinggroup.org',
  permissionsEmail: 'permissions@academicpublishinggroup.org',
  responseTimes: {
    email: '24-48 Hours',
    quotes: 'Within 12 Hours',
    tech: 'Same Day'
  },
  offices: [
    {
      id: 'off-1',
      city: 'London',
      address: '5 Howick Place, London, SW1P 1WG, United Kingdom',
      type: 'Global Headquarters',
      phone: '+44 (0) 20 7017 6000'
    },
    {
      id: 'off-2',
      city: 'New York',
      address: '605 Third Avenue, New York, NY 10158, USA',
      type: 'Americas Regional Office',
      phone: '+1 212 216 7800'
    },
    {
      id: 'off-3',
      city: 'Singapore',
      address: '240 MacPherson Road, #08-01 Pines Industrial Building, Singapore 348574',
      type: 'Asia-Pacific Hub',
      phone: '+65 6508 2888'
    }
  ],
  faqSectionTitle: 'Looking for something else?',
  faqSectionSubtitle: 'Check out our specialized resources or browse our help center.'
};

const DEFAULT_SETTINGS: SystemSettings = {
  logoUrl: null, // null means use default SVG
  faviconUrl: null,
  siteName: 'Academic Publishing Group',
  siteFooterInfo: 'Academic Publishing Group is Registered in England & Wales',
  copyrightYear: '2026',
  pages: {
    'about': { title: 'About Us', content: 'Academic Publishing is a leader in academic dissemination...' },
    'contact': { title: 'Contact Us', content: 'Get in touch with our editorial and support teams.' },
  },
  contactConfig: DEFAULT_CONTACT_CONFIG,
  socialLinks: DEFAULT_SOCIAL_LINKS
};

const ConfigurationContext = createContext<ConfigurationContextType | undefined>(undefined);

export const ConfigurationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SystemSettings>(() => {
    const saved = localStorage.getItem('ajp_system_settings');
    if (!saved) return DEFAULT_SETTINGS;
    try {
      const parsed = JSON.parse(saved);
      // Ensure nested objects like pages, contactConfig & socialLinks are merged or defaulted
      return {
        ...DEFAULT_SETTINGS,
        ...parsed,
        pages: { ...DEFAULT_SETTINGS.pages, ...(parsed.pages || {}) },
        socialLinks: {
          ...DEFAULT_SOCIAL_LINKS,
          ...(parsed.socialLinks || {})
        },
        contactConfig: {
          ...DEFAULT_CONTACT_CONFIG,
          ...(parsed.contactConfig || {}),
          responseTimes: {
            ...DEFAULT_CONTACT_CONFIG.responseTimes,
            ...(parsed.contactConfig?.responseTimes || {})
          },
          offices: Array.isArray(parsed.contactConfig?.offices)
            ? parsed.contactConfig.offices
            : DEFAULT_CONTACT_CONFIG.offices
        }
      };
    } catch (e) {
      return DEFAULT_SETTINGS;
    }
  });

  useEffect(() => {
    localStorage.setItem('ajp_system_settings', JSON.stringify(settings));
  }, [settings]);

  const updateLogo = (url: string | null) => {
    setSettings(prev => ({ ...prev, logoUrl: url }));
  };

  const updateFavicon = (url: string | null) => {
    setSettings(prev => ({ ...prev, faviconUrl: url }));
  };

  const updateSiteName = (name: string) => {
    setSettings(prev => ({ ...prev, siteName: name }));
  };

  const updateFooterInfo = (info: string) => {
    setSettings(prev => ({ ...prev, siteFooterInfo: info }));
  };

  const updateCopyrightYear = (year: string) => {
    setSettings(prev => ({ ...prev, copyrightYear: year }));
  };

  const updatePageContent = (pageId: string, content: PageContent) => {
    setSettings(prev => ({
      ...prev,
      pages: {
        ...prev.pages,
        [pageId]: content
      }
    }));
  };

  const updateContactConfig = (newConfig: Partial<ContactPageSettings>) => {
    setSettings(prev => ({
      ...prev,
      contactConfig: {
        ...prev.contactConfig,
        ...newConfig,
        responseTimes: newConfig.responseTimes
          ? { ...prev.contactConfig.responseTimes, ...newConfig.responseTimes }
          : prev.contactConfig.responseTimes
      }
    }));
  };

  const updateSocialLinks = (newLinks: Partial<SocialLinksSettings>) => {
    setSettings(prev => ({
      ...prev,
      socialLinks: {
        ...(prev.socialLinks || DEFAULT_SOCIAL_LINKS),
        ...newLinks
      }
    }));
  };

  const addOfficeLocation = (office: Omit<OfficeLocation, 'id'>) => {
    const newOffice: OfficeLocation = {
      ...office,
      id: `off-${Date.now()}`
    };
    setSettings(prev => ({
      ...prev,
      contactConfig: {
        ...prev.contactConfig,
        offices: [...prev.contactConfig.offices, newOffice]
      }
    }));
  };

  const updateOfficeLocation = (id: string, updatedFields: Partial<OfficeLocation>) => {
    setSettings(prev => ({
      ...prev,
      contactConfig: {
        ...prev.contactConfig,
        offices: prev.contactConfig.offices.map(off =>
          off.id === id ? { ...off, ...updatedFields } : off
        )
      }
    }));
  };

  const deleteOfficeLocation = (id: string) => {
    setSettings(prev => ({
      ...prev,
      contactConfig: {
        ...prev.contactConfig,
        offices: prev.contactConfig.offices.filter(off => off.id !== id)
      }
    }));
  };

  return (
    <ConfigurationContext.Provider
      value={{
        settings,
        updateLogo,
        updateFavicon,
        updateSiteName,
        updateFooterInfo,
        updateCopyrightYear,
        updatePageContent,
        updateContactConfig,
        updateSocialLinks,
        addOfficeLocation,
        updateOfficeLocation,
        deleteOfficeLocation
      }}
    >
      {children}
    </ConfigurationContext.Provider>
  );
};

export const useConfiguration = () => {
  const context = useContext(ConfigurationContext);
  if (context === undefined) {
    throw new Error('useConfiguration must be used within a ConfigurationProvider');
  }
  return context;
};
