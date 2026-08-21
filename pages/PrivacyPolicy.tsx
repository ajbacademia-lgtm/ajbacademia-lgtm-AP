import React from 'react';
import { Shield, Lock, Eye, FileText } from 'lucide-react';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="bg-white min-h-screen">
      <section className="bg-brand-navy text-white py-16">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Privacy Policy</h1>
          <p className="text-xl text-white/60 max-w-2xl">
            How Academic Publishing Group handles and protects your personal data in accordance with global standards.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="prose prose-slate max-w-none">
            <p className="text-brand-navy/60 mb-8 italic">Last Updated: October 25, 2025</p>
            
            <h2 className="text-2xl font-serif font-bold text-brand-navy mt-10 mb-4">1. Introduction</h2>
            <p className="text-brand-navy/70 leading-relaxed mb-6">
              Academic Publishing Group ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our scholarly publishing services.
            </p>

            <h2 className="text-2xl font-serif font-bold text-brand-navy mt-10 mb-4">2. Data We Collect</h2>
            <p className="text-brand-navy/70 leading-relaxed mb-4">
              We collect information that you provide directly to us when you register for an account, submit a manuscript, or communicate with us. This may include:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-brand-navy/70 mb-6">
              <li>Name, email address, and professional affiliation.</li>
              <li>ORCID iD and other researcher identifiers.</li>
              <li>Manuscript metadata and content.</li>
              <li>Payment information for Article Processing Charges (APCs).</li>
            </ul>

            <h2 className="text-2xl font-serif font-bold text-brand-navy mt-10 mb-4">3. How We Use Your Data</h2>
            <p className="text-brand-navy/70 leading-relaxed mb-4">
              Your data is processed to provide our core publishing services, including:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-brand-navy/70 mb-6">
              <li>Managing the peer-review process.</li>
              <li>Publishing and indexing your research.</li>
              <li>Communicating important updates regarding your submissions.</li>
              <li>Improving our platform and AI-assisted tools.</li>
            </ul>

            <h2 className="text-2xl font-serif font-bold text-brand-navy mt-10 mb-4">4. Data Sharing and Disclosure</h2>
            <p className="text-brand-navy/70 leading-relaxed mb-6">
              We do not sell your personal data. We share information only with trusted partners necessary for the publishing workflow, such as peer reviewers (who are bound by confidentiality) and indexing databases (like Crossref and PubMed).
            </p>

            <div className="bg-brand-light p-8 rounded-sm border border-brand-navy/5 my-12">
              <h3 className="text-lg font-bold text-brand-navy mb-4 flex items-center gap-2">
                <Shield size={20} className="text-brand-action" /> Your Rights
              </h3>
              <p className="text-sm text-brand-navy/70 mb-4">
                Under GDPR and other international privacy laws, you have the right to:
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-bold uppercase tracking-widest text-brand-navy/60">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-brand-action rounded-full"></div> Access your data</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-brand-action rounded-full"></div> Correct inaccuracies</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-brand-action rounded-full"></div> Request deletion</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-brand-action rounded-full"></div> Data portability</li>
              </ul>
            </div>

            <h2 className="text-2xl font-serif font-bold text-brand-navy mt-10 mb-4">5. Contact Us</h2>
            <p className="text-brand-navy/70 leading-relaxed">
              If you have any questions about this Privacy Policy, please contact our Data Protection Officer at <a href="mailto:privacy@academicpublishinggroup.org" className="text-brand-action hover:underline font-bold">privacy@academicpublishinggroup.org</a>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};