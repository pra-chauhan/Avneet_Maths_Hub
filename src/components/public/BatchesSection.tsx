import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Clock, MapPin, User, Users, Calendar, ArrowRight, ShieldCheck } from 'lucide-react';
import { ClassLevel } from '../../types';

interface BatchesSectionProps {
  onSelectBatchForTrial: (classLevel: ClassLevel, batchName: string) => void;
}

export const BatchesSection: React.FC<BatchesSectionProps> = ({ onSelectBatchForTrial }) => {
  const { batches } = useData();
  const [selectedClassFilter, setSelectedClassFilter] = useState<number | 'all'>('all');

  const filteredBatches = batches.filter(b => {
    if (selectedClassFilter === 'all') return true;
    return b.classLevel === selectedClassFilter;
  });

  return (
    <section id="batches" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-700 bg-indigo-100/70 border border-indigo-200 px-3.5 py-1.5 rounded-full">
              LIVE SCHEDULE • SMALL BATCHES
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-4 font-sans">
              Current Batches & Timings
            </h2>
            <p className="text-slate-600 text-base mt-2 max-w-2xl">
              Small batch sizes ensure personalized step-by-step checking. View active batches at our Bahadrabad offline center.
            </p>
          </div>

          {/* Class Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs">
            <button
              id="filter-batch-all"
              onClick={() => setSelectedClassFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedClassFilter === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              All Classes
            </button>
            {[7, 8, 9, 10, 11, 12].map(lvl => (
              <button
                key={lvl}
                id={`filter-batch-class-${lvl}`}
                onClick={() => setSelectedClassFilter(lvl)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedClassFilter === lvl
                    ? 'bg-blue-700 text-white'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Class {lvl}th
              </button>
            ))}
          </div>
        </div>

        {/* Batches Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBatches.map(b => {
            const seatsLeft = b.capacity - b.enrolledCount;
            const isAlmostFull = seatsLeft <= 5;

            return (
              <div
                key={b.id}
                id={`batch-card-${b.id}`}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-slate-900 text-white">
                      Class {b.classLevel}th
                    </span>

                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                        seatsLeft <= 3
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : isAlmostFull
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}
                    >
                      {seatsLeft > 0 ? `${seatsLeft} Seats Available` : 'Batch Full (Waitlist)'}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 font-sans">{b.name}</h3>

                  <div className="mt-4 space-y-2.5 text-xs text-slate-600">
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50">
                      <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                      <span className="font-semibold text-slate-800">{b.timeSlot}</span>
                    </div>

                    <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50">
                      <Calendar className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span>{b.scheduleDays.join(', ')}</span>
                    </div>

                    <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50">
                      <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{b.room}</span>
                    </div>

                    <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50">
                      <User className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Faculty: <strong>{b.teacher}</strong></span>
                    </div>
                  </div>

                  {/* Seat capacity bar */}
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <div className="flex justify-between text-[11px] text-slate-500 font-medium mb-1">
                      <span>Batch Capacity</span>
                      <span>{b.enrolledCount} / {b.capacity} Enrolled</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          seatsLeft <= 3 ? 'bg-red-500' : isAlmostFull ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(100, (b.enrolledCount / b.capacity) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <button
                    id={`batch-select-btn-${b.id}`}
                    onClick={() => onSelectBatchForTrial(b.classLevel, b.name)}
                    className="w-full py-2.5 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Request Trial in this Batch</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
