import React from 'react';
import { Phone, MessageSquare, ArrowRight, CheckCircle2, MapPin, Calendar, Award, Shield, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  onBookTrial: () => void;
  onOpenPortal: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onBookTrial, onOpenPortal }) => {
  return (
    <section id="home" className="relative bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 text-white overflow-hidden py-16 sm:py-24">
      {/* Background Math Geometry pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none select-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="math-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#60a5fa" strokeWidth="0.8" />
              <circle cx="30" cy="30" r="1.5" fill="#38bdf8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#math-grid)" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Heading & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-semibold backdrop-blur-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>OFFLINE MATHEMATICS COACHING • ADMISSIONS OPEN</span>
            </div>

            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white font-sans">
                AVNEET MATHS HUB
              </h1>
              <p className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 bg-clip-text text-transparent mt-2">
                “Empowering Minds, Building Futures!”
              </p>
            </div>

            <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed">
              Excellence in Offline Mathematics Education for <strong className="text-white font-bold">Classes 7th to 12th</strong>. 
              Personalized mentor guidance by <strong className="text-white">Mr. Avneet Chauhan</strong> (B.Ed, M.Sc Mathematics, CTET) at our dedicated center in Bahadrabad.
            </p>

            {/* Poster Statement Pill */}
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 backdrop-blur-xs max-w-xl shadow-inner text-left">
              <p className="text-xs uppercase tracking-widest text-amber-400 font-bold mb-1">
                Core Teaching Philosophy
              </p>
              <blockquote className="text-sm sm:text-base font-semibold text-white italic">
                “The only way to learn mathematics is to do mathematics.”
              </blockquote>
            </div>

            {/* Call to Actions */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                id="hero-book-trial-btn"
                onClick={onBookTrial}
                className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded-xl text-base transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 transform active:scale-95"
              >
                <span>Book 3-Day Free Trial</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <a
                id="hero-whatsapp-btn"
                href="https://wa.me/919528665136?text=Hello%20Avneet%20Sir,%20I%20would%20like%20to%20inquire%20about%20Mathematics%20classes%20at%20Avneet%20Maths%20Hub."
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3.5 bg-slate-800/90 hover:bg-slate-700 text-white font-bold rounded-xl text-base border border-slate-600 flex items-center gap-2 transition-all"
              >
                <MessageSquare className="w-5 h-5 text-emerald-400" />
                <span>Call / WhatsApp</span>
              </a>

              <button
                id="hero-coaching-portal-btn"
                onClick={onOpenPortal}
                className="px-5 py-3.5 bg-blue-600/30 hover:bg-blue-600/50 text-blue-200 hover:text-white font-semibold rounded-xl text-sm border border-blue-500/30 flex items-center gap-2 transition-all"
              >
                <Shield className="w-4 h-4 text-blue-400" />
                <span>Coaching Portal Login</span>
              </button>
            </div>

            {/* Micro Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800/80">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Concept Clarity</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Regular Mock Tests</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Small Batch Sizes</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Study Material & DPPs</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Info Card with Authentic Details */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md bg-gradient-to-b from-slate-800/90 to-slate-900/95 border border-slate-700/80 rounded-2xl p-6 shadow-2xl backdrop-blur-md">
              <div className="flex items-center justify-between pb-4 border-b border-slate-700/70">
                <div>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-400">
                    ADMISSIONS OPEN • 2026-27
                  </span>
                  <h3 className="text-lg font-bold text-white">Avneet Maths Hub Centre</h3>
                </div>
                <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-300 text-xs font-bold">
                  Classes 7th - 12th
                </div>
              </div>

              {/* Faculty Highlight */}
              <div className="mt-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md shrink-0">
                    AC
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-base">Mr. Avneet Chauhan</h4>
                    <p className="text-xs text-slate-400">Head Mathematics Teacher</p>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      <span className="bg-blue-900/60 text-blue-300 text-[10px] font-semibold px-2 py-0.5 rounded border border-blue-700">
                        B.Ed
                      </span>
                      <span className="bg-blue-900/60 text-blue-300 text-[10px] font-semibold px-2 py-0.5 rounded border border-blue-700">
                        M.Sc (Mathematics)
                      </span>
                      <span className="bg-emerald-900/60 text-emerald-300 text-[10px] font-semibold px-2 py-0.5 rounded border border-emerald-700">
                        CTET
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Offline Location & Contact Details */}
              <div className="mt-4 space-y-2.5 text-xs text-slate-300">
                <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-800/40">
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white block">Offline Coaching Location:</span>
                    <span>Rohalki Kishanpur, Bahadrabad (PIN: 249402)</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-slate-800/40">
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-semibold text-white block">Direct Phone / WhatsApp:</span>
                    <a href="tel:+919528665136" className="text-emerald-400 font-bold hover:underline">
                      +91 9528665136
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-amber-950/30 border border-amber-500/20">
                  <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                  <div className="text-amber-200">
                    <span className="font-bold block">3-Day Free Trial Available</span>
                    <span className="text-[11px]">Experience teaching before final enrollment</span>
                  </div>
                </div>
              </div>

              {/* Quick Booking trigger */}
              <div className="mt-5">
                <button
                  id="hero-card-trial-btn"
                  onClick={onBookTrial}
                  className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold rounded-xl text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <span>Claim Your 3-Day Free Trial</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
