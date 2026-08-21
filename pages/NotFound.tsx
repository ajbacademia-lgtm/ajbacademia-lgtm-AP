import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Search, ShieldAlert, BookOpen } from 'lucide-react';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center py-24 px-6 text-center">
      {/* Visual background element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-action/5 rounded-full blur-3xl -z-10"></div>
      
      <div className="max-w-2xl">
        <div className="mb-8 flex justify-center">
          <div className="relative inline-block">
            <h1 className="text-[180px] font-serif font-black text-brand-navy/5 leading-none">404</h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <ShieldAlert size={80} className="text-brand-action/20" />
            </div>
          </div>
        </div>

        <h2 className="text-4xl font-serif font-bold text-brand-navy mb-6 italic">Architecture Unaligned</h2>
        <p className="text-brand-navy/60 text-lg mb-12 leading-relaxed max-w-lg mx-auto">
          The research pathway you followed appears to be missing or permanently archived. Our systems cannot locate this specific knowledge node in the Academic repository.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-3 px-8 py-4 border border-brand-navy/10 text-brand-navy text-[10px] font-black uppercase tracking-[0.2em] rounded-sm hover:bg-brand-navy hover:text-white transition-all group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
            Back to Previous
          </button>
          
          <Link 
            to="/" 
            className="flex items-center justify-center gap-3 px-8 py-4 bg-brand-navy text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-sm hover:bg-brand-action transition-all"
          >
            <Home size={16} /> 
            Publishing Portal
          </Link>
        </div>

        <div className="pt-12 border-t border-gray-100 grid grid-cols-3 gap-8">
          <Link to="/journals" className="group">
            <BookOpen size={20} className="mx-auto mb-2 text-brand-navy/20 group-hover:text-brand-action transition-colors" />
            <span className="text-[9px] font-black uppercase tracking-widest text-brand-navy/40 group-hover:text-brand-navy underline underline-offset-4">Journals</span>
          </Link>
          <Link to="/advanced-search" className="group">
            <Search size={20} className="mx-auto mb-2 text-brand-navy/20 group-hover:text-brand-action transition-colors" />
            <span className="text-[9px] font-black uppercase tracking-widest text-brand-navy/40 group-hover:text-brand-navy underline underline-offset-4">Database</span>
          </Link>
          <Link to="/news" className="group">
            <Home size={20} className="mx-auto mb-2 text-brand-navy/20 group-hover:text-brand-action transition-colors" />
            <span className="text-[9px] font-black uppercase tracking-widest text-brand-navy/40 group-hover:text-brand-navy underline underline-offset-4">Latest Insights</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
