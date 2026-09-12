import React from 'react';
import { Award, BookOpen, CheckCircle, GraduationCap, MapPin, Phone, MessageSquare, ShieldCheck } from 'lucide-react';

interface TeacherSectionProps {
  onBookTrial: () => void;
}

export const TeacherSection: React.FC<TeacherSectionProps> = ({ onBookTrial }) => {
  return (
    <section id="teacher" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Teacher Image / Visual Frame */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md bg-gradient-to-br from-blue-900 to-slate-900 rounded-3xl p-8 text-white shadow-xl overflow-hidden">
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />
              
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-28 h-28 rounded-2xl bg-gradient-to-tr from-emerald-400 to-blue-500 flex items-center justify-center text-slate-950 font-black text-3xl shadow-lg mb-4">
                  AC
                </div>

                <h3 className="text-2xl font-black text-white tracking-tight font-sans">
                  Mr. Avneet Chauhan
                </h3>
                <p className="text-emerald-400 text-sm font-semibold mt-1">
                  Founder & Head Mathematics Faculty
                </p>

                {/* Exact Verified Qualifications */}
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  <span className="bg-white/10 text-white text-xs font-bold px-3 py-1 rounded-lg border border-white/20">
                    B.Ed
                  </span>
                  <span className="bg-white/10 text-white text-xs font-bold px-3 py-1 rounded-lg border border-white/20">
                    M.Sc (Mathematics)
                  </span>
                  <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-lg border border-emerald-500/30">
                    CTET
                  </span>
                </div>

                {/* Institute & Location */}
                <div className="mt-6 pt-6 border-t border-white/10 w-full text-xs text-slate-300 space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Rohalki Kishanpur, Bahadrabad (PIN: 249402)</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>+91 9528665136</span>
                  </div>
                </div>

                {/* Poster quote */}
                <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10 w-full text-xs text-slate-200 italic">
                  “The only way to learn mathematics is to do mathematics.”
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Teaching Philosophy & Profile */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-blue-700 bg-blue-100/70 border border-blue-200 px-3.5 py-1.5 rounded-full">
                FACULTY PROFILE
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-4 font-sans">
                Dedicated Mentorship by Mr. Avneet Chauhan
              </h2>
              <p className="text-slate-600 text-base sm:text-lg mt-3 leading-relaxed">
                Mathematics education at <strong className="text-slate-900">AVNEET MATHS HUB</strong> is built on rigor, concept clarity, and individualized offline mentoring. Mr. Avneet Chauhan personally conducts all lectures and doubt resolution sessions.
              </p>
            </div>

            {/* Teaching Pillars */}
            <div className="space-y-3.5">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <GraduationCap className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Academic Background & Credentials</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Holder of <strong>M.Sc in Mathematics</strong>, <strong>B.Ed</strong>, and <strong>CTET certified</strong>. Trained in pedagogical techniques that simplify complex abstract mathematical concepts into intuitive steps.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <BookOpen className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Pen-and-Paper Offline Practice</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Strict emphasis on writing down every step, drawing neat geometric figures, and adhering to board examination marking rubrics. No shortcuts or rote memorization.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Continuous Evaluation & Parent Communication</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Regular chapter tests, mock exams, and homework checking. Attendance and performance are systematically recorded and shared with parents.
                  </p>
                </div>
              </div>
            </div>

            {/* Direct Connect Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                id="teacher-book-trial-btn"
                onClick={onBookTrial}
                className="px-6 py-3 bg-slate-900 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-colors shadow-md"
              >
                Book 3-Day Free Trial
              </button>

              <a
                id="teacher-whatsapp-contact"
                href="https://wa.me/919528665136?text=Hello%20Avneet%20Sir,%20I%20want%20to%20know%20more%20about%20your%20Mathematics%20classes."
                target="_blank"
                rel="noreferrer"
                className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-sm flex items-center gap-2 transition-colors shadow-sm"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat with Avneet Sir (+91 9528665136)</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
