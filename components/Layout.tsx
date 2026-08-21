import React, { useState, useRef, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Search, BookOpen, User, LogOut, Globe, ChevronRight, Twitter, Linkedin, Youtube, Facebook, Instagram, ChevronDown, Loader2, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useConfiguration } from '../context/ConfigurationContext';
import { GeminiService, SearchResult } from '../services/geminiService';
import { AIChatBox } from './AIChatBox';
import { safeFetchJson } from '../src/utils/safeApi';

const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
  "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei Darussalam", "Bulgaria", "Burkina Faso", "Burundi",
  "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Congo (DRC)", "Costa Rica", "Côte d'Ivoire", "Croatia", "Cuba", "Cyprus", "Czechia",
  "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia",
  "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana",
  "Haiti", "Holy See", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan",
  "Kazakhstan", "Kenya", "Kiribati", "North Korea", "South Korea", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
  "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar",
  "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal",
  "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria",
  "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States of America", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

// AP Logo Component
const Logo = ({ className = "h-10" }: { className?: string }) => {
  const { settings } = useConfiguration();
  
  if (settings.logoUrl) {
    return <img src={settings.logoUrl} alt={settings.siteName} className={className} />;
  }

  return (
    <svg viewBox="0 0 256 195" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M47.7651 189.65L12.0151 189.65L41.3901 27.65L77.1401 27.65L47.7651 189.65Z" fill="black"/>
      <path d="M123.64 189.65L103.015 189.65L118.89 101.9L134.765 189.65L113.14 189.65L123.64 189.65Z" fill="black"/>
      <path d="M117.89 107.65L72.1401 107.65L87.1401 27.65L132.89 27.65L117.89 107.65Z" fill="black"/>
      <path d="M171.14 189.65L132.515 189.65L160.89 27.65L199.515 27.65L171.14 189.65Z" fill="#3296D2"/>
      <path d="M211.515 125.15H176.64L188.89 57.4H223.765C234.39 57.4 242.015 63.65 244.64 74.525C247.265 85.4 244.39 98.775 236.39 110.15C230.14 119.025 221.015 125.15 211.515 125.15Z" fill="#3296D2"/>
      <path d="M245.765 27.65C255.515 41.525 258.89 59.275 255.265 79.4C251.64 99.525 241.64 115.525 227.14 125.4C221.765 129.025 215.765 131.025 209.39 131.025H163.64L190.515 27.65H245.765Z" fill="#3296D2"/>
      <path d="M60.7651 86.4C63.2651 83.275 66.8901 80.9 71.3901 79.4C75.8901 77.9 80.8901 77.4 86.3901 78.025C103.265 79.9 113.39 90.025 106.64 127.15C102.515 150.15 89.2651 161.9 66.7651 162.275C60.3901 162.4 54.1401 161.4 48.0151 159.4" stroke="black" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M110.265 119.775C118.015 106.65 130.64 97.4 148.015 91.9C165.39 86.4 182.14 85.9 198.265 90.4" stroke="#46B4E6" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M102.015 140.525C112.14 128.525 126.14 120.4 144.015 116.025C161.89 111.65 178.265 112.15 193.14 117.525" stroke="#46B4E6" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
};

export const Layout: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState('Regions');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRegionsOpen, setIsRegionsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  
  const { authState, logout } = useAuth();
  const { settings } = useConfiguration();
  const navigate = useNavigate();
  const regionsRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    const results = await GeminiService.webSearch(searchQuery);
    setSearchResults(results);
    setIsSearching(false);
  };

  // IP Detection for Regions
  useEffect(() => {
    let isMounted = true;
    const detectRegion = async () => {
      try {
        const data = await safeFetchJson<any>('/api/geo/region', { timeout: 3000, silent: true } as any);
        if (isMounted && data && data.country_name) {
          setSelectedRegion(data.country_name);
        }
      } catch {
        // Safe default fallback
      }
    };
    detectRegion();
    return () => {
      isMounted = false;
    };
  }, []);

  // Close regions dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (regionsRef.current && !regionsRef.current.contains(event.target as Node)) {
        setIsRegionsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when overlay opens
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Update document title dynamically based on route
  useEffect(() => {
    const site = settings.siteName || 'Academic Publishing Group';
    const path = location.pathname;
    
    if (path === '/') {
      document.title = `${site} | Premier Open Access Academic Publishing Platform`;
    } else if (path.startsWith('/journals')) {
      document.title = `Browse Peer-Reviewed Journals | ${site}`;
    } else if (path.startsWith('/solution')) {
      document.title = `Enterprise Publishing Solutions & Platform | ${site}`;
    } else if (path.startsWith('/editing-services')) {
      document.title = `Language Editing & Manuscript Services | ${site}`;
    } else if (path.startsWith('/contact')) {
      document.title = `Contact Us & Global Offices | ${site}`;
    } else if (path.startsWith('/news')) {
      document.title = `Latest News & Research Highlights | ${site}`;
    } else if (path.startsWith('/about')) {
      document.title = `About Us | ${site}`;
    } else if (path.startsWith('/careers')) {
      document.title = `Careers & Global Opportunities | ${site}`;
    } else if (path.startsWith('/submit')) {
      document.title = `Submit Manuscript | ${site}`;
    } else if (path.startsWith('/admindashboard')) {
      document.title = `Admin Console & Site Governance | ${site}`;
    } else if (path.startsWith('/dashboard')) {
      document.title = `Author & Reviewer Dashboard | ${site}`;
    } else if (path.startsWith('/advanced-search')) {
      document.title = `Advanced Research Search | ${site}`;
    } else if (path.startsWith('/login')) {
      document.title = `Sign In | ${site}`;
    } else if (path.startsWith('/register')) {
      document.title = `Register Account | ${site}`;
    } else if (path.startsWith('/author-guidelines')) {
      document.title = `Author Guidelines & Manuscript Requirements | ${site}`;
    } else if (path.startsWith('/security-compliance')) {
      document.title = `Security, Compliance & Data Trust | ${site}`;
    } else if (path.startsWith('/newsletter') || path.startsWith('/subscribe')) {
      document.title = `Newsletter & Research Journal Alerts | ${site}`;
    } else if (path.startsWith('/admindashboard/subscribers') || path.startsWith('/admindashboard/newsletter')) {
      document.title = `Subscriber Management & Newsletter Console | ${site}`;
    }
  }, [location.pathname, settings.siteName]);

  // Update browser favicon dynamically
  useEffect(() => {
    if (settings.faviconUrl) {
      const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (link) {
        link.href = settings.faviconUrl;
      } else {
        const newLink = document.createElement('link');
        newLink.rel = 'icon';
        newLink.href = settings.faviconUrl;
        document.head.appendChild(newLink);
      }
    }
  }, [settings.faviconUrl]);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[100] bg-white animate-in fade-in duration-200 flex flex-col">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between border-b border-gray-100">
            <div className="flex items-center gap-3">
              <Logo className="h-8 md:h-10" />
              <span className="font-serif text-xl font-black">SEARCH</span>
            </div>
            <button 
              onClick={() => setIsSearchOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={24} className="text-brand-navy" />
            </button>
          </div>
          
          <div className="flex-grow overflow-y-auto">
            <div className="container mx-auto px-6 py-12 max-w-4xl">
              <form onSubmit={handleSearch} className="relative mb-12">
                <input 
                  ref={searchInputRef}
                  type="text" 
                  placeholder="Search journals, articles, or the entire web..." 
                  className="w-full text-2xl md:text-3xl font-serif border-b-2 border-brand-navy/10 py-4 outline-none focus:border-[#0052cc] transition-colors pr-12"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button 
                  type="submit"
                  className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-brand-navy hover:text-[#0052cc]"
                >
                  <Search size={28} />
                </button>
              </form>

              {isSearching && (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <Loader2 className="animate-spin text-[#0052cc]" size={48} />
                  <p className="text-brand-navy/60 font-medium animate-pulse">Searching the web with Academic Publishing Intelligence...</p>
                </div>
              )}

              {searchResults && !isSearching && (
                <div className="animate-in slide-in-from-bottom-4 duration-500">
                  <div className="prose prose-blue max-w-none mb-12">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-brand-navy/40 mb-4">Search Insights</h3>
                    <p className="text-brand-navy/80 text-lg leading-relaxed whitespace-pre-wrap">
                      {searchResults.text}
                    </p>
                  </div>

                  {searchResults.sources.length > 0 && (
                    <div className="border-t border-gray-100 pt-8">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-brand-navy/40 mb-6">Sources & References</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {searchResults.sources.map((source, idx) => (
                          <a 
                            key={idx} 
                            href={source.uri} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-start gap-3 p-4 border border-gray-100 rounded-sm hover:border-[#0052cc] hover:bg-blue-50/30 transition-all group"
                          >
                            <Globe size={16} className="text-[#0052cc] mt-1 flex-shrink-0" />
                            <div className="overflow-hidden">
                              <div className="font-bold text-sm text-brand-navy group-hover:text-[#0052cc] truncate">{source.title}</div>
                              <div className="text-[10px] text-brand-navy/40 truncate flex items-center gap-1">
                                {new URL(source.uri).hostname} <ExternalLink size={8} />
                              </div>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {!isSearching && !searchResults && (
                <div className="text-center py-20 opacity-30">
                  <Search size={64} className="mx-auto mb-4" />
                  <p className="text-lg">What would you like to discover today?</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Top Utility Bar */}
      <div className="bg-brand-navy text-white/80 text-[11px] font-medium py-1.5 hidden md:block">
        <div className="container mx-auto px-6 flex justify-end gap-5">
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            <Search size={12} /> Search
          </button>
          <Link 
            to="/careers"
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            <User size={12} /> Careers
          </Link>
          <Link to="/contact" className="flex items-center gap-1 hover:text-white transition-colors">Contact</Link>
          
          {/* Regions Dropdown */}
          <div className="relative" ref={regionsRef}>
            <button 
              onClick={() => setIsRegionsOpen(!isRegionsOpen)}
              className={`flex items-center gap-1 hover:text-white transition-colors ${isRegionsOpen ? 'text-white' : ''}`}
            >
              <Globe size={12} /> {selectedRegion} <ChevronDown size={10} className={`transition-transform duration-200 ${isRegionsOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isRegionsOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded shadow-2xl z-[60] border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="bg-[#0052cc] px-4 py-2 text-white font-bold text-[10px] uppercase tracking-widest border-b border-white/10">
                  Select Region
                </div>
                <div className="max-h-[320px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
                  <div className="grid grid-cols-1 divide-y divide-gray-50">
                    {COUNTRIES.map((country) => (
                      <button 
                        key={country}
                        onClick={() => {
                          setSelectedRegion(country);
                          setIsRegionsOpen(false);
                        }}
                        className={`px-4 py-2.5 text-left text-brand-navy hover:bg-gray-50 hover:text-[#0052cc] text-[12px] font-medium transition-colors w-full ${selectedRegion === country ? 'bg-blue-50 text-[#0052cc]' : ''}`}
                      >
                        {country}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 bg-white text-brand-navy border-b border-gray-100 shadow-sm transition-all">
        <div className="container mx-auto px-4 md:px-6 h-14 md:h-20 flex items-center justify-between">
          <div className="flex items-center gap-4 md:gap-10">
            {/* Main Logo */}
            <Link to="/" className="flex items-center gap-2.5 md:gap-3 group">
              <Logo className="h-8 md:h-12 transition-transform group-hover:scale-105 flex-shrink-0" />
              <div className="flex flex-col leading-tight">
                <span className="text-xs md:text-sm font-bold uppercase tracking-wider text-brand-navy max-w-[180px] sm:max-w-none truncate leading-snug">
                  {settings.siteName}
                </span>
              </div>
            </Link>

            {/* Main Nav (Desktop) */}
            <nav className="hidden lg:flex items-center gap-6">
              <Link to="/solution" className="text-[13px] font-bold hover:text-[#0052cc] transition-colors">Solution</Link>
              <Link to="/journals" className="text-[13px] font-bold hover:text-[#0052cc] transition-colors">Journals</Link>
              <Link to="/editing-services" className="text-[13px] font-bold hover:text-[#0052cc] transition-colors">Editing Services</Link>
              <Link to="/news" className="text-[13px] font-bold hover:text-[#0052cc] transition-colors">News</Link>
              <Link to="/about" className="text-[13px] font-bold hover:text-[#0052cc] transition-colors">About</Link>
              <Link to="/submit" className="text-[13px] font-bold bg-[#0052cc] text-white px-4 py-1.5 rounded-sm hover:bg-brand-navy transition-colors ml-2">Submit Manuscript</Link>
            </nav>
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            {/* Search Icon (Mobile quick access) */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="lg:hidden p-2 text-brand-navy hover:bg-gray-100 rounded-md transition-colors"
              title="Search"
            >
              <Search size={20} />
            </button>

            {authState.isAuthenticated ? (
               <div className="hidden md:flex items-center gap-4">
                 {authState.user?.role === 'admin' && (
                   <Link to="/admindashboard" className="text-xs font-bold text-brand-action hover:underline uppercase tracking-widest">Admin Console</Link>
                 )}
                 <Link to="/dashboard" className="text-xs font-bold text-[#0052cc] hover:underline uppercase tracking-widest">Dashboard</Link>
                 <button onClick={handleLogout} className="text-xs font-bold opacity-60 hover:opacity-100 uppercase tracking-widest">Logout</button>
               </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link to="/login" className="btn-pill bg-brand-light text-brand-navy text-xs hover:bg-[#0052cc] hover:text-white border border-brand-navy/10">
                  Login
                </Link>
                <Link to="/register" className="btn-pill bg-[#0052cc] text-white text-xs hover:bg-brand-navy border border-transparent">
                  Register
                </Link>
              </div>
            )}

            <button 
              className="md:hidden p-2 text-brand-navy hover:bg-gray-100 rounded-md transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden bg-brand-navy text-white border-t border-white/10 p-6 space-y-4 animate-in slide-in-from-top-2 duration-200">
             {/* Quick Search */}
             <button
               onClick={() => {
                 setIsSearchOpen(true);
                 setIsMenuOpen(false);
               }}
               className="w-full flex items-center justify-between bg-white/10 hover:bg-white/15 px-4 py-2.5 rounded-sm text-sm font-medium transition-colors mb-2"
             >
               <span className="flex items-center gap-2 text-white/80">
                 <Search size={16} /> Search journals & articles
               </span>
               <ChevronRight size={16} className="text-white/40" />
             </button>

             <Link to="/solution" onClick={() => setIsMenuOpen(false)} className="block text-white font-bold hover:text-brand-action transition-colors">Solution</Link>
             <Link to="/journals" onClick={() => setIsMenuOpen(false)} className="block text-white font-bold hover:text-brand-action transition-colors">Journals</Link>
             <Link to="/editing-services" onClick={() => setIsMenuOpen(false)} className="block text-white font-bold hover:text-brand-action transition-colors">Editing Services</Link>
             <Link to="/news" onClick={() => setIsMenuOpen(false)} className="block text-white font-bold hover:text-brand-action transition-colors">News</Link>
             <Link to="/about" onClick={() => setIsMenuOpen(false)} className="block text-white font-bold hover:text-brand-action transition-colors">About</Link>
             <Link to="/careers" onClick={() => setIsMenuOpen(false)} className="block text-white/80 font-medium hover:text-white transition-colors">Careers</Link>
             <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="block text-white/80 font-medium hover:text-white transition-colors">Contact</Link>
             
             {/* Region selector for mobile */}
             <div className="pt-2">
               <div className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Region</div>
               <select
                 value={selectedRegion}
                 onChange={(e) => setSelectedRegion(e.target.value)}
                 className="w-full bg-white/10 text-white text-xs py-2 px-3 rounded border border-white/10 outline-none"
               >
                 {COUNTRIES.map(country => (
                   <option key={country} value={country} className="bg-brand-navy text-white">
                     {country}
                   </option>
                 ))}
               </select>
             </div>

             <div className="pt-2">
               <Link 
                 to="/submit" 
                 onClick={() => setIsMenuOpen(false)} 
                 className="block text-center text-white font-bold bg-[#0052cc] py-2.5 rounded-sm hover:bg-[#003d99] transition-colors shadow"
               >
                 Submit Manuscript
               </Link>
             </div>

             <hr className="opacity-10 my-4" />

             {authState.isAuthenticated ? (
                <div className="space-y-3">
                  {authState.user?.role === 'admin' && (
                    <Link to="/admindashboard" onClick={() => setIsMenuOpen(false)} className="block text-brand-action font-bold">Admin Console</Link>
                  )}
                  <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="block text-[#46B4E6] font-bold">Dashboard</Link>
                  <button 
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }} 
                    className="block text-white/60 font-bold hover:text-white transition-colors"
                  >
                    Logout
                  </button>
                </div>
             ) : (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Link 
                    to="/login" 
                    onClick={() => setIsMenuOpen(false)} 
                    className="block text-center bg-white/10 hover:bg-white/20 text-white font-bold py-2 rounded-sm text-sm transition-colors"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    onClick={() => setIsMenuOpen(false)} 
                    className="block text-center bg-[#0052cc] hover:bg-[#003d99] text-white font-bold py-2 rounded-sm text-sm transition-colors"
                  >
                    Register
                  </Link>
                </div>
             )}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      <AIChatBox />

      {/* Footer */}
      <footer className="bg-brand-navy text-white pt-16 pb-8">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div>
              <h4 className="font-bold text-sm mb-6 uppercase tracking-widest text-white/50">Explore</h4>
              <ul className="space-y-2 text-[13px]">
                <li><Link to="/company" className="hover:text-brand-action">Our company</Link></li>
                <li><Link to="/leadership" className="hover:text-brand-action">Our leadership team</Link></li>
                <li><Link to="/careers" className="hover:text-brand-action">Careers</Link></li>
                <li><Link to="/contact" className="hover:text-brand-action">Contact us</Link></li>
                <li><Link to="/newsletter" className="hover:text-brand-action text-brand-light font-semibold flex items-center gap-1.5"><span>Subscribe to Newsletter</span></Link></li>
                <li><Link to="/solution" className="hover:text-brand-action">Solution</Link></li>
                <li><Link to="/explore-enterprise" className="hover:text-brand-action">Explore Enterprise</Link></li>
                <li><Link to="/user-roles" className="hover:text-brand-action">User Roles</Link></li>
                <li><Link to="/submission-workflow" className="hover:text-brand-action">Submission Workflow</Link></li>
                <li><Link to="/review-management" className="hover:text-brand-action">Review Management</Link></li>
                <li><Link to="/publication-module" className="hover:text-brand-action">Publication Module</Link></li>
                <li><Link to="/security-compliance" className="hover:text-brand-action">Security & Compliance</Link></li>
                <li><Link to="/editing-services" className="hover:text-brand-action">Editing Services</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-6 uppercase tracking-widest text-white/50">Our policies</h4>
              <ul className="space-y-2 text-[13px]">
                <li><Link to="/privacy-policy" className="hover:text-brand-action">Privacy policy</Link></li>
                <li><Link to="/cookies" className="hover:text-brand-action">Cookie Policy</Link></li>
                <li>
                  <button 
                    type="button"
                    onClick={() => window.dispatchEvent(new CustomEvent('open-cookie-preferences'))} 
                    className="hover:text-brand-action text-left text-[13px] text-white/70 hover:text-white transition-colors"
                  >
                    Manage Cookie Preferences
                  </button>
                </li>
                <li><Link to="/terms-and-conditions" className="hover:text-brand-action">Terms and conditions</Link></li>
                <li><Link to="/accessibility" className="hover:text-brand-action">Accessibility</Link></li>
                <li><Link to="/modern-slavery" className="hover:text-brand-action">Modern slavery</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-6 uppercase tracking-widest text-white/50">Information for</h4>
              <ul className="space-y-2 text-[13px]">
                <li><Link to="/author-guidelines" className="hover:text-brand-action">Instruction Guide</Link></li>
                <li><Link to="/book-authors" className="hover:text-brand-action">Book Authors</Link></li>
                <li><Link to="/journal-authors" className="hover:text-brand-action">Journal Authors</Link></li>
                <li><Link to="/librarians" className="hover:text-brand-action">Librarians</Link></li>
                <li><Link to="/editors" className="hover:text-brand-action">Editors</Link></li>
                <li><Link to="/societies" className="hover:text-brand-action">Societies</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-6 uppercase tracking-widest text-white/50">Support</h4>
              <ul className="space-y-2 text-[13px]">
                <li><Link to="/customer-support" className="hover:text-brand-action">Customer support</Link></li>
                <li><button onClick={() => window.dispatchEvent(new CustomEvent('openSalesChat'))} className="hover:text-brand-action text-left">Chat with us</button></li>
                <li><Link to="/rights-permissions" className="hover:text-brand-action">Rights and permissions</Link></li>
                <li><Link to="/royalty-recipients" className="hover:text-brand-action">Royalty recipients</Link></li>
              </ul>
              <div className="mt-8">
                <h4 className="font-bold text-sm mb-4 uppercase tracking-widest text-white/50">Follow us</h4>
                <div className="flex flex-wrap gap-3 items-center">
                  {settings.socialLinks?.linkedinUrl && (
                    <a 
                      href={settings.socialLinks.linkedinUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      title="LinkedIn"
                      className="p-2 bg-white/5 hover:bg-brand-action/20 hover:text-brand-action text-white rounded-full transition-all border border-white/10"
                    >
                      <Linkedin size={18} />
                    </a>
                  )}
                  {settings.socialLinks?.twitterUrl && (
                    <a 
                      href={settings.socialLinks.twitterUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      title="Twitter / X"
                      className="p-2 bg-white/5 hover:bg-brand-action/20 hover:text-brand-action text-white rounded-full transition-all border border-white/10"
                    >
                      <Twitter size={18} />
                    </a>
                  )}
                  {settings.socialLinks?.youtubeUrl && (
                    <a 
                      href={settings.socialLinks.youtubeUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      title="YouTube"
                      className="p-2 bg-white/5 hover:bg-brand-action/20 hover:text-brand-action text-white rounded-full transition-all border border-white/10"
                    >
                      <Youtube size={18} />
                    </a>
                  )}
                  {settings.socialLinks?.facebookUrl && (
                    <a 
                      href={settings.socialLinks.facebookUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      title="Facebook"
                      className="p-2 bg-white/5 hover:bg-brand-action/20 hover:text-brand-action text-white rounded-full transition-all border border-white/10"
                    >
                      <Facebook size={18} />
                    </a>
                  )}
                  {settings.socialLinks?.instagramUrl && (
                    <a 
                      href={settings.socialLinks.instagramUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      title="Instagram"
                      className="p-2 bg-white/5 hover:bg-brand-action/20 hover:text-brand-action text-white rounded-full transition-all border border-white/10"
                    >
                      <Instagram size={18} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-[11px] text-white/40">
             <div className="text-center md:text-left">
                <p className="font-bold text-white mb-1">© {settings.copyrightYear} {settings.siteName}</p>
                <p className="max-w-md">{settings.siteFooterInfo}</p>
             </div>
             <div className="text-center md:text-right opacity-60">
                <p>Registered in England & Wales No. 3099067</p>
                <p>5 Howick Place | London | SW1P 1WG</p>
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
};