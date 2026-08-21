import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  FlaskConical, 
  Binary, 
  Globe, 
  Leaf, 
  Cpu, 
  Database, 
  BarChart, 
  Microscope, 
  ArrowRight, 
  ChevronRight,
  BookOpen,
  Users,
  Award,
  Settings,
  Zap,
  Droplets,
  Wrench,
  Truck,
  HardHat,
  Factory,
  Layers,
  Heart,
  Brain,
  Stethoscope,
  Building2,
  Shield,
  Scissors,
  Activity as LucideActivity,
  Baby,
  Pill,
  ShieldPlus,
  Thermometer,
  Bandage,
  Bone,
  Palette,
  Building,
  Briefcase,
  MessageSquare,
  TrendingUp,
  GraduationCap,
  DollarSign,
  Map,
  History as HistoryIcon,
  Languages,
  Gavel,
  Book,
  Library,
  Lightbulb,
  Landmark,
  Compass,
  Plane,
  Layout,
  UserSearch,
  Search,
  Home
} from 'lucide-react';
import { MockService } from '../services/mockDb';
import { Journal } from '../types';

interface SubjectContent {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

// Internal icon proxy for Activity since it might not be imported from lucide
const Activity = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

const SUBJECT_DATA: Record<string, SubjectContent> = {
  // --- High Level Categories (from Home Sidebar) ---
  'biology-life-sciences': {
    title: 'Biology & Life Sciences',
    description: 'Comprehensive research into the biological mechanisms of life, from molecular structures to global ecosystems.',
    icon: <Microscope size={48} />,
    color: 'bg-emerald-600'
  },
  'business-economics': {
    title: 'Business & Economics',
    description: 'Analytical studies on global markets, organizational leadership, macroeconomics, and fiscal policy.',
    icon: <TrendingUp size={48} />,
    color: 'bg-blue-800'
  },
  'chemistry-materials-science': {
    title: 'Chemistry & Materials Science',
    description: 'Exploring the properties of matter and the development of new materials for industrial and scientific applications.',
    icon: <FlaskConical size={48} />,
    color: 'bg-indigo-700'
  },
  'computer-science-mathematics': {
    title: 'Computer Science & Mathematics',
    description: 'The foundation of the digital age, encompassing theoretical mathematics, algorithms, and artificial intelligence.',
    icon: <Binary size={48} />,
    color: 'bg-violet-800'
  },
  'engineering': {
    title: 'Engineering',
    description: 'Applied sciences and technologies that design, build, and maintain the infrastructure of the modern world.',
    icon: <Settings size={48} />,
    color: 'bg-slate-700'
  },
  'environmental-earth-sciences': {
    title: 'Environmental & Earth Sciences',
    description: 'Critical investigations into planetary processes, climate change, and environmental sustainability.',
    icon: <Globe size={48} />,
    color: 'bg-green-700'
  },
  'medicine-pharmacology': {
    title: 'Medicine & Pharmacology',
    description: 'Clinical research and pharmaceutical development aimed at improving human health and treating disease.',
    icon: <Stethoscope size={48} />,
    color: 'bg-red-700'
  },
  'public-health-health-care': {
    title: 'Public Health & Health Care',
    description: 'Systemic approaches to community health, epidemiology, healthcare policy, and hospital management.',
    icon: <Activity size={48} />,
    color: 'bg-teal-700'
  },
  'social-sciences-arts-humanities': {
    title: 'Social Sciences, Arts & Humanities',
    description: 'Interdisciplinary exploration of human society, culture, behavior, and creative expression.',
    icon: <Users size={48} />,
    color: 'bg-amber-800'
  },

  // --- Specific Subject Areas ---
  'bioscience': {
    title: 'Bioscience',
    description: 'Exploring the fundamental principles of life, from molecular biology to ecosystem dynamics.',
    icon: <Microscope size={48} />,
    color: 'bg-emerald-600'
  },
  'chemistry': {
    title: 'Chemistry',
    description: 'Advancing the molecular sciences through innovative research in organic, inorganic, and physical chemistry.',
    icon: <FlaskConical size={48} />,
    color: 'bg-blue-600'
  },
  'computer-information-sciences': {
    title: 'Computer & Information Sciences',
    description: 'Leading the digital revolution with research in AI, cybersecurity, and information theory.',
    icon: <Binary size={48} />,
    color: 'bg-indigo-700'
  },
  'earth-sciences': {
    title: 'Earth Sciences',
    description: 'Investigating the physical processes of our planet, from geology to atmospheric science.',
    icon: <Globe size={48} />,
    color: 'bg-amber-700'
  },
  'environment-agriculture': {
    title: 'Environment & Agriculture',
    description: 'Sustainable solutions for global food security and environmental conservation.',
    icon: <Leaf size={48} />,
    color: 'bg-green-700'
  },
  'environment-sustainability': {
    title: 'Environment & Sustainability',
    description: 'Interdisciplinary research focused on preserving our world for future generations.',
    icon: <Globe size={48} />,
    color: 'bg-teal-600'
  },
  'environmental-sciences': {
    title: 'Environmental Sciences',
    description: 'Critical analysis of environmental challenges and policy-driven solutions.',
    icon: <Leaf size={48} />,
    color: 'bg-emerald-700'
  },
  'food-science-technology': {
    title: 'Food Science & Technology',
    description: 'Innovation in food safety, nutrition, and processing technologies.',
    icon: <FlaskConical size={48} />,
    color: 'bg-orange-700'
  },
  'information-science': {
    title: 'Information Science',
    description: 'The study of information processing, storage, and retrieval in complex systems.',
    icon: <Database size={48} />,
    color: 'bg-slate-700'
  },
  'mathematics': {
    title: 'Mathematics',
    description: 'Pure and applied mathematical research pushing the boundaries of human logic.',
    icon: <Binary size={48} />,
    color: 'bg-purple-800'
  },
  'physical-sciences': {
    title: 'Physical Sciences',
    description: 'Fundamental research into the nature of matter, energy, and the universe.',
    icon: <Cpu size={48} />,
    color: 'bg-brand-navy'
  },
  'statistics': {
    title: 'Statistics',
    description: 'Methodologies for data analysis, probability, and decision-making under uncertainty.',
    icon: <BarChart size={48} />,
    color: 'bg-blue-800'
  },

  // Engineering
  'automotive-engineering': {
    title: 'Automotive Engineering',
    description: 'Innovative research in vehicle design, propulsion systems, and autonomous transportation technologies.',
    icon: <Truck size={48} />,
    color: 'bg-slate-800'
  },
  'biomedical-engineering': {
    title: 'Biomedical Engineering',
    description: 'Bridging the gap between engineering and medicine to improve healthcare through technological innovation.',
    icon: <Activity size={48} />,
    color: 'bg-cyan-600'
  },
  'chemical-engineering': {
    title: 'Chemical Engineering',
    description: 'Technical advancements in process engineering, material transformation, and biochemical systems.',
    icon: <FlaskConical size={48} />,
    color: 'bg-orange-600'
  },
  'civil-engineering': {
    title: 'Civil Engineering',
    description: 'Design and construction of sustainable infrastructure, from urban planning to structural mechanics.',
    icon: <HardHat size={48} />,
    color: 'bg-amber-600'
  },
  'electrical-engineering': {
    title: 'Electrical Engineering',
    description: 'Research in power systems, microelectronics, and signal processing for a connected world.',
    icon: <Zap size={48} />,
    color: 'bg-yellow-700'
  },
  'energy-oil': {
    title: 'Energy & Oil',
    description: 'Optimizing resource extraction while developing sustainable and alternative energy solutions.',
    icon: <Droplets size={48} />,
    color: 'bg-sky-800'
  },
  'engineering-computing-technology': {
    title: 'Engineering, Computing & Technology',
    description: 'Interdisciplinary research at the intersection of hardware systems and software intelligence.',
    icon: <Cpu size={48} />,
    color: 'bg-indigo-800'
  },
  'environmental-engineering': {
    title: 'Environmental Engineering',
    description: 'Applying engineering principles to protect environments and promote sustainable resource management.',
    icon: <Leaf size={48} />,
    color: 'bg-emerald-800'
  },
  'general-engineering': {
    title: 'General Engineering',
    description: 'Fundamental research and multidisciplinary studies across all branches of engineering.',
    icon: <Settings size={48} />,
    color: 'bg-slate-600'
  },
  'industrial-manufacturing-engineering': {
    title: 'Industrial & Manufacturing Engineering',
    description: 'Optimization of complex processes, systems, and organizations to improve productivity and quality.',
    icon: <Factory size={48} />,
    color: 'bg-zinc-700'
  },
  'materials-science-engineering': {
    title: 'Materials Science & Engineering',
    description: 'Discovering and designing new materials to solve technical challenges in modern industry.',
    icon: <Layers size={48} />,
    color: 'bg-violet-700'
  },
  'mechanical-engineering': {
    title: 'Mechanical Engineering',
    description: 'Research into mechanics, thermodynamics, and manufacturing systems that power modern machinery.',
    icon: <Wrench size={48} />,
    color: 'bg-red-700'
  },
  'mining-engineering': {
    title: 'Mining Engineering',
    description: 'Safe and efficient extraction of minerals and resources through technical excellence and innovation.',
    icon: <HardHat size={48} />,
    color: 'bg-stone-700'
  },

  // Medicine & Healthcare
  'addiction-treatment': {
    title: 'Addiction & Treatment',
    description: 'Evidence-based research on the prevention, treatment, and recovery from substance use disorders.',
    icon: <Activity size={48} />,
    color: 'bg-rose-700'
  },
  'allied-health': {
    title: 'Allied Health',
    description: 'Supporting the wide range of health professionals who provide diagnostic, technical, and therapeutic services.',
    icon: <Heart size={48} />,
    color: 'bg-sky-600'
  },
  'anesthesiology': {
    title: 'Anesthesiology',
    description: 'Advancing research in pain management, perioperative care, and anesthetic administration.',
    icon: <Thermometer size={48} />,
    color: 'bg-indigo-600'
  },
  'behavioral-health-and-medicine': {
    title: 'Behavioral Health and Medicine',
    description: 'Investigating the connection between human behavior and biological health outcomes.',
    icon: <Brain size={48} />,
    color: 'bg-purple-600'
  },
  'cardiology': {
    title: 'Cardiology',
    description: 'Frontier research in cardiovascular diseases, treatments, and heart health innovation.',
    icon: <Heart size={48} />,
    color: 'bg-red-600'
  },
  'clinical-medicine': {
    title: 'Clinical Medicine',
    description: 'Practitioner-focused research on diagnosis, treatment, and management of medical conditions.',
    icon: <Stethoscope size={48} />,
    color: 'bg-brand-navy'
  },
  'dentistry': {
    title: 'Dentistry',
    description: 'Innovations in oral health, dental surgery, and periodontics research.',
    icon: <ShieldPlus size={48} />,
    color: 'bg-blue-500'
  },
  'dermatology': {
    title: 'Dermatology',
    description: 'Advanced studies in skin health, pathology, and dermatological therapies.',
    icon: <Bandage size={48} />,
    color: 'bg-orange-600'
  },
  'endocrinology': {
    title: 'Endocrinology',
    description: 'The study of hormonal systems and their impact on physiological health and disease.',
    icon: <FlaskConical size={48} />,
    color: 'bg-amber-600'
  },
  'expert-collection': {
    title: 'Expert Collection',
    description: 'A curated selection of high-impact medical research and peer-reviewed expert opinions.',
    icon: <Award size={48} />,
    color: 'bg-yellow-600'
  },
  'hematology': {
    title: 'Hematology',
    description: 'Investigations into blood-related disorders, coagulation, and lymphatic systems.',
    icon: <Droplets size={48} />,
    color: 'bg-red-800'
  },
  'hospitals-and-health-systems': {
    title: 'Hospitals and Health Systems',
    description: 'Strategic research on healthcare delivery, management, and hospital operations.',
    icon: <Building2 size={48} />,
    color: 'bg-slate-700'
  },
  'immunology': {
    title: 'Immunology',
    description: 'Studying the immune system\'s mechanisms and its role in fighting and developing diseases.',
    icon: <Shield size={48} />,
    color: 'bg-emerald-600'
  },
  'infectious-diseases': {
    title: 'Infectious Diseases',
    description: 'Comprehensive research on viral, bacterial, and fungal infections and global health security.',
    icon: <LucideActivity size={48} />,
    color: 'bg-red-900'
  },
  'nephrology': {
    title: 'Nephrology',
    description: 'Dedicated research on kidney function, renal diseases, and therapeutic interventions.',
    icon: <Droplets size={48} />,
    color: 'bg-cyan-700'
  },
  'neurology': {
    title: 'Neurology',
    description: 'Advancing our understanding of the nervous system and neurological disorders.',
    icon: <Brain size={48} />,
    color: 'bg-violet-800'
  },
  'nursing': {
    title: 'Nursing',
    description: 'Empowering the nursing profession through high-quality research on patient care and practices.',
    icon: <Heart size={48} />,
    color: 'bg-pink-600'
  },
  'oncology': {
    title: 'Oncology',
    description: 'Critical research in cancer biology, treatments, and patient survivorship.',
    icon: <Activity size={48} />,
    color: 'bg-indigo-900'
  },
  'pediatrics': {
    title: 'Pediatrics',
    description: 'The health and medical care of infants, children, and adolescents.',
    icon: <Baby size={48} />,
    color: 'bg-sky-500'
  },
  'pharmaceutical-sciences': {
    title: 'Pharmaceutical Sciences',
    description: 'Drug discovery, pharmacology, and the development of new therapeutic agents.',
    icon: <Pill size={48} />,
    color: 'bg-blue-700'
  },
  'psychiatry': {
    title: 'Psychiatry',
    description: 'Clinical research on mental health, behavioral disorders, and therapeutic models.',
    icon: <Brain size={48} />,
    color: 'bg-fuchsia-800'
  },
  'public-health': {
    title: 'Public Health',
    description: 'Improving community health outcomes through research on policy, environment, and behavior.',
    icon: <Globe size={48} />,
    color: 'bg-teal-700'
  },
  'radiology': {
    title: 'Radiology',
    description: 'Advancements in medical imaging technology and radiological diagnostics.',
    icon: <Activity size={48} />,
    color: 'bg-blue-900'
  },
  'substance-use-misuse': {
    title: 'Substance Use & Misuse',
    description: 'Interdisciplinary research on the impacts and interventions for substance misuse.',
    icon: <Activity size={48} />,
    color: 'bg-zinc-700'
  },
  'surgery': {
    title: 'Surgery',
    description: 'Technical innovation and clinical outcomes in surgical procedures and postoperative care.',
    icon: <Scissors size={48} />,
    color: 'bg-slate-600'
  },
  'urology': {
    title: 'Urology',
    description: 'Clinical research on the urinary-tract system and reproductive health.',
    icon: <Droplets size={48} />,
    color: 'bg-blue-800'
  },
  'veterinary-medicine': {
    title: 'Veterinary Medicine',
    description: 'Advancing the health and well-being of animals through scientific research.',
    icon: <Activity size={48} />,
    color: 'bg-orange-800'
  },
  'womens-health': {
    title: 'Women\'s Health',
    description: 'Specialized research focusing on health issues specific to women throughout their lifespan.',
    icon: <Heart size={48} />,
    color: 'bg-rose-500'
  },

  // Humanities & Social Sciences
  'area-studies': {
    title: 'Area Studies',
    description: 'Multidisciplinary research into the history, politics, and culture of specific geographic regions.',
    icon: <Globe size={48} />,
    color: 'bg-orange-800'
  },
  'arts': {
    title: 'Arts',
    description: 'Critical perspectives on visual arts, performing arts, and the history of creative expression.',
    icon: <Palette size={48} />,
    color: 'bg-rose-600'
  },
  'behavioural-sciences': {
    title: 'Behavioural Sciences',
    description: 'Exploring the complexities of human action, decision-making, and social interaction.',
    icon: <Brain size={48} />,
    color: 'bg-purple-700'
  },
  'built-environment': {
    title: 'Built Environment',
    description: 'Architecture, urban design, and the physical spaces that shape human experience.',
    icon: <Building size={48} />,
    color: 'bg-stone-600'
  },
  'business-management': {
    title: 'Business & Management',
    description: 'Research into organizational theory, strategy, leadership, and global commerce.',
    icon: <Briefcase size={48} />,
    color: 'bg-blue-900'
  },
  'communication-studies': {
    title: 'Communication Studies',
    description: 'The study of human communication, media impact, and information flow in digital societies.',
    icon: <MessageSquare size={48} />,
    color: 'bg-indigo-600'
  },
  'economics': {
    title: 'Economics',
    description: 'Theoretical and applied research into market dynamics, policy, and global wealth distribution.',
    icon: <TrendingUp size={48} />,
    color: 'bg-emerald-800'
  },
  'education': {
    title: 'Education',
    description: 'Advancing pedagogical research, learning theories, and educational policy development.',
    icon: <GraduationCap size={48} />,
    color: 'bg-blue-700'
  },
  'finance': {
    title: 'Finance',
    description: 'Rigorous analysis of financial markets, investment theory, and corporate finance.',
    icon: <DollarSign size={48} />,
    color: 'bg-slate-800'
  },
  'geography': {
    title: 'Geography',
    description: 'Human and physical geography research exploring spatial relationships and environmental impacts.',
    icon: <Map size={48} />,
    color: 'bg-green-700'
  },
  'global-development': {
    title: 'Global Development',
    description: 'Critical analysis of international development, poverty alleviation, and sustainable growth.',
    icon: <Globe size={48} />, // Use Globe for Global Dev
    color: 'bg-cyan-800'
  },
  'history': {
    title: 'History',
    description: 'Uncovering the narratives of the past to understand the evolution of human societies.',
    icon: <HistoryIcon size={48} />,
    color: 'bg-amber-900'
  },
  'humanities-and-social-sciences': {
    title: 'Humanities and Social Sciences',
    description: 'Broad-based interdisciplinary research spanning the full breadth of human thought and social structure.',
    icon: <Users size={48} />,
    color: 'bg-brand-navy'
  },
  'international-relations': {
    title: 'International Relations',
    description: 'Studies in diplomacy, global governance, security, and international political economy.',
    icon: <Globe size={48} />,
    color: 'bg-indigo-900'
  },
  'language': {
    title: 'Language',
    description: 'Linguistic research into the structure, acquisition, and social use of language.',
    icon: <Languages size={48} />,
    color: 'bg-violet-700'
  },
  'law': {
    title: 'Law',
    description: 'Academic research in legal theory, jurisprudence, and international legal systems.',
    icon: <Gavel size={48} />,
    color: 'bg-slate-900'
  },
  'literature': {
    title: 'Literature',
    description: 'Critical analysis of literary works, genres, and the evolution of storytelling.',
    icon: <Book size={48} />,
    color: 'bg-red-900'
  },
  'museum-and-heritage-studies': {
    title: 'Museum and Heritage Studies',
    description: 'The preservation of cultural heritage and the evolving role of museums in society.',
    icon: <Library size={48} />,
    color: 'bg-orange-700'
  },
  'philosophy': {
    title: 'Philosophy',
    description: 'Inquiry into fundamental questions of existence, knowledge, ethics, and reason.',
    icon: <Lightbulb size={48} />,
    color: 'bg-yellow-900'
  },
  'politics': {
    title: 'Politics',
    description: 'Research on political systems, political theory, and the dynamics of power.',
    icon: <Landmark size={48} />,
    color: 'bg-blue-800'
  },
  'psychology': {
    title: 'Psychology',
    description: 'The scientific study of the human mind, behavior, and mental processes.',
    icon: <Brain size={48} />,
    color: 'bg-purple-800'
  },
  'religion': {
    title: 'Religion',
    description: 'Academic study of religious traditions, belief systems, and their societal impact.',
    icon: <Compass size={48} />,
    color: 'bg-stone-800'
  },
  'routledge-encyclopedia-of-modernism': {
    title: 'Routledge Encyclopedia of Modernism',
    description: 'A comprehensive digital resource for the study of global modernism across the humanities.',
    icon: <Layout size={48} />,
    color: 'bg-brand-navy'
  },
  'routledge-handbooks-online': {
    title: 'Routledge Handbooks Online',
    description: 'Premier digital collection of high-level handbooks across major social science and humanities disciplines.',
    icon: <Library size={48} />,
    color: 'bg-indigo-800'
  },
  'sociology': {
    title: 'Sociology',
    description: 'Investigating social structures, institutions, and the dynamics of human collective life.',
    icon: <Users size={48} />,
    color: 'bg-cyan-900'
  },
  'tourism-hospitality-and-events': {
    title: 'Tourism, Hospitality and Events',
    description: 'Research into the economic, social, and environmental impacts of global travel and event industries.',
    icon: <Plane size={48} />,
    color: 'bg-sky-600'
  },
  'urban-studies': {
    title: 'Urban Studies',
    description: 'Analysis of city life, urban development, and the challenges of modern metropolitan environments.',
    icon: <Building2 size={48} />,
    color: 'bg-slate-700'
  },
  'world-whos-who': {
    title: 'World Who\'s Who',
    description: 'The definitive biographical resource for influential figures across all international domains.',
    icon: <UserSearch size={48} />,
    color: 'bg-brand-navy'
  }
};

export const SubjectArea: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [journals, setJournals] = useState<Journal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const content = slug ? SUBJECT_DATA[slug] : null;

