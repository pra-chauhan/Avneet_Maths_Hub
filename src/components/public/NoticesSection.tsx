import React from 'react';
import { useData } from '../../context/DataContext';
import { Bell, AlertCircle, Calendar, Tag, ArrowRight } from 'lucide-react';

export const NoticesSection: React.FC = () => {
  const { announcements } = useData();

  return (
    <section id="notices" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-extrabold uppercase tracking-widest text-amber-700 bg-amber-100/70 border border-amber-200 px-3.5 py-1.5 rounded-full">
            INSTITUTE NOTICE BOARD
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-4 font-sans">
            Important Notices & Announcements
          </h2>
          <p className="text-slate-600 text-base sm:text-lg mt-3 leading-relaxed">
            Stay updated with real-time class timings, test dates, holiday circulars, and offline coaching circulars.
          </p>
        </div>

        {/* Notices Cards */}
        <div className="space-y-4 max-w-4xl mx-auto">
          {announcements.map(ann => {
            const isUrgent = ann.priority === 'Urgent';
            const isImportant = ann.priority === 'Important';

            return (
              <div
                key={ann.id}
                id={`public-notice-${ann.id}`}
                className={`rounded-2xl p-6 border transition-all ${
                  isUrgent
                    ? 'bg-red-50/70 border-red-200 shadow-sm'
                    : isImportant
                    ? 'bg-amber-50/70 border-amber-200 shadow-sm'
                    : 'bg-white border-slate-200 shadow-xs'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${
                        isUrgent
                          ? 'bg-red-600 text-white'
                          : isImportant
                          ? 'bg-amber-600 text-white'
                          : 'bg-slate-800 text-white'
                      }`}
                    >
                      {ann.priority} Notice
                    </span>

                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white text-slate-700 border border-slate-200">
                      {ann.category}
                    </span>

                    {ann.targetClass && (
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                        Class {ann.targetClass}th
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Posted on {new Date(ann.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 font-sans mb-2">
                  {ann.title}
                </h3>

                <p className="text-sm text-slate-700 leading-relaxed">
                  {ann.message}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
                  <span>Authorized by: Mr. Avneet Chauhan (Head Faculty)</span>
                  <span>Offline Notice ID: {ann.id.toUpperCase()}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
