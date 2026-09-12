import React from 'react';
import { BookOpen, Check, ArrowRight, Layers, Award } from 'lucide-react';
import { ClassLevel } from '../../types';

interface ClassesSectionProps {
  onSelectClassForTrial: (classLevel: ClassLevel) => void;
}

export const ClassesSection: React.FC<ClassesSectionProps> = ({ onSelectClassForTrial }) => {
  const classesData = [
    {
      level: 7 as ClassLevel,
      title: 'Class 7th Mathematics',
      subtitle: 'Junior Foundation & Number Logic',
      focus: 'Integers, Fractions, Decimals, Simple Equations, Lines & Angles, Triangles, Perimeter & Area',
      highlights: ['Mental math drills', 'Strong arithmetic foundation', 'Visual geometry modeling'],
      batchTime: '03:30 PM - 04:30 PM',
      batchDays: 'Mon, Wed, Fri',
      badge: 'Foundation',
    },
    {
      level: 8 as ClassLevel,
      title: 'Class 8th Mathematics',
      subtitle: 'Algebraic Thinking & Pre-Board Prep',
      focus: 'Rational Numbers, Linear Equations, Quadrilaterals, Square & Cube Roots, Algebraic Identities, Mensuration',
      highlights: ['Word problems mastery', 'Algebraic factorisation drills', 'Graph plotting essentials'],
      batchTime: '03:30 PM - 04:30 PM',
      batchDays: 'Tue, Thu, Sat',
      badge: 'Concept Booster',
    },
    {
      level: 9 as ClassLevel,
      title: 'Class 9th Mathematics',
      subtitle: 'Secondary Core & Geometry Proofs',
      focus: 'Number Systems, Polynomials, Coordinate Geometry, Linear Equations in Two Variables, Euclid’s Geometry, Triangles, Circles, Surface Areas & Volumes',
      highlights: ['Step-by-step theorem proving', 'Factoring polynomial techniques', 'Comprehensive NCERT & exemplar solutions'],
      batchTime: '04:45 PM - 06:00 PM',
      batchDays: 'Mon, Wed, Fri',
      badge: 'Pre-Board Core',
    },
    {
      level: 10 as ClassLevel,
      title: 'Class 10th Board Mathematics',
      subtitle: 'CBSE / State Board 95%+ Target',
      focus: 'Real Numbers, Polynomials, Linear Equations, Quadratic Equations, Arithmetic Progressions, Triangles, Coordinate Geometry, Trigonometry & Applications, Circles, Statistics, Probability',
      highlights: ['Daily Practice Problems (DPP)', '10-year previous board question analysis', 'Timed answer-writing & presentation training'],
      batchTime: '05:00 PM - 06:15 PM & 06:30 PM',
      batchDays: 'Monday to Saturday',
      badge: 'Board Intensive',
    },
    {
      level: 11 as ClassLevel,
      title: 'Class 11th Mathematics',
      subtitle: 'Higher Secondary & Pre-Engineering Foundation',
      focus: 'Sets, Relations & Functions, Trigonometric Functions, Complex Numbers, Linear Inequalities, Permutations & Combinations, Binomial Theorem, Sequences & Series, Straight Lines, Conic Sections, Limits & Derivatives',
      highlights: ['Rigorous algebraic & calculus roots', 'Advanced problem solving techniques', 'Weekly diagnostic assessments'],
      batchTime: '06:30 PM - 08:00 PM',
      batchDays: 'Mon, Wed, Fri, Sat',
      badge: 'Senior Foundation',
    },
    {
      level: 12 as ClassLevel,
      title: 'Class 12th Board Mathematics',
      subtitle: 'Mastery in Calculus, Vectors & 3D Geometry',
      focus: 'Relations & Functions, Inverse Trigonometric Functions, Matrices & Determinants, Continuity & Differentiability, Application of Derivatives, Integrals, Differential Equations, Vector Algebra, Three-Dimensional Geometry, Linear Programming, Probability',
      highlights: ['Comprehensive integration problem banks', 'Step-marking strategy for board exams', 'Full syllabus mock tests with individualized reviews'],
      batchTime: '07:45 PM - 09:15 PM',
      batchDays: 'Monday to Saturday',
      badge: 'Board & Competitive',
    },
  ];

  return (
    <section id="classes" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-100/70 border border-emerald-200 px-3.5 py-1.5 rounded-full">
            OFFLINE CURRICULUM • CLASSES 7TH TO 12TH
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-4 font-sans">
            Specialized Mathematics Programs
          </h2>
          <p className="text-slate-600 text-base sm:text-lg mt-3 leading-relaxed">
            Every grade level has a custom curriculum crafted by Mr. Avneet Chauhan, focusing on concept clarity, regular practice, and step-by-step problem solving.
          </p>
        </div>

        {/* Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classesData.map(c => (
            <div
              key={c.level}
              id={`class-card-${c.level}`}
              className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 flex flex-col justify-between hover:border-blue-300 hover:bg-white hover:shadow-md transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-blue-100 text-blue-800 border border-blue-200">
                    {c.badge}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">{c.batchDays}</span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors font-sans">
                  {c.title}
                </h3>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">{c.subtitle}</p>

                <div className="mt-4 p-3 rounded-xl bg-white border border-slate-200/80">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Key Topics Covered:
                  </p>
                  <p className="text-xs text-slate-700 leading-relaxed line-clamp-3">
                    {c.focus}
                  </p>
                </div>

                <div className="mt-4 space-y-2">
                  {c.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-200 flex items-center justify-between">
                <div className="text-xs text-slate-500">
                  <span className="block font-medium">Batch Timing:</span>
                  <span className="text-slate-800 font-semibold">{c.batchTime}</span>
                </div>

                <button
                  id={`btn-trial-class-${c.level}`}
                  onClick={() => onSelectClassForTrial(c.level)}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <span>Book Trial</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