  useEffect(() => {
    setLoading(true);
    MockService.getJournals()
      .then(data => {
        // In a real app, we would filter by subject. 
        // For this mock, we show all journals or a subset.
        setJournals(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load journals for subject:", err);
        setError("Failed to retrieve journals for this disciplinary node.");
        setLoading(false);
      });
  }, [slug]);

  const filteredJournals = journals.filter(j => 
    j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.issn.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!content) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center py-24 px-6 text-center">
        <div className="max-w-2xl">
          <div className="mb-8 flex justify-center">
            <div className="relative inline-block">
              <h1 className="text-[120px] font-serif font-black text-brand-navy/5 leading-none">404</h1>
              <div className="absolute inset-0 flex items-center justify-center">
                <Search size={60} className="text-brand-action/20" />
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-serif font-bold text-brand-navy mb-4 italic">Subject Undefined</h2>
          <p className="text-brand-navy/60 text-lg mb-10 leading-relaxed max-w-lg mx-auto">
            Our disciplinary repository does not currently contain a knowledge node for <span className="font-bold text-brand-navy">"{slug}"</span>. 
            The classification may have been restructured or moved to a related subject area.
          </p>

          <Link 
            to="/" 
            className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-brand-navy text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-sm hover:bg-brand-action transition-all shadow-lg hover:shadow-xl"
          >
            <Home size={16} /> 
            Return to Portal
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Subject Hero */}
      <section className={`${content.color} text-white py-20 relative overflow-hidden`}>
        <div className="absolute top-0 right-0 p-12 opacity-10 transform translate-x-1/4 -translate-y-1/4">
          {content.icon}
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50 mb-4 block">Discipline</span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 leading-tight">
              {content.title}
            </h1>
            <p className="text-xl text-white/80 leading-relaxed font-sans">
              {content.description}
            </p>
          </div>
        </div>
      </section>

