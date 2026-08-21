import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Edit3, ShieldCheck, List, Quote, BookOpen } from 'lucide-react';

export const WritingManuscript: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-left">
      {/* Detail Header */}
      <div className="bg-slate-50 border-b border-slate-200 pt-32 pb-16">
        <div className="container mx-auto px-6">
          <Link to="/author-guidelines" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-brand-navy transition-colors mb-8">
            <ArrowLeft size={14} /> Back to Guidelines
          </Link>
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-serif font-black text-brand-navy mb-6 leading-tight">
              03. Writing Your <span className="text-brand-action">Manuscript</span>
            </h1>
            <p className="text-lg text-slate-500 font-light leading-relaxed">
              Precision in scientific communication is the cornerstone of reproducibility and citations.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-20">
        <div className="max-w-4xl space-y-20">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <section className="space-y-6">
              <h3 className="text-lg font-black text-brand-navy uppercase tracking-widest flex items-center gap-3">
                <div className="w-8 h-px bg-brand-action"></div> The Methods Section
              </h3>
              <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
                <p>There is no word limit for Methods. Efficiency and detail are the goals here.</p>
                <div className="p-6 bg-slate-50 border border-slate-100 rounded space-y-3">
                   <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-brand-navy">
                     <List size={14} className="text-brand-action" /> Requirements
                   </div>
                   <ul className="space-y-2 text-xs font-medium">
                     <li>• Specific sources for kits and reagents</li>
                     <li>• Detailed documentation of safety hazards</li>
                     <li>• Systematic nomenclature for all compounds</li>
                     <li>• Data processing algorithms & AI logs</li>
                   </ul>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h3 className="text-lg font-black text-brand-navy uppercase tracking-widest flex items-center gap-3">
                <div className="w-8 h-px bg-brand-action"></div> Ethics & Compliance
              </h3>
              <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
                <p>Ethics Declarations are mandatory for all research involving human or animal subjects.</p>
                <div className="p-6 bg-emerald-50 border border-emerald-100 rounded space-y-3">
                   <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-emerald-800">
                     <ShieldCheck size={14} /> Protocol
                   </div>
                   <p className="text-xs text-emerald-700 font-medium">
                     Identify the licensing committee and confirm that informed consent was obtained for all participants. Confirm that all research was performed in accordance with relevant national guidelines.
                   </p>
                </div>
              </div>
            </section>
          </div>

          <section className="space-y-8">
            <h3 className="text-lg font-black text-brand-navy uppercase tracking-widest flex items-center gap-3">
              <div className="w-8 h-px bg-brand-action"></div> Reference Protocols
            </h3>
            <div className="bg-white border-2 border-slate-100 p-10 rounded shadow-sm">
               <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center shrink-0">
                    <Quote size={20} className="text-brand-action" />
                  </div>
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-bold text-brand-navy mb-2">Numerical System</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">Use numerical citations in square brackets throughout the text, e.g., <span className="font-black text-brand-navy">[1]</span>. References are sequentially numbered in the bibliography.</p>
                    </div>
                    <div className="p-6 bg-slate-50 border border-slate-100 rounded font-mono text-[11px] leading-relaxed italic">
                      Author, A. B. Title of article. <span className="font-bold border-b border-brand-action not-italic">Journal Name</span> <span className="font-black text-brand-navy">Vol</span>, Page range (Year).
                    </div>
                    <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-slate-400">
                       <BookOpen size={14} className="text-brand-navy" /> Limit: 60 References total
                    </div>
                  </div>
               </div>
            </div>
          </section>

          <section className="p-8 bg-brand-navy text-white text-center">
             <h3 className="text-xl font-serif font-black mb-4">Scholarly Precision</h3>
             <p className="text-xs text-slate-400 uppercase tracking-[0.2em] font-bold">
               Refine your manuscript for global transmission and node indexing.
             </p>
          </section>
        </div>
      </div>
    </div>
  );
};
