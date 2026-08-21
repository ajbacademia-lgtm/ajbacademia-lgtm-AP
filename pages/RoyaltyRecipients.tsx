import React from 'react';
import { DollarSign, FileText, Calendar, Landmark, CreditCard, ShieldCheck } from 'lucide-react';

export const RoyaltyRecipients: React.FC = () => {
  return (
    <div className="bg-white min-h-screen">
      <section className="bg-brand-navy text-white py-16">
        <div className="container mx-auto px-6">
          <span className="text-xs font-black uppercase tracking-[0.3em] text-brand-action mb-4 block">Financials</span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Royalty Recipients</h1>
          <p className="text-xl text-white/60 max-w-2xl">
            Management of royalty payments for book authors, editors, and society partners.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
            <div>
              <h2 className="text-3xl font-serif font-bold text-brand-navy mb-6">Payment & Reporting</h2>
              <p className="text-brand-navy/70 leading-relaxed mb-6">
                Academic Publishing Group is committed to transparent and timely royalty payments. Our global finance team handles thousands of distributions annually across multiple currencies and tax jurisdictions.
              </p>
              <div className="space-y-4">
                <div className="flex gap-4 p-4 bg-gray-50 border border-gray-100 rounded-sm">
                  <Calendar className="text-brand-action flex-shrink-0" size={24} />
                  <div>
                    <h4 className="font-bold text-brand-navy text-sm">Payment Schedule</h4>
                    <p className="text-xs text-brand-navy/60">Royalties are typically calculated semi-annually (March and September) and paid within 45 days of the period close.</p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 bg-gray-50 border border-gray-100 rounded-sm">
                  <Landmark className="text-brand-action flex-shrink-0" size={24} />
                  <div>
                    <h4 className="font-bold text-brand-navy text-sm">Payment Methods</h4>
                    <p className="text-xs text-brand-navy/60">We support Direct Deposit (ACH), International Wire Transfer, and Payoneer. Cheques are available in select regions upon request.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-brand-light p-10 rounded-sm border border-brand-navy/5">
              <h3 className="text-xl font-bold text-brand-navy mb-6 flex items-center gap-2">
                <ShieldCheck className="text-brand-action" /> Tax Compliance
              </h3>
              <p className="text-sm text-brand-navy/70 mb-6 leading-relaxed">
                Before payments can be issued, all recipients must have valid tax documentation on file. This ensures compliance with international tax treaties and local regulations.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-xs font-bold text-brand-navy">
                   <FileText size={14} className="text-brand-action" /> W-9 (US Residents)
                </li>
                <li className="flex items-center gap-2 text-xs font-bold text-brand-navy">
                   <FileText size={14} className="text-brand-action" /> W-8BEN / W-8BEN-E (Non-US Residents)
                </li>
                <li className="flex items-center gap-2 text-xs font-bold text-brand-navy">
                   <FileText size={14} className="text-brand-action" /> VAT Registration (where applicable)
                </li>
              </ul>
              <button className="w-full py-4 bg-brand-navy text-white font-bold text-xs uppercase tracking-widest rounded-sm hover:bg-brand-action transition-all">
                Access Author Portal
              </button>
            </div>
          </div>

          <div className="max-w-4xl mx-auto border-t border-gray-100 pt-16">
            <h2 className="text-2xl font-serif font-bold text-brand-navy mb-8 text-center">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <h4 className="font-bold text-brand-navy mb-2">How can I view my latest statement?</h4>
                <p className="text-sm text-brand-navy/60">Statements are available for download through the Academic Publishing Author Portal 15 days before the payment date.</p>
              </div>
              <div>
                <h4 className="font-bold text-brand-navy mb-2">What is the minimum payment threshold?</h4>
                <p className="text-sm text-brand-navy/60">Payments are issued once royalties exceed $50 (or equivalent). Accrued balances below this carry over to the next period.</p>
              </div>
              <div>
                <h4 className="font-bold text-brand-navy mb-2">My contact details have changed.</h4>
                <p className="text-sm text-brand-navy/60">Please update your address and banking information in the Author Portal immediately to avoid payment delays.</p>
              </div>
              <div>
                <h4 className="font-bold text-brand-navy mb-2">Who do I contact for royalty queries?</h4>
                <p className="text-sm text-brand-navy/60">Our dedicated royalties desk is available at <a href="mailto:royalties@academicpublishinggroup.org" className="text-brand-action hover:underline">royalties@academicpublishinggroup.org</a>.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
