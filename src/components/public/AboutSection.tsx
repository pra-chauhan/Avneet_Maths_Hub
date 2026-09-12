import React from 'react';
import { Target, CheckCircle, ShieldCheck, HeartHandshake, MapPin, Award } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-extrabold uppercase tracking-widest text-blue-700 bg-blue-100/70 border border-blue-200 px-3.5 py-1.5 rounded-full">
              ABOUT AVNEET MATHS HUB
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-sans">
              Pure Offline Mathematics Excellence
            </h2>
            <p className="text-slate-700 text-base leading-relaxed">
              <strong>AVNEET MATHS HUB</strong> is an offline mathematics coaching center located at <strong>Rohalki Kishanpur, Bahadrabad (PIN: 249402)</strong>. Founded by <strong>Mr. Avneet Chauhan</strong> (B.Ed, M.Sc Mathematics, CTET), our institute specializes exclusively in mathematics for students from <strong>Class 7th to Class 12th</strong>.
            </p>
            <p className="text-slate-600 text-sm leading-relaxed">
              We firmly believe that learning mathematics requires real pencil-and-paper problem solving, interactive whiteboard dialogue, and disciplined step-by-step checking. That is why we are strictly an offline coaching center where the teacher knows each student personally, understands their individual weak points, and guides them towards scoring 95%+ in their board exams.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
                <Target className="w-6 h-6 text-blue-600 mb-2" />
                <h4 className="font-bold text-sm text-slate-900">Our Mission</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  To eliminate the fear of mathematics by building unshakable conceptual clarity and analytical confidence.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
                <ShieldCheck className="w-6 h-6 text-emerald-600 mb-2" />
                <h4 className="font-bold text-sm text-slate-900">Our Commitment</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Small batch sizes (15-20 students), disciplined attendance tracking, regular mock tests, and transparent parent updates.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-4">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
              <h3 className="font-bold text-slate-900 text-base mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-600" />
                <span>Offline Campus & Infrastructure</span>
              </h3>
              <ul className="space-y-3 text-xs text-slate-700">
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Dedicated Math Lecture Rooms:</strong> Quiet, well-lit classrooms with wide whiteboards for step-by-step mathematical proofs.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Comfortable Seating & Capped Strength:</strong> No overcrowded benches; every student gets ample desk space to work out derivations and DPPs.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Offline Test Environment:</strong> Structured exam hall setup for simulating actual board exam conditions during monthly mock tests.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Study Material Desk:</strong> Printed DPP handouts, formula sheets, and chapter worksheets readily distributed before every lecture.</span>
                </li>
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-950 text-white shadow-md">
              <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                Institute Motto
              </p>
              <p className="text-lg font-bold text-white mt-1 italic font-serif">
                “Empowering Minds, Building Futures!”
              </p>
              <p className="text-xs text-slate-300 mt-2">
                “The only way to learn mathematics is to do mathematics.” — Paul Halmos
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
