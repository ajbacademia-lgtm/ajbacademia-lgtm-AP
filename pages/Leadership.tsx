import React from 'react';
import { Linkedin, Mail, Twitter } from 'lucide-react';

export const Leadership: React.FC = () => {
  const leaders = [
    {
      name: "Dr. Elena Rodriguez",
      role: "Chief Executive Officer",
      bio: "A pioneer in open access publishing with over 20 years of experience in academic management and digital transformation.",
      image: "https://i.pravatar.cc/300?u=elena"
    },
    {
      name: "Prof. Marcus Thorne",
      role: "Chief Editorial Officer",
      bio: "Former Dean of Sciences at Academic Publishing Global University, overseeing the integrity and growth of our 500+ journal portfolio.",
      image: "https://i.pravatar.cc/300?u=marcus"
    },
    {
      name: "Sarah Jenkins",
      role: "Chief Technology Officer",
      bio: "Leading the development of our AI-native publishing platform and global content delivery networks.",
      image: "https://i.pravatar.cc/300?u=sarah"
    },
    {
      name: "David Chen",
      role: "Chief Operations Officer",
      bio: "Focused on global expansion and operational excellence across our London, Singapore, and New York hubs.",
      image: "https://i.pravatar.cc/300?u=david"
    }
  ];

  return (
    <div className="bg-white min-h-screen">
      <section className="bg-brand-navy text-white py-20">
        <div className="container mx-auto px-6">
          <span className="text-xs font-black uppercase tracking-[0.3em] text-brand-action mb-4 block">Expertise</span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">Our Leadership Team</h1>
          <p className="text-xl text-white/60 max-w-2xl leading-relaxed">
            Guided by a diverse team of academics, technologists, and publishing professionals dedicated to the future of scholarly communication.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {leaders.map((leader, i) => (
              <div key={i} className="group">
                <div className="relative aspect-[3/4] mb-6 overflow-hidden bg-gray-100 rounded-sm">
                  <img 
                    src={leader.image} 
                    alt={leader.name} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-brand-navy/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <button className="w-10 h-10 bg-white text-brand-navy rounded-full flex items-center justify-center hover:bg-brand-action hover:text-white transition-colors">
                      <Linkedin size={18} />
                    </button>
                    <button className="w-10 h-10 bg-white text-brand-navy rounded-full flex items-center justify-center hover:bg-brand-action hover:text-white transition-colors">
                      <Mail size={18} />
                    </button>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-brand-navy mb-1">{leader.name}</h3>
                <div className="text-[10px] font-black uppercase tracking-widest text-brand-action mb-4">{leader.role}</div>
                <p className="text-sm text-brand-navy/60 leading-relaxed">
                  {leader.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-serif font-bold text-brand-navy mb-6">Guided by Scientific Councils</h2>
            <p className="text-brand-navy/70 mb-10">
              Beyond our core leadership, Academic Publishing is advised by international scientific councils comprising Nobel laureates and field-leading researchers who ensure our editorial policies remain at the absolute vanguard of science.
            </p>
            <button className="text-brand-action font-bold hover:underline flex items-center justify-center gap-2 mx-auto">
              View Scientific Advisory Board <Linkedin size={14} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
