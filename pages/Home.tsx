import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ArrowRight, SlidersHorizontal, Layers, Leaf, Cpu, Globe, FlaskConical, Zap, BarChart, Stethoscope, Satellite, Carrot, Activity, Droplets, Binary, Microscope, Mail } from 'lucide-react';
import { MockService } from '../services/mockDb';
import { Journal } from '../types';
import { NewsletterSubscription } from '../components/NewsletterSubscription';

export const Home: React.FC = () => {
  const [journals, setJournals] = useState<Journal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    MockService.getJournals()
      .then(data => {
        setJournals(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load journals:", err);
        setError("Unable to load featured journals. Please try again later.");
        setLoading(false);
      });
  }, []);

  const journalGridItems = [
    { title: "IJASI", icon: <Carrot className="text-white" />, color: "bg-emerald-800" },
    { title: "QJESI", icon: <Globe className="text-white" />, color: "bg-blue-700" },
    { title: "JBME", icon: <Microscope className="text-white" />, color: "bg-indigo-700" },
    { title: "IJESSI", icon: <Zap className="text-white" />, color: "bg-amber-700" },
    { title: "IJAIT", icon: <Cpu className="text-white" />, color: "bg-teal-600" },
    { title: "JIEAI", icon: <BarChart className="text-white" />, color: "bg-slate-700" },
    { title: "FESE", icon: <Droplets className="text-white" />, color: "bg-blue-600" },
    { title: "FSIE", icon: <Activity className="text-white" />, color: "bg-rose-800" }
  ];

  const sidebarSubjects = [
    "All Subjects",
    "Biology & Life Sciences",
    "Business & Economics",
    "Chemistry & Materials Science",
    "Computer Science & Mathematics",
    "Engineering",
    "Environmental & Earth Sciences",
    "Medicine & Pharmacology",
    "Physical Sciences",
    "Public Health & Health Care",
    "Social Sciences, Arts & Humanities"
  ];

  const footerSubjects = {
    "Science & Technology": ["Bioscience", "Chemistry", "Computer & Information Sciences", "Earth Sciences", "Environment & Agriculture", "Environment & Sustainability", "Environmental Sciences", "Food Science & Technology", "Information Science", "Mathematics", "Physical Sciences", "Statistics"],
    "Engineering": ["Automotive Engineering", "Biomedical Engineering", "Chemical Engineering", "Civil Engineering", "Electrical Engineering", "Energy & Oil", "Engineering, Computing & Technology", "Environmental Engineering", "General Engineering", "Industrial & Manufacturing Engineering", "Materials Science & Engineering", "Mechanical Engineering", "Mining Engineering"],
    "Medicine & Healthcare": ["Addiction & Treatment", "Allied Health", "Anesthesiology", "Behavioral Health and Medicine", "Cardiology", "Clinical Medicine", "Dentistry", "Dermatology", "Endocrinology", "Expert Collection", "Hematology", "Hospitals and Health Systems", "Immunology", "Infectious Diseases", "Nephrology", "Neurology", "Nursing", "Oncology", "Pediatrics", "Pharmaceutical Sciences", "Psychiatry", "Public Health", "Radiology", "Substance Use & Misuse", "Surgery", "Urology", "Veterinary Medicine", "Women's Health"],
    "Humanities & Social Sciences": ["Area Studies", "Arts", "Behavioural Sciences", "Built Environment", "Business & Management", "Communication Studies", "Economics", "Education", "Finance", "Geography", "Global Development", "History", "Humanities and Social Sciences", "International Relations", "Language", "Law", "Literature", "Museum and Heritage Studies", "Philosophy", "Politics", "Psychology", "Religion", "Routledge Encyclopedia of Modernism", "Routledge Handbooks Online", "Sociology", "Tourism, Hospitality and Events", "Urban Studies", "World Who's Who"]
  };

  const slugify = (text: string) => {
    return text.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-').replace(/,/g, '').replace(/'/g, '');
  };

  return (
    <div className="w-full bg-white">
      {/* Hero Section - Split into two columns */}
      <section className="bg-brand-navy text-white">
        <div className="container mx-auto px-6 py-12 md:py-16 border-b border-white/5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-serif font-medium leading-tight">
              Advancing Science through world’s leading open access publisher.
            </h1>
            <div className="lg:border-l lg:border-white/10 lg:pl-12">
              <p className="text-sm md:text-base text-white/70 font-sans leading-relaxed">
                Supporting research communities and accelerating scientific discovery through knowledge sharing
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Advancing Open Science Banner - Minimized & Compact Blue */}
      <section className="bg-[#0052cc] text-white">
        <div className="container mx-auto px-6 py-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
            {/* Left: Search Content */}
            <div className="w-full lg:w-1/2">
              <h2 className="text-3xl md:text-4xl font-sans font-bold mb-6 tracking-tight">
                Advancing Open Science
              </h2>
              <div className="max-w-xl">
                <div className="relative flex items-center bg-white rounded-sm p-1 shadow-lg">
                  <input 
                    type="text" 
                    placeholder="Search for articles..." 
                    className="flex-grow px-4 py-2.5 text-brand-slate outline-none text-base"
                  />
                  <button className="bg-[#0052cc] hover:bg-brand-navy text-white px-6 py-2.5 rounded-sm font-bold transition-colors text-sm">
                    Search
                  </button>
                </div>
                <Link to="/advanced-search" className="mt-3 flex items-center gap-2 text-white/80 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors">
                  <SlidersHorizontal size={14} />
                  Advanced Search
                </Link>
              </div>
            </div>

            {/* Right: Integrated Platform Highlights */}
            <div className="w-full lg:w-1/2 grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="border-l border-white/20 pl-6 py-2">
                <div className="text-xl md:text-2xl font-light">100%</div>
                <div className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Peer Reviewed</div>
              </div>
              <div className="border-l border-white/20 pl-6 py-2">
                <div className="text-xl md:text-2xl font-light">Gold & Diamond</div>
                <div className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Open Access</div>
              </div>
              <div className="border-l border-white/20 pl-6 py-2">
                <div className="text-xl md:text-2xl font-light">COPE & DOAJ</div>
                <div className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Ethics Compliant</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Action Bar */}
      <div className="bg-white border-b border-gray-100 shadow-sm relative z-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-100">
            <Link to="/submission-workflow" className="flex items-center justify-between md:justify-center gap-2 py-5 px-4 text-brand-navy hover:text-brand-action group transition-all bg-brand-light/30">
              <span className="text-[10px] font-bold uppercase tracking-widest">Submission Workflow</span>
              <ChevronRight size={14} className="text-brand-action group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/review-management" className="flex items-center justify-between md:justify-center gap-2 py-5 px-4 text-brand-navy hover:text-brand-action group transition-all">
              <span className="text-[10px] font-bold uppercase tracking-widest">Review Management</span>
              <ChevronRight size={14} className="text-brand-action group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/publication-module" className="flex items-center justify-between md:justify-center gap-2 py-5 px-4 text-brand-navy hover:text-brand-action group transition-all bg-brand-light/10">
              <span className="text-[10px] font-bold uppercase tracking-widest">Publication Module</span>
              <ChevronRight size={14} className="text-brand-action group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/admindashboard" className="flex items-center justify-between md:justify-center gap-2 py-5 px-4 text-brand-navy hover:text-brand-action group transition-all">
              <span className="text-[10px] font-bold uppercase tracking-widest">Admin Dashboards</span>
              <ChevronRight size={14} className="text-brand-action group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/advanced-search" className="flex items-center justify-between md:justify-center gap-2 py-5 px-4 text-brand-navy hover:text-brand-action group transition-all">
              <span className="text-[10px] font-bold uppercase tracking-widest">Find a journal article</span>
              <ChevronRight size={14} className="text-brand-action group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/" className="flex items-center justify-between md:justify-center gap-2 py-5 px-4 text-brand-navy hover:text-brand-action group transition-all">
              <span className="text-[10px] font-bold uppercase tracking-widest">Shop for books</span>
              <ChevronRight size={14} className="text-brand-action group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/careers" className="flex items-center justify-between md:justify-center gap-2 py-5 px-4 text-brand-navy hover:text-brand-action group transition-all">
              <span className="text-[10px] font-bold uppercase tracking-widest">Find a job</span>
              <ChevronRight size={14} className="text-brand-action group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Journals Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-10">
             <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-brand-navy group">
               Journals <ArrowRight className="group-hover:translate-x-1 transition-transform" size={24} />
             </Link>
             <Link to="/journals" className="flex items-center gap-1 text-[#0052cc] font-medium text-sm hover:underline">
               Browse full list <ChevronRight size={16} />
             </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Sidebar Column */}
            <div className="lg:col-span-3">
              <nav className="flex flex-col gap-1">
                {sidebarSubjects.map((subject, idx) => (
                  <Link 
                    key={idx}
                    to={subject === "All Subjects" ? "/" : `/subject/${slugify(subject)}`}
                    className={`text-[13px] text-left w-full py-2.5 transition-all border-l-2 ${
                      subject === "All Subjects" 
                      ? "text-[#0052cc] font-bold border-[#0052cc] bg-blue-50/50 pl-4" 
                      : "text-brand-navy/70 border-transparent hover:text-[#0052cc] hover:bg-gray-50 pl-4"
                    }`}
                  >
                    {subject}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Grid Column */}
            <div className="lg:col-span-9">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {loading ? (
                  Array(6).fill(0).map((_, i) => (
                    <div key={i} className="h-20 bg-gray-50 animate-pulse rounded-sm"></div>
                  ))
                ) : error ? (
                  <div className="col-span-full p-6 bg-red-50 text-red-700 text-sm font-medium rounded-sm border border-red-100 italic">
                    {error}
                  </div>
                ) : (
                  journals.map((journal) => (
                    <Link 
                      key={journal.id} 
                      to={`/journal/${journal.id}`} 
                      className="flex items-center gap-4 p-4 border border-gray-200 rounded-sm hover:shadow-md transition-shadow group bg-white"
                    >
                      <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-sm bg-brand-navy overflow-hidden">
                        <img src={journal.coverImage} alt="" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <span className="text-sm font-bold text-brand-navy group-hover:text-[#0052cc] transition-colors line-clamp-1">
                        {journal.title}
                      </span>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Subject Areas Section */}
      <section className="py-20 bg-gray-50 border-t border-gray-100">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-6 mb-16">
            <h2 className="text-2xl font-serif font-bold text-brand-navy whitespace-nowrap">Our subject areas and disciplines</h2>
            <div className="w-full h-[1px] bg-brand-navy/10"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-12 gap-y-16">
            {Object.entries(footerSubjects).map(([category, items]) => (
              <div key={category}>
                <h3 className="font-bold text-brand-navy mb-6 pb-2 border-b border-brand-navy/5 text-lg">{category}</h3>
                <ul className="space-y-2.5">
                  {items.map(item => (
                    <li key={item}>
                      <Link 
                        to={(category === "Science & Technology" || category === "Engineering" || category === "Medicine & Healthcare" || category === "Humanities & Social Sciences") ? `/subject/${slugify(item)}` : "/"} 
                        className="text-[13px] text-brand-navy/70 hover:text-brand-action transition-colors hover:underline"
                      >
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Subscription Section (Before Footer) */}
      <section className="py-12 bg-white border-t border-gray-200">
        <div className="container mx-auto px-6">
          <NewsletterSubscription 
            variant="banner" 
            source="Home Page Section"
          />
        </div>
      </section>
    </div>
  );
};
