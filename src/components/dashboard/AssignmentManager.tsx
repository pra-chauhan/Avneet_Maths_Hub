import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Assignment, AssignmentSubmission, ClassLevel } from '../../types';
import { fileToBase64, formatFileSize, downloadFile } from '../../utils/fileHelpers';
import {
  FileCheck,
  Plus,
  Calendar,
  Clock,
  CheckCircle,
  Eye,
  Trash2,
  XCircle,
  Download,
  Save,
  Filter,
} from 'lucide-react';

export const AssignmentManager: React.FC = () => {
  const { assignments, batches, addAssignment, deleteAssignment, gradeAssignmentSubmission, currentUser } =
    useData();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewingAssignment, setViewingAssignment] = useState<Assignment | null>(null);
  const [filterClass, setFilterClass] = useState<number | 'all'>('all');

  // New assignment fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [classLevel, setClassLevel] = useState<ClassLevel>(10);
  const [batchId, setBatchId] = useState(batches[0]?.id || '');
  const [chapter, setChapter] = useState('');
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]
  );
  const [maxMarks, setMaxMarks] = useState(25);
  const [attachmentName, setAttachmentName] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [attachmentSize, setAttachmentSize] = useState(0);

  // Grade state
  const [selectedSub, setSelectedSub] = useState<AssignmentSubmission | null>(null);
  const [marksAwarded, setMarksAwarded] = useState(20);
  const [teacherRemarks, setTeacherRemarks] = useState('');

  const filteredAssignments = assignments.filter(a => {
    if (filterClass === 'all') return true;
    return a.classLevel === filterClass;
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await fileToBase64(file);
      setAttachmentName(file.name);
      setAttachmentUrl(base64);
      setAttachmentSize(file.size);
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const batch = batches.find(b => b.id === batchId);

    addAssignment({
      title: title.trim(),
      description: description.trim(),
      classLevel,
      batchId,
      batchName: batch ? batch.name : `Class ${classLevel}th Batch`,
      chapter: chapter.trim() || 'Mathematics Assessment Chapter',
      startDate: new Date().toISOString().split('T')[0],
      dueDate,
      maxMarks,
      attachmentName,
      attachmentUrl,
      attachmentSize,
      submissionRequired: true,
    });

    setIsAddModalOpen(false);
    setTitle('');
    setDescription('');
    setChapter('');
    setAttachmentName('');
    setAttachmentUrl('');
  };

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSub) return;

    gradeAssignmentSubmission(
      selectedSub.id,
      marksAwarded,
      teacherRemarks || 'Step-marking applied. Well attempted.'
    );

    if (viewingAssignment) {
      setViewingAssignment({
        ...viewingAssignment,
        submissions: viewingAssignment.submissions.map(s =>
          s.id === selectedSub.id
            ? {
                ...s,
                status: 'Checked',
                marksAwarded,
                teacherRemarks: teacherRemarks || 'Step-marking applied. Well attempted.',
                gradedAt: new Date().toISOString(),
              }
            : s
        ),
      });
    }

    setSelectedSub(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-100 text-indigo-800">
              <FileCheck className="w-5 h-5" />
            </span>
            <h2 className="text-2xl font-black text-slate-900 font-sans">
              Subjective Mathematics Assignments
            </h2>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Graded assignments, theorem derivations, step-marking evaluation, and feedback.
          </p>
        </div>

        <button
          id="btn-create-new-assignment"
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>New Assignment</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssignments.map(asg => {
          const totalSubs = asg.submissions.length;
          const checkedSubs = asg.submissions.filter(s => s.status === 'Checked').length;

          return (
            <div
              key={asg.id}
              id={`asg-card-${asg.id}`}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-slate-900 text-white">
                    Class {asg.classLevel}th
                  </span>

                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                    Max: {asg.maxMarks} Marks
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 font-sans">{asg.title}</h3>
                <p className="text-xs text-blue-700 font-semibold mt-0.5">{asg.chapter}</p>

                <p className="text-xs text-slate-600 mt-2 leading-relaxed line-clamp-3">
                  {asg.description}
                </p>

                {asg.attachmentName && (
                  <div className="mt-3 p-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700 truncate max-w-[180px]">
                      📎 {asg.attachmentName}
                    </span>
                    {asg.attachmentUrl && (
                      <button
                        onClick={() => downloadFile(asg.attachmentUrl!, asg.attachmentName!)}
                        className="text-blue-600 hover:text-blue-800 font-bold"
                      >
                        Download
                      </button>
                    )}
                  </div>
                )}

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Due: <strong>{asg.dueDate}</strong></span>
                  <span>Batch: <strong>{asg.batchName}</strong></span>
                </div>

                <div className="mt-2 p-2.5 bg-slate-50 rounded-xl text-xs flex items-center justify-between">
                  <span className="text-slate-600">Submissions Status:</span>
                  <span className="font-bold text-slate-900">
                    {checkedSubs} / {totalSubs} Checked
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  id={`btn-review-asg-subs-${asg.id}`}
                  onClick={() => setViewingAssignment(asg)}
                  className="flex-1 py-2 bg-slate-900 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Review Work ({totalSubs})</span>
                </button>

                <button
                  onClick={() => {
                    if (confirm('Delete this assignment?')) deleteAssignment(asg.id);
                  }}
                  className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100"
                  title="Delete Assignment"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL: CREATE ASSIGNMENT */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 bg-indigo-700 text-white flex items-center justify-between">
              <h3 className="font-bold text-base">Create Graded Mathematics Assignment</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 rounded-lg hover:bg-white/10">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Assignment Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Real Numbers - Fundamental Theorem of Arithmetic"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
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
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Chapter Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chapter 1: Real Numbers"
                    value={chapter}
                    onChange={e => setChapter(e.target.value)}
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
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Due Date *</label>
                <input
                  type="date"
                  required
                  value={dueDate}
                  onChange={e => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Assignment Details & Questions
                </label>
                <textarea
                  rows={3}
                  placeholder="State questions or problems to be completed in student notebooks..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Attach Assignment Sheet (Optional)
                </label>
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                  onChange={handleFileUpload}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
                {attachmentName && (
                  <p className="text-xs text-emerald-600 mt-1 font-semibold">
                    Attached: {attachmentName} ({formatFileSize(attachmentSize)})
                  </p>
                )}
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
                  id="submit-asg-btn"
                  className="px-5 py-2.5 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl text-xs font-bold"
                >
                  Assign to Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: VIEW SUBMISSIONS & GRADE */}
      {viewingAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">{viewingAssignment.title}</h3>
                <p className="text-xs text-slate-300">
                  {viewingAssignment.batchName} • Max: {viewingAssignment.maxMarks} Marks
                </p>
              </div>
              <button onClick={() => setViewingAssignment(null)} className="p-1 rounded-lg hover:bg-white/10">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              {viewingAssignment.submissions.length === 0 ? (
                <div className="text-center py-10 text-slate-400">
                  <FileCheck className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No assignment submissions yet.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {viewingAssignment.submissions.map(sub => (
                    <div key={sub.id} className="py-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">{sub.studentName}</h4>
                          <p className="text-[11px] text-slate-500">
                            Submitted on {new Date(sub.submittedAt).toLocaleString()}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                              sub.status === 'Checked'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : 'bg-blue-50 text-blue-800 border-blue-200'
                            }`}
                          >
                            {sub.status === 'Checked'
                              ? `Checked: ${sub.marksAwarded}/${viewingAssignment.maxMarks}`
                              : 'Pending Checking'}
                          </span>

                          <button
                            onClick={() => {
                              setSelectedSub(sub);
                              setMarksAwarded(sub.marksAwarded || Math.round(viewingAssignment.maxMarks * 0.8));
                              setTeacherRemarks(sub.teacherRemarks || '');
                            }}
                            className="px-3 py-1 bg-slate-900 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors"
                          >
                            Evaluate
                          </button>
                        </div>
                      </div>

                      {sub.submissionNotes && (
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                          <strong className="block text-slate-900 mb-0.5">Student Notes:</strong>
                          {sub.submissionNotes}
                        </div>
                      )}

                      {sub.attachmentName && (
                        <div className="flex items-center gap-2 text-xs">
                          <span className="font-semibold text-slate-600">Attached Answer Sheet:</span>
                          <span className="text-slate-800 font-medium">{sub.attachmentName}</span>
                          {sub.attachmentUrl && (
                            <button
                              onClick={() => downloadFile(sub.attachmentUrl!, sub.attachmentName!)}
                              className="text-blue-600 hover:underline font-bold"
                            >
                              Download File
                            </button>
                          )}
                        </div>
                      )}

                      {sub.teacherRemarks && (
                        <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900">
                          <span className="font-bold block">
                            Teacher Feedback ({sub.marksAwarded}/{viewingAssignment.maxMarks} Marks):
                          </span>
                          {sub.teacherRemarks}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUB-MODAL: GRADE ASSIGNMENT */}
      {selectedSub && viewingAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 bg-indigo-700 text-white flex items-center justify-between">
              <h3 className="font-bold text-base">Grade: {selectedSub.studentName}</h3>
              <button onClick={() => setSelectedSub(null)} className="p-1 rounded-lg hover:bg-white/10">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGrade} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Marks Awarded (Out of {viewingAssignment.maxMarks}) *
                </label>
                <input
                  type="number"
                  min={0}
                  max={viewingAssignment.maxMarks}
                  required
                  value={marksAwarded}
                  onChange={e => setMarksAwarded(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Teacher Evaluation Remarks *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Excellent step-by-step presentation! Proof of theorem is neat."
                  value={teacherRemarks}
                  onChange={e => setTeacherRemarks(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedSub(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="submit-asg-grade-btn"
                  className="px-5 py-2.5 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl text-xs font-bold"
                >
                  Save Marks & Grade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
