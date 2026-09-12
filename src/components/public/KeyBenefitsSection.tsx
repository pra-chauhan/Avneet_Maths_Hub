import React from 'react';
import { Lightbulb, FileText, Users, CheckCircle, Compass, Target, BookMarked, Sparkles } from 'lucide-react';

export const KeyBenefitsSection: React.FC = () => {
  const benefits = [
    {
      id: 'benefit-1',
      title: 'Concept Clarity',
      icon: Lightbulb,
      badge: 'Deep Understanding',
      color: 'from-amber-500/10 to-amber-500/5 text-amber-700 border-amber-200',
      iconBg: 'bg-amber-100 text-amber-800',
      description:
        'Mathematics is not about memorizing formulae. Every theorem, algebraic derivation, and geometric axiom is explained from first principles with real-life connections.',
      bullets: [
        'Root-cause step-by-step derivations',
        'Why each formula works before practicing',
        'Elimination of math anxiety and fear',
      ],
    },
    {
      id: 'benefit-2',
      title: 'Regular Mock Tests',
      icon: Target,
      badge: 'Exam Readiness',
      color: 'from-blue-500/10 to-blue-500/5 text-blue-700 border-blue-200',
      iconBg: 'bg-blue-100 text-blue-800',
      description:
        'Rigorous periodic chapter tests, monthly assessments, and board-pattern mock examinations with detailed individual paper checking and personalized feedback.',
      bullets: [
        'Chapter-wise evaluation tests',
        'Full syllabus board-pattern simulations',
        'Detailed correction remarks on answer sheets',
      ],
    },
    {
      id: 'benefit-3',
      title: 'Small Batch Sizes',
      icon: Users,
      badge: 'Personal Attention',
      color: 'from-emerald-500/10 to-emerald-500/5 text-emerald-700 border-emerald-200',
      iconBg: 'bg-emerald-100 text-emerald-800',
      description:
        'We strictly cap classroom strength to 15-20 students per batch. Mr. Avneet Chauhan personally observes every student’s workbook and calculation steps in class.',
      bullets: [
        'Strict batch caps (15-20 students maximum)',
        'Immediate offline doubt resolution during lectures',
        'Individual attention to slower and faster learners',
      ],
    },
    {
      id: 'benefit-4',
      title: 'Study Material & DPPs',
      icon: FileText,
      badge: 'Daily Problem Practice',
      color: 'from-indigo-500/10 to-indigo-500/5 text-indigo-700 border-indigo-200',
      iconBg: 'bg-indigo-100 text-indigo-800',
      description:
        'Exclusively crafted Daily Practice Problems (DPPs), chapter summary notes, comprehensive formula cheat-sheets, and curated previous year questions.',
      bullets: [
        'Graded DPPs with difficulty progression',
        'Consolidated formula and theorem handbooks',
        'Structured offline homework check & tracking',
      ],
    },
  ];

  return (
    <section id="why-us" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-extrabold uppercase tracking-widest text-blue-700 bg-blue-100/70 border border-blue-200 px-3.5 py-1.5 rounded-full">
            THE AVNEET MATHS HUB ADVANTAGE
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-4 font-sans">
            Why Choose Avneet Maths Hub?
          </h2>
          <p className="text-slate-600 text-base sm:text-lg mt-3 leading-relaxed">
            Our proven four-pillar offline methodology ensures students not only score top marks in school and board exams, but genuinely love solving mathematics.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map(b => {
            const Icon = b.icon;
            return (
              <div
                key={b.id}
                id={`card-${b.id}`}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${b.iconBg}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">
                      {b.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-2 font-sans">
                    {b.title}
                  </h3>

                  <p className="text-slate-600 text-sm leading-relaxed mb-6">
                    {b.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-2">
                  {b.bullets.map((bullet, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Quote Footer Callout */}
        <div className="mt-12 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-900 text-emerald-400 flex items-center justify-center font-serif text-2xl font-bold shrink-0">
              ∑
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">
                “The only way to learn mathematics is to do mathematics.”
              </p>
              <p className="text-xs text-slate-500">
                Guiding every student at Rohalki Kishanpur, Bahadrabad through active whiteboard and notebook practice.
              </p>
            </div>
          </div>

          <div className="text-xs font-semibold px-4 py-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
            3-Day Free Trial Available
          </div>
        </div>
      </div>
    </section>
  );
};
