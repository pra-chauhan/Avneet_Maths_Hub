import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { AttendanceStatus } from '../../types';
import {
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  AlertTriangle,
  MessageSquare,
  Users,
  CheckCheck,
  Save,
  Filter,
} from 'lucide-react';

export const AttendanceManager: React.FC = () => {
  const { batches, students, attendances, markAttendance, markBulkAttendance } = useData();

  const [selectedBatchId, setSelectedBatchId] = useState<string>(batches[0]?.id || '');
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [remarksMap, setRemarksMap] = useState<Record<string, string>>({});
  const [saveAlert, setSaveAlert] = useState(false);

  const selectedBatch = batches.find(b => b.id === selectedBatchId) || batches[0];
  const batchStudents = students.filter(s => s.batchId === selectedBatch?.id);

  // Get current attendance for selected batch & date
  const currentAttendanceRecords = attendances.filter(
    a => a.batchId === selectedBatch?.id && a.date === selectedDate
  );

  const getStudentStatus = (studentId: string): AttendanceStatus => {
    const record = currentAttendanceRecords.find(a => a.studentId === studentId);
    return record ? record.status : 'Present';
  };

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    markAttendance({
      date: selectedDate,
      batchId: selectedBatch.id,
      studentId,
      status,
      remarks: remarksMap[studentId] || (status === 'Absent' ? 'Unexcused absence' : ''),
    });
  };

  const handleMarkAllPresent = () => {
    const records = batchStudents.map(st => ({
      date: selectedDate,
      batchId: selectedBatch.id,
      studentId: st.id,
      status: 'Present' as AttendanceStatus,
      remarks: '',
    }));
    markBulkAttendance(records);
    setSaveAlert(true);
    setTimeout(() => setSaveAlert(false), 3000);
  };

  // Stats calculation
  const presentCount = batchStudents.filter(s => getStudentStatus(s.id) === 'Present').length;
  const absentCount = batchStudents.filter(s => getStudentStatus(s.id) === 'Absent').length;
  const lateCount = batchStudents.filter(s => getStudentStatus(s.id) === 'Late').length;
  const attendanceRate =
    batchStudents.length > 0
      ? Math.round(((presentCount + lateCount) / batchStudents.length) * 100)
      : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-100 text-blue-800">
              <CheckCircle className="w-5 h-5" />
            </span>
            <h2 className="text-2xl font-black text-slate-900 font-sans">
              Daily Offline Attendance Register
            </h2>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Log classroom attendance, monitor percentage rates, and notify parents of unexcused absences.
          </p>
        </div>

        <button
          id="btn-mark-all-present"
          onClick={handleMarkAllPresent}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors shadow-xs"
        >
          <CheckCheck className="w-4 h-4" />
          <span>Mark All Present</span>
        </button>
      </div>

      {saveAlert && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>Attendance registered successfully for {batchStudents.length} students!</span>
        </div>
      )}

      {/* Selector & Stats Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls */}
        <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-xs font-bold text-slate-700 mb-1">Select Batch *</label>
            <select
              id="attendance-batch-select"
              value={selectedBatchId}
              onChange={e => setSelectedBatchId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold bg-white"
            >
              {batches.map(b => (
                <option key={b.id} value={b.id}>
                  Class {b.classLevel}th - {b.name} ({b.timeSlot})
                </option>
              ))}
            </select>
          </div>

          <div className="sm:w-48">
            <label className="block text-xs font-bold text-slate-700 mb-1">Date *</label>
            <input
              id="attendance-date-select"
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold bg-white"
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="lg:col-span-6 grid grid-cols-4 gap-3">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center">
            <span className="text-[11px] font-bold uppercase text-slate-400 block">Total</span>
            <span className="text-xl font-extrabold text-slate-900">{batchStudents.length}</span>
          </div>

          <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 text-center">
            <span className="text-[11px] font-bold uppercase text-emerald-700 block">Present</span>
            <span className="text-xl font-extrabold text-emerald-800">{presentCount}</span>
          </div>

          <div className="bg-red-50 p-4 rounded-2xl border border-red-200 text-center">
            <span className="text-[11px] font-bold uppercase text-red-700 block">Absent</span>
            <span className="text-xl font-extrabold text-red-800">{absentCount}</span>
          </div>

          <div className="bg-blue-50 p-4 rounded-2xl border border-blue-200 text-center">
            <span className="text-[11px] font-bold uppercase text-blue-700 block">Rate</span>
            <span className="text-xl font-extrabold text-blue-800">{attendanceRate}%</span>
          </div>
        </div>
      </div>

      {/* Attendance Roster Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Roll</th>
                <th className="py-3.5 px-4">Student Name</th>
                <th className="py-3.5 px-4">Historical Rate</th>
                <th className="py-3.5 px-4 text-center">Status on {selectedDate}</th>
                <th className="py-3.5 px-4">Remarks / Parent Alert</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {batchStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    No students found in this batch.
                  </td>
                </tr>
              ) : (
                batchStudents.map(st => {
                  const currentStatus = getStudentStatus(st.id);
                  const isAbsent = currentStatus === 'Absent';
                  const isLate = currentStatus === 'Late';
                  const isPresent = currentStatus === 'Present';
                  const isLowAttendance = (st.attendancePercentage ?? 90) < 75;

                  return (
                    <tr
                      key={st.id}
                      className={`hover:bg-slate-50/70 transition-colors ${
                        isAbsent ? 'bg-red-50/40' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4 font-bold text-slate-500">{st.rollNumber}</td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-xs">
                            {st.name.charAt(0)}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block">{st.name}</span>
                            <span className="text-[11px] text-slate-500">
                              Parent: {st.parentName} ({st.parentPhone})
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`font-bold text-xs ${
                              isLowAttendance ? 'text-red-600' : 'text-slate-700'
                            }`}
                          >
                            {st.attendancePercentage ?? 92}%
                          </span>
                          {isLowAttendance && (
                            <span className="text-[10px] bg-red-100 text-red-800 px-1.5 py-0.5 rounded font-bold">
                              Low
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                          <button
                            type="button"
                            id={`att-${st.id}-present`}
                            onClick={() => handleStatusChange(st.id, 'Present')}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                              isPresent
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            Present
                          </button>

                          <button
                            type="button"
                            id={`att-${st.id}-late`}
                            onClick={() => handleStatusChange(st.id, 'Late')}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                              isLate
                                ? 'bg-amber-600 text-white shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            Late
                          </button>

                          <button
                            type="button"
                            id={`att-${st.id}-absent`}
                            onClick={() => handleStatusChange(st.id, 'Absent')}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                              isAbsent
                                ? 'bg-red-600 text-white shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            Absent
                          </button>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        {isAbsent ? (
                          <div className="flex items-center gap-2">
                            <a
                              id={`alert-parent-${st.id}`}
                              href={`https://wa.me/${st.parentPhone.replace(/[^0-9]/g, '')}?text=Dear%20${encodeURIComponent(st.parentName)},%20this%20is%20to%20inform%20you%20that%20${encodeURIComponent(st.name)}%20was%20marked%20ABSENT%20today%20(${selectedDate})%20in%20their%20Mathematics%20class%20at%20Avneet%20Maths%20Hub.%20Please%20contact%20Mr.%20Avneet%20Chauhan%20if%20this%20was%20unexpected.`}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>WhatsApp Absence Notice</span>
                            </a>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">Attending lecture</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
