import React from 'react';
import { HelpCircle, MessageSquare, Phone, Mail, FileQuestion, LifeBuoy, Monitor, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CustomerSupport: React.FC = () => {
  const categories = [
    { title: "Author Support", icon: <FileQuestion />, desc: "Submission help, tracking your paper, and APC payments." },
    { title: "Technical Help", icon: <Monitor />, desc: "Login issues, platform errors, and institutional access." },
    { title: "Editorial Support", icon: <LifeBuoy />, desc: "Peer review process, ethical queries, and board roles." },
    { title: "Library Relations", icon: <Search />, desc: "Subscription management, usage reports, and metadata." }
  ];

  return (
    <div className="bg-white min-h-screen">
      <section className="bg-brand-navy text-white py-20">
        <div className="container mx-auto px-6">
          <span className="text-xs font-black uppercase tracking-[0.3em] text-brand-action mb-4 block">Help Center</span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">Customer Support</h1>
          <p className="text-xl text-white/60 max-w-2xl leading-relaxed">
            We are here to assist you with every step of your scholarly journey. Explore our resources or reach out to our global team.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {categories.map((cat, i) => (
              <div key={i} className="p-8 border border-gray-100 rounded-sm hover:border-brand-action hover:shadow-lg transition-all cursor-pointer group">
                <div className="w-12 h-12 bg-blue-50 text-brand-action rounded-sm flex items-center justify-center mb-6 group-hover:bg-brand-action group-hover:text-white transition-colors">
                  {React.cloneElement(cat.icon as React.ReactElement<any>, { size: 24 })}
                </div>
                <h3 className="text-lg font-bold text-brand-navy mb-2">{cat.title}</h3>
                <p className="text-sm text-brand-navy/60 leading-relaxed">{cat.desc}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            <div className="lg:col-span-2 space-y-12">
              <div>
                <h2 className="text-2xl font-serif font-bold text-brand-navy mb-8">Frequently Asked Questions</h2>
                <div className="space-y-6">
                  {[
                    { q: "How do I track my manuscript submission?", a: "Log in to your Author Dashboard and click on 'Active Submissions'. You will see real-time updates on the peer-review status." },
                    { q: "What is the typical turnaround time for peer review?", a: "While it varies by journal, we aim for a first decision within 4-6 weeks for most disciplines." },
                    { q: "Does Academic Publishing provide waivers for Article Processing Charges?", a: "Yes, we offer discretionary waivers for authors from low-income countries and cases of demonstrated financial hardship." },
                    { q: "How can I regain access to my account?", a: "Use the 'Forgot Password' link on the login page. If you no longer have access to your registered email, contact technical support below." }
                  ].map((faq, i) => (
                    <div key={i} className="border-b border-gray-100 pb-6">
                      <h4 className="font-bold text-brand-navy mb-2">{faq.q}</h4>
                      <p className="text-sm text-brand-navy/60 leading-relaxed">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-sm border border-gray-100">
              <h3 className="text-lg font-bold text-brand-navy mb-6">Direct Contact</h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <Mail className="text-brand-action flex-shrink-0" size={20} />
                  <div>
                    <div className="font-bold text-sm">Email Support</div>
                    <a href="mailto:support@academicpublishinggroup.org" className="text-xs text-brand-action hover:underline">support@academicpublishinggroup.org</a>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Phone className="text-brand-action flex-shrink-0" size={20} />
                  <div>
                    <div className="font-bold text-sm">24/7 Phone Support</div>
                    <div className="text-xs text-brand-navy/60">+44 (0) 20 7017 6000</div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <MessageSquare className="text-brand-action flex-shrink-0" size={20} />
                  <div>
                    <div className="font-bold text-sm">Live Chat</div>
                    <div className="text-xs text-brand-navy/60">Available Monday - Friday, 9am - 5pm GMT</div>
                  </div>
                </div>
              </div>
              <div className="mt-10">
                <Link to="/contact" className="block text-center py-3 bg-brand-navy text-white text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-brand-action transition-all">
                  Open Support Ticket
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
