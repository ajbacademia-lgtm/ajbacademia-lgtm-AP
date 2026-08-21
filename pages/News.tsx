import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, Tag, Share2, Search, Loader2 } from 'lucide-react';
import { MockService } from '../services/mockDb';
import { NewsItem } from '../types';

export const News: React.FC = () => {
  const [newsItems, setNewsItems] = React.useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [activeCategory, setActiveCategory] = React.useState("All News");

  React.useEffect(() => {
    MockService.getNews().then(data => {
      setNewsItems(data);
      setIsLoading(false);
    });
  }, []);

  const categories = ["All News", "Innovation", "Journals", "Events", "Partnerships", "Reports"];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-brand-action" size={48} />
      </div>
    );
  }

  const filteredNews = activeCategory === "All News" 
    ? newsItems 
    : newsItems.filter(item => item.category === activeCategory);

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <section className="bg-brand-navy text-white py-16">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">News & Announcements</h1>
          <p className="text-xl text-white/60 max-w-2xl">
            Stay updated with the latest developments in open access publishing, platform updates, and research community events.
          </p>
        </div>
      </section>

      {/* Featured News */}
      <section className="py-12 -mt-10">
        <div className="container mx-auto px-6">
          {filteredNews.filter(i => i.featured).map(item => (
            <div key={item.id} className="bg-white rounded-sm shadow-2xl border border-gray-100 overflow-hidden flex flex-col lg:flex-row">
              <div className="lg:w-1/2 h-64 lg:h-auto overflow-hidden">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="lg:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-6">
                  <span className="bg-brand-action text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">{item.category}</span>
                  <span className="text-brand-navy/40 text-xs flex items-center gap-1">
                    <Calendar size={12} /> {item.date}
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-navy mb-6 leading-tight">
                  {item.title}
                </h2>
                <p className="text-brand-navy/60 text-lg mb-8 leading-relaxed">
                  {item.excerpt}
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <button className="flex items-center gap-2 text-brand-action font-bold hover:underline group">
                    Read Story <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button className="text-brand-navy/30 hover:text-brand-action transition-colors">
                    <Share2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories & Search */}
      <section className="py-8 border-b border-gray-100 sticky top-20 bg-white/95 backdrop-blur-sm z-30 hidden md:block">
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
            {categories.map(cat => (
              <button 
                key={cat} 
                onClick={() => setActiveCategory(cat)}
                className={`text-xs font-bold uppercase tracking-widest whitespace-nowrap pb-2 border-b-2 transition-all ${
                  cat === activeCategory ? "text-brand-action border-brand-action" : "text-brand-navy/40 border-transparent hover:text-brand-navy"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Filter news..." 
              className="pl-10 pr-4 py-2 border border-gray-100 rounded-sm text-xs focus:border-brand-action outline-none w-64"
            />
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-navy/30" />
          </div>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredNews.filter(i => !i.featured).map(item => (
              <div key={item.id} className="group flex flex-col">
                <div className="h-56 overflow-hidden rounded-sm mb-6 border border-gray-100">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-action">{item.category}</span>
                  <div className="w-1 h-1 bg-gray-200 rounded-full"></div>
                  <span className="text-brand-navy/40 text-[10px] uppercase font-bold tracking-widest">{item.date}</span>
                </div>
                <h3 className="text-xl font-bold text-brand-navy mb-4 group-hover:text-brand-action transition-colors leading-snug">
                  {item.title}
                </h3>
                <p className="text-brand-navy/60 text-sm leading-relaxed mb-6 flex-grow">
                  {item.excerpt}
                </p>
                <button className="flex items-center gap-1 text-xs font-bold text-brand-navy hover:text-brand-action transition-colors">
                  Read Full Article <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-20 pt-12 border-t border-gray-100 flex flex-col items-center">
            <p className="text-brand-navy/40 text-sm mb-6">Viewing 5 of 124 articles</p>
            <button className="px-10 py-3 border border-brand-navy/10 rounded-sm font-bold text-sm text-brand-navy hover:bg-brand-navy hover:text-white transition-all">
              Load More News
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};