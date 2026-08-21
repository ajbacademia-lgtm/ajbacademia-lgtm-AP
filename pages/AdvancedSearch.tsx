import React, { useState } from 'react';
import { Search, ArrowLeft, Loader2, FileText, User, Globe, ExternalLink, Hash, Book, Plus, Trash2, X, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GeminiService, SearchResult } from '../services/geminiService';

type SearchCategory = 'Title' | 'Abstract' | 'Keywords' | 'Authors' | 'Affiliations' | 'DOI' | 'Full Text' | 'References';

interface SearchRow {
  id: string;
  category: SearchCategory;
  value: string;
}

const CATEGORIES: SearchCategory[] = [
  'Title', 'Abstract', 'Keywords', 'Authors', 'Affiliations', 'DOI', 'Full Text', 'References'
];

const CATEGORY_ICONS: Record<SearchCategory, React.ReactNode> = {
  'Title': <FileText size={14} />,
  'Authors': <User size={14} />,
  'Keywords': <Hash size={14} />,
  'DOI': <ExternalLink size={14} />,
  'Affiliations': <Globe size={14} />,
  'Abstract': <Book size={14} />,
  'Full Text': <FileText size={14} />,
  'References': <Hash size={14} />,
};

export const AdvancedSearch: React.FC = () => {
  const [searchRows, setSearchRows] = useState<SearchRow[]>([
    { id: '1', category: 'Title', value: '' }
  ]);
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResult | null>(null);

  const addRow = () => {
    setSearchRows([...searchRows, { id: Math.random().toString(36).substr(2, 9), category: 'Full Text', value: '' }]);
  };

  const removeRow = (id: string) => {
    if (searchRows.length > 1) {
      setSearchRows(searchRows.filter(row => row.id !== id));
    } else {
      setSearchRows([{ id: '1', category: 'Title', value: '' }]);
    }
  };

  const updateRow = (id: string, updates: Partial<SearchRow>) => {
    setSearchRows(searchRows.map(row => row.id === id ? { ...row, ...updates } : row));
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const activeRows = searchRows.filter(row => row.value.trim() !== '');
    if (activeRows.length === 0) return;

    setIsSearching(true);
    
    const queryParts = activeRows.map(row => `${row.category.toUpperCase()}: ${row.value}`);
    const combinedQuery = `Find academic papers matching these specific criteria: ${queryParts.join('; ')}. Provide a structured analysis of the findings.`;
    
    const searchResult = await GeminiService.webSearch(combinedQuery);
    setResults(searchResult);
    setIsSearching(false);
  };

  const clearAll = () => {
    setSearchRows([{ id: '1', category: 'Title', value: '' }]);
    setResults(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-brand-navy text-white py-10">
        <div className="container mx-auto px-6">
          <Link to="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-4 transition-colors text-sm">
            <ArrowLeft size={14} /> Back to Home
          </Link>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-serif font-bold">Advanced Search</h1>
              <p className="mt-1 text-white/50 text-sm max-w-xl">
                Precision discovery across metadata, full-text, and citations.
              </p>
            </div>
            {results && (
              <button 
                onClick={clearAll}
                className="text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white flex items-center gap-2 transition-colors border border-white/10 px-4 py-2 rounded-sm"
              >
                <X size={14} /> Clear Search
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 -mt-6">
        <div className="flex flex-col gap-8">
          {/* Minimized Search Builder Card */}
          <div className="bg-white p-6 md:p-8 rounded-sm shadow-xl border border-gray-100 w-full max-w-5xl mx-auto">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="space-y-3">
                {searchRows.map((row, index) => (
                  <div key={row.id} className="flex flex-col sm:flex-row items-center gap-2 animate-in slide-in-from-left-2 duration-200">
                    <div className="relative w-full sm:w-48 group">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-navy/30 group-focus-within:text-[#0052cc]">
                        {CATEGORY_ICONS[row.category]}
                      </div>
                      <select
                        value={row.category}
                        onChange={(e) => updateRow(row.id, { category: e.target.value as SearchCategory })}
                        className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-sm outline-none focus:border-[#0052cc] focus:bg-white text-xs font-bold uppercase tracking-tight text-brand-navy/70 appearance-none cursor-pointer"
                      >
                        {CATEGORIES.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-20">
                        <Search size={10} />
                      </div>
                    </div>

                    <input
                      type="text"
                      placeholder={`Search by ${row.category}...`}
                      value={row.value}
                      onChange={(e) => updateRow(row.id, { value: e.target.value })}
                      className="flex-grow w-full px-4 py-2.5 border border-gray-200 rounded-sm outline-none focus:border-[#0052cc] text-sm transition-colors"
                      autoFocus={index === searchRows.length - 1 && searchRows.length > 1}
                    />

                    <button
                      type="button"
                      onClick={() => removeRow(row.id)}
                      className="p-2.5 text-brand-navy/20 hover:text-red-500 transition-colors"
                      title="Remove field"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-50 mt-6">
                <button
                  type="button"
                  onClick={addRow}
                  className="flex items-center gap-2 text-[#0052cc] text-xs font-bold uppercase tracking-widest hover:bg-blue-50 px-4 py-2 rounded-sm transition-all"
                >
                  <Plus size={16} /> Add Search Field
                </button>

                <button
                  type="submit"
                  disabled={isSearching}
                  className="w-full sm:w-auto bg-[#0052cc] hover:bg-brand-navy text-white px-10 py-3 rounded-sm font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-blue-500/20"
                >
                  {isSearching ? (
                    <>
                      <Loader2 className="animate-spin" size={18} /> Searching...
                    </>
                  ) : (
                    <>
                      <Search size={18} /> Execute Search
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Results Area */}
          <div className="max-w-5xl mx-auto w-full">
            {isSearching ? (
              <div className="bg-white p-12 rounded-sm border border-gray-100 flex flex-col items-center justify-center text-center shadow-sm">
                <Loader2 className="animate-spin text-[#0052cc] mb-4" size={40} />
                <h3 className="text-lg font-bold text-brand-navy">Processing Advanced Query...</h3>
                <p className="text-brand-navy/50 text-sm mt-1">Cross-referencing scientific databases and open-access repositories.</p>
              </div>
            ) : results ? (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-white p-8 rounded-sm border border-gray-100 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#0052cc]"></div>
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#0052cc] mb-6">Expert Discovery Intelligence</h3>
                  <div className="prose prose-blue max-w-none text-brand-navy/80 leading-relaxed text-sm md:text-base">
                    {results.text}
                  </div>
                </div>

                {results.sources.length > 0 && (
                  <div>
                    <div className="flex items-center gap-4 mb-6">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-brand-navy/40 whitespace-nowrap">Verified Records Found</h3>
                      <div className="w-full h-[1px] bg-brand-navy/5"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {results.sources.map((source, idx) => (
                        <a
                          key={idx}
                          href={source.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-start gap-4 p-5 bg-white border border-gray-100 rounded-sm hover:border-[#0052cc] hover:shadow-md transition-all group"
                        >
                          <div className="bg-gray-50 p-2 rounded-sm text-brand-navy/30 group-hover:text-[#0052cc] group-hover:bg-[#0052cc]/5 transition-colors">
                            <Book size={18} />
                          </div>
                          <div className="flex-grow overflow-hidden">
                            <div className="font-bold text-brand-navy group-hover:text-[#0052cc] transition-colors leading-tight text-sm">
                              {source.title}
                            </div>
                            <div className="text-[10px] text-brand-navy/40 mt-2 flex items-center gap-2 font-medium">
                              <Globe size={10} /> {new URL(source.uri).hostname}
                            </div>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-20 text-center opacity-20 flex flex-col items-center">
                <SlidersHorizontal size={48} className="mb-4 text-brand-navy" />
                <p className="text-sm font-medium mb-8">Define your criteria above to explore the academic horizon.</p>
                <Link to="/submission-workflow" className="text-xs font-black uppercase tracking-widest text-brand-navy hover:text-brand-action transition-colors flex items-center gap-2 opacity-100">
                  🔹 View Submission Workflow <ArrowRight size={14} />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Internal icon for consistency if SlidersHorizontal is needed
const SlidersHorizontal = ({ size, className }: { size: number, className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <line x1="21" y1="4" x2="14" y2="4" />
    <line x1="10" y1="4" x2="3" y2="4" />
    <line x1="21" y1="12" x2="12" y2="12" />
    <line x1="8" y1="12" x2="3" y2="12" />
    <line x1="21" y1="20" x2="16" y2="20" />
    <line x1="12" y1="20" x2="3" y2="20" />
    <line x1="14" y1="2" x2="14" y2="6" />
    <line x1="8" y1="10" x2="8" y2="14" />
    <line x1="16" y1="18" x2="16" y2="22" />
  </svg>
);
