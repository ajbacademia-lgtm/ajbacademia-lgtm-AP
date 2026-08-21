import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, ShieldCheck, Globe, Star } from 'lucide-react';

export const BeforeSubmit: React.FC = () => {
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
              01. Before You <span className="text-brand-action">Submit</span>
            </h1>
            <p className="text-lg text-slate-500 font-light leading-relaxed">
              Academic Publishing values clarity and technical rigor. Before submission, ensure your work meets our core publication standards.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-20">
        <div className="max-w-3xl text-left space-y-16">
          <section className="space-y-8">
            <div className="flex items-start gap-6 p-8 bg-white border border-slate-100 shadow-sm rounded-sm">
              <div className="w-12 h-12 bg-brand-navy text-white rounded-full flex items-center justify-center shrink-0 shadow-lg">
                <Star size={20} />
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-brand-navy uppercase tracking-widest">Originality & Novelty</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  We publish original research as <strong>Articles</strong> or <strong>Registered Reports</strong>. Manuscripts submitted to Academic Publishing must not have been published previously, nor be under consideration for publication elsewhere.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6 p-8 bg-white border border-slate-100 shadow-sm rounded-sm">
              <div className="w-12 h-12 bg-brand-action text-white rounded-full flex items-center justify-center shrink-0 shadow-lg">
                <Globe size={20} />
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-brand-navy uppercase tracking-widest">Accessibility</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Write for a diverse scientific audience. While technical accuracy is paramount, authors are encouraged to avoid excessive jargon and define abbreviations at first use. This ensures cross-disciplinary impact.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6 p-8 bg-white border border-slate-100 shadow-sm rounded-sm">
              <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center shrink-0 shadow-lg">
                <ShieldCheck size={20} />
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-brand-navy uppercase tracking-widest">Ethical Soundness</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Ensure all human or animal experimental approvals are documented in your Methods section. Academic Publishing adheres to strict ethical protocols and COPE guidelines for publishing integrity.
                </p>
              </div>
            </div>
          </section>

          <section className="p-10 bg-brand-navy text-white rounded-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-brand-action opacity-10 -translate-y-1/2 translate-x-1/2 rounded-full"></div>
             <h3 className="text-xs font-black uppercase tracking-[0.3em] text-brand-action mb-6">Pre-Submission Checkbox</h3>
             <ul className="space-y-4">
               {[
                 'Novel scientific contribution confirmed',
                 'Ethics approval obtained and documented',
                 'Competing interests identified for all authors',
                 'Data availability strategy finalized',
                 'Language and clarity reviewed for global audience'
               ].map((item, i) => (
                 <li key={i} className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest">
                   <CheckCircle2 size={16} className="text-brand-action" /> {item}
                 </li>
               ))}
             </ul>
          </section>
        </div>
      </div>
    </div>
  );
};
