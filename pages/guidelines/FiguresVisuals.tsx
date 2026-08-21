import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Image, PenTool, Hash, Maximize, FileCode } from 'lucide-react';

export const FiguresVisuals: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-left">
      {/* Detail Header */}
      <div className="bg-slate-50 border-b border-slate-200 pt-32 pb-16">
        <div className="container mx-auto px-6">
          <Link to="/author-guidelines" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-brand-navy transition-colors mb-8">
            <ArrowLeft size={14} /> Back to Guidelines
          </Link>
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-serif font-black text-brand-navy mb-6 leading-tight">
              04. Figures and <span className="text-brand-action">Visuals</span>
            </h1>
            <p className="text-lg text-slate-500 font-light leading-relaxed">
              High-fidelity visual communication is essential for the rapid interpretation of complex scientific datasets.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-20">
        <div className="max-w-4xl space-y-20">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <section className="space-y-6">
              <h3 className="text-lg font-black text-brand-navy uppercase tracking-widest flex items-center gap-3">
                <div className="w-8 h-px bg-brand-action"></div> Formats & resolution
              </h3>
              <div className="space-y-4">
                 <div className="flex gap-4 p-6 bg-slate-50 border border-slate-100 rounded">
                    <PenTool size={20} className="text-brand-action shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold text-brand-navy mb-1">Vector Graphics</h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed font-medium">EPS or Adobe Illustrator (AI) formats are required for all line art, charts, and diagrams to ensure infinitely scalable precision.</p>
                    </div>
                 </div>
                 <div className="flex gap-4 p-6 bg-slate-50 border border-slate-100 rounded">
                    <Image size={20} className="text-brand-navy shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold text-brand-navy mb-1">Bitmap Imagery</h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed font-medium">TIFF or high-quality JPG are accepted for photographic data. Minimum resolution: 300 dpi at final publication size.</p>
                    </div>
                 </div>
              </div>
            </section>

            <section className="space-y-6">
              <h3 className="text-lg font-black text-brand-navy uppercase tracking-widest flex items-center gap-3">
                <div className="w-8 h-px bg-brand-action"></div> Visual Style Guide
              </h3>
              <div className="space-y-4">
                 <div className="flex gap-4 p-6 bg-brand-navy text-white rounded shadow-xl">
                    <Hash size={20} className="text-brand-action shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold mb-1">Labeling Convention</h4>
                      <p className="text-[11px] text-slate-300 leading-relaxed font-medium">Use sans-serif fonts (Helvetica or Arial). Label figure sub-panels with lowercase bold letters (a, b, c) in the top-left corner.</p>
                    </div>
                 </div>
                 <div className="flex gap-4 p-6 bg-white border border-slate-100 rounded shadow-sm">
                    <Maximize size={20} className="text-slate-300 shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold text-brand-navy mb-1">Scale and Metrics</h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed font-medium">Always include scale bars in micro-photographs. Do not use magnification factors (e.g., 40x) as these vary with screen size.</p>
                    </div>
                 </div>
              </div>
            </section>
          </div>

          <section className="space-y-8">
            <h3 className="text-lg font-black text-brand-navy uppercase tracking-widest flex items-center gap-3">
              <div className="w-8 h-px bg-brand-action"></div> Editorial Constraints
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
               <div className="p-8 border border-slate-100 text-center space-y-4">
                  <div className="w-10 h-1 bg-brand-action mx-auto"></div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-navy">No 3D Effects</h4>
                  <p className="text-[10px] text-slate-400 leading-relaxed font-medium italic">Avoid drop shadows or 3D extrusions on charts.</p>
               </div>
               <div className="p-8 border border-slate-100 text-center space-y-4">
                  <div className="w-10 h-1 bg-brand-navy mx-auto"></div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-navy">White Backgrounds</h4>
                  <p className="text-[10px] text-slate-400 leading-relaxed font-medium italic">Keep plot areas clean of background tints.</p>
               </div>
               <div className="p-8 border border-slate-100 text-center space-y-4">
                  <div className="w-10 h-1 bg-brand-action mx-auto"></div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-navy">High Contrast</h4>
                  <p className="text-[10px] text-slate-400 leading-relaxed font-medium italic">Ensure color combinations are accessible.</p>
               </div>
            </div>
          </section>

          <div className="bg-slate-50 p-10 border border-slate-100 rounded flex gap-8 items-center">
             <div className="p-4 bg-white rounded-full shadow-lg shrink-0">
                <FileCode size={32} className="text-brand-action" />
             </div>
             <div>
                <h3 className="font-bold text-brand-navy mb-2">Equations & Symbols</h3>
                <p className="text-sm text-slate-500 leading-relaxed max-w-xl">
                  Use editable formats (Word Equation Editor) or standard TeX math environments. Avoid embedding equations as flat images, as they cannot be indexed or scaled.
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
