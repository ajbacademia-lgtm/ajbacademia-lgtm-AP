import React, { useState, useRef } from 'react';
import { Check, Zap, Award, FileText, Layout as LayoutIcon, Clock, DollarSign, ShieldCheck, HelpCircle, FileCode, CheckCircle2, ArrowRight, Mail, X, Send, Loader2, Upload, File as FileIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export const EditingServices: React.FC = () => {
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [calcWordCount, setCalcWordCount] = useState(3000);
  const [quoteForm, setQuoteForm] = useState({
    name: '',
    email: '',
    manuscriptType: 'Research Paper',
    wordCount: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const calculatePrice = (basePrice: number) => {
    // Basic calculation: Price scales per word if above 3000, otherwise minimum price.
    const baseWords = 3000;
    if (calcWordCount <= baseWords) return basePrice;
    return Math.round((calcWordCount / baseWords) * basePrice);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Process quote request data

    // Construct mailto link (optional, since it's a simulated backend)
    const subject = `Request for Editing Quote: ${quoteForm.manuscriptType}`;
    const body = `Name: ${quoteForm.name}\nEmail: ${quoteForm.email}\nManuscript Type: ${quoteForm.manuscriptType}\nWord Count: ${quoteForm.wordCount}\n\nAttached: ${uploadedFile?.name || 'No attachment'}\n\nMessage:\n${quoteForm.message}`;
    const mailtoLink = `mailto:edit@academicpublishinggroup.org?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Simulate delay
    setTimeout(() => {
      // In a real app we'd upload the file to a server/S3 first
      window.location.href = mailtoLink;
      setIsSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        setShowQuoteModal(false);
        setSubmitted(false);
        setUploadedFile(null);
        setQuoteForm({ name: '', email: '', manuscriptType: 'Research Paper', wordCount: '', message: '' });
      }, 3000);
    }, 1500);
  };

  const packages = [
    {
      name: 'Standard Editing',
      icon: <Check className="text-blue-500" />,
      purpose: 'Improve clarity, grammar, and consistency.',
      basePrice: 120,
      price: '$120',
      words: '≤3,000 words',
      time: '5–7 business days',
      features: [
        'Correction of grammar, punctuation, and syntax',
        'Rewording awkward or unclear text',
        'Consistent style throughout the manuscript',
        'Ideal for professional language refinement'
      ],
      color: 'border-gray-100'
    },
    {
      name: 'Rapid Editing',
      icon: <Zap className="text-brand-action" />,
      purpose: 'Fast professional editing without sacrificing quality.',
      basePrice: 180,
      price: '$180',
      words: '≤3,000 words',
      time: '2–3 business days',
      features: [
        'All Standard editing benefits',
        'Priority handling for expedited turnaround',
        'Free re-editing support (14 days)',
        'Ideal for tight deadlines/urgent submissions'
      ],
      color: 'border-brand-action shadow-lg shadow-blue-500/10',
      popular: true
    },
    {
      name: 'Academic Editing',
      icon: <Award className="text-indigo-600" />,
      purpose: 'Comprehensive editing for publication readiness.',
      basePrice: 250,
      price: '$250',
      words: '≤3,000 words',
      time: '5–7 business days',
      features: [
        'All Rapid service features',
        'Review by subject-specific expert',
        'Technical review report on structure',
        'Free re-editing and support for cover letters',
        'Ideal for in-depth academic refinement'
      ],
      color: 'border-gray-100'
    }
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-brand-navy text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-[120px] -mr-48 -mt-48"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-action rounded-full blur-[120px] -ml-48 -mb-48"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight mb-6">
              Academic Editing Services
            </h1>
            <p className="text-xl md:text-2xl text-white/70 font-sans leading-relaxed">
              Professional, high-quality editing solutions designed to prepare manuscripts for international publication.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <button 
                onClick={() => setShowCalculator(true)}
                className="btn-pill bg-brand-action text-white hover:bg-white hover:text-brand-navy transition-all leading-none py-4"
              >
                View Packages & Calculator
              </button>
              <button 
                onClick={() => setShowQuoteModal(true)}
                className="btn-pill border border-white/20 text-white hover:bg-white/10 transition-all flex items-center gap-2 leading-none py-4"
              >
                <Mail size={18} /> Request a Quote
              </button>
            </div>
          </div>
        </div>

        {/* Price Calculator Modal */}
        <AnimatePresence>
          {showCalculator && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowCalculator(false)}
                className="absolute inset-0 bg-brand-navy/90 backdrop-blur-md"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative bg-white w-full max-w-5xl rounded-sm shadow-2xl overflow-hidden"
              >
                <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50">
                  <div className="flex items-center gap-3">
                    <DollarSign className="text-brand-action" size={24} />
                    <h3 className="text-xl font-bold text-brand-navy uppercase tracking-tight">Editing Service Calculator</h3>
                  </div>
                  <button onClick={() => setShowCalculator(false)} className="text-brand-navy/40 hover:text-brand-navy transition-colors">
                    <X size={24} />
                  </button>
                </div>

                <div className="p-8">
                  <div className="bg-brand-navy text-white p-8 rounded-sm mb-12 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex-grow w-full">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-[#46B4E6] mb-4">Estimate Your Manuscript Word Count</label>
                      <input 
                        type="range"
                        min="500"
                        max="20000"
                        step="100"
                        value={calcWordCount}
                        onChange={(e) => setCalcWordCount(parseInt(e.target.value))}
                        className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-brand-action mb-4"
                      />
                      <div className="flex justify-between text-[10px] font-bold opacity-40 uppercase tracking-widest">
                        <span>Min: 500 words</span>
                        <span>Max: 20,000 words</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-center md:text-right bg-white/5 border border-white/10 p-6 rounded-sm min-w-[200px]">
                      <div className="text-[10px] font-black uppercase tracking-widest text-[#46B4E6] mb-1">Your Word Count</div>
                      <div className="text-4xl font-serif font-black">{calcWordCount.toLocaleString()}</div>
                      <div className="text-[10px] opacity-40 font-bold uppercase mt-1">Words Estimated</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {packages.map((pkg, i) => (
                      <div key={i} className={`p-6 border-2 rounded-sm transition-all text-center ${pkg.popular ? 'border-brand-action bg-blue-50/10' : 'border-gray-100'}`}>
                        <div className="inline-flex w-10 h-10 bg-gray-50 rounded-sm items-center justify-center mb-4">
                          {pkg.icon}
                        </div>
                        <h4 className="font-bold text-brand-navy mb-1 uppercase tracking-tight">{pkg.name}</h4>
                        <p className="text-[10px] text-brand-navy/40 uppercase font-black tracking-widest mb-4">{pkg.time}</p>
                        
                        <div className="mb-6">
                          <div className="text-xs text-brand-navy/60 mb-1">Estimated Price:</div>
                          <div className="text-4xl font-serif font-black text-brand-navy">${calculatePrice(pkg.basePrice)}</div>
                          <div className="text-[10px] opacity-40 font-bold uppercase tracking-widest mt-1">USD Total</div>
                        </div>

                        <button 
                          onClick={() => {
                            setQuoteForm({
                              ...quoteForm,
                              manuscriptType: 'Research Paper',
                              wordCount: calcWordCount.toString(),
                              message: `I am interested in the ${pkg.name} package for my manuscript of approximately ${calcWordCount} words.`
                            });
                            setShowCalculator(false);
                            setShowQuoteModal(true);
                          }}
                          className={`w-full py-3 rounded-sm font-bold text-xs uppercase tracking-widest transition-all ${
                            pkg.popular 
                            ? 'bg-brand-action text-white hover:bg-brand-navy' 
                            : 'bg-brand-navy text-white hover:bg-brand-action'
                          }`}
                        >
                          Confirm & Inquire
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 p-4 bg-gray-50 border border-gray-100 rounded-sm flex items-start gap-3">
                    <HelpCircle size={16} className="text-brand-action mt-0.5 flex-shrink-0" />
                    <p className="text-[10px] text-brand-navy/60 leading-relaxed italic">
                      *Note: Prices are estimates based on a standard 3,000-word unit rate. Final quotes may vary depending on the technical complexity, 
                      subject area, and current editor availability. All prices are in USD.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Request Quote Modal */}
        <AnimatePresence>
          {showQuoteModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowQuoteModal(false)}
                className="absolute inset-0 bg-brand-navy/80 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative bg-white w-full max-w-2xl rounded-sm shadow-2xl overflow-hidden"
              >
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                  <h3 className="text-xl font-bold text-brand-navy uppercase tracking-tight">Request a Professional Quote</h3>
                  <button onClick={() => setShowQuoteModal(false)} className="text-brand-navy/40 hover:text-brand-navy transition-colors">
                    <X size={24} />
                  </button>
                </div>

                <div className="p-8">
                  {submitted ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 size={32} />
                      </div>
                      <h4 className="text-xl font-bold text-brand-navy mb-2">Quote Request Initiated</h4>
                      <p className="text-brand-navy/60">Opening your email client to finalize the submission...</p>
                    </div>
                  ) : (
                    <form onSubmit={handleQuoteSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-[10px] font-black uppercase tracking-widest text-brand-navy/40 mb-2">Full Name</label>
                          <input 
                            required
                            type="text"
                            value={quoteForm.name}
                            onChange={(e) => setQuoteForm({...quoteForm, name: e.target.value})}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-sm focus:bg-white focus:border-brand-action outline-none transition-all text-sm"
                            placeholder="e.g. Dr. Jane Smith"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black uppercase tracking-widest text-brand-navy/40 mb-2">Email Address</label>
                          <input 
                            required
                            type="email"
                            value={quoteForm.email}
                            onChange={(e) => setQuoteForm({...quoteForm, email: e.target.value})}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-sm focus:bg-white focus:border-brand-action outline-none transition-all text-sm"
                            placeholder="jane.smith@university.edu"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-[10px] font-black uppercase tracking-widest text-brand-navy/40 mb-2">Manuscript Type</label>
                          <select 
                            value={quoteForm.manuscriptType}
                            onChange={(e) => setQuoteForm({...quoteForm, manuscriptType: e.target.value})}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-sm focus:bg-white focus:border-brand-action outline-none transition-all text-sm appearance-none"
                          >
                            <option>Research Paper</option>
                            <option>Review Article</option>
                            <option>Case Study</option>
                            <option>Book Chapter</option>
                            <option>Conference Proceeding</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-black uppercase tracking-widest text-brand-navy/40 mb-2">Approximate Word Count</label>
                          <input 
                            required
                            type="number"
                            value={quoteForm.wordCount}
                            onChange={(e) => setQuoteForm({...quoteForm, wordCount: e.target.value})}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-sm focus:bg-white focus:border-brand-action outline-none transition-all text-sm"
                            placeholder="e.g. 5000"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-brand-navy/40 mb-2">Additional Details / Message</label>
                        <textarea 
                          required
                          rows={4}
                          value={quoteForm.message}
                          onChange={(e) => setQuoteForm({...quoteForm, message: e.target.value})}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-sm focus:bg-white focus:border-brand-action outline-none transition-all text-sm resize-none"
                          placeholder="Please provide any specific requirements or deadlines..."
                        ></textarea>
                      </div>

                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40 mb-2">Attach Manuscript Fragment or Full Draft (PDF/DOC)</label>
                        <input 
                          type="file" 
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          className="hidden"
                          accept=".pdf,.doc,.docx,.tex"
                        />
                        <div 
                          onClick={() => fileInputRef.current?.click()}
                          className="border-2 border-dashed border-gray-200 rounded-sm p-8 flex flex-col items-center justify-center cursor-pointer hover:border-brand-action hover:bg-brand-action/5 transition-all group relative overflow-hidden"
                        >
                          {uploadedFile ? (
                            <div className="flex items-center gap-4 text-brand-navy relative z-10 w-full px-4">
                              <div className="w-12 h-12 bg-brand-action/10 rounded flex items-center justify-center shrink-0">
                                <FileIcon className="text-brand-action" size={24} />
                              </div>
                              <div className="text-left overflow-hidden">
                                <div className="text-sm font-bold truncate">{uploadedFile.name}</div>
                                <div className="text-[10px] text-brand-navy/40 uppercase font-black tracking-widest mt-0.5">
                                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB — Added to Request
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center relative z-10">
                              <Upload size={32} className="text-gray-300 mb-3 group-hover:text-brand-action transition-colors mx-auto" />
                              <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Click to upload for review</p>
                              <p className="text-[9px] text-gray-300 mt-1 uppercase tracking-widest italic">PDF, DOC, DOCX, or TEX is accepted</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-brand-navy text-white py-4 rounded-sm font-bold flex items-center justify-center gap-3 hover:bg-brand-action transition-all disabled:opacity-70 shadow-lg shadow-brand-navy/10"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center gap-2">
                            <Loader2 className="animate-spin" size={20} />
                            Calculating Final Quote...
                          </span>
                        ) : (
                          <>
                            <Send size={18} /> Send Professional Inquiry
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </section>

      {/* Introduction */}
      <section className="py-20 border-b border-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="prose prose-lg max-w-none text-brand-navy/80">
              <p>
                Academic Editing Services supports researchers, scholars, and institutions by providing professional, 
                high-quality editing solutions designed to prepare manuscripts for submission, peer review, and publication 
                in international academic journals.
              </p>
              <p>
                Our services help authors improve clarity, readability, and scholarly expression in English, 
                enhancing the likelihood of successful peer review and acceptance. Editing is available to authors 
                publishing with Academic Publishing as well as those submitting to other reputable journals.
              </p>
            </div>
            <div className="bg-gray-50 p-10 rounded-sm border border-gray-100">
              <h3 className="text-xl font-bold text-brand-navy mb-6">Benefits of Professional Editing</h3>
              <ul className="space-y-4">
                {[
                  'Improved manuscript readability and flow',
                  'Enhanced academic tone and structure',
                  'Better alignment with journal expectations',
                  'Increased confidence during peer review',
                  'Support for non-native English speakers'
                ].map((benefit, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm font-medium text-brand-navy/70">
                    <CheckCircle2 className="text-brand-action flex-shrink-0 mt-0.5" size={18} />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Tiered Packages */}
      <section id="english-editing" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-navy mb-4">English Language Editing Services</h2>
            <p className="text-brand-navy/60 mb-10">We offer tiered editing options to suit the needs of different authors and manuscript requirements.</p>
            
            {/* Quick Estimator Bar */}
            <div className="bg-gray-50 p-6 rounded-sm border border-gray-100 flex flex-col md:flex-row items-center gap-6 justify-center">
              <span className="text-xs font-black uppercase tracking-widest text-brand-navy/40">Manuscript Word Count</span>
              <div className="flex items-center gap-4 w-full max-w-md">
                <input 
                  type="number"
                  value={calcWordCount}
                  onChange={(e) => setCalcWordCount(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-24 px-3 py-2 border border-gray-200 rounded-sm font-bold text-brand-navy outline-none focus:border-brand-action"
                />
                <input 
                  type="range"
                  min="500"
                  max="15000"
                  step="100"
                  value={calcWordCount}
                  onChange={(e) => setCalcWordCount(parseInt(e.target.value))}
                  className="flex-grow h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-action"
                />
              </div>
              <div className="text-[10px] font-bold text-brand-action uppercase tracking-widest px-3 py-1 bg-white border border-brand-action/10 rounded-full">
                Dynamic Estimates Apply
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg, i) => (
              <div key={i} className={`relative p-8 rounded-sm border-2 transition-all hover:-translate-y-1 ${pkg.color}`}>
                {pkg.popular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-action text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full">
                    Most Popular
                  </div>
                )}
                <div className="w-12 h-12 bg-gray-50 rounded-sm flex items-center justify-center mb-6">
                  {pkg.icon}
                </div>
                <h3 className="text-2xl font-bold text-brand-navy mb-2">{pkg.name}</h3>
                <p className="text-sm text-brand-navy/50 mb-6 min-h-[40px]">{pkg.purpose}</p>
                
                <div className="mb-8">
                  <div className="text-3xl font-bold text-brand-navy">${calculatePrice(pkg.basePrice)}</div>
                  <div className="text-xs font-bold text-brand-navy/30 uppercase tracking-widest mt-1">
                    {calcWordCount > 3000 ? `Estimated for ${calcWordCount.toLocaleString()} words` : pkg.words}
                  </div>
                </div>

                <ul className="space-y-4 mb-10 border-t border-gray-50 pt-8">
                  {pkg.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-3 text-sm text-brand-navy/70">
                      <Check size={14} className="text-green-500 flex-shrink-0 mt-1" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button 
                  onClick={() => {
                    setQuoteForm({
                      ...quoteForm,
                      manuscriptType: 'Research Paper',
                      wordCount: calcWordCount.toString(),
                      message: `I am interested in the ${pkg.name} package for my manuscript of approximately ${calcWordCount} words.`
                    });
                    setShowQuoteModal(true);
                  }}
                  className={`w-full py-3 rounded-sm font-bold text-sm transition-all ${
                    pkg.popular 
                    ? 'bg-brand-action text-white hover:bg-brand-navy' 
                    : 'bg-gray-100 text-brand-navy hover:bg-gray-200'
                  }`}
                >
                  Select {pkg.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Support */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-6 mb-12">
            <h2 className="text-2xl font-serif font-bold text-brand-navy">Additional Editorial Support</h2>
            <div className="flex-grow h-[1px] bg-brand-navy/10"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-sm border border-gray-100 flex gap-6">
              <div className="bg-blue-50 p-4 rounded-sm text-brand-action h-fit">
                <FileText size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-brand-navy mb-2">Figure and Table Editing</h3>
                <p className="text-sm text-brand-navy/60 leading-relaxed">
                  Enhances the quality and presentation of figures and tables by adjusting resolution, 
                  labeling, formatting, and clarity to improve research communication.
                </p>
              </div>
            </div>
            <div className="bg-white p-8 rounded-sm border border-gray-100 flex gap-6">
              <div className="bg-blue-50 p-4 rounded-sm text-brand-action h-fit">
                <LayoutIcon size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-brand-navy mb-2">Layout and Formatting</h3>
                <p className="text-sm text-brand-navy/60 leading-relaxed">
                  Ensures compliance with target journal guidelines, including reference style checks 
                  and structural alignment with publication requirements.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Table */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="mb-12">
            <h2 className="text-3xl font-serif font-bold text-brand-navy mb-2">Detailed Pricing & Delivery</h2>
            <p className="text-brand-navy/50">Full comparison of turnaround times and costs for all packages.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border border-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-6 border border-gray-100 text-[10px] font-black uppercase tracking-widest text-brand-navy/40">Service Type</th>
                  <th className="p-6 border border-gray-100 text-[10px] font-black uppercase tracking-widest text-brand-navy/40">Turnaround</th>
                  <th className="p-6 border border-gray-100 text-[10px] font-black uppercase tracking-widest text-brand-navy/40">Price (USD)*</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-6 border border-gray-100">
                    <div className="font-bold text-brand-navy">Standard Editing</div>
                    <div className="text-xs text-brand-navy/50 mt-1">Basic grammar & clarity improvement</div>
                  </td>
                  <td className="p-6 border border-gray-100 text-sm font-medium">5–7 business days</td>
                  <td className="p-6 border border-gray-100 font-bold text-brand-navy">$120 <span className="text-[10px] opacity-40 font-normal">/3k words</span></td>
                </tr>
                <tr className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-6 border border-gray-100">
                    <div className="font-bold text-brand-navy">Rapid Editing</div>
                    <div className="text-xs text-brand-navy/50 mt-1">Priority handling, expedited delivery</div>
                  </td>
                  <td className="p-6 border border-gray-100 text-sm font-medium">2–3 business days</td>
                  <td className="p-6 border border-gray-100 font-bold text-brand-navy">$180 <span className="text-[10px] opacity-40 font-normal">/3k words</span></td>
                </tr>
                <tr className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-6 border border-gray-100">
                    <div className="font-bold text-brand-navy">Academic Editing</div>
                    <div className="text-xs text-brand-navy/50 mt-1">Subject-expert review & structure refinement</div>
                  </td>
                  <td className="p-6 border border-gray-100 text-sm font-medium">5–7 business days</td>
                  <td className="p-6 border border-gray-100 font-bold text-brand-navy">$250 <span className="text-[10px] opacity-40 font-normal">/3k words</span></td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-[10px] text-brand-navy/40 italic">*Prices increase proportionally for manuscripts exceeding 3,000 words.</p>

          <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="font-bold text-brand-navy mb-6 flex items-center gap-2">
                <Zap size={18} className="text-amber-500" /> Express & Priority Options
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-sm">
                  <span className="text-sm font-medium">Express (48 hours)</span>
                  <span className="text-sm font-bold text-[#0052cc]">+40% fee</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-sm">
                  <span className="text-sm font-medium">Super Express (24 hours)</span>
                  <span className="text-sm font-bold text-[#0052cc]">+60% fee</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-brand-navy mb-6 flex items-center gap-2">
                <ShieldCheck size={18} className="text-green-600" /> Free Re-Editing Policy
              </h3>
              <ul className="space-y-3 text-sm text-brand-navy/70">
                <li><strong>Standard:</strong> One free re-edit within 7 days</li>
                <li><strong>Rapid:</strong> One free re-edit within 14 days</li>
                <li><strong>Academic:</strong> Unlimited re-editing for 30 days</li>
              </ul>
              <p className="mt-4 text-[11px] text-brand-navy/40 italic">Applies only to revised sections; does not cover newly added content beyond 20%.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Quote Box Section */}
      <section className="py-24 bg-gray-50 border-y border-gray-100">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div className="max-w-xl">
              <div className="flex items-center gap-3 text-brand-action mb-4">
                <FileCode size={20} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Service Inquiry</span>
              </div>
              <h2 className="text-4xl font-serif font-bold text-brand-navy mb-6">Request a Professional Quote</h2>
              <p className="text-brand-navy/60 text-lg leading-relaxed mb-8">
                Ready to take your manuscript to the next level? Fill out the form to receive a detailed quote tailored to your specific research needs and subject area.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4 text-brand-navy/70">
                   <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm shrink-0">
                      <Clock size={18} className="text-brand-action" />
                   </div>
                   <p className="text-sm">Response within <strong>24 business hours</strong></p>
                </div>
                <div className="flex items-center gap-4 text-brand-navy/70">
                   <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm shrink-0">
                      <ShieldCheck size={18} className="text-emerald-500" />
                   </div>
                   <p className="text-sm">100% Confidential and Secure Data Handling</p>
                </div>
                <div className="flex items-center gap-4 text-brand-navy/70">
                   <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm shrink-0">
                      <Award size={18} className="text-indigo-500" />
                   </div>
                   <p className="text-sm">Work reviewed by native English subject experts</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 md:p-12 rounded-sm shadow-2xl border border-gray-100 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-2 h-full bg-brand-action"></div>
               
               <form onSubmit={handleQuoteSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-brand-navy/40 mb-2">Full Name</label>
                      <input 
                        required
                        type="text"
                        value={quoteForm.name}
                        onChange={(e) => setQuoteForm({...quoteForm, name: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-sm focus:bg-white focus:border-brand-action outline-none transition-all text-sm"
                        placeholder="Dr. Jane Smith"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-brand-navy/40 mb-2">Email Address</label>
                      <input 
                        required
                        type="email"
                        value={quoteForm.email}
                        onChange={(e) => setQuoteForm({...quoteForm, email: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-sm focus:bg-white focus:border-brand-action outline-none transition-all text-sm"
                        placeholder="jane.smith@university.edu"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-brand-navy/40 mb-2">Service Type</label>
                      <select 
                        value={quoteForm.manuscriptType}
                        onChange={(e) => setQuoteForm({...quoteForm, manuscriptType: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-sm focus:bg-white focus:border-brand-action outline-none transition-all text-sm appearance-none"
                      >
                        <option>Standard Editing</option>
                        <option>Rapid Editing</option>
                        <option>Academic Editing</option>
                        <option>Figure/Table Editing</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-brand-navy/40 mb-2">Word Count</label>
                      <input 
                        required
                        type="number"
                        value={quoteForm.wordCount}
                        onChange={(e) => setQuoteForm({...quoteForm, wordCount: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-sm focus:bg-white focus:border-brand-action outline-none transition-all text-sm"
                        placeholder="e.g. 5000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-brand-navy/40 mb-2">Manuscript Overview</label>
                    <textarea 
                      required
                      rows={3}
                      value={quoteForm.message}
                      onChange={(e) => setQuoteForm({...quoteForm, message: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-sm focus:bg-white focus:border-brand-action outline-none transition-all text-sm resize-none"
                      placeholder="Briefly describe your manuscript subject and any specific concerns..."
                    ></textarea>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40 mb-2 text-nowrap">Attach Manuscript/Sample (Max 10MB)</label>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-100 rounded-sm p-6 flex flex-col items-center justify-center cursor-pointer hover:border-brand-action hover:bg-brand-action/5 transition-all group"
                    >
                      {uploadedFile ? (
                        <div className="flex items-center gap-3 text-brand-navy w-full">
                          <FileIcon className="text-brand-action shrink-0" size={20} />
                          <div className="text-left overflow-hidden">
                             <div className="text-xs font-bold truncate">{uploadedFile.name}</div>
                             <div className="text-[9px] text-brand-navy/40 uppercase font-black tracking-widest">
                                {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB — Ready
                             </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center">
                          <Upload size={24} className="text-gray-300 mb-2 group-hover:text-brand-action transition-colors mx-auto" />
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Click to upload fragment</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-brand-navy text-white py-4 rounded-sm font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:bg-brand-action transition-all disabled:opacity-70 shadow-xl shadow-brand-navy/10"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="animate-spin" size={16} /> Processing...
                      </span>
                    ) : (
                      <>
                        <Send size={16} /> Request Quote Now
                      </>
                    )}
                  </button>
               </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-brand-navy text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Ready to Polish Your Research?</h2>
            <p className="text-white/60 mb-10 text-lg">
              Academic Editing Services accepts Microsoft Word and LaTeX formats. 
              Our team is available to answer questions before or after editing.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => setShowQuoteModal(true)}
                className="btn-pill bg-brand-action w-full sm:w-auto hover:bg-white hover:text-brand-navy transition-all px-12 py-4"
              >
                Request a Quote
              </button>
              <Link to="/advanced-search" className="btn-pill border border-white/20 w-full sm:w-auto hover:bg-white/10 transition-all flex items-center justify-center gap-2 py-4">
                Search Journals <ArrowRight size={16} />
              </Link>
            </div>
            <div className="mt-12 pt-12 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <div className="text-2xl font-bold">100%</div>
                <div className="text-[10px] uppercase tracking-widest opacity-40 font-black mt-1">Confidential</div>
              </div>
              <div>
                <div className="text-2xl font-bold">Subject</div>
                <div className="text-[10px] uppercase tracking-widest opacity-40 font-black mt-1">Experts</div>
              </div>
              <div>
                <div className="text-2xl font-bold">LaTeX</div>
                <div className="text-[10px] uppercase tracking-widest opacity-40 font-black mt-1">Support</div>
              </div>
              <div>
                <div className="text-2xl font-bold">Word</div>
                <div className="text-[10px] uppercase tracking-widest opacity-40 font-black mt-1">Formats</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
