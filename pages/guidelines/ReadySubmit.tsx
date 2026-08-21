import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Send, FileText, BookOpen, UserCheck, Shield } from 'lucide-react';

export const ReadySubmit: React.FC = () => {
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
              05. Ready to <span className="text-brand-action">Submit</span>
            </h1>
            <p className="text-lg text-slate-500 font-light leading-relaxed">
              Finalize your manuscript transmission package for our editorial node.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-20">
        <div className="max-w-4xl space-y-20">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-white border-b-2 border-brand-navy shadow-lg text-center space-y-6">
              <div className="w-16 h-16 bg-brand-navy text-white rounded-full flex items-center justify-center mx-auto shadow-xl ring-4 ring-slate-100">
                <Send size={24} />
              </div>
              <div>
                <h4 className="text-sm font-black uppercase tracking-widest text-brand-navy mb-2">Cover Letter</h4>
                <p className="text-[11px] text-slate-400 font-medium leading-relaxed italic">Essential rationale and suggest reviewers.</p>
              </div>
            </div>
            <div className="p-8 bg-white border-b-2 border-brand-action shadow-lg text-center space-y-6">
              <div className="w-16 h-16 bg-brand-action text-white rounded-full flex items-center justify-center mx-auto shadow-xl ring-4 ring-slate-100">
                <FileText size={24} />
              </div>
              <div>
                <h4 className="text-sm font-black uppercase tracking-widest text-brand-navy mb-2">Manuscript</h4>
                <p className="text-[11px] text-slate-400 font-medium leading-relaxed italic">Integrated text and figures for initial entry.</p>
              </div>
            </div>
            <div className="p-8 bg-white border-b-2 border-slate-300 shadow-lg text-center space-y-6">
              <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto shadow-xl ring-4 ring-slate-50">
                <BookOpen size={24} />
              </div>
              <div>
                <h4 className="text-sm font-black uppercase tracking-widest text-brand-navy mb-2">Supplements</h4>
                <p className="text-[11px] text-slate-400 font-medium leading-relaxed italic">Extended data and supporting protocols.</p>
              </div>
            </div>
          </div>

          <section className="space-y-8">
            <div className="flex border-l-4 border-brand-action p-10 bg-slate-50">
               <div className="space-y-6">
                  <h3 className="text-lg font-black text-brand-navy uppercase tracking-widest flex items-center gap-3">
                    <Shield size={18} className="text-brand-action" /> The Cover Letter Constraint
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-sm text-slate-600 leading-relaxed font-medium">
                     <p>Include corresponding author contact info and a brief "Why Academic Publishing?" explanation summarizing the manuscript's impact.</p>
                     <p>You must provide suggested reviewers (at least 3) and list any excluded referees with valid scientific justification.</p>
                  </div>
               </div>
            </div>
          </section>

          <section className="space-y-8">
            <h3 className="text-lg font-black text-brand-navy uppercase tracking-widest flex items-center gap-3">
              <div className="w-8 h-px bg-brand-action"></div> Final Protocol Audit
            </h3>
            <div className="space-y-4">
              {[
                { title: 'Identity Check', icon: <UserCheck size={18} />, desc: 'Ensure all co-authors have reviewed the final submission version.' },
                { title: 'Privacy Check', icon: <Shield size={18} />, desc: 'Remove personal identifying info from raw supplemental data files.' },
                { title: 'Resolution Check', icon: <Maximize size={18} />, desc: 'Confirm all internal figure labels are legible at publication scale.' }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-6 p-6 border border-slate-100 hover:bg-slate-50 transition-colors">
                  <div className="text-brand-action shrink-0">{item.icon}</div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-brand-navy mb-1">{item.title}</h4>
                    <p className="text-[11px] text-slate-500 font-medium">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="text-center py-20 bg-slate-50 rounded-sm border border-slate-200">
             <h3 className="text-3xl font-serif font-black mb-10 text-brand-navy">Initiate Manuscript <span className="text-brand-action">Transfer</span></h3>
             <Link to="/register" className="px-16 py-5 bg-brand-navy text-white text-[10px] font-black uppercase tracking-widest hover:bg-brand-action transition-all shadow-2xl inline-flex items-center gap-3">
                <Send size={16} /> Enter Submission Portal
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// Placeholder icons missing from first import
const Maximize = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m15 3 6 6M9 21l-6-6M21 3l-6 6M3 21l6-6" />
  </svg>
);
