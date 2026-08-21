import React, { useState } from 'react';
import { Mail, Phone, MapPin, Globe, MessageSquare, Send, CheckCircle2, Loader2, ArrowRight, ExternalLink, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useConfiguration, DEFAULT_CONTACT_CONFIG } from '../context/ConfigurationContext';
import { MockService } from '../services/mockDb';

export const Contact: React.FC = () => {
  const { settings } = useConfiguration();
  const contactConfig = settings.contactConfig || DEFAULT_CONTACT_CONFIG;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    inquiryType: 'General Support',
    orcid: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await MockService.submitContactInquiry(formData);
      setIsSubmitting(false);
      setSubmitted(true);
    } catch (err) {
      console.error('Contact submit error:', err);
      setIsSubmitting(false);
      setSubmitted(true);
    }
  };

  const offices = contactConfig.offices || DEFAULT_CONTACT_CONFIG.offices;

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Hero Section */}
      <section className="bg-brand-navy text-white py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">{contactConfig.title || 'Contact Us'}</h1>
            <p className="text-xl text-white/70 leading-relaxed">
              {contactConfig.subtitle}
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 -mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Contact Form */}
          <div className="lg:col-span-2 bg-white rounded-sm shadow-2xl border border-gray-100 overflow-hidden">
            <div className="p-8 md:p-12">
              {submitted ? (
                <div className="text-center py-20 animate-in fade-in zoom-in duration-500">
                  <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={40} />
                  </div>
                  <h2 className="text-2xl font-bold text-brand-navy mb-2">Message Received</h2>
                  <p className="text-brand-navy/60 max-w-sm mx-auto mb-8">
                    Thank you for reaching out. A member of our editorial support team will contact you within 24-48 business hours.
                  </p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="text-brand-action font-bold hover:underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-brand-navy/40 mb-2">Full Name</label>
                      <input 
                        required
                        type="text" 
                        value={formData.fullName}
                        onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-sm focus:bg-white focus:border-brand-action outline-none transition-all text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-brand-navy/40 mb-2">Email Address</label>
                      <input 
                        required
                        type="email" 
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="john@university.edu"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-sm focus:bg-white focus:border-brand-action outline-none transition-all text-sm"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-brand-navy/40 mb-2">Inquiry Type</label>
                      <select 
                        value={formData.inquiryType}
                        onChange={(e) => setFormData(prev => ({ ...prev, inquiryType: e.target.value }))}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-sm focus:bg-white focus:border-brand-action outline-none transition-all text-sm appearance-none"
                      >
                        <option>General Support</option>
                        <option>Manuscript Submission</option>
                        <option>Editorial Services</option>
                        <option>Librarian Resources</option>
                        <option>Technical Issue</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-brand-navy/40 mb-2">ORCID iD (Optional)</label>
                      <input 
                        type="text" 
                        value={formData.orcid}
                        onChange={(e) => setFormData(prev => ({ ...prev, orcid: e.target.value }))}
                        placeholder="0000-0000-0000-0000"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-sm focus:bg-white focus:border-brand-action outline-none transition-all text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-brand-navy/40 mb-2">Your Message</label>
                    <textarea 
                      required
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="How can we help you today?"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-sm focus:bg-white focus:border-brand-action outline-none transition-all text-sm resize-none"
                    ></textarea>
                  </div>

                  <button 
                    disabled={isSubmitting}
                    className="w-full bg-brand-navy text-white py-4 rounded-sm font-bold flex items-center justify-center gap-3 hover:bg-brand-action transition-all disabled:opacity-70 group"
                  >
                    {isSubmitting ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <>
                        <Send size={18} className="group-hover:translate-x-1 transition-transform" /> 
                        Send Inquiry
                      </>
                    )}
                  </button>
                  <p className="text-[10px] text-center text-brand-navy/30">
                    By submitting this form, you agree to our privacy policy and terms of service.
                  </p>
                </form>
              )}
            </div>
          </div>

          {/* Quick Support Sidebar */}
          <div className="space-y-6">
            <div className="bg-brand-navy p-8 rounded-sm text-white shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                <Sparkles size={64} />
              </div>
              <h3 className="text-lg font-bold mb-2 relative z-10">Representative</h3>
              <p className="text-xs text-white/60 mb-6 relative z-10 leading-relaxed">
                Connect with our AI-powered assistant for instant quotes and platform inquiries.
              </p>
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('openSalesChat'))}
                className="w-full py-3 bg-brand-action text-white text-[10px] font-black uppercase tracking-widest rounded flex items-center justify-center gap-2 hover:bg-white hover:text-brand-navy transition-all"
              >
                Chat with us <ArrowRight size={14} />
              </button>
            </div>

            <div className="bg-brand-light p-8 rounded-sm border border-brand-navy/5">
              <h3 className="text-lg font-bold text-brand-navy mb-6">Specialized Support</h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="bg-white p-2 rounded-sm text-brand-action h-fit shadow-sm">
                    <MessageSquare size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-brand-navy">Editorial Services</h4>
                    <p className="text-xs text-brand-navy/60 mt-1 mb-2">Need help with manuscript polishing?</p>
                    <Link to="/editing-services" className="text-xs font-bold text-brand-action hover:underline flex items-center gap-1">
                      Learn more <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="bg-white p-2 rounded-sm text-brand-action h-fit shadow-sm">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-brand-navy">Journal Permissions</h4>
                    <p className="text-xs text-brand-navy/60 mt-1 mb-2">Requesting rights to reuse content?</p>
                    <a href={`mailto:${contactConfig.permissionsEmail || 'permissions@academicpublishinggroup.org'}`} className="text-xs font-bold text-brand-action hover:underline break-all">
                      {contactConfig.permissionsEmail || 'permissions@academicpublishinggroup.org'}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-sm border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-brand-navy mb-4">Response Times</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-brand-navy/50">Email inquiries</span>
                  <span className="font-bold text-brand-navy">{contactConfig.responseTimes?.email || '24-48 Hours'}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-brand-navy/50">Editing quotes</span>
                  <span className="font-bold text-brand-navy">{contactConfig.responseTimes?.quotes || 'Within 12 Hours'}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-brand-navy/50">Tech support</span>
                  <span className="font-bold text-brand-navy">{contactConfig.responseTimes?.tech || 'Same Day'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Office Locations */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-6 mb-16">
            <h2 className="text-2xl font-serif font-bold text-brand-navy">Our Global Offices</h2>
            <div className="flex-grow h-[1px] bg-brand-navy/10"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {offices.map((office, i) => (
              <div key={office.id || i} className="group">
                <div className="text-brand-navy/20 font-serif italic text-4xl mb-4 group-hover:text-brand-action/20 transition-colors">
                  0{i + 1}
                </div>
                <h3 className="text-xl font-bold text-brand-navy mb-2">{office.city}</h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-brand-action mb-4">{office.type}</p>
                <div className="space-y-4 text-sm text-brand-navy/60 leading-relaxed">
                  <p className="flex gap-3">
                    <MapPin size={16} className="text-brand-navy/20 flex-shrink-0" />
                    {office.address}
                  </p>
                  <p className="flex gap-3">
                    <Phone size={16} className="text-brand-navy/20 flex-shrink-0" />
                    {office.phone}
                  </p>
                </div>
                <button className="mt-6 text-xs font-bold text-brand-navy group-hover:text-brand-action transition-colors flex items-center gap-1">
                  View on Map <ExternalLink size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Frequently Asked Section */}
      <section className="bg-gray-50 py-20 border-t border-gray-100">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-serif font-bold text-brand-navy mb-4">{contactConfig.faqSectionTitle || 'Looking for something else?'}</h2>
            <p className="text-brand-navy/60 mb-10">{contactConfig.faqSectionSubtitle || 'Check out our specialized resources or browse our help center.'}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/" className="px-8 py-3 bg-white border border-gray-200 rounded-sm text-sm font-bold hover:border-brand-action transition-all">Author Guidelines</Link>
              <Link to="/" className="px-8 py-3 bg-white border border-gray-200 rounded-sm text-sm font-bold hover:border-brand-action transition-all">Reviewer Hub</Link>
              <Link to="/" className="px-8 py-3 bg-white border border-gray-200 rounded-sm text-sm font-bold hover:border-brand-action transition-all">Institutional Sales</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
