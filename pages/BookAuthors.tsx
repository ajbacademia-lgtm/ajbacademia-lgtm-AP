import React from 'react';
import { Link } from 'react-router-dom';
import { Book, PenTool, Award, BarChart, CheckCircle2, Globe, ArrowRight } from 'lucide-react';

export const BookAuthors: React.FC = () => {
  return (
    <div className="bg-white min-h-screen">
      <section className="bg-brand-navy text-white py-16">
        <div className="container mx-auto px-6">
          <span className="text-xs font-black uppercase tracking-[0.3em] text-brand-action mb-4 block">Authors</span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Publishing Books with Academic Publishing</h1>
          <p className="text-xl text-white/60 max-w-2xl">
            Join a global community of scholars. We turn your research into high-impact academic books.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-serif font-bold text-brand-navy mb-6">Why publish with us?</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="bg-blue-50 p-3 rounded-sm text-brand-action h-fit"><Globe size={20} /></div>
                  <div>
                    <h4 className="font-bold text-brand-navy">Global Distribution</h4>
                    <p className="text-sm text-brand-navy/60">Your work will be available in print and digital formats across all major global retailers and library networks.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="bg-blue-50 p-3 rounded-sm text-brand-action h-fit"><Award size={20} /></div>
                  <div>
                    <h4 className="font-bold text-brand-navy">Prestige & Quality</h4>
                    <p className="text-sm text-brand-navy/60">Rigorous peer-review and high production standards ensure your work is recognized by your peers.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="bg-blue-50 p-3 rounded-sm text-brand-action h-fit"><BarChart size={20} /></div>
                  <div>
                    <h4 className="font-bold text-brand-navy">Author Royalties</h4>
                    <p className="text-sm text-brand-navy/60">Competitive royalty structures and transparent reporting via our Author Portal.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-10 rounded-sm border border-gray-100">
              <h3 className="text-xl font-bold text-brand-navy mb-8">The Journey to Publication</h3>
              <ul className="space-y-6 relative mb-10">
                {[
                  { title: "Proposal", desc: "Submit your book proposal and sample chapters." },
                  { title: "Peer Review", desc: "Expert assessment to ensure academic rigor." },
                  { title: "Contract", desc: "Formal agreement and production scheduling." },
                  { title: "Production", desc: "Copy-editing, typesetting, and cover design." },
                  { title: "Launch", desc: "Global marketing and institutional distribution." }
                ].map((step, i) => (
                  <li key={i} className="flex gap-4 relative">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 bg-brand-navy text-white text-xs font-bold rounded-full flex items-center justify-center relative z-10">
                        {i + 1}
                      </div>
                      {i < 4 && <div className="w-[1px] h-full bg-gray-200 absolute top-8"></div>}
                    </div>
                    <div>
                      <h4 className="font-bold text-brand-navy text-sm">{step.title}</h4>
                      <p className="text-xs text-brand-navy/50">{step.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="pt-6 border-t border-gray-200">
                <Link to="/submission-workflow" className="text-xs font-black uppercase tracking-widest text-brand-action hover:underline flex items-center gap-2">
                  🔹 View Journal Submission Workflow <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