      {/* Stats/Quick Actions */}
      <section className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
            <div className="py-8 px-4 flex flex-col items-center text-center">
              <div className="text-2xl font-bold text-brand-navy mb-1">45+</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40">Active Journals</div>
            </div>
            <div className="py-8 px-4 flex flex-col items-center text-center">
              <div className="text-2xl font-bold text-brand-navy mb-1">12k+</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40">Articles Published</div>
            </div>
            <div className="py-8 px-4 flex flex-col items-center text-center">
              <div className="text-2xl font-bold text-brand-navy mb-1">2.4M</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-brand-navy/40">Citations Yearly</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-16">
            {/* Sidebar Resources */}
            <div className="lg:col-span-1 space-y-10">
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-brand-navy/40 mb-6 pb-2 border-b border-gray-100">Resources</h3>
                <ul className="space-y-4">
                  <li>
                    <Link to="/journal-authors" className="flex items-center justify-between group">
                      <span className="text-sm font-bold text-brand-navy group-hover:text-brand-action transition-colors">Submit a Manuscript</span>
                      <ChevronRight size={16} className="text-gray-300 group-hover:text-brand-action transition-colors" />
                    </Link>
                  </li>
                  <li>
                    <Link to="/submission-workflow" className="flex items-center justify-between group">
                      <span className="text-sm font-bold text-brand-navy group-hover:text-brand-action transition-colors">Submission Workflow</span>
                      <ChevronRight size={16} className="text-gray-300 group-hover:text-brand-action transition-colors" />
                    </Link>
                  </li>
                  <li>
                    <Link to="/publication-module" className="flex items-center justify-between group">
                      <span className="text-sm font-bold text-brand-navy group-hover:text-brand-action transition-colors">Publication Module</span>
                      <ChevronRight size={16} className="text-gray-300 group-hover:text-brand-action transition-colors" />
                    </Link>
                  </li>
                  <li>
                    <Link to="/admindashboard" className="flex items-center justify-between group">
                      <span className="text-sm font-bold text-brand-navy group-hover:text-brand-action transition-colors">Admin Dashboards</span>
                      <ChevronRight size={16} className="text-gray-300 group-hover:text-brand-action transition-colors" />
                    </Link>
                  </li>
                  <li>
                    <Link to="/editing-services" className="flex items-center justify-between group">
                      <span className="text-sm font-bold text-brand-navy group-hover:text-brand-action transition-colors">Language Editing</span>
                      <ChevronRight size={16} className="text-gray-300 group-hover:text-brand-action transition-colors" />
                    </Link>
                  </li>
                  <li>
                    <Link to="/societies" className="flex items-center justify-between group">
                      <span className="text-sm font-bold text-brand-navy group-hover:text-brand-action transition-colors">Society Partnerships</span>
                      <ChevronRight size={16} className="text-gray-300 group-hover:text-brand-action transition-colors" />
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="bg-brand-light p-6 rounded-sm border border-brand-navy/5">
                <h4 className="font-bold text-brand-navy mb-3 text-sm flex items-center gap-2">
                  <Award size={18} className="text-brand-action" /> Excellence
                </h4>
                <p className="text-xs text-brand-navy/60 leading-relaxed">
                  Our {content.title} journals are indexed in Web of Science, Scopus, and PubMed, ensuring maximum visibility for your research.
                </p>
              </div>
            </div>

