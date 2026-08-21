import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, ShieldAlert, Newspaper, Users, AlertCircle } from 'lucide-react';

export const PostPublication: React.FC = () => {
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
              06. Post-<span className="text-brand-action">Publication</span>
            </h1>
            <p className="text-lg text-slate-500 font-light leading-relaxed">
              Managing your published intellectual property and ensuring academic integrity post-transmission.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-20">
        <div className="max-w-4xl space-y-20">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <section className="space-y-6">
              <h3 className="text-lg font-black text-brand-navy uppercase tracking-widest flex items-center gap-3">
                <div className="w-8 h-px bg-brand-action"></div> Editorial Integrity
              </h3>
              <div className="space-y-4">
                 <div className="p-8 bg-slate-50 border border-slate-100 rounded space-y-4">
                    <div className="text-[10px] font-black uppercase tracking-widest text-brand-navy flex items-center gap-2">
                       <ShieldAlert size={14} className="text-brand-action" /> Copy Editing POLICY
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">
                      Academic Publishing does not provide in-depth linguistic or copy editing. We recommend using professional services prior to submission if needed to ensure global accessibility.
                    </p>
                 </div>
              </div>
            </section>

            <section className="space-y-6">
              <h3 className="text-lg font-black text-brand-navy uppercase tracking-widest flex items-center gap-3">
                <div className="w-8 h-px bg-brand-action"></div> Document Corrections
              </h3>
              <div className="space-y-4">
                 <div className="p-8 bg-rose-50 border border-rose-100 rounded space-y-4 text-rose-800">
                    <div className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                       <AlertCircle size={14} /> Formal Notices
                    </div>
                    <p className="text-xs leading-relaxed font-bold">
                      Check your Supplementary Information carefully during proofs; any changes post-publication require a formal correction notice, which is permanently linked to the record of science.
                    </p>
                 </div>
              </div>
            </section>
          </div>

          <section className="space-y-8">
            <h3 className="text-lg font-black text-brand-navy uppercase tracking-widest flex items-center gap-3">
              <div className="w-8 h-px bg-brand-action"></div> Open Access & Rights
            </h3>
            <div className="bg-white border border-slate-200 p-10 rounded shadow-sm">
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-brand-navy">
                       <Users size={18} />
                       <h4 className="text-sm font-bold uppercase tracking-widest">Privacy Integrity</h4>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium capitalize">
                      Ensure all identifying participant info is removed unless explicit "Consent to Publish" has been obtained via AES encryption protocols.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-brand-navy">
                       <Newspaper size={18} />
                       <h4 className="text-sm font-bold uppercase tracking-widest">Registered Reports</h4>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium capitalize">
                      Peer review occurs prior to data collection. Refer to our dedicated Registered Reports policy for specific stage-one criteria.
                    </p>
                  </div>
               </div>
            </div>
          </section>

          <footer className="py-20 border-t border-slate-100 text-center">
            <div className="max-w-xl mx-auto space-y-6">
              <CheckCircle2 size={48} className="text-brand-action mx-auto mb-8" />
              <h3 className="text-2xl font-serif font-black text-brand-navy">Structural Integrity Confirmed</h3>
              <p className="text-sm text-slate-500 leading-relaxed font-light italic">
                Academic Publishing processes manuscripts as permanent nodes of intellectual progress. All published content is archived on our secure global distribution network.
              </p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};
