import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { FreeTrialRequest, TrialStatus } from '../../types';
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Phone,
  MessageSquare,
  Sparkles,
  UserCheck,
  Clock,
  Check,
  UserPlus,
  Filter,
} from 'lucide-react';

export const FreeTrialManager: React.FC = () => {
  const {
    freeTrials,
    updateFreeTrialStatus,
    updateTrialAttendance,
    convertTrialToStudent,
    batches,
  } = useData();

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedTrialForConversion, setSelectedTrialForConversion] = useState<FreeTrialRequest | null>(null);
  const [targetBatchId, setTargetBatchId] = useState(batches[0]?.id || '');

  const filteredTrials = freeTrials.filter(t => {
    if (filterStatus === 'all') return true;
    return t.status === filterStatus;
  });

  const handleConvert = (trial: FreeTrialRequest) => {
    const matchingBatch = batches.find(b => b.classLevel === trial.classLevel) || batches[0];
    setTargetBatchId(matchingBatch ? matchingBatch.id : '');
    setSelectedTrialForConversion(trial);
  };

  const confirmConversion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTrialForConversion) return;
    convertTrialToStudent(selectedTrialForConversion.id, targetBatchId);
    setSelectedTrialForConversion(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <Sparkles className="w-5 h-5" />
            </span>
            <h2 className="text-2xl font-black text-slate-900 font-sans">
              3-Day Free Trial Management
            </h2>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Track student trial attendance, evaluate fit, and convert trial students into active admissions.
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <select
            id="filter-trial-status"
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold bg-white"
          >
            <option value="all">All Trial Requests ({freeTrials.length})</option>
            <option value="Trial Scheduled">Trial Scheduled</option>
            <option value="Attending">Attending Now</option>
            <option value="Completed">3 Days Completed</option>
            <option value="Converted">Converted to Admission</option>
            <option value="Requested">Pending Request</option>
          </select>
        </div>
      </div>

      {/* Trial Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTrials.map(trial => {
          const attendance = trial.attendanceDays || { day1: false, day2: false, day3: false };
          const attendedCount = [attendance.day1, attendance.day2, attendance.day3].filter(Boolean).length;

          return (
            <div
              key={trial.id}
              id={`trial-card-${trial.id}`}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-blue-700 text-white">
                    Class {trial.classLevel}th
                  </span>

                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                      trial.status === 'Converted'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : trial.status === 'Attending'
                        ? 'bg-blue-100 text-blue-800 border-blue-300'
                        : trial.status === 'Completed'
                        ? 'bg-purple-100 text-purple-800 border-purple-300'
                        : 'bg-amber-100 text-amber-800 border-amber-300'
                    }`}
                  >
                    {trial.status}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 font-sans">{trial.studentName}</h3>
                <p className="text-xs text-slate-500">Parent: {trial.parentName}</p>

                <div className="mt-4 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                    <span className="text-slate-500">Preferred Date:</span>
                    <strong className="text-slate-800">{trial.preferredDate}</strong>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                    <span className="text-slate-500">Batch Timing:</span>
                    <strong className="text-slate-800">{trial.preferredBatch}</strong>
                  </div>

                  {trial.message && (
                    <div className="p-2 rounded-lg bg-slate-50 text-[11px] italic text-slate-600">
                      "{trial.message}"
                    </div>
                  )}
                </div>

                {/* 3-Day Attendance Tracker Checkboxes */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-700">3-Day Trial Attendance:</span>
                    <span className="text-xs font-bold text-emerald-600">
                      {attendedCount} of 3 Days
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {(['day1', 'day2', 'day3'] as const).map((dayKey, idx) => {
                      const isChecked = !!attendance[dayKey];
                      return (
                        <button
                          key={dayKey}
                          type="button"
                          id={`trial-${trial.id}-${dayKey}-btn`}
                          onClick={() => updateTrialAttendance(trial.id, dayKey, !isChecked)}
                          className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                            isChecked
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold'
                              : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                          }`}
                        >
                          <span className="text-[10px] uppercase">Day {idx + 1}</span>
                          <div
                            className={`w-4 h-4 rounded flex items-center justify-center ${
                              isChecked ? 'bg-emerald-600 text-white' : 'border border-slate-300'
                            }`}
                          >
                            {isChecked && <Check className="w-3 h-3" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-slate-100 space-y-2">
                {trial.status !== 'Converted' && (
                  <button
                    id={`btn-convert-trial-${trial.id}`}
                    onClick={() => handleConvert(trial)}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-xs"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Convert to Enrolled Student</span>
                  </button>
                )}

                <div className="flex items-center gap-2">
                  <a
                    href={`https://wa.me/${trial.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(trial.parentName)},%20this%20is%20Mr.%20Avneet%20Chauhan%20from%20Avneet%20Maths%20Hub%20regarding%20${encodeURIComponent(trial.studentName)}'s%203-day%20free%20trial%20class.`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                    <span>WhatsApp</span>
                  </a>

                  <a
                    href={`tel:${trial.phone}`}
                    className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                    title="Call Parent"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>

                  {trial.status !== 'Converted' && trial.status !== 'Completed' && (
                    <button
                      onClick={() => updateFreeTrialStatus(trial.id, 'Completed')}
                      className="px-2.5 py-1.5 text-[11px] font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200"
                    >
                      Mark Done
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL: CONVERT TRIAL TO ACTIVE STUDENT */}
      {selectedTrialForConversion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 bg-emerald-700 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">Convert to Full Admission</h3>
                <p className="text-xs text-emerald-100">
                  {selectedTrialForConversion.studentName} (Class {selectedTrialForConversion.classLevel}th)
                </p>
              </div>
              <button
                onClick={() => setSelectedTrialForConversion(null)}
                className="p-1 rounded-lg hover:bg-white/10"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={confirmConversion} className="p-6 space-y-4">
              <p className="text-xs text-slate-600">
                Assign a permanent batch for <strong>{selectedTrialForConversion.studentName}</strong>. A student ID and profile will be created automatically in the management roster.
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Select Batch *</label>
                <select
                  id="convert-target-batch"
                  value={targetBatchId}
                  onChange={e => setTargetBatchId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm bg-white"
                >
                  {batches
                    .filter(b => b.classLevel === selectedTrialForConversion.classLevel)
                    .map(b => (
                      <option key={b.id} value={b.id}>
                        {b.name} ({b.timeSlot}) - Room {b.room}
                      </option>
                    ))}
                </select>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
                <p><strong>Parent:</strong> {selectedTrialForConversion.parentName}</p>
                <p><strong>Phone:</strong> {selectedTrialForConversion.phone}</p>
                <p><strong>Status:</strong> Active Admission</p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedTrialForConversion(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="confirm-convert-btn"
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
                >
                  Confirm Admission
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
