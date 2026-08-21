import React from 'react';
import { Accessibility as AccessIcon, CheckCircle, Globe } from 'lucide-react';

export const Accessibility: React.FC = () => {
  return (
    <div className="bg-white min-h-screen">
      <section className="bg-brand-navy text-white py-16">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Accessibility Statement</h1>
          <p className="text-xl text-white/60 max-w-2xl">
            Ensuring that scientific research is accessible to everyone, regardless of ability or technology.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="prose prose-slate max-w-none">
            <h2 className="text-2xl font-serif font-bold text-brand-navy mb-6">Our Commitment</h2>
            <p className="text-brand-navy/70 leading-relaxed mb-8">
              Academic Publishing Group is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.
            </p>

            <h2 className="text-2xl font-serif font-bold text-brand-navy mb-6">Conformance Status</h2>
            <p className="text-brand-navy/70 leading-relaxed mb-6">
              The Web Content Accessibility Guidelines (WCAG) defines requirements for designers and developers to improve accessibility for people with disabilities. Academic Publishing is partially conformant with WCAG 2.1 level AA.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
              <div className="p-6 bg-gray-50 rounded-sm">
                <h3 className="font-bold text-brand-navy mb-3 flex items-center gap-2">
                  <CheckCircle size={18} className="text-green-600" /> Current Features
                </h3>
                <ul className="text-sm text-brand-navy/60 space-y-2">
                  <li>Screen reader compatible layouts</li>
                  <li>Keyboard navigation support</li>
                  <li>High-contrast text options</li>
                  <li>Alt text for all figures and charts</li>
                </ul>
              </div>
              <div className="p-6 bg-gray-50 rounded-sm">
                <h3 className="font-bold text-brand-navy mb-3 flex items-center gap-2">
                  <Globe size={18} className="text-brand-action" /> Ongoing Work
                </h3>
                <ul className="text-sm text-brand-navy/60 space-y-2">
                  <li>Improving PDF accessibility</li>
                  <li>Expanding video transcriptions</li>
                  <li>Refining ARIA label coverage</li>
                </ul>
              </div>
            </div>

            <h2 className="text-2xl font-serif font-bold text-brand-navy mb-6">Feedback</h2>
            <p className="text-brand-navy/70 leading-relaxed">
              We welcome your feedback on the accessibility of the Academic Publishing platform. Please let us know if you encounter accessibility barriers:
            </p>
            <ul className="mt-4 space-y-2 text-brand-navy/70 font-bold">
              <li>Email: <a href="mailto:access@academicpublishinggroup.org" className="text-brand-action hover:underline">access@academicpublishinggroup.org</a></li>
              <li>Phone: +44 (0) 20 7017 6000</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};