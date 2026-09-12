import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { TestRecord, TestResult, ClassLevel, TestType } from '../../types';
import {
  Award,
  Plus,
  Calendar,
  Clock,
  CheckCircle,
  FileCheck,
  Edit2,
  Trash2,
  XCircle,
  Users,
  BarChart3,
  TrendingUp,
  Save,
} from 'lucide-react';

export const TestManager: React.FC = () => {
  const { tests, batches, students, addTest, recordTestResults, deleteTest, currentUser } = useData();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [enteringMarksTest, setEnteringMarksTest] = useState<TestRecord | null>(null);

  // Form states
  const [testName, setTestName] = useState('');
  const [testType, setTestType] = useState<TestType>('Chapter Test');
  const [classLevel, setClassLevel] = useState<ClassLevel>(10);
  const [batchId, setBatchId] = useState(batches[0]?.id || '');
  const [chapter, setChapter] = useState('');
  const [testDate, setTestDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('05:00 PM');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [maxMarks, setMaxMarks] = useState(40);
  const [passingMarks, setPassingMarks] = useState(16);
  const [instructions, setInstructions] = useState('Step-marking applies. Show neat geometric diagrams.');

  // Marks entry state
  const [marksSheet, setMarksSheet] = useState<
    Record<string, { marks: number; remarks: string; isAbsent: boolean }>
  >({});

  const handleOpenMarksEntry = (test: TestRecord) => {
    setEnteringMarksTest(test);
    const batchStudents = students.filter(s => s.batchId === test.batchId);
    const initialSheet: Record<string, { marks: number; remarks: string; isAbsent: boolean }> = {};

    batchStudents.forEach(st => {
      const resultsList = test.results || [];
      const existingRes = resultsList.find(r => r.studentId === st.id);
      initialSheet[st.id] = {
        marks: existingRes ? existingRes.marksObtained : Math.round(test.maxMarks * 0.8),
        remarks: existingRes ? existingRes.teacherRemarks || (existingRes as any).teacherRemark || '' : 'Good conceptual approach.',
        isAbsent: existingRes ? (existingRes.isAbsent ?? false) : false,
      };
    });

    setMarksSheet(initialSheet);
  };

  const calculateGrade = (pct: number) => {
    if (pct >= 90) return 'A+';
    if (pct >= 80) return 'A';
    if (pct >= 70) return 'B';
    if (pct >= 60) return 'C';
    if (pct >= 50) return 'D';
    return 'F';
  };

  const handleSaveMarks = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enteringMarksTest) return;

    const batchStudents = students.filter(s => s.batchId === enteringMarksTest.batchId);
    const results: Omit<TestResult, 'id'>[] = batchStudents.map(st => {
      const sheet = marksSheet[st.id] || { marks: 0, remarks: '', isAbsent: false };
      const percentage = sheet.isAbsent ? 0 : Math.round((sheet.marks / enteringMarksTest.maxMarks) * 100);

      return {
        testId: enteringMarksTest.id,
        studentId: st.id,
        studentName: st.fullName || st.name || 'Student',
        rollNumber: st.rollNumber,
        marksObtained: sheet.isAbsent ? 0 : sheet.marks,
        maxMarks: enteringMarksTest.maxMarks,
        percentage,
        grade: sheet.isAbsent ? 'AB' : calculateGrade(percentage),
        teacherRemarks: sheet.remarks,
        teacherRemark: sheet.remarks,
        isAbsent: sheet.isAbsent,
      };
    });

    recordTestResults(enteringMarksTest.id, results);
    setEnteringMarksTest(null);
  };

  const handleCreateTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testName.trim()) return;

    const batch = batches.find(b => b.id === batchId);

    addTest({
      name: testName.trim(),
      testName: testName.trim(),
      testType,
      classLevel,
      batchId,
      batchName: batch ? batch.name : `Class ${classLevel}th Batch`,
      chapter: chapter.trim() || 'General Mathematics Exam',
      date: testDate,
      testDate,
      startTime,
      durationMinutes,
      maxMarks,
      passingMarks,
      instructions,
      isCompleted: false,
    });

    setIsAddModalOpen(false);
    setTestName('');
    setChapter('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <Award className="w-5 h-5" />
            </span>
            <h2 className="text-2xl font-black text-slate-900 font-sans">
              Test Management & Marksheets
            </h2>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Conduct periodic mock examinations, record student step-marking scores, and monitor batch performance.
          </p>
        </div>

        {(currentUser.role === 'admin' || currentUser.role === 'teacher') && (
          <button
            id="btn-schedule-new-test"
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Test</span>
          </button>
        )}
      </div>

      {/* Tests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tests.map(test => {
          const resultsList = test.results || [];
          const resultsCount = resultsList.length;
          const avgPercentage =
            resultsCount > 0
              ? Math.round(
                  resultsList.reduce((acc, r) => acc + (r.isAbsent ? 0 : r.percentage), 0) /
                    resultsCount
                )
              : 0;

          return (
            <div
              key={test.id}
              id={`test-card-${test.id}`}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-slate-900 text-white">
                    Class {test.classLevel}th
                  </span>

                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                    {test.testType}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 font-sans">{test.name}</h3>
                <p className="text-xs font-semibold text-blue-700 mt-0.5">{test.chapter}</p>

                <div className="mt-4 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                    <span>Date & Time:</span>
                    <strong className="text-slate-800">
                      {test.testDate} • {test.startTime}
                    </strong>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                    <span>Duration & Marks:</span>
                    <strong className="text-slate-800">
                      {test.durationMinutes} mins • {test.maxMarks} Marks (Pass: {test.passingMarks})
                    </strong>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                    <span>Target Batch:</span>
                    <span className="font-semibold text-slate-800">{test.batchName}</span>
                  </div>
                </div>

                {/* Score Summary */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Evaluation Status:</span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded-full ${
                      resultsCount > 0
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {resultsCount > 0 ? `${resultsCount} Papers Graded (Avg: ${avgPercentage}%)` : 'Pending Grading'}
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  id={`btn-marks-entry-${test.id}`}
                  onClick={() => handleOpenMarksEntry(test)}
                  className="flex-1 py-2 bg-slate-900 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>{resultsCount > 0 ? 'Edit Marksheet' : 'Enter Marks'}</span>
                </button>

                {(currentUser.role === 'admin' || currentUser.role === 'teacher') && (
                  <button
                    onClick={() => {
                      if (confirm('Delete this test record?')) deleteTest(test.id);
                    }}
                    className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100"
                    title="Delete Test"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL: CREATE TEST */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 bg-amber-600 text-white flex items-center justify-between">
              <h3 className="font-bold text-base">Schedule New Mathematics Test</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 rounded-lg hover:bg-white/10">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTest} className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Test Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chapter 4 & 5 Mock Assessment"
                  value={testName}
                  onChange={e => setTestName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Test Type *</label>
                  <select
                    value={testType}
                    onChange={e => setTestType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm bg-white"
                  >
                    <option value="Chapter Test">Chapter Test</option>
                    <option value="Weekly Test">Weekly Test</option>
                    <option value="Monthly Assessment">Monthly Assessment</option>
                    <option value="Mock Test">Mock Test</option>
                    <option value="Half-Yearly Test">Half-Yearly Test</option>
                    <option value="Final Revision Test">Final Revision Test</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Class Level *</label>
                  <select
                    value={classLevel}
                    onChange={e => setClassLevel(Number(e.target.value) as ClassLevel)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm bg-white"
                  >
                    <option value={7}>Class 7th</option>
                    <option value={8}>Class 8th</option>
                    <option value={9}>Class 9th</option>
                    <option value={10}>Class 10th</option>
                    <option value={11}>Class 11th</option>
                    <option value={12}>Class 12th</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Batch *</label>
                  <select
                    value={batchId}
                    onChange={e => setBatchId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm bg-white"
                  >
                    {batches.map(b => (
                      <option key={b.id} value={b.id}>
                        Class {b.classLevel}th - {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Chapter Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Quadratic Equations"
                    value={chapter}
                    onChange={e => setChapter(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Test Date *</label>
                  <input
                    type="date"
                    required
                    value={testDate}
                    onChange={e => setTestDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Max Marks *</label>
                  <input
                    type="number"
                    required
                    value={maxMarks}
                    onChange={e => setMaxMarks(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Pass Marks *</label>
                  <input
                    type="number"
                    required
                    value={passingMarks}
                    onChange={e => setPassingMarks(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                  />
                </div>
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
                  id="submit-create-test"
                  className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-xs"
                >
                  Schedule Test
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ENTER MARKS */}
      {enteringMarksTest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden flex flex-col max-h-[88vh]">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">Marksheet: {enteringMarksTest.name}</h3>
                <p className="text-xs text-slate-300">
                  {enteringMarksTest.batchName} • Maximum Marks: {enteringMarksTest.maxMarks}
                </p>
              </div>
              <button
                onClick={() => setEnteringMarksTest(null)}
                className="p-1 rounded-lg hover:bg-white/10"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMarks} className="p-6 overflow-y-auto space-y-4">
              <div className="divide-y divide-slate-100">
                {students
                  .filter(s => s.batchId === enteringMarksTest.batchId)
                  .map(st => {
                    const currentEntry = marksSheet[st.id] || {
                      marks: 0,
                      remarks: '',
                      isAbsent: false,
                    };

                    const pct = currentEntry.isAbsent
                      ? 0
                      : Math.round((currentEntry.marks / enteringMarksTest.maxMarks) * 100);

                    return (
                      <div key={st.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="w-48">
                          <span className="font-bold text-slate-900 block text-xs sm:text-sm">
                            {st.fullName || st.name}
                          </span>
                          <span className="text-[11px] text-slate-400">Roll: {st.rollNumber}</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <label className="flex items-center gap-1.5 text-xs text-slate-600 font-medium cursor-pointer">
                            <input
                              type="checkbox"
                              checked={currentEntry.isAbsent}
                              onChange={e =>
                                setMarksSheet({
                                  ...marksSheet,
                                  [st.id]: {
                                    ...currentEntry,
                                    isAbsent: e.target.checked,
                                  },
                                })
                              }
                              className="rounded text-red-600 focus:ring-red-500"
                            />
                            <span>Absent</span>
                          </label>

                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              min={0}
                              max={enteringMarksTest.maxMarks}
                              disabled={currentEntry.isAbsent}
                              value={currentEntry.marks}
                              onChange={e =>
                                setMarksSheet({
                                  ...marksSheet,
                                  [st.id]: {
                                    ...currentEntry,
                                    marks: Number(e.target.value),
                                  },
                                })
                              }
                              className="w-20 px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs font-bold text-center disabled:bg-slate-100"
                            />
                            <span className="text-xs text-slate-400">/ {enteringMarksTest.maxMarks}</span>
                          </div>

                          <span
                            className={`w-12 text-center text-xs font-bold px-1.5 py-0.5 rounded ${
                              currentEntry.isAbsent
                                ? 'bg-red-100 text-red-800'
                                : pct >= 80
                                ? 'bg-emerald-100 text-emerald-800'
                                : pct >= 50
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {currentEntry.isAbsent ? 'AB' : `${pct}%`}
                          </span>

                          <input
                            type="text"
                            placeholder="Teacher feedback..."
                            value={currentEntry.remarks}
                            onChange={e =>
                              setMarksSheet({
                                ...marksSheet,
                                [st.id]: {
                                  ...currentEntry,
                                  remarks: e.target.value,
                                },
                              })
                            }
                            className="flex-1 min-w-[150px] px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs"
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEnteringMarksTest(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="submit-marksheet-btn"
                  className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Marksheet</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
