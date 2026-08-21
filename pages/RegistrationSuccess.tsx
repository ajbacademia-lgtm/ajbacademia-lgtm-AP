import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, Mail, ArrowRight, Home, LayoutDashboard } from 'lucide-react';

export const RegistrationSuccess: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get('email') || 'your email';

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-20 px-6">
      <div className="max-w-2xl w-full">
        {/* Success Card */}
        <div className="bg-white rounded-sm shadow-2xl border border-slate-200 overflow-hidden">
          <div className="bg-brand-navy p-10 text-center relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-brand-action opacity-10 -translate-y-1/2 translate-x-1/2 rounded-full"></div>
             <div className="w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl relative z-10">
                <CheckCircle size={40} />
             </div>
             <h1 className="text-3xl font-serif font-black text-white relative z-10">Account Created!</h1>
             <p className="text-slate-300 mt-2 font-light relative z-10">Welcome to the Academic Publishing scientific community.</p>
          </div>

          <div className="p-10 space-y-10 text-left">
            {/* Simulation of a Sent Email */}
            <div className="bg-slate-50 border border-slate-100 rounded p-8 relative">
              <div className="absolute top-4 right-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <Mail size={12} /> Message Sent to {email}
              </div>
              
              <div className="space-y-6 text-brand-navy">
                <div className="pb-4 border-b border-slate-200">
                  <h3 className="text-xl font-bold">Welcome to Academic Publishing!</h3>
                </div>
                
                <div className="space-y-4 text-sm leading-relaxed text-slate-600">
                  <p>Thank you for registering with Academic Publishing. We are thrilled to have you join our community of authors and readers.</p>
                  
                  <p>Your account is now active, granting you full access to our digital resources and submission portals. Whether you are looking to embark on a new publishing journey or stay updated on the latest literary trends, we are committed to providing the support and platform you need to succeed.</p>

                  <div className="space-y-3 pt-4">
                    <h4 className="font-bold text-brand-navy uppercase tracking-widest text-xs">What’s Next?</h4>
                    <ul className="space-y-3">
                      <li className="flex gap-3">
                        <span className="w-1.5 h-1.5 bg-brand-action rounded-full mt-1.5 shrink-0"></span>
                        <span><strong>Complete Your Profile:</strong> Ensure your contact details and preferences are up to date to receive tailored updates.</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="w-1.5 h-1.5 bg-brand-action rounded-full mt-1.5 shrink-0"></span>
                        <span><strong>Explore Resources:</strong> Visit our Author Resource Center for guides on manuscript preparation and marketing.</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="w-1.5 h-1.5 bg-brand-action rounded-full mt-1.5 shrink-0"></span>
                        <span><strong>Stay Informed:</strong> Keep an eye on your inbox for our monthly newsletter featuring industry insights and upcoming events.</span>
                      </li>
                    </ul>
                  </div>

                  <p className="pt-6">If you have any questions about the registration process or our services, please feel free to reach out to our support team at <a href="mailto:info@academicpublishinggroup.org" className="text-brand-action font-bold hover:underline">info@academicpublishinggroup.org</a>.</p>
                  
                  <div className="pt-6 border-t border-slate-200">
                    <p className="font-bold">The Academic Publishing Team</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link to="/dashboard" className="flex items-center justify-center gap-3 px-8 py-4 bg-brand-navy text-white text-[10px] font-black uppercase tracking-widest hover:bg-brand-action transition-all">
                <LayoutDashboard size={16} /> Go to Dashboard
              </Link>
              <Link to="/" className="flex items-center justify-center gap-3 px-8 py-4 border-2 border-slate-200 text-brand-navy text-[10px] font-black uppercase tracking-widest hover:border-brand-navy transition-all">
                <Home size={16} /> Back Home
              </Link>
            </div>
          </div>
        </div>

        <p className="text-center mt-10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          Professional Scientific Communication <span className="mx-2">•</span> Integrated Node Network
        </p>
      </div>
    </div>
  );
};
