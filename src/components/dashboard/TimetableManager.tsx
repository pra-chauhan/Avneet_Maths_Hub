import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import {
  Clock,
  Calendar,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Edit3,
  Plus,
  RefreshCw,
  MapPin,
  User,
  Search,
  Filter,
} from 'lucide-react';
import { DailyClassSchedule, ClassLevel, ClassScheduleStatus } from '../../types';

export const TimetableManager: React.FC = () => {
  const { schedules, batches, rescheduleClass, addSchedule, updateSchedule, deleteSchedule, currentUser } = useData();

  const [filterClass, setFilterClass] = useState<number | 'all'>('all');
  const [selectedScheduleForReschedule, setSelectedScheduleForReschedule] = useState<DailyClassSchedule | null>(null);
  const [newStartTime, setNewStartTime] = useState('06:00 PM');
  const [newEndTime, setNewEndTime] = useState('07:15 PM');
  const [rescheduleReason, setRescheduleReason] = useState('Extra revision & concept doubt-clearing session');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newBatchId, setNewBatchId] = useState(batches[0]?.id || '');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newSubject, setNewSubject] = useState('Mathematics');
  const [newTopic, setNewTopic] = useState('');
  const [newStartTimeInput, setNewStartTimeInput] = useState('05:00 PM');
  const [newEndTimeInput, setNewEndTimeInput] = useState('06:15 PM');
  const [newRoom, setNewRoom] = useState('Main Hall');

  const todayStr = new Date().toISOString().split('T')[0];

  // Group schedules
  const todaysClasses = schedules.filter(s => s.date === todayStr);
  const upcomingClasses = schedules.filter(s => s.date > todayStr);
  const recentlyChangedClasses = schedules.filter(s => s.status === 'Rescheduled' || s.status === 'Cancelled');

  const handleOpenRescheduleModal = (schedule: DailyClassSchedule) => {
    setSelectedScheduleForReschedule(schedule);
    setNewStartTime(schedule.startTime);
    setNewEndTime(schedule.endTime);
    setRescheduleReason(schedule.rescheduleReason || 'Timing updated for offline lecture session');
  };

  const handleSaveReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedScheduleForReschedule) return;
    rescheduleClass(selectedScheduleForReschedule.id, newStartTime, newEndTime, rescheduleReason);
    setSelectedScheduleForReschedule(null);
  };

  const handleCreateSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    const batch = batches.find(b => b.id === newBatchId);
    if (!batch) return;

    addSchedule({
      date: newDate,
      day: new Date(newDate).toLocaleDateString('en-US', { weekday: 'long' }),
      batchId: batch.id,
      batchName: batch.name,
      classLevel: batch.classLevel,
      subject: newSubject,
      teacher: batch.teacher || 'Mr. Avneet Chauhan',
      startTime: newStartTimeInput,
      endTime: newEndTimeInput,
      room: newRoom,
      topic: newTopic || 'Offline Problem Solving & DPP Practice',
      status: 'Scheduled',
    });

    setIsAddModalOpen(false);
    setNewTopic('');
  };

  const renderScheduleCard = (item: DailyClassSchedule, highlightToday = false) => {
    const isRescheduled = item.status === 'Rescheduled';
    const isCancelled = item.status === 'Cancelled';
    const isCompleted = item.status === 'Completed';

    return (
      <div
        key={item.id}
        id={`schedule-item-${item.id}`}
        className={`rounded-2xl border p-5 transition-all ${
          isRescheduled
            ? 'bg-amber-50/80 border-amber-300 shadow-sm ring-1 ring-amber-300'
            : isCancelled
            ? 'bg-red-50/80 border-red-200 opacity-80'
            : isCompleted
            ? 'bg-slate-50 border-slate-200'
            : 'bg-white border-slate-200 shadow-xs hover:shadow-md'
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-slate-900 text-white">
              Class {item.classLevel}th
            </span>
            <span className="text-xs font-semibold text-slate-700">{item.batchName}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span
              className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                isRescheduled
                  ? 'bg-amber-100 text-amber-900 border-amber-300 animate-pulse'
                  : isCancelled
                  ? 'bg-red-100 text-red-900 border-red-300'
                  : isCompleted
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : 'bg-blue-100 text-blue-800 border-blue-200'
              }`}
            >
              {isRescheduled ? '⚡ Today Rescheduled' : item.status}
            </span>
          </div>
        </div>

        {/* Timings & Notice */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <Clock className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              {item.startTime} – {item.endTime}
            </span>
            {item.originalTime && (
              <span className="text-xs font-normal text-slate-400 line-through">
                (Old: {item.originalTime})
              </span>
            )}
          </div>

          {isRescheduled && item.rescheduleReason && (
            <div className="p-2.5 rounded-xl bg-amber-100/90 border border-amber-200 text-xs text-amber-900 flex items-start gap-2 font-medium">
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-amber-950 font-bold">Timing Notice to Students:</strong>
                <span>{item.rescheduleReason}</span>
              </div>
            </div>
          )}

          <div className="text-xs text-slate-700">
            <strong className="text-slate-900">Topic / Chapter:</strong> {item.topic}
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {item.room}
            </span>
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-slate-400" />
              {item.teacher}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {item.date} ({item.day})
            </span>
          </div>
        </div>

        {/* Action Controls for Admin / Teacher */}
        {(currentUser.role === 'admin' || currentUser.role === 'teacher') && (
          <div className="pt-3 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2">
            <button
              id={`btn-reschedule-${item.id}`}
              onClick={() => handleOpenRescheduleModal(item)}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reschedule Class</span>
            </button>

            <div className="flex items-center gap-1.5">
              {item.status !== 'Completed' && (
                <button
                  id={`btn-complete-${item.id}`}
                  onClick={() => updateSchedule(item.id, { status: 'Completed' })}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                >
                  Mark Done
                </button>
              )}

              {item.status !== 'Cancelled' && (
                <button
                  id={`btn-cancel-${item.id}`}
                  onClick={() => updateSchedule(item.id, { status: 'Cancelled', rescheduleReason: 'Class cancelled due to institute holiday or schedule readjustment' })}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
                >
                  Cancel
                </button>
              )}

              <button
                id={`btn-del-sch-${item.id}`}
                onClick={() => deleteSchedule(item.id)}
                className="p-1.5 text-xs text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100"
                title="Delete Schedule"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-100 text-blue-800">
              <Clock className="w-5 h-5" />
            </span>
            <h2 className="text-2xl font-black text-slate-900 font-sans">
              Daily Class Timetable & Schedule
            </h2>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Update classroom timings, reschedule today’s batches, and notify students instantly.
          </p>
        </div>

        {(currentUser.role === 'admin' || currentUser.role === 'teacher') && (
          <button
            id="open-add-schedule-modal"
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule New Class</span>
          </button>
        )}
      </div>

      {/* SECTION 1: TODAY'S CLASSES */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wider font-sans">
              Today's Classes ({todaysClasses.length})
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">Date: {todayStr}</span>
        </div>

        {todaysClasses.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-400">
            No classes scheduled for today.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {todaysClasses.map(s => renderScheduleCard(s, true))}
          </div>
        )}
      </div>

      {/* SECTION 2: RECENTLY CHANGED / RESCHEDULED CLASSES */}
      {recentlyChangedClasses.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-amber-100 text-amber-800">
              <AlertTriangle className="w-4 h-4" />
            </span>
            <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wider font-sans">
              Recently Changed Classes ({recentlyChangedClasses.length})
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {recentlyChangedClasses.map(s => renderScheduleCard(s))}
          </div>
        </div>
      )}

      {/* SECTION 3: UPCOMING CLASSES */}
      <div className="space-y-4 pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wider font-sans">
            Upcoming Classes ({upcomingClasses.length})
          </h3>
        </div>

        {upcomingClasses.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-400">
            No upcoming sessions scheduled.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {upcomingClasses.map(s => renderScheduleCard(s))}
          </div>
        )}
      </div>

      {/* MODAL: RESCHEDULE TODAY'S CLASS */}
      {selectedScheduleForReschedule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 bg-amber-500 text-slate-950 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">Reschedule Today's Class</h3>
                <p className="text-xs font-semibold text-amber-950">
                  {selectedScheduleForReschedule.batchName} (Class {selectedScheduleForReschedule.classLevel}th)
                </p>
              </div>
              <button
                onClick={() => setSelectedScheduleForReschedule(null)}
                className="p-1 rounded-lg hover:bg-black/10"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveReschedule} className="p-6 space-y-4">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                <span>Current Timing: </span>
                <strong className="text-slate-900">
                  {selectedScheduleForReschedule.startTime} – {selectedScheduleForReschedule.endTime}
                </strong>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">New Start Time *</label>
                  <input
                    id="reschedule-start-time"
                    type="text"
                    required
                    value={newStartTime}
                    onChange={e => setNewStartTime(e.target.value)}
                    placeholder="e.g. 06:00 PM"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">New End Time *</label>
                  <input
                    id="reschedule-end-time"
                    type="text"
                    required
                    value={newEndTime}
                    onChange={e => setNewEndTime(e.target.value)}
                    placeholder="e.g. 07:15 PM"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Reason for Timing Shift (Visible to Students & Parents) *
                </label>
                <textarea
                  id="reschedule-reason"
                  rows={3}
                  required
                  value={rescheduleReason}
                  onChange={e => setRescheduleReason(e.target.value)}
                  placeholder="e.g. Moved 1 hour later for comprehensive doubt discussion."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900">
                🔔 <strong>Instant Notification:</strong> All students and parents in this batch will immediately receive a notification banner on their portal.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedScheduleForReschedule(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="submit-reschedule-btn"
                  className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
                >
                  Confirm & Broadcast Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD NEW SCHEDULE */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 bg-blue-700 text-white flex items-center justify-between">
              <h3 className="font-bold text-base">Schedule New Class Session</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 rounded-lg hover:bg-white/10">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSchedule} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Select Batch *</label>
                <select
                  id="new-schedule-batch"
                  value={newBatchId}
                  onChange={e => setNewBatchId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm bg-white"
                >
                  {batches.map(b => (
                    <option key={b.id} value={b.id}>
                      Class {b.classLevel}th - {b.name} ({b.timeSlot})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Date *</label>
                  <input
                    id="new-schedule-date"
                    type="date"
                    required
                    value={newDate}
                    onChange={e => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Classroom / Room</label>
                  <input
                    id="new-schedule-room"
                    type="text"
                    value={newRoom}
                    onChange={e => setNewRoom(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Start Time *</label>
                  <input
                    id="new-schedule-start-time"
                    type="text"
                    value={newStartTimeInput}
                    onChange={e => setNewStartTimeInput(e.target.value)}
                    placeholder="05:00 PM"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">End Time *</label>
                  <input
                    id="new-schedule-end-time"
                    type="text"
                    value={newEndTimeInput}
                    onChange={e => setNewEndTimeInput(e.target.value)}
                    placeholder="06:15 PM"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Topic / Chapter to be taught *
                </label>
                <input
                  id="new-schedule-topic"
                  type="text"
                  required
                  placeholder="e.g. Quadratic Equations - Word Problems & Graph Analysis"
                  value={newTopic}
                  onChange={e => setNewTopic(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="submit-new-schedule-btn"
                  className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold"
                >
                  Save Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
