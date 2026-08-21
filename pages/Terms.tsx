import React from 'react';
import { Scale, FileText, AlertCircle } from 'lucide-react';

export const Terms: React.FC = () => {
  return (
    <div className="bg-white min-h-screen">
      <section className="bg-brand-navy text-white py-16">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Terms and Conditions</h1>
          <p className="text-xl text-white/60 max-w-2xl">
            The legal framework governing your use of the Academic Publishing Group platform and services.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="prose prose-slate max-w-none">
            <h2 className="text-2xl font-serif font-bold text-brand-navy mb-6">1. Acceptance of Terms</h2>
            <p className="text-brand-navy/70 leading-relaxed mb-8">
              By accessing or using the Academic Publishing platform, you agree to be bound by these Terms and Conditions and our Privacy Policy. If you do not agree, you must not use our services.
            </p>

            <h2 className="text-2xl font-serif font-bold text-brand-navy mb-6">2. Intellectual Property</h2>
            <p className="text-brand-navy/70 leading-relaxed mb-4">
              Our journals operate under the Creative Commons Attribution 4.0 International (CC BY 4.0) license. This means:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-brand-navy/70 mb-8">
              <li>Authors retain copyright of their work.</li>
              <li>Users are free to share and adapt the work, provided appropriate credit is given.</li>
              <li>The Academic Publishing platform's branding, UI, and underlying software remain the property of Academic Publishing Group.</li>
            </ul>

            <h2 className="text-2xl font-serif font-bold text-brand-navy mb-6">3. User Conduct</h2>
            <p className="text-brand-navy/70 leading-relaxed mb-8">
              You agree not to engage in any activity that interferes with or disrupts the Academic Publishing platform. This includes unauthorized access to editorial systems, scraping content without permission (outside of CC BY guidelines), or submitting fraudulent research.
            </p>

            <div className="bg-amber-50 p-6 rounded-sm border border-amber-200 mb-12">
              <div className="flex gap-4">
                <AlertCircle className="text-amber-600 flex-shrink-0" size={24} />
                <div>
                  <h4 className="font-bold text-amber-900 mb-1">Publication Ethics</h4>
                  <p className="text-sm text-amber-800">
                    Academic Publishing takes research integrity seriously. Any submission found to contain plagiarized content, fabricated data, or other unethical practices will be summarily rejected and reported to the relevant institutional authorities.
                  </p>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-serif font-bold text-brand-navy mb-6">4. Limitation of Liability</h2>
            <p className="text-brand-navy/70 leading-relaxed mb-8">
              Academic Publishing provides scientific content for informational purposes. While we maintain rigorous peer-review standards, we do not guarantee the absolute accuracy of published research and are not liable for any damages resulting from the use of such information.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};