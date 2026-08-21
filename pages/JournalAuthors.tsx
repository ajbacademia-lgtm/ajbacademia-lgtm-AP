import React from 'react';
import { FileText, Send, ShieldCheck, Zap, Info, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const JournalAuthors: React.FC = () => {
  return (
    <div className="bg-white min-h-screen">
      <section className="bg-brand-navy text-white py-16">
        <div className="container mx-auto px-6">
          <span className="text-xs font-black uppercase tracking-[0.3em] text-brand-action mb-4 block">Researchers</span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Information for Journal Authors</h1>
          <p className="text-xl text-white/60 max-w-2xl">
            Everything you need to prepare, submit, and promote your peer-reviewed research.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-serif font-bold text-brand-navy">Author Resources</h2>
            <Link to="/submission-workflow" className="text-xs font-black uppercase tracking-widest text-brand-action hover:underline flex items-center gap-2">
              🔹 View Submission Workflow <ArrowRight size={14} />
            </Link>
            <Link to="/review-management" className="text-xs font-black uppercase tracking-widest text-brand-action hover:underline flex items-center gap-2">
              🔹 View Review Management <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-20">
            <div className="p-8 bg-white border border-gray-100 rounded-sm shadow-sm">
              <div className="w-12 h-12 bg-blue-50 text-brand-action rounded-sm flex items-center justify-center mb-6">
                <FileText size={24} />
              </div>
              <h3 className="text-xl font-bold text-brand-navy mb-3">Manuscript Prep</h3>
              <p className="text-sm text-brand-navy/60 leading-relaxed mb-6">Download templates and style guides to ensure your paper meets our formatting requirements.</p>
              <button className="text-xs font-black uppercase tracking-widest text-brand-action hover:underline">View Guidelines</button>
            </div>
            <div className="p-8 bg-white border border-gray-100 rounded-sm shadow-sm">
              <div className="w-12 h-12 bg-blue-50 text-brand-action rounded-sm flex items-center justify-center mb-6">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-bold text-brand-navy mb-3">Open Access</h3>
              <p className="text-sm text-brand-navy/60 leading-relaxed mb-6">Learn about Gold and Green Open Access options and our Article Processing Charges (APCs).</p>
              <button className="text-xs font-black uppercase tracking-widest text-brand-action hover:underline">Learn More</button>
            </div>
            <div className="p-8 bg-white border border-gray-100 rounded-sm shadow-sm">
              <div className="w-12 h-12 bg-blue-50 text-brand-action rounded-sm flex items-center justify-center mb-6">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-xl font-bold text-brand-navy mb-3">Ethics & Rights</h3>
              <p className="text-sm text-brand-navy/60 leading-relaxed mb-6">Information on copyright, COPE compliance, and our commitment to research integrity.</p>
              <button className="text-xs font-black uppercase tracking-widest text-brand-action hover:underline">Review Policies</button>
            </div>
          </div>

          <div className="bg-brand-light p-10 rounded-sm border border-brand-navy/5">
            <div className="flex flex-col lg:flex-row gap-12 items-center">
              <div className="lg:w-2/3">
                <h2 className="text-2xl font-serif font-bold text-brand-navy mb-4">Ready to submit?</h2>
                <p className="text-brand-navy/70 mb-8">Our AI-assisted submission portal guides you through the process, ensuring all required metadata and declarations are captured accurately from the start.</p>
                <div className="flex flex-wrap gap-4">
                  <Link to="/login" className="px-8 py-3 bg-brand-action text-white text-sm font-bold rounded-sm hover:bg-brand-navy transition-all flex items-center gap-2">
                    <Send size={16} /> Enter Submission Portal
                  </Link>
                  <Link to="/editing-services" className="px-8 py-3 bg-white border border-brand-navy/10 text-brand-navy text-sm font-bold rounded-sm hover:border-brand-action transition-all">
                    Language Editing Services
                  </Link>
                </div>
              </div>
              <div className="lg:w-1/3">
                <div className="flex items-start gap-4 p-6 bg-white rounded-sm border border-gray-100">
                  <Info className="text-brand-action flex-shrink-0" size={20} />
                  <div>
                    <h4 className="text-xs font-bold text-brand-navy uppercase tracking-widest mb-1">Author Help</h4>
                    <p className="text-[11px] text-brand-navy/50">Need technical help with your account or the submission system? Visit our help center.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
