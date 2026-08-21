import React from 'react';
import { Link } from 'react-router-dom';
import { Users, BookOpen, Scale, Award, MessageCircle, ArrowRight } from 'lucide-react';

export const Editors: React.FC = () => {
  return (
    <div className="bg-white min-h-screen">
      <section className="bg-brand-navy text-white py-16">
        <div className="container mx-auto px-6">
          <span className="text-xs font-black uppercase tracking-[0.3em] text-brand-action mb-4 block">Editorial Board</span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Information for Editors</h1>
          <p className="text-xl text-white/60 max-w-2xl">
            Supporting our editorial network with the tools and guidelines needed to maintain scientific excellence.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mb-16">
            <h2 className="text-3xl font-serif font-bold text-brand-navy mb-6">Our Shared Commitment</h2>
            <p className="text-brand-navy/70 leading-relaxed mb-6">
              As an Editor at Academic Publishing, you play a critical role in shaping the direction of your field. We are committed to providing you with an efficient, AI-enhanced editorial workflow that allows you to focus on what matters most: the science.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            <div className="flex gap-6 p-8 border border-gray-100 rounded-sm hover:shadow-md transition-shadow">
              <div className="bg-blue-50 p-4 rounded-sm text-brand-action h-fit"><Scale size={24} /></div>
              <div>
                <h4 className="font-bold text-brand-navy mb-2">Ethics & Compliance</h4>
                <p className="text-sm text-brand-navy/60 mb-4">Detailed guides on COPE guidelines, handling conflicts of interest, and managing research misconduct.</p>
                <button className="text-xs font-bold text-brand-action hover:underline">Read Ethical Guidelines</button>
              </div>
            </div>
            <div className="flex gap-6 p-8 border border-gray-100 rounded-sm hover:shadow-md transition-shadow">
              <div className="bg-blue-50 p-4 rounded-sm text-brand-action h-fit"><BookOpen size={24} /></div>
              <div>
                <h4 className="font-bold text-brand-navy mb-2">Editorial Training</h4>
                <p className="text-sm text-brand-navy/60 mb-4">Access our webinars and interactive modules for new board members and seasoned editors.</p>
                <button className="text-xs font-bold text-brand-action hover:underline">Start Training</button>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-12 rounded-sm border border-gray-100 text-center">
             <h3 className="text-2xl font-serif font-bold text-brand-navy mb-6">Editorial Management System</h3>
             <p className="text-brand-navy/60 max-w-2xl mx-auto mb-10 text-sm">Log in to manage your journal's workflow, communicate with reviewers, and oversee the peer-review process for submitted manuscripts.</p>
             <div className="flex flex-col items-center gap-6">
               <div className="flex justify-center gap-4">
                  <button className="px-10 py-3 bg-brand-navy text-white text-sm font-bold rounded-sm hover:bg-brand-action transition-all">Access Dashboard</button>
                  <button className="px-10 py-3 border border-brand-navy/10 text-brand-navy text-sm font-bold rounded-sm hover:border-brand-action transition-all flex items-center gap-2">
                     <MessageCircle size={16} /> Contact Support
                  </button>
               </div>
               <Link to="/submission-workflow" className="text-xs font-black uppercase tracking-widest text-brand-action hover:underline flex items-center gap-2">
                 🔹 View Submission Workflow <ArrowRight size={14} />
               </Link>
               <Link to="/review-management" className="text-xs font-black uppercase tracking-widest text-brand-action hover:underline flex items-center gap-2">
                 🔹 View Review Management <ArrowRight size={14} />
               </Link>
               <Link to="/publication-module" className="text-xs font-black uppercase tracking-widest text-brand-action hover:underline flex items-center gap-2">
                 🔹 View Publication Module <ArrowRight size={14} />
               </Link>
               <Link to="/admindashboard" className="text-xs font-black uppercase tracking-widest text-brand-action hover:underline flex items-center gap-2">
                 🔹 View Admin Dashboards <ArrowRight size={14} />
               </Link>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};