            {/* Journal Grid */}
            <div className="lg:col-span-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <h2 className="text-2xl font-serif font-bold text-brand-navy">Featured Journals</h2>
                
                <div className="flex items-center gap-4 flex-grow max-w-md">
                  <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      placeholder="Search journals..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-sm focus:ring-2 focus:ring-brand-action outline-none text-sm transition-all"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="text-xs font-bold text-brand-navy/40 uppercase tracking-widest whitespace-nowrap">
                    {filteredJournals.length} Journals found
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-48 bg-gray-50 animate-pulse rounded-sm"></div>
                  ))}
                </div>
              ) : error ? (
                <div className="p-12 bg-red-50 text-red-700 text-center rounded-sm border border-red-100 italic">
                  {error}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {filteredJournals.map((journal) => (
                    <Link 
                      key={journal.id} 
                      to={`/journal/${journal.id}`} 
                      className="flex gap-6 p-6 border border-gray-100 rounded-sm hover:border-brand-action hover:shadow-xl transition-all group"
                    >
                      <div className="w-24 h-32 flex-shrink-0 bg-gray-100 rounded-sm overflow-hidden shadow-sm">
                        <img src={journal.coverImage} alt={journal.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-brand-navy mb-2 group-hover:text-brand-action transition-colors leading-tight">
                          {journal.title}
                        </h4>
                        <p className="text-xs text-brand-navy/60 line-clamp-3 mb-4 leading-relaxed">
                          {journal.description}
                        </p>
                        <div className="text-[10px] font-black uppercase tracking-widest text-brand-navy/30">
                          ISSN: {journal.issn}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              <div className="mt-16 p-8 bg-gray-50 rounded-sm border border-gray-100 text-center">
                <h3 className="text-xl font-bold text-brand-navy mb-4">Can't find what you're looking for?</h3>
                <p className="text-sm text-brand-navy/60 mb-8 max-w-lg mx-auto">
                  Browse our full A-Z list of journals or use the advanced search to discover articles across all our {content.title} publications.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link to="/" className="px-8 py-3 bg-brand-navy text-white text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-brand-action transition-all">Full Journal List</Link>
                  <Link to="/advanced-search" className="px-8 py-3 border border-brand-navy/10 text-brand-navy text-xs font-bold uppercase tracking-widest rounded-sm hover:border-brand-action transition-all">Advanced Search</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Publish Section */}
      <section className="py-24 bg-brand-light border-y border-brand-navy/5">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-serif font-bold text-brand-navy mb-4">Why publish your {content.title} research with Academic Publishing?</h2>
            <div className="w-16 h-[1px] bg-brand-action mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-white text-brand-action rounded-sm flex items-center justify-center shadow-sm">
                <Users size={24} />
              </div>
              <h4 className="text-lg font-bold text-brand-navy">Global Readership</h4>
              <p className="text-sm text-brand-navy/60 leading-relaxed">
                Reach a global audience with our gold open access model, ensuring your work is seen by thousands of researchers daily.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-white text-brand-action rounded-sm flex items-center justify-center shadow-sm">
                <BookOpen size={24} />
              </div>
              <h4 className="text-lg font-bold text-brand-navy">Rapid Publication</h4>
              <p className="text-sm text-brand-navy/60 leading-relaxed">
                Our efficient editorial process ensures high-quality peer review without long delays, getting your research out faster.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-white text-brand-action rounded-sm flex items-center justify-center shadow-sm">
                <Globe size={24} />
              </div>
              <h4 className="text-lg font-bold text-brand-navy">High Impact</h4>
              <p className="text-sm text-brand-navy/60 leading-relaxed">
                Dedicated marketing and indexing strategies across all major scientific databases to maximize your citation count.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
