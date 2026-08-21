import React, { useState, useRef } from 'react';
import { Briefcase, MapPin, Clock, ArrowRight, Sparkles, Users, Globe, Rocket, X, Upload, File as FileIcon, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const JOBS = [
  {
    id: 'job1',
    title: 'Senior Acquisitions Editor',
    department: 'Editorial',
    location: 'London, UK / Remote',
    type: 'Full-time',
    description: 'Leading the strategy for our growing Physical Sciences portfolio, identifying high-impact research trends.'
  },
  {
    id: 'job2',
    title: 'AI Engineering Lead',
    department: 'Technology',
    location: 'New York, USA / Remote',
    type: 'Full-time',
    description: 'Spearheading the development of our next-gen peer review automation and semantic search engines.'
  },
  {
    id: 'job3',
    title: 'Production Coordinator',
    department: 'Operations',
    location: 'New Delhi, India',
    type: 'Full-time',
    description: 'Managing the end-to-end publication workflow for our open access journals, ensuring quality and speed.'
  },
  {
    id: 'job4',
    title: 'Institutional Sales Manager',
    department: 'Sales & Marketing',
    location: 'Berlin, Germany',
    type: 'Full-time',
    description: 'Expanding our reach within European research institutions and managing consortia relationships.'
  },
  {
    id: 'job5',
    title: 'English Editor',
    department: 'Editorial',
    location: 'Remote',
    type: 'Full-time',
    description: 'Ensuring the highest linguistic standards across all published manuscripts, focusing on clarity, grammar, and academic style.'
  },
  {
    id: 'job6',
    title: 'Language Translator',
    department: 'Editorial',
    location: 'Remote / Multi-region',
    type: 'Contract',
    description: 'Facilitating global knowledge exchange by translating research abstracts and full papers across major scientific languages.'
  },
  {
    id: 'job7',
    title: 'IT Engineer',
    department: 'Technology',
    location: 'New York, USA / Remote',
    type: 'Full-time',
    description: 'Maintaining and scaling the cloud infrastructure that powers our global publishing platform and developer APIs.'
  },
  {
    id: 'job8',
    title: 'Journal Editor',
    department: 'Editorial',
    location: 'London, UK',
    type: 'Full-time',
    description: 'Managing the day-to-day operations of specific journals, coordinating with reviewers and authors throughout the peer-review process.'
  },
  {
    id: 'job9',
    title: 'Academic Publisher',
    department: 'Publishing Strategy',
    location: 'Berlin, Germany',
    type: 'Full-time',
    description: 'Driving the long-term growth and impact metrics for our portfolio, managing relationships with society partners and institutions.'
  }
];

export const Careers: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<typeof JOBS[0] | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openApplication = (job?: typeof JOBS[0]) => {
    setSelectedJob(job || null);
    setShowModal(true);
    setIsSubmitted(false);
    setUploadedFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call to jobs@academicpublishinggroup.org
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Application submitted to jobs@academicpublishinggroup.org
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-brand-navy overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-brand-action rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600 rounded-full blur-[120px]"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-3 text-brand-action mb-6">
              <Briefcase size={20} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Join the Future of Publishing</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-8 leading-tight">
              Build the infrastructure of <span className="text-brand-action italic">global knowledge.</span>
            </h1>
            <p className="text-xl text-white/60 mb-10 leading-relaxed font-light">
              Academic Publishing is redefining academic dissemination. We're looking for visionaries, editors, and engineers to help us make research more accessible, efficient, and impactful.
            </p>
            <a 
              href="#openings" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-brand-action text-white font-bold uppercase tracking-widest text-xs rounded-sm hover:bg-white hover:text-brand-navy transition-all shadow-xl shadow-brand-action/20"
            >
              View Open Positions <ArrowRight size={16} />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 border-b border-gray-100">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-blue-50 flex items-center justify-center text-brand-action rounded-sm">
                <Globe size={24} />
              </div>
              <h3 className="text-xl font-serif font-bold text-brand-navy">Global Impact</h3>
              <p className="text-sm text-brand-navy/60 leading-relaxed">
                Work on platforms used by millions of researchers across every continent, facilitating the exchange of life-changing discoveries.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-indigo-50 flex items-center justify-center text-indigo-600 rounded-sm">
                <Sparkles size={24} />
              </div>
              <h3 className="text-xl font-serif font-bold text-brand-navy">Tech-Forward</h3>
              <p className="text-sm text-brand-navy/60 leading-relaxed">
                We're not just a publisher; we're a tech company. We leverage AI, blockchain, and cloud native infrastructure to solve legacy problems.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-emerald-50 flex items-center justify-center text-emerald-600 rounded-sm">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-serif font-bold text-brand-navy">Academic Integrity</h3>
              <p className="text-sm text-brand-navy/60 leading-relaxed">
                Our mission is rooted in the quality of science. We value accuracy, peer review excellence, and ethical dissemination above all else.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Openings Section */}
      <section id="openings" className="py-24 bg-gray-50/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-bold text-brand-navy mb-4">Current Opportunities</h2>
            <p className="text-brand-navy/50 max-w-2xl mx-auto italic">
              We're a distributed team with hubs in major academic centers. Discover where you fit in the Academic ecosystem.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {JOBS.map((job) => (
              <motion.div 
                key={job.id}
                whileHover={{ x: 10 }}
                className="p-8 bg-white border border-gray-100 rounded-sm shadow-sm hover:shadow-xl transition-all group flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div>
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-action px-2 py-0.5 bg-brand-action/10 rounded">
                      {job.department}
                    </span>
                    <div className="flex items-center gap-1.5 text-[10px] text-brand-navy/40 font-bold uppercase tracking-wider">
                      <MapPin size={12} /> {job.location}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-brand-navy mb-2 group-hover:text-brand-action transition-colors">{job.title}</h3>
                  <p className="text-sm text-brand-navy/60 leading-relaxed max-w-xl">
                    {job.description}
                  </p>
                </div>
                <div className="flex flex-col items-start md:items-end gap-4 min-w-fit">
                  <div className="flex items-center gap-1.5 text-[10px] text-brand-navy/40 font-bold uppercase tracking-wider">
                    <Clock size={12} /> {job.type}
                  </div>
                  <button 
                    onClick={() => openApplication(job)}
                    className="px-6 py-2 border border-brand-navy/10 text-brand-navy font-bold uppercase tracking-widest text-[10px] rounded-sm hover:bg-brand-navy hover:text-white transition-all shadow-sm"
                  >
                    Apply Now
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-sm text-brand-navy/40 mb-6">Don't see a role that fits?</p>
            <button 
              onClick={() => openApplication()}
              className="text-sm font-black uppercase tracking-widest text-brand-action hover:underline"
            >
              Send us a spontaneous application
            </button>
          </div>
        </div>
      </section>

      {/* Perks Section */}
      <section className="py-24 bg-brand-navy text-white relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl font-serif font-bold mb-8">Beyond the Salary</h2>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-white/10 flex items-center justify-center rounded-full shrink-0">
                    <Rocket className="text-brand-action" size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Stock Options</h4>
                    <p className="text-sm text-white/50">Own a piece of the future. We offer competitive equity packages for all full-time employees.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-white/10 flex items-center justify-center rounded-full shrink-0">
                    <Users className="text-brand-action" size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Learning Stipend</h4>
                    <p className="text-sm text-white/50">Annual budget for books, conferences, and courses to help you stay at the cutting edge.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-white/10 flex items-center justify-center rounded-full shrink-0">
                    <Globe size={20} className="text-brand-action" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">True Remote Work</h4>
                    <p className="text-sm text-white/50">We focus on asynchronous communication so you can work during the hours that suit you best.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative aspect-square">
               <div className="absolute inset-12 bg-brand-action/20 rounded-sm transform rotate-3"></div>
               <div className="absolute inset-12 bg-white/5 rounded-sm transform -rotate-3 border border-white/10"></div>
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-7xl font-serif font-black text-white/5 mb-4 select-none tracking-widest">ACADEMIC</div>
                    <p className="text-xs uppercase tracking-[0.4em] font-black text-brand-action">Employee Experience</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Application Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-brand-navy/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-xl rounded-sm shadow-2xl relative overflow-hidden"
            >
              {/* Header */}
              <div className="bg-brand-navy p-6 text-white flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-serif font-bold">
                    {isSubmitted ? 'Application Sent' : selectedJob ? `Join as ${selectedJob.title}` : 'Spontaneous Application'}
                  </h3>
                  {!isSubmitted && (
                    <div className="text-[10px] text-brand-action uppercase font-black tracking-widest mt-1">
                      Direct to recruitment team
                    </div>
                  )}
                </div>
                <button 
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
              <div className="p-8">
                {isSubmitted ? (
                  <div className="py-12 text-center space-y-6">
                    <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
                      <CheckCircle2 size={40} />
                    </div>
                    <div className="space-y-2">
                       <h4 className="text-2xl font-serif font-bold text-brand-navy">Success.</h4>
                       <p className="text-sm text-brand-navy/60 leading-relaxed max-w-sm mx-auto">
                          Your credentials have been securely transmitted to <strong>jobs@academicpublishinggroup.org</strong>. Our talent acquisition team will review your application and provide feedback shortly.
                       </p>
                    </div>
                    <button 
                      onClick={() => setShowModal(false)}
                      className="px-10 py-3 bg-brand-navy text-white text-[10px] font-black uppercase tracking-widest rounded-sm hover:bg-brand-action hover:shadow-lg hover:shadow-brand-action/20 transition-all"
                    >
                      Close
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40">Full Name</label>
                        <input required type="text" className="w-full border-b border-gray-200 py-2 outline-none focus:border-brand-action transition-colors text-sm font-bold bg-transparent" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40">Email Address</label>
                        <input required type="email" className="w-full border-b border-gray-200 py-2 outline-none focus:border-brand-action transition-colors text-sm font-bold bg-transparent" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40">Cover Letter / Message</label>
                      <textarea 
                        required 
                        rows={4} 
                        placeholder="Tell us about your expertise and why Academic Publishing is the right next step for your career..."
                        className="w-full border border-gray-100 p-4 focus:border-brand-action outline-none transition-colors text-sm rounded-sm bg-gray-50/50 resize-none"
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40">Attach CV / Portfolio (PDF)</label>
                      <input 
                        type="file" 
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept=".pdf,.doc,.docx"
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
                                  {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB — Ready for Review
                               </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center relative z-10">
                            <Upload size={32} className="text-gray-300 mb-3 group-hover:text-brand-action transition-colors mx-auto" />
                            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Click to upload document</p>
                            <p className="text-[9px] text-gray-300 mt-1 uppercase tracking-widest italic">PDF, DOC is accepted</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-6 flex flex-col gap-4">
                      <button 
                        type="submit"
                        disabled={isSubmitting || !uploadedFile}
                        className="w-full py-5 bg-brand-action text-white font-black uppercase tracking-widest text-xs rounded-sm hover:bg-brand-navy transition-all shadow-xl shadow-brand-action/20 disabled:opacity-50 disabled:grayscale"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center justify-center gap-3">
                             <CircleDashed className="animate-spin" size={16} /> Transmitting Credentials...
                          </span>
                        ) : (
                          'Send Application'
                        )}
                      </button>
                      <p className="text-[9px] text-center text-brand-navy/30 uppercase tracking-[0.3em] font-black italic">
                        By submitting, you agree to our talent privacy policy
                      </p>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CircleDashed = ({ className, size }: { className?: string, size?: number }) => (
  <svg 
    className={className} 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M12 3a9 9 0 1 0 9 9" />
  </svg>
);
