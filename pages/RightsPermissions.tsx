import React from 'react';
import { ShieldCheck, FileText, Share2, Scale, ExternalLink, Mail } from 'lucide-react';

export const RightsPermissions: React.FC = () => {
  return (
    <div className="bg-white min-h-screen">
      <section className="bg-brand-navy text-white py-16">
        <div className="container mx-auto px-6">
          <span className="text-xs font-black uppercase tracking-[0.3em] text-brand-action mb-4 block">Compliance</span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Rights and Permissions</h1>
          <p className="text-xl text-white/60 max-w-2xl">
            Guidelines on how to reuse Academic Publishing content, understanding our licenses, and requesting specific permissions.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="prose prose-slate max-w-none">
            <h2 className="text-2xl font-serif font-bold text-brand-navy mb-6">Open Access & Licensing</h2>
            <p className="text-brand-navy/70 leading-relaxed mb-6">
              Most Academic Publishing journals publish under the <strong>Creative Commons Attribution 4.0 International (CC BY 4.0)</strong> license. This allows for unrestricted use, distribution, and reproduction in any medium, provided the original work is properly cited.
            </p>
            
            <div className="bg-blue-50 p-8 rounded-sm border border-blue-100 my-10 flex gap-6 items-start">
              <Scale className="text-brand-action flex-shrink-0" size={32} />
              <div>
                <h4 className="font-bold text-brand-navy mb-2">Authors Retain Copyright</h4>
                <p className="text-sm text-brand-navy/70">
                  Under our Open Access model, authors retain copyright to their work. You do not need to ask Academic Publishing for permission to reuse your own figures, tables, or text in future publications, provided you cite the original Academic Publishing article.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-serif font-bold text-brand-navy mt-16 mb-6">Requesting Permission</h2>
            <p className="text-brand-navy/70 leading-relaxed mb-8">
              If the content you wish to reuse is not published under an Open Access license, or if you require a formal permission letter for a third party, please follow these steps:
            </p>
            
            <div className="space-y-6">
              <div className="flex gap-4 items-start border-l-2 border-brand-action pl-6 py-2">
                <div className="font-bold text-brand-navy">1. Locate the Article</div>
                <p className="text-sm text-brand-navy/60">Find the article on the Academic Publishing platform and look for the "Rights & Permissions" link in the sidebar.</p>
              </div>
              <div className="flex gap-4 items-start border-l-2 border-brand-action pl-6 py-2">
                <div className="font-bold text-brand-navy">2. Use RightsLink®</div>
                <p className="text-sm text-brand-navy/60">We partner with Copyright Clearance Center’s RightsLink service for fast, automated permission processing.</p>
              </div>
              <div className="flex gap-4 items-start border-l-2 border-brand-action pl-6 py-2">
                <div className="font-bold text-brand-navy">3. Direct Contact</div>
                <p className="text-sm text-brand-navy/60">For complex requests or society-owned journals not on RightsLink, email our permissions team directly.</p>
              </div>
            </div>

            <div className="mt-16 p-10 bg-brand-navy text-white rounded-sm">
               <h3 className="text-xl font-bold mb-4">Questions about Permissions?</h3>
               <p className="text-white/60 mb-8 text-sm">Our team typically responds to permission queries within 3-5 business hours.</p>
               <div className="flex flex-wrap gap-4">
                  <a href="mailto:permissions@academicpublishinggroup.org" className="flex items-center gap-2 bg-brand-action px-6 py-3 rounded-sm font-bold text-xs uppercase tracking-widest hover:bg-white hover:text-brand-navy transition-all">
                     <Mail size={16} /> Email Permissions Team
                  </a>
                  <button className="flex items-center gap-2 border border-white/20 px-6 py-3 rounded-sm font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all">
                     <ExternalLink size={16} /> Copyright Clearing Center
                  </button>
               </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
