import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, Layout, Info, Layers, Type } from 'lucide-react';

export const SubmissionGuidelines: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Detail Header */}
      <div className="bg-slate-50 border-b border-slate-200 pt-32 pb-16">
        <div className="container mx-auto px-6">
          <Link to="/author-guidelines" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-brand-navy transition-colors mb-8">
            <ArrowLeft size={14} /> Back to Guidelines
          </Link>
          <div className="max-w-4xl text-left">
            <h1 className="text-4xl md:text-5xl font-serif font-black text-brand-navy mb-6 leading-tight">
              02. Submission <span className="text-brand-action">Guidelines</span>
            </h1>
            <p className="text-lg text-slate-500 font-light leading-relaxed">
              Standardized formatting ensures efficient peer-review and high-quality production of your intellectual property.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-20">
        <div className="max-w-4xl text-left space-y-20">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <section className="space-y-6 text-left">
              <h3 className="text-lg font-black text-brand-navy uppercase tracking-widest flex items-center gap-3">
                <div className="w-8 h-px bg-brand-action"></div> Format & Length
              </h3>
              <div className="space-y-4">
                <div className="p-6 border border-slate-100 bg-slate-50/50 rounded flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Typeset Limit</span>
                  <span className="text-sm font-black text-brand-navy">11 Pages</span>
                </div>
                <div className="p-6 border border-slate-100 bg-slate-50/50 rounded flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Main Text</span>
                  <span className="text-sm font-black text-brand-navy">4,500 Words</span>
                </div>
                <div className="p-6 border border-slate-100 bg-slate-50/50 rounded flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Title Length</span>
                  <span className="text-sm font-black text-brand-navy">20 Words Max</span>
                </div>
                <div className="p-6 border border-slate-100 bg-slate-50/50 rounded flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Abstract</span>
                  <span className="text-sm font-black text-brand-navy">200 Words</span>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h3 className="text-lg font-black text-brand-navy uppercase tracking-widest flex items-center gap-3">
                <div className="w-8 h-px bg-brand-action"></div> Technical Specs
              </h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                   <div className="w-10 h-10 bg-slate-100 rounded flex items-center justify-center shrink-0">
                      <FileText size={18} className="text-brand-navy" />
                   </div>
                   <div>
                     <h4 className="text-sm font-bold text-brand-navy mb-1">MS Word Preferred</h4>
                     <p className="text-xs text-slate-500 leading-relaxed">Microsoft Word is our primary processing format. LaTeX is accepted for first submission only.</p>
                   </div>
                </div>
                <div className="flex gap-4">
                   <div className="w-10 h-10 bg-slate-100 rounded flex items-center justify-center shrink-0">
                      <Type size={18} className="text-brand-navy" />
                   </div>
                   <div>
                     <h4 className="text-sm font-bold text-brand-navy mb-1">Article Class</h4>
                     <p className="text-xs text-slate-500 leading-relaxed">For LaTeX, use standard ‘Article’ class. Include .bbl files; we do not accept .bib.</p>
                   </div>
                </div>
                <div className="flex gap-4">
                   <div className="w-10 h-10 bg-slate-100 rounded flex items-center justify-center shrink-0">
                      <Layout size={18} className="text-brand-navy" />
                   </div>
                   <div>
                     <h4 className="text-sm font-bold text-brand-navy mb-1">Display Items</h4>
                     <p className="text-xs text-slate-500 leading-relaxed">Limited to 8 total items (Figures + Tables combined) per manuscript.</p>
                   </div>
                </div>
              </div>
            </section>
          </div>

          <section className="space-y-8">
            <h3 className="text-lg font-black text-brand-navy uppercase tracking-widest flex items-center gap-3">
              <div className="w-8 h-px bg-brand-action"></div> Manuscript Architecture
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: 'Title Page', desc: 'Affiliations and marked corresponding author' },
                { title: 'Introduction', desc: 'Background and scientific rationale' },
                { title: 'Results', desc: 'Data presentation with optional subheadings' },
                { title: 'Discussion', desc: 'Interpretation without subheadings' },
                { title: 'Methods', desc: 'Detailed, reproducible protocols' },
                { title: 'References', desc: 'Sequentially numbered, Nature style' },
                { title: 'Data Statement', desc: 'Mandatory availability declaration' },
                { title: 'Competing Interests', desc: 'Explicit conflict of interest statement' }
              ].map((item, i) => (
                <div key={i} className="p-6 border border-slate-100 hover:border-brand-action/30 transition-all">
                  <div className="text-xs font-black uppercase tracking-widest text-brand-navy mb-2">{item.title}</div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="p-8 bg-rose-50 border border-rose-100 rounded-sm">
             <div className="flex items-center gap-3 mb-3">
               <Info size={18} className="text-rose-600" />
               <span className="font-black text-[10px] uppercase tracking-widest text-rose-600">AI Authorship Policy</span>
             </div>
             <p className="text-sm text-rose-800 leading-relaxed font-medium">
               Large Language Models (LLMs) like ChatGPT do not meet authorship criteria. Their use for text generation or data processing must be explicitly documented in the Methods section.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};
