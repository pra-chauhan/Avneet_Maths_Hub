import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { fileToBase64, formatFileSize, downloadFile } from '../../utils/fileHelpers';
import {
  User,
  Calendar,
  BookOpen,
  Award,
  CheckCircle,
  FileText,
  Clock,
  MessageSquare,
  UploadCloud,
  Check,
  Star,
  Download,
  AlertCircle,
  TrendingUp,
  Phone,
  Sparkles,
} from 'lucide-react';

export const StudentPortal: React.FC = () => {
  const {
    students,
    batches,
    timetable,
    homeworkList,
    assignments,
    studyMaterials,
    tests,
    announcements,
    submitHomework,
    submitAssignment,
    currentUser,
    setCurrentUser,
  } = useData();

  // Pick current student (defaults to Priyanshu Sharma or the logged in user)
  const currentStudent =
    students.find(s => s.id === currentUser.id) ||
    students.find(s => s.name.toLowerCase().includes('priyanshu')) ||
    students[0];

  const studentBatch = batches.find(b => b.id === currentStudent?.batchId) || batches[0];

  // Active tab in Student/Parent view
  const [activeTab, setActiveTab] = useState<
    'schedule' | 'homework' | 'assignments' | 'results' | 'materials' | 'attendance'
  >('homework');

  // Homework submission state
  const [submittingHwId, setSubmittingHwId] = useState<string | null>(null);
  const [hwNotes, setHwNotes] = useState('');
  const [hwFileName, setHwFileName] = useState('');
  const [hwFileUrl, setHwFileUrl] = useState('');
  const [hwSuccessMsg, setHwSuccessMsg] = useState(false);

  // Assignment submission state
  const [submittingAsgId, setSubmittingAsgId] = useState<string | null>(null);
  const [asgNotes, setAsgNotes] = useState('');
  const [asgFileName, setAsgFileName] = useState('');
  const [asgFileUrl, setAsgFileUrl] = useState('');
  const [asgSuccessMsg, setAsgSuccessMsg] = useState(false);

  if (!currentStudent) {
    return <div className="p-8 text-center text-slate-500">Student record not found.</div>;
  }

  // Filter items for current student
  const studentTimetable = timetable.filter(
    t => t.classLevel === currentStudent.classLevel || t.batchId === studentBatch?.id
  );

  const studentHomework = homeworkList.filter(
    hw => hw.classLevel === currentStudent.classLevel || hw.batchId === studentBatch?.id
  );

  const studentAssignments = assignments.filter(
    a => a.classLevel === currentStudent.classLevel || a.batchId === studentBatch?.id
  );

  const studentMaterials = studyMaterials.filter(
    m => m.classLevel === currentStudent.classLevel
  );

  const studentResults = tests.flatMap(t => {
    const resultsList = t.results || [];
    const res = resultsList.find(r => r.studentId === currentStudent.id);
    if (!res) return [];
    return [
      {
        testName: t.name,
        testDate: t.testDate,
        chapter: t.chapter,
        marksObtained: res.marksObtained,
        maxMarks: res.maxMarks,
        percentage: res.percentage,
        grade: res.grade,
        remarks: res.teacherRemarks,
        isAbsent: res.isAbsent,
      },
    ];
  });

  const handleHwFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await fileToBase64(file);
      setHwFileName(file.name);
      setHwFileUrl(base64);
    }
  };

  const handleSubmitHw = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submittingHwId) return;

    submitHomework(
      submittingHwId,
      currentStudent.id,
      currentStudent.name,
      hwNotes,
      hwFileName || undefined,
      hwFileUrl || undefined
    );

    setSubmittingHwId(null);
    setHwNotes('');
    setHwFileName('');
    setHwFileUrl('');
    setHwSuccessMsg(true);
    setTimeout(() => setHwSuccessMsg(false), 3500);
  };

  const handleAsgFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await fileToBase64(file);
      setAsgFileName(file.name);
      setAsgFileUrl(base64);
    }
  };

  const handleSubmitAsg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submittingAsgId) return;

    submitAssignment(
      submittingAsgId,
      currentStudent.id,
      currentStudent.name,
      asgNotes,
      asgFileName || undefined,
      asgFileUrl || undefined
    );

    setSubmittingAsgId(null);
    setAsgNotes('');
    setAsgFileName('');
    setAsgFileUrl('');
    setAsgSuccessMsg(true);
    setTimeout(() => setAsgSuccessMsg(false), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Student Banner with Quick Profile Switcher */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-400 text-blue-950 font-black text-2xl flex items-center justify-center shadow-lg">
              {currentStudent.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black font-sans tracking-tight">
                  {currentStudent.name}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold">
                  Class {currentStudent.classLevel}th
                </span>
              </div>
              <p className="text-blue-200 text-xs sm:text-sm mt-0.5">
                Roll No: <strong>{currentStudent.rollNumber}</strong> • Batch:{' '}
                <strong>{studentBatch?.name || 'Class Batch'}</strong> ({studentBatch?.timeSlot})
              </p>
              <p className="text-blue-300 text-xs mt-1">
                Parent: {currentStudent.parentName} ({currentStudent.parentPhone})
              </p>
            </div>
          </div>

          {/* Switch Student Profile Demo Selector */}
          <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 flex flex-col gap-1.5">
            <span className="text-[10px] uppercase font-bold text-blue-200 tracking-wider">
              Switch Student View:
            </span>
            <select
              id="select-student-profile"
              value={currentStudent.id}
              onChange={e => {
                const target = students.find(s => s.id === e.target.value);
                if (target) {
                  setCurrentUser({
                    id: target.id,
                    name: target.name,
                    role: currentUser.role === 'parent' ? 'parent' : 'student',
                    classLevel: target.classLevel,
                  });
                }
              }}
              className="bg-blue-950/80 border border-white/30 text-white rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-hidden"
            >
              {students.map(s => (
                <option key={s.id} value={s.id} className="bg-slate-900 text-white">
                  {s.name} (Class {s.classLevel}th - {s.rollNumber})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick KPI Stat Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10 text-xs">
          <div className="bg-white/10 rounded-xl p-2.5 backdrop-blur-xs">
            <span className="text-blue-200 text-[11px] block">Attendance Rate</span>
            <span className="text-lg font-black text-amber-300">
              {currentStudent.attendancePercentage ?? 92}%
            </span>
          </div>

          <div className="bg-white/10 rounded-xl p-2.5 backdrop-blur-xs">
            <span className="text-blue-200 text-[11px] block">Enrolled Offline In</span>
            <span className="text-lg font-black text-white">Room {studentBatch?.room || '101'}</span>
          </div>

          <div className="bg-white/10 rounded-xl p-2.5 backdrop-blur-xs">
            <span className="text-blue-200 text-[11px] block">Tests Completed</span>
            <span className="text-lg font-black text-white">{studentResults.length} Tests</span>
          </div>

          <div className="bg-white/10 rounded-xl p-2.5 backdrop-blur-xs flex items-center justify-between">
            <div>
              <span className="text-blue-200 text-[11px] block">Teacher Contact</span>
              <span className="text-xs font-bold text-white">Mr. Avneet Chauhan</span>
            </div>
            <a
              href={`https://wa.me/919528665136?text=Hello%20Sir,%20this%20is%20regarding%20${encodeURIComponent(currentStudent.name)}%20(Class%20${currentStudent.classLevel}th).`}
              target="_blank"
              rel="noreferrer"
              className="p-2 bg-emerald-500 hover:bg-emerald-400 rounded-lg text-white"
              title="Message Teacher"
            >
              <MessageSquare className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {hwSuccessMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Homework solution submitted successfully to Mr. Avneet Chauhan for checking!</span>
        </div>
      )}

      {asgSuccessMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Assignment uploaded successfully for step-marking evaluation!</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200">
        {[
          { id: 'homework', label: 'Daily Homework & DPPs', icon: BookOpen, count: studentHomework.length },
          { id: 'assignments', label: 'Graded Assignments', icon: FileText, count: studentAssignments.length },
          { id: 'results', label: 'Test Report Cards', icon: Award, count: studentResults.length },
          { id: 'schedule', label: 'My Batch Timetable', icon: Calendar },
          { id: 'materials', label: 'Notes & Formula Sheets', icon: Download, count: studentMaterials.length },
          { id: 'attendance', label: 'Attendance Record', icon: CheckCircle },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`tab-student-${tab.id}`}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: DAILY HOMEWORK */}
      {activeTab === 'homework' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {studentHomework.map(hw => {
              const mySub = hw.submissions.find(s => s.studentId === currentStudent.id);
              const isChecked = mySub?.status === 'Checked';
              const isNeedsImp = mySub?.status === 'Needs Improvement';

              return (
                <div
                  key={hw.id}
                  id={`student-hw-${hw.id}`}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-blue-700">{hw.chapter}</span>
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                          isChecked
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : isNeedsImp
                            ? 'bg-amber-50 text-amber-800 border-amber-300'
                            : mySub
                            ? 'bg-blue-50 text-blue-800 border-blue-300'
                            : 'bg-red-50 text-red-800 border-red-300'
                        }`}
                      >
                        {isChecked
                          ? `Checked (${mySub?.scoreRating}/5 ★)`
                          : isNeedsImp
                          ? 'Needs Improvement'
                          : mySub
                          ? 'Submitted'
                          : 'Pending Solution'}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 font-sans">{hw.title}</h3>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">{hw.description}</p>

                    {hw.attachmentName && (
                      <div className="mt-3 p-2 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                        <span className="text-slate-700 truncate max-w-[200px]">
                          📎 {hw.attachmentName}
                        </span>
                        {hw.attachmentUrl && (
                          <button
                            onClick={() => downloadFile(hw.attachmentUrl!, hw.attachmentName!)}
                            className="text-blue-600 hover:underline font-bold"
                          >
                            Download DPP
                          </button>
                        )}
                      </div>
                    )}

                    {/* Feedback if graded */}
                    {mySub?.teacherRemarks && (
                      <div className="mt-3 p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950">
                        <strong className="block text-emerald-900 mb-0.5">
                          Mr. Avneet Chauhan's Feedback:
                        </strong>
                        {mySub.teacherRemarks}
                      </div>
                    )}
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                      Due: <strong>{hw.dueDate}</strong>
                    </span>

                    <button
                      id={`btn-submit-hw-${hw.id}`}
                      onClick={() => setSubmittingHwId(hw.id)}
                      className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition-colors"
                    >
                      {mySub ? 'Re-upload / Update Solution' : 'Submit Solution'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB CONTENT: GRADED ASSIGNMENTS */}
      {activeTab === 'assignments' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {studentAssignments.map(asg => {
              const mySub = asg.submissions.find(s => s.studentId === currentStudent.id);
              const isChecked = mySub?.status === 'Checked';

              return (
                <div
                  key={asg.id}
                  id={`student-asg-${asg.id}`}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-indigo-700">{asg.chapter}</span>
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                          isChecked
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : mySub
                            ? 'bg-blue-50 text-blue-800 border-blue-300'
                            : 'bg-red-50 text-red-800 border-red-300'
                        }`}
                      >
                        {isChecked
                          ? `Graded: ${mySub?.marksAwarded}/${asg.maxMarks} Marks`
                          : mySub
                          ? 'Submitted'
                          : 'Not Submitted'}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 font-sans">{asg.title}</h3>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">{asg.description}</p>

                    {asg.attachmentName && (
                      <div className="mt-3 p-2 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                        <span className="text-slate-700 truncate max-w-[200px]">
                          📎 {asg.attachmentName}
                        </span>
                        {asg.attachmentUrl && (
                          <button
                            onClick={() => downloadFile(asg.attachmentUrl!, asg.attachmentName!)}
                            className="text-indigo-600 hover:underline font-bold"
                          >
                            Download Question Sheet
                          </button>
                        )}
                      </div>
                    )}

                    {mySub?.teacherRemarks && (
                      <div className="mt-3 p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950">
                        <strong className="block text-emerald-900 mb-0.5">Evaluation Remarks:</strong>
                        {mySub.teacherRemarks}
                      </div>
                    )}
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                      Due: <strong>{asg.dueDate}</strong> • Max: {asg.maxMarks} Marks
                    </span>

                    <button
                      id={`btn-submit-asg-${asg.id}`}
                      onClick={() => setSubmittingAsgId(asg.id)}
                      className="px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl text-xs font-bold transition-colors"
                    >
                      {mySub ? 'Update Solution Sheet' : 'Upload Solution PDF'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB CONTENT: TEST REPORT CARDS */}
      {activeTab === 'results' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div>
              <h3 className="font-bold text-lg text-slate-900">Academic Test Performance</h3>
              <p className="text-xs text-slate-500">
                Evaluation results with step-marking and personalized comments from Mr. Avneet Chauhan.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
              Class {currentStudent.classLevel}th Offline Tests
            </span>
          </div>

          {studentResults.length === 0 ? (
            <p className="py-8 text-center text-slate-400 text-sm">
              No test report cards published yet for this student.
            </p>
          ) : (
            <div className="space-y-4">
              {studentResults.map((res, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-blue-700">{res.chapter}</span>
                      <span className="text-[11px] text-slate-400">• {res.testDate}</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-base">{res.testName}</h4>
                    {res.remarks && (
                      <p className="text-xs text-slate-600 mt-1 italic">
                        "{res.remarks}" — Mr. Avneet Chauhan
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-slate-200">
                    <div className="text-center pr-3 border-r border-slate-200">
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Marks</span>
                      <span className="text-base font-extrabold text-slate-900">
                        {res.isAbsent ? 'AB' : `${res.marksObtained} / ${res.maxMarks}`}
                      </span>
                    </div>

                    <div className="text-center pr-3 border-r border-slate-200">
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Percentage</span>
                      <span className="text-base font-extrabold text-blue-700">
                        {res.isAbsent ? '0%' : `${res.percentage}%`}
                      </span>
                    </div>

                    <div className="text-center">
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Grade</span>
                      <span
                        className={`text-base font-black px-2 py-0.5 rounded ${
                          res.grade === 'A+' || res.grade === 'A'
                            ? 'text-emerald-700'
                            : 'text-amber-700'
                        }`}
                      >
                        {res.grade}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: BATCH TIMETABLE */}
      {activeTab === 'schedule' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div>
            <h3 className="font-bold text-lg text-slate-900">My Class Timetable & Room Location</h3>
            <p className="text-xs text-slate-500">
              Offline lecture schedule at Rohalki Kishanpur, Bahadrabad center.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {studentTimetable.map(item => (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-700 text-white">
                      {item.dayOfWeek}
                    </span>
                    <span className="text-xs font-bold text-slate-600">Room {item.room}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{item.batchName}</h4>
                  <p className="text-xs text-slate-600 mt-1">{item.chapterFocus}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                  <span>⏰ {item.timeSlot}</span>
                  <span>👨‍🏫 {item.teacherName}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: STUDY MATERIAL & FORMULA SHEETS */}
      {activeTab === 'materials' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div>
            <h3 className="font-bold text-lg text-slate-900">Class {currentStudent.classLevel}th Notes & DPPs</h3>
            <p className="text-xs text-slate-500">Download practice problem sets, formula summaries, and NCERT exemplars.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {studentMaterials.map(mat => (
              <div
                key={mat.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase">
                    {mat.category}
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm mt-2">{mat.title}</h4>
                  <p className="text-xs text-blue-700 font-medium">{mat.chapter}</p>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{mat.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">{formatFileSize(mat.fileSize)}</span>
                  <button
                    onClick={() => downloadFile(mat.fileUrl, mat.fileName)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: ATTENDANCE RECORD */}
      {activeTab === 'attendance' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div>
              <h3 className="font-bold text-lg text-slate-900">Offline Classroom Attendance</h3>
              <p className="text-xs text-slate-500">Strict regular attendance ensures mathematical continuity.</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-blue-700">
                {currentStudent.attendancePercentage ?? 92}%
              </span>
              <span className="block text-[11px] text-slate-400 uppercase font-bold">Overall Rate</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-950 flex items-center justify-between">
            <div>
              <strong>Attendance Policy:</strong> 75%+ attendance is required for comprehensive syllabus coverage.
            </div>
            <span className="font-bold text-emerald-700 bg-white px-2 py-1 rounded">Good Standing</span>
          </div>
        </div>
      )}

      {/* SUBMISSION MODAL: HOMEWORK */}
      {submittingHwId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 bg-blue-700 text-white flex items-center justify-between">
              <h3 className="font-bold text-base">Submit Mathematics Homework</h3>
              <button onClick={() => setSubmittingHwId(null)} className="p-1 rounded-lg hover:bg-white/10">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitHw} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Upload Answer Sheet / Notebook Photo (PDF/Image) *
                </label>
                <input
                  type="file"
                  required
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={handleHwFileUpload}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {hwFileName && (
                  <p className="text-xs text-emerald-600 mt-1 font-semibold">Ready: {hwFileName}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Notes / Doubts Encountered While Solving
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Completed all 5 problems. Found Question 4 slightly tricky in Step 2."
                  value={hwNotes}
                  onChange={e => setHwNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSubmittingHwId(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="confirm-submit-hw"
                  className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold"
                >
                  Submit for Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUBMISSION MODAL: ASSIGNMENT */}
      {submittingAsgId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 bg-indigo-700 text-white flex items-center justify-between">
              <h3 className="font-bold text-base">Upload Assignment Solutions</h3>
              <button onClick={() => setSubmittingAsgId(null)} className="p-1 rounded-lg hover:bg-white/10">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitAsg} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Upload Solutions Document (PDF/Images) *
                </label>
                <input
                  type="file"
                  required
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={handleAsgFileUpload}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
                {asgFileName && (
                  <p className="text-xs text-emerald-600 mt-1 font-semibold">Ready: {asgFileName}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Remarks / Method Used
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Followed the NCERT standard theorem proof steps."
                  value={asgNotes}
                  onChange={e => setAsgNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSubmittingAsgId(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="confirm-submit-asg"
                  className="px-5 py-2.5 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl text-xs font-bold"
                >
                  Upload for Marks
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
