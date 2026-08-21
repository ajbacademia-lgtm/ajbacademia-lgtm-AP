import React from 'react';
import { ShieldAlert, Heart, Building } from 'lucide-react';

export const ModernSlavery: React.FC = () => {
  return (
    <div className="bg-white min-h-screen">
      <section className="bg-brand-navy text-white py-16">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Modern Slavery Statement</h1>
          <p className="text-xl text-white/60 max-w-2xl">
            Academic Publishing Group's commitment to ethical practices and the prevention of human trafficking.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="prose prose-slate max-w-none">
            <h2 className="text-2xl font-serif font-bold text-brand-navy mb-6">1. Our Policy</h2>
            <p className="text-brand-navy/70 leading-relaxed mb-8">
              This statement is made pursuant to section 54(1) of the Modern Slavery Act 2015. Academic Publishing Group has a zero-tolerance approach to modern slavery and we are committed to acting ethically and with integrity in all our business dealings and relationships.
            </p>

            <h2 className="text-2xl font-serif font-bold text-brand-navy mb-6">2. Supply Chain Due Diligence</h2>
            <p className="text-brand-navy/70 leading-relaxed mb-6">
              As a digital-first publisher, our supply chain consists primarily of technology providers, freelance editors, and administrative services. We conduct regular audits of our key suppliers to ensure they adhere to fair labor practices.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
              <div className="text-center p-6 bg-gray-50 rounded-sm">
                <Heart size={32} className="mx-auto text-red-500 mb-4" />
                <h4 className="font-bold text-brand-navy text-xs uppercase tracking-widest">Ethical Labor</h4>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-sm">
                <ShieldAlert size={32} className="mx-auto text-amber-500 mb-4" />
                <h4 className="font-bold text-brand-navy text-xs uppercase tracking-widest">Zero Tolerance</h4>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-sm">
                <Building size={32} className="mx-auto text-blue-500 mb-4" />
                <h4 className="font-bold text-brand-navy text-xs uppercase tracking-widest">Global Audit</h4>
              </div>
            </div>

            <h2 className="text-2xl font-serif font-bold text-brand-navy mb-6">3. Training</h2>
            <p className="text-brand-navy/70 leading-relaxed mb-8">
              To ensure a high level of understanding of the risks of modern slavery and human trafficking in our supply chains and our business, we provide training to our staff, particularly those involved in procurement and vendor management.
            </p>

            <h2 className="text-2xl font-serif font-bold text-brand-navy mb-6">4. Future Commitments</h2>
            <p className="text-brand-navy/70 leading-relaxed">
              We will continue to review our policies and processes to ensure that our business and supply chain remain free from modern slavery. We remain committed to transparency and will publish an updated statement annually.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};