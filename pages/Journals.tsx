import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MockService } from '../services/mockDb';
import { Journal } from '../types';
import { ChevronRight, Search, BookOpen, Filter, X } from 'lucide-react';

const SUBJECT_AREAS = {
  "Science & Technology": ["Bioscience", "Chemistry", "Computer & Information Sciences", "Earth Sciences", "Environment & Agriculture", "Environment & Sustainability", "Environmental Sciences", "Food Science & Technology", "Information Science", "Mathematics", "Physical Sciences", "Statistics"],
  "Engineering": ["Automotive Engineering", "Biomedical Engineering", "Chemical Engineering", "Civil Engineering", "Electrical Engineering", "Energy & Oil", "Engineering, Computing & Technology", "Environmental Engineering", "General Engineering", "Industrial & Manufacturing Engineering", "Materials Science & Engineering", "Mechanical Engineering", "Mining Engineering", "Sustainable Engineering"],
  "Medicine & Healthcare": ["Addiction & Treatment", "Allied Health", "Anesthesiology", "Behavioral Health and Medicine", "Cardiology", "Clinical Medicine", "Dentistry", "Dermatology", "Endocrinology", "Expert Collection", "Hematology", "Hospitals and Health Systems", "Immunology", "Infectious Diseases", "Nephrology", "Neurology", "Nursing", "Oncology", "Pediatrics", "Pharmaceutical Sciences", "Psychiatry", "Public Health", "Radiology", "Substance Use & Misuse", "Surgery", "Urology", "Veterinary Medicine", "Women's Health"],
  "Humanities & Social Sciences": ["Area Studies", "Arts", "Behavioural Sciences", "Built Environment", "Business & Management", "Communication Studies", "Economics", "Education", "Finance", "Geography", "Global Development", "History", "Humanities and Social Sciences", "International Relations", "Language", "Law", "Literature", "Museum and Heritage Studies", "Philosophy", "Politics", "Psychology", "Religion", "Routledge Encyclopedia of Modernism", "Routledge Handbooks Online", "Sociology", "Tourism, Hospitality and Events", "Urban Studies", "World Who's Who"]
};

export const Journals: React.FC = () => {
  const [journals, setJournals] = useState<Journal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    MockService.getJournals()
      .then(data => {
        setJournals(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load journals:", err);
        setError("Database synchronization failed. Please refresh your browser or check your connection.");
        setLoading(false);
      });
  }, []);

  const filteredJournals = journals.filter(j => {
    const matchesSearch = j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.issn.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !selectedCategory || j.category === selectedCategory;
    const matchesSubject = !selectedSubject || j.subject === selectedSubject;
    
    return matchesSearch && matchesCategory && matchesSubject;
  });

  const slugify = (text: string) => {
    return text.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-').replace(/,/g, '').replace(/'/g, '');
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Link to="/" className="hover:text-brand-600">Home</Link>
            <ChevronRight size={14} />
            <span className="text-slate-900 font-medium">Journals</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 mt-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-serif font-bold text-slate-900">Featured Journals</h1>
            <p className="text-slate-600 mt-2">Explore our collection of high-quality, peer-reviewed open access journals.</p>
          </div>
          
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search journals by title, ISSN, or subject..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-md focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Sidebar: Subject Areas */}
          <div className="lg:col-span-3 space-y-8">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-slate-900 flex items-center gap-2">
                  <Filter size={18} className="text-brand-600" /> Filter by Subject
                </h2>
                {(selectedCategory || selectedSubject) && (
                  <button 
                    onClick={() => { setSelectedCategory(null); setSelectedSubject(null); }}
                    className="text-xs text-red-600 hover:underline flex items-center gap-1"
                  >
                    <X size={12} /> Clear
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {Object.entries(SUBJECT_AREAS).map(([category, subjects]) => (
                  <div key={category} className="space-y-2">
                    <button 
                      onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                      className={`w-full text-left text-sm font-bold flex items-center justify-between p-2 rounded transition-colors ${selectedCategory === category ? 'bg-brand-50 text-brand-700' : 'text-slate-700 hover:bg-gray-50'}`}
                    >
                      {category}
                      <ChevronRight size={14} className={`transition-transform ${selectedCategory === category ? 'rotate-90' : ''}`} />
                    </button>
                    
                    {selectedCategory === category && (
                      <div className="pl-4 space-y-1 animate-in fade-in slide-in-from-top-1 duration-200">
                        {subjects.map(subject => (
                          <button
                            key={subject}
                            onClick={() => setSelectedSubject(subject)}
                            className={`w-full text-left text-xs py-1.5 px-2 rounded transition-colors ${selectedSubject === subject ? 'text-brand-700 font-bold bg-brand-50/50' : 'text-slate-500 hover:text-brand-600 hover:bg-gray-50'}`}
                          >
                            {subject}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-brand-navy text-white p-6 rounded-lg shadow-md">
              <h3 className="font-bold mb-4">Submit your research</h3>
              <p className="text-sm text-white/70 mb-6">Join thousands of researchers who have published their work with Academic Publishing.</p>
              <div className="space-y-3">
                <Link to="/submit" className="block text-center bg-white text-brand-navy py-2 rounded font-bold text-sm hover:bg-brand-light transition-colors">
                  Submit Manuscript
                </Link>
                <Link to="/submission-workflow" className="block text-center border border-white/20 text-white py-2 rounded font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-colors">
                  View Workflow
                </Link>
                <Link to="/publication-module" className="block text-center border border-white/20 text-white py-2 rounded font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-colors">
                  Publication Suite
                </Link>
                <Link to="/admindashboard" className="block text-center border border-white/20 text-white py-2 rounded font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-colors">
                  Admin Dashboards
                </Link>
              </div>
            </div>
          </div>

          {/* Main Content: Journal Grid */}
          <div className="lg:col-span-9">
            {selectedSubject && (
              <div className="mb-6 flex items-center gap-2 bg-brand-50 text-brand-700 px-4 py-2 rounded-md border border-brand-100">
                <span className="text-sm font-medium">Showing journals in: <strong>{selectedSubject}</strong></span>
                <button onClick={() => setSelectedSubject(null)} className="hover:text-brand-900"><X size={14} /></button>
              </div>
            )}

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mb-4"></div>
                <p className="text-slate-500">Loading journals...</p>
              </div>
            ) : error ? (
              <div className="py-20 text-center">
                <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                   <Filter size={32} className="text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Synchronization Error</h3>
                <p className="text-slate-500 mt-2 max-w-sm mx-auto">{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-6 text-brand-600 font-bold hover:underline"
                >
                  Retry Synchronization
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredJournals.map(journal => (
                  <Link 
                    key={journal.id} 
                    to={`/journal/${journal.id}`}
                    className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all group flex flex-col"
                  >
                    <div className="aspect-[3/4] relative overflow-hidden bg-gray-100">
                      <img 
                        src={journal.coverImage} 
                        alt={journal.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                    </div>
                    <div className="p-5 flex-grow flex flex-col">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-brand-600 bg-brand-50 px-2 py-0.5 rounded">Open Access</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-gray-100 px-2 py-0.5 rounded">ISSN: {journal.issn}</span>
                      </div>
                      <h2 className="text-lg font-serif font-bold text-slate-900 mb-2 group-hover:text-brand-600 transition-colors line-clamp-2">
                        {journal.title}
                      </h2>
                      <p className="text-xs text-slate-600 line-clamp-3 mb-4 flex-grow">
                        {journal.description}
                      </p>
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                          <BookOpen size={12} /> View Journal
                        </span>
                        <ChevronRight size={16} className="text-brand-600 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                ))}
                
                {filteredJournals.length === 0 && (
                  <div className="col-span-full py-20 text-center">
                    <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search size={32} className="text-slate-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">No journals found</h3>
                    <p className="text-slate-500 mt-2">Try adjusting your search terms or browse by subject area.</p>
                    <button 
                      onClick={() => { setSearchTerm(''); setSelectedCategory(null); setSelectedSubject(null); }}
                      className="mt-6 text-brand-600 font-bold hover:underline"
                    >
                      Clear all filters
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Subject Areas Section at Bottom */}
        <section className="mt-20 pt-20 border-t border-gray-200">
          <div className="flex items-center gap-6 mb-12">
            <h2 className="text-2xl font-serif font-bold text-slate-900 whitespace-nowrap">Our subject areas and disciplines</h2>
            <div className="w-full h-[1px] bg-gray-200"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {Object.entries(SUBJECT_AREAS).map(([category, items]) => (
              <div key={category}>
                <h3 className="font-bold text-slate-900 mb-6 pb-2 border-b border-gray-100 text-lg">{category}</h3>
                <ul className="space-y-2">
                  {items.slice(0, 8).map(item => (
                    <li key={item}>
                      <button 
                        onClick={() => {
                          setSelectedCategory(category);
                          setSelectedSubject(item);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="text-sm text-slate-600 hover:text-brand-600 transition-colors hover:underline text-left"
                      >
                        {item}
                      </button>
                    </li>
                  ))}
                  {items.length > 8 && (
                    <li>
                      <button 
                        onClick={() => {
                          setSelectedCategory(category);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="text-xs font-bold text-brand-600 hover:underline"
                      >
                        View all {items.length} subjects
                      </button>
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

