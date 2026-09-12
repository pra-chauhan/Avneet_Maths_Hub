import React from 'react';
import { useData } from '../../context/DataContext';
import {
  Users,
  Layers,
  Calendar,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  FileText,
  Award,
  Bell,
  Phone,
  MessageSquare,
} from 'lucide-react';

interface TeacherOverviewProps {
  onNavigateTab: (tabId: string) => void;
}

export const TeacherOverview: React.FC<TeacherOverviewProps> = ({ onNavigateTab }) => {
  const {
    students,
    batches,
    timetable,
    freeTrials,
    homeworkList,
    enquiries,
    announcements,
    attendances,
  } = useData();

  // Calculations
  const totalStudents = students.length;
  const activeBatchesCount = batches.length;
  const pendingTrialsCount = freeTrials.filter(
    t =>
      t.status === 'Requested' ||
      t.status === 'Trial Scheduled' ||
      t.status === 'Attending' ||
      t.status === 'New' ||
      t.status === 'Scheduled'
  ).length;

  const uncheckedHwCount = (homeworkList || []).reduce((acc, hw) => {
    const subs = hw?.submissions || [];
    return acc + subs.filter(s => s.status === 'Submitted' || s.status === 'Pending').length;
  }, 0);

  // Today's classes
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayName = days[new Date().getDay()];
  const todaysClasses = (timetable || []).filter(
    t => t.dayOfWeek === todayName || t.dayOfWeek === 'Monday'
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold mb-3 border border-white/15">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Offline Coaching Management Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-sans tracking-tight">
              Welcome, Mr. Avneet Chauhan
            </h1>
            <p className="text-blue-200 text-xs sm:text-sm mt-1 max-w-xl">
              B.Ed, M.Sc Mathematics, CTET • Rohalki Kishanpur, Bahadrabad center operations.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              id="dash-quick-attendance"
              onClick={() => onNavigateTab('attendance')}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-md"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Mark Attendance</span>
            </button>

            <button
              id="dash-quick-assign-hw"
              onClick={() => onNavigateTab('homework')}
              className="px-4 py-2.5 bg-white text-blue-900 hover:bg-blue-50 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-md"
            >
              <BookOpen className="w-4 h-4 text-blue-700" />
              <span>Assign Homework</span>
            </button>
          </div>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10">
          <div
            onClick={() => onNavigateTab('students')}
            className="bg-white/10 hover:bg-white/15 cursor-pointer p-4 rounded-2xl backdrop-blur-xs transition-all border border-white/10"
          >
            <span className="text-blue-200 text-xs font-medium block">Total Offline Students</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-black text-white">{totalStudents}</span>
              <span className="text-xs text-amber-300 font-bold">Enrolled</span>
            </div>
          </div>

          <div
            onClick={() => onNavigateTab('batches')}
            className="bg-white/10 hover:bg-white/15 cursor-pointer p-4 rounded-2xl backdrop-blur-xs transition-all border border-white/10"
          >
            <span className="text-blue-200 text-xs font-medium block">Active Batches</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-black text-white">{activeBatchesCount}</span>
              <span className="text-xs text-blue-200">Classes 7th-12th</span>
            </div>
          </div>

          <div
            onClick={() => onNavigateTab('freetrials')}
            className="bg-white/10 hover:bg-white/15 cursor-pointer p-4 rounded-2xl backdrop-blur-xs transition-all border border-white/10"
          >
            <span className="text-blue-200 text-xs font-medium block">3-Day Free Trials</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-black text-amber-300">{pendingTrialsCount}</span>
              <span className="text-xs text-amber-200 font-semibold">Active Trials</span>
            </div>
          </div>

          <div
            onClick={() => onNavigateTab('homework')}
            className="bg-white/10 hover:bg-white/15 cursor-pointer p-4 rounded-2xl backdrop-blur-xs transition-all border border-white/10"
          >
            <span className="text-blue-200 text-xs font-medium block">Homework To Check</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-black text-white">{uncheckedHwCount}</span>
              <span className="text-xs text-emerald-300 font-semibold">Pending Review</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Today's Classroom Schedule */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-blue-100 text-blue-800">
                  <Clock className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-sans">
                    Today's Classroom Schedule ({todayName})
                  </h3>
                  <p className="text-xs text-slate-500">Rohalki Kishanpur coaching center offline batches</p>
                </div>
              </div>

              <button
                onClick={() => onNavigateTab('timetable')}
                className="text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1"
              >
                <span>Full Timetable</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {todaysClasses.length === 0 ? (
                <p className="py-6 text-center text-slate-400 text-xs">No batches scheduled today.</p>
              ) : (
                todaysClasses.map(session => (
                  <div
                    key={session.id}
                    className="py-3.5 flex items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors rounded-xl px-2"
                  >
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 rounded-md bg-blue-50 border border-blue-200 text-blue-800 font-black text-xs">
                        Class {session.classLevel}th
                      </span>

                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{session.batchName}</h4>
                        <p className="text-xs text-slate-500">
                          {session.timeSlot} • Room {session.room} • Focus: {session.chapterFocus}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          session.status === 'Cancelled'
                            ? 'bg-red-100 text-red-800'
                            : session.status === 'Rescheduled'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {session.status}
                      </span>

                      <button
                        onClick={() => onNavigateTab('attendance')}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-blue-600 hover:text-white rounded-lg text-xs font-semibold text-slate-700 transition-colors"
                      >
                        Roster
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Pending Homework Submissions to Check */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-purple-100 text-purple-800">
                  <BookOpen className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-sans">
                    Homework Pending Verification
                  </h3>
                  <p className="text-xs text-slate-500">Check steps and award ratings</p>
                </div>
              </div>

              <button
                onClick={() => onNavigateTab('homework')}
                className="text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {homeworkList.slice(0, 3).map(hw => {
                const pending = hw.submissions.filter(s => s.status !== 'Checked').length;
                return (
                  <div
                    key={hw.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900 text-white">
                          Class {hw.classLevel}th
                        </span>
                        <h5 className="font-bold text-slate-900 text-xs">{hw.title}</h5>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Chapter: {hw.chapter} • Due: {hw.dueDate}
                      </p>
                    </div>

                    <button
                      onClick={() => onNavigateTab('homework')}
                      className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold whitespace-nowrap shadow-2xs"
                    >
                      Check ({(hw.submissions || []).length})
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: 3-Day Trials & Admissions CRM */}
        <div className="lg:col-span-5 space-y-6">
          {/* Active 3-Day Free Trial Requests */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-amber-100 text-amber-800">
                  <Sparkles className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-sans">
                    3-Day Free Trial Queue
                  </h3>
                  <p className="text-xs text-slate-500">Track 3 days and convert</p>
                </div>
              </div>

              <button
                onClick={() => onNavigateTab('freetrials')}
                className="text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1"
              >
                <span>Manage</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {freeTrials.slice(0, 4).map(trial => {
                const attended = [
                  trial.day1Attended || trial.attendanceDays?.day1,
                  trial.day2Attended || trial.attendanceDays?.day2,
                  trial.day3Attended || trial.attendanceDays?.day3,
                ].filter(Boolean).length;

                return (
                  <div
                    key={trial.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between gap-2"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900">{trial.studentName}</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                          Class {trial.classLevel}th
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        {trial.preferredBatch} • Attendance: <strong>{attended}/3 Days</strong>
                      </p>
                    </div>

                    <a
                      href={`https://wa.me/${trial.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(trial.parentName)},%20this%20is%20Mr.%20Avneet%20Chauhan%20from%20Avneet%20Maths%20Hub.`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg transition-colors"
                      title="WhatsApp Parent"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </a>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Enquiries */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-blue-100 text-blue-800">
                  <Users className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-sans">
                    Recent Admission Inquiries
                  </h3>
                  <p className="text-xs text-slate-500">Website and walk-in leads</p>
                </div>
              </div>

              <button
                onClick={() => onNavigateTab('enquiries')}
                className="text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1"
              >
                <span>CRM</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {enquiries.slice(0, 3).map(enq => (
                <div
                  key={enq.id}
                  className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-900 block">{enq.studentName}</span>
                    <span className="text-slate-500">
                      Class {enq.classLevel}th • Status: <strong>{enq.status || 'New Enquiry'}</strong>
                    </span>
                  </div>
                  <a
                    href={`tel:${enq.phone}`}
                    className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 hover:text-blue-700"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
