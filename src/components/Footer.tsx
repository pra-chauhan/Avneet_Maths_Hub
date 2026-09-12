import React from 'react';
import { MapPin, Phone, MessageSquare, Award, Clock, ArrowRight, ShieldCheck, Mail } from 'lucide-react';

interface FooterProps {
  onNavigateSection: (sectionId: string) => void;
  onOpenPortal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateSection, onOpenPortal }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Highlight Banner */}
        <div className="bg-gradient-to-r from-blue-900/80 via-indigo-900/80 to-slate-800 border border-blue-700/40 rounded-2xl p-8 mb-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full">
              OFFLINE ENROLLMENT OPEN
            </span>
            <h3 className="text-2xl font-bold text-white mt-2">
              Book Your 3-Day Free Trial Classes Today
            </h3>
            <p className="text-slate-300 text-sm mt-1 max-w-xl">
              Experience Mr. Avneet Chauhan’s concept-clarity teaching methodology before admission. For Classes 7th to 12th.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              id="footer-trial-cta-btn"
              onClick={() => onNavigateSection('free-trial')}
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-md flex items-center gap-2"
            >
              <span>Book 3-Day Free Trial</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              id="footer-whatsapp-cta-link"
              href="https://wa.me/919528665136?text=Hello%20Avneet%20Sir,%20I%20am%20interested%20in%20Mathematics%20coaching%20classes."
              target="_blank"
              rel="noreferrer"
              className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-sm border border-slate-700 flex items-center gap-2 transition-all"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp Inquiry</span>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1: Brand & Philosophy */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                AMH
              </div>
              <div>
                <h4 className="text-lg font-extrabold text-white tracking-tight">AVNEET MATHS HUB</h4>
                <p className="text-xs text-emerald-400 font-medium">Empowering Minds, Building Futures!</p>
              </div>
            </div>

            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              A premier offline mathematics coaching institute dedicated to deep concept clarity, personalized attention, and rigorous board exam mastery for Classes 7th through 12th.
            </p>

            <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-3 text-xs italic text-amber-300">
              “The only way to learn mathematics is to do mathematics.”
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h5 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Quick Navigation</h5>
            <ul className="space-y-2 text-sm">
              {[
                { id: 'home', label: 'Home Page' },
                { id: 'about', label: 'About Avneet Maths Hub' },
                { id: 'classes', label: 'Classes Offered (7th - 12th)' },
                { id: 'batches', label: 'Current Batch Timetable' },
                { id: 'why-us', label: 'Key Benefits & Methodology' },
                { id: 'teacher', label: 'Teacher Profile' },
                { id: 'free-trial', label: '3-Day Free Trial Registration' },
                { id: 'notices', label: 'Notice & Announcements Board' },
              ].map(item => (
                <li key={item.id}>
                  <button
                    id={`footer-link-${item.id}`}
                    onClick={() => onNavigateSection(item.id)}
                    className="hover:text-emerald-400 text-slate-400 transition-colors flex items-center gap-1.5"
                  >
                    <ArrowRight className="w-3 h-3 text-slate-600" />
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
              <li>
                <button
                  id="footer-open-portal-btn"
                  onClick={onOpenPortal}
                  className="hover:text-blue-400 text-blue-400 font-semibold transition-colors flex items-center gap-1.5 pt-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Student & Teacher Portal</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Classes & Teacher */}
          <div>
            <h5 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Faculty & Classes</h5>
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 mb-4">
              <p className="text-white font-bold text-sm">Mr. Avneet Chauhan</p>
              <p className="text-xs text-slate-400 mt-0.5">Head Mathematics Faculty</p>
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                <span className="bg-blue-950 text-blue-300 text-[11px] font-semibold px-2 py-0.5 rounded border border-blue-800">
                  B.Ed
                </span>
                <span className="bg-blue-950 text-blue-300 text-[11px] font-semibold px-2 py-0.5 rounded border border-blue-800">
                  M.Sc (Mathematics)
                </span>
                <span className="bg-emerald-950 text-emerald-300 text-[11px] font-semibold px-2 py-0.5 rounded border border-emerald-800">
                  CTET
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 mb-2 font-medium">Classes Conducted:</p>
            <div className="grid grid-cols-2 gap-1.5 text-xs text-slate-300">
              <span className="bg-slate-800 px-2 py-1 rounded">Class 7th Maths</span>
              <span className="bg-slate-800 px-2 py-1 rounded">Class 8th Maths</span>
              <span className="bg-slate-800 px-2 py-1 rounded">Class 9th Maths</span>
              <span className="bg-slate-800 px-2 py-1 rounded">Class 10th Board</span>
              <span className="bg-slate-800 px-2 py-1 rounded">Class 11th Core</span>
              <span className="bg-slate-800 px-2 py-1 rounded">Class 12th Board</span>
            </div>
          </div>

          {/* Col 4: Location & Contact */}
          <div>
            <h5 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Coaching Centre Address</h5>
            <ul className="space-y-3.5 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-slate-300">
                  Rohalki Kishanpur, Bahadrabad<br />
                  PIN: 249402, Haridwar, Uttarakhand
                </span>
              </li>

              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-emerald-400 shrink-0" />
                <a
                  id="footer-call-link"
                  href="tel:+919528665136"
                  className="hover:text-emerald-400 text-slate-300 font-semibold"
                >
                  +91 9528665136
                </a>
              </li>

              <li className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-emerald-400 shrink-0" />
                <a
                  id="footer-whatsapp-link"
                  href="https://wa.me/919528665136"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-emerald-400 text-slate-300"
                >
                  WhatsApp: +91 9528665136
                </a>
              </li>

              <li className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-slate-400 shrink-0" />
                <span className="text-slate-400 text-xs">
                  Monday - Saturday: 03:00 PM - 09:30 PM<br />
                  Sunday: Mock Tests & Doubt Clearing
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} AVNEET MATHS HUB. All Rights Reserved. Offline Mathematics Coaching Centre.</p>
          <p className="flex items-center gap-2">
            <span>Teacher: Mr. Avneet Chauhan</span>
            <span>•</span>
            <span>Rohalki Kishanpur, Bahadrabad</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
