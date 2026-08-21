import React from 'react';
import { Link } from 'react-router-dom';
import { Database, Layout, BarChart3, Globe, Download, Mail, ArrowRight } from 'lucide-react';

export const Librarians: React.FC = () => {
  return (
    <div className="bg-white min-h-screen">
      <section className="bg-brand-navy text-white py-16">
        <div className="container mx-auto px-6">
          <span className="text-xs font-black uppercase tracking-[0.3em] text-brand-action mb-4 block">Institutions</span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Resources for Librarians</h1>
          <p className="text-xl text-white/60 max-w-2xl">
            Empowering institutions with robust metadata, seamless access, and detailed usage analytics.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
            <div>
              <h2 className="text-3xl font-serif font-bold text-brand-navy mb-8">Institutional Management</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="text-brand-action"><Database size={32} /></div>
                  <h4 className="font-bold text-brand-navy">OAI-PMH & KBART</h4>
                  <p className="text-sm text-brand-navy/60">Standardized metadata harvesting and title lists for easy integration into discovery layers.</p>
                </div>
                <div className="space-y-4">
                  <div className="text-brand-action"><BarChart3 size={32} /></div>
                  <h4 className="font-bold text-brand-navy">COUNTER Reports</h4>
                  <p className="text-sm text-brand-navy/60">Compliant usage statistics (R5) available via our administrator dashboard or SUSHI API.</p>
                </div>
                <div className="space-y-4">
                  <div className="text-brand-action"><Globe size={32} /></div>
                  <h4 className="font-bold text-brand-navy">Single Sign-On</h4>
                  <p className="text-sm text-brand-navy/60">Shibboleth and OpenAthens support for seamless off-campus access for your students and staff.</p>
                </div>
                <div className="space-y-4">
                  <div className="text-brand-action"><Layout size={32} /></div>
                  <h4 className="font-bold text-brand-navy">Admin Portal</h4>
                  <p className="text-sm text-brand-navy/60">Manage IP ranges, view subscription status, and download promotional materials.</p>
                </div>
              </div>
              <div className="mt-12 flex flex-col gap-4">
                <Link to="/submission-workflow" className="inline-flex items-center gap-2 text-brand-action font-bold uppercase tracking-widest text-xs hover:underline">
                  🔹 View Submission Workflow <ArrowRight size={16} />
                </Link>
                <Link to="/publication-module" className="inline-flex items-center gap-2 text-brand-action font-bold uppercase tracking-widest text-xs hover:underline">
                  🔹 View Publication Module <ArrowRight size={16} />
                </Link>
                <Link to="/security-compliance" className="inline-flex items-center gap-2 text-brand-action font-bold uppercase tracking-widest text-xs hover:underline">
                  🔹 View Security & Compliance <ArrowRight size={16} />
                </Link>
              </div>
            </div>
            <div className="bg-brand-navy text-white p-12 rounded-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Download size={120} />
               </div>
               <h3 className="text-2xl font-serif font-bold mb-6">Librarian Toolkit</h3>
               <p className="text-white/60 mb-8 text-sm leading-relaxed">Download our latest posters, training guides, and system configuration documentation to help your community get the most out of Academic Publishing.</p>
               <div className="space-y-4">
                  <button className="w-full py-3 bg-white text-brand-navy font-bold text-xs uppercase tracking-widest rounded-sm hover:bg-brand-action hover:text-white transition-all">Download Title List (CSV)</button>
                  <button className="w-full py-3 border border-white/20 text-white font-bold text-xs uppercase tracking-widest rounded-sm hover:bg-white/10 transition-all">Request Training Session</button>
               </div>
               <div className="mt-12 flex items-center gap-4 text-xs font-medium text-white/40">
                  <Mail size={16} /> 
                  <span>Contact library relations: <a href="mailto:libraries@academicpublishinggroup.org" className="text-white hover:text-brand-action underline">libraries@academicpublishinggroup.org</a></span>
               </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
