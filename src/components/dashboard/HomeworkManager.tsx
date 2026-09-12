import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Homework, HomeworkSubmission, ClassLevel } from '../../types';
import { fileToBase64, formatFileSize, downloadFile } from '../../utils/fileHelpers';
import {
  BookOpen,
  Plus,
  Calendar,
  Clock,
  CheckCircle,
  FileText,
  UploadCloud,
  Eye,
  Edit2,
  Trash2,
  XCircle,
  Download,
  Star,
  Send,
  Filter,
} from 'lucide-react';

export const HomeworkManager: React.FC = () => {
  const {
    homeworkList,
    batches,
    students,
    addHomework,
    deleteHomework,
    gradeHomeworkSubmission,
    currentUser,
  } = useData();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewingHomework, setViewingHomework] = useState<Homework | null>(null);
  const [filterClass, setFilterClass] = useState<number | 'all'>('all');

  // New Homework state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [classLevel, setClassLevel] = useState<ClassLevel>(10);
  const [batchId, setBatchId] = useState(batches[0]?.id || '');
  const [chapter, setChapter] = useState('');
  const [topic, setTopic] = useState('');
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]
  );
  const [questions, setQuestions] = useState('');
  const [attachmentName, setAttachmentName] = useState('');
  const [attachmentData, setAttachmentData] = useState('');
  const [attachmentSize, setAttachmentSize] = useState<number>(0);
  const [priority, setPriority] = useState<'Normal' | 'High' | 'Mandatory'>('Mandatory');

  // Grade state
  const [selectedSubmission, setSelectedSubmission] = useState<HomeworkSubmission | null>(null);
  const [gradeScore, setGradeScore] = useState(5);
  const [gradeStatus, setGradeStatus] = useState<any>('Checked');
  const [teacherRemarks, setTeacherRemarks] = useState('');

  const filteredHomework = homeworkList.filter(hw => {
    if (filterClass === 'all') return true;
    return hw.classLevel === filterClass;
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await fileToBase64(file);
      setAttachmentName(file.name);
      setAttachmentData(base64);
      setAttachmentSize(file.size);
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const batch = batches.find(b => b.id === batchId);

    addHomework({
      title: title.trim(),
      description: description.trim(),
      classLevel,
      batchId,
      batchName: batch ? batch.name : `Class ${classLevel}th Batch`,
      chapter: chapter.trim() || 'Mathematics Chapter Practice',
      topic: topic.trim(),
      assignedDate: new Date().toISOString().split('T')[0],
      dueDate,
      questionsList: questions
        .split('\n')
        .map(q => q.trim())
        .filter(Boolean),
      priority,
      attachmentName,
      attachmentUrl: attachmentData,
      attachmentSize,
    });

    setIsAddModalOpen(false);
    setTitle('');
    setDescription('');
    setChapter('');
    setTopic('');
    setQuestions('');
    setAttachmentName('');
    setAttachmentData('');
  };

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubmission) return;

    gradeHomeworkSubmission(
      selectedSubmission.id,
      gradeStatus,
      teacherRemarks,
      gradeScore
    );

    // Update in local viewing modal
    if (viewingHomework) {
      setViewingHomework({
        ...viewingHomework,
        submissions: viewingHomework.submissions.map(sub =>
          sub.id === selectedSubmission.id
            ? {
                ...sub,
                status: gradeStatus,
                teacherRemarks,
                scoreRating: gradeScore,
                gradedAt: new Date().toISOString(),
              }
            : sub
        ),
      });
    }

    setSelectedSubmission(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-100 text-purple-800">
              <BookOpen className="w-5 h-5" />
            </span>
            <h2 className="text-2xl font-black text-slate-900 font-sans">
              Daily Homework & Problem Practice (DPP)
            </h2>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Assign homework tasks, track student submissions, and check mathematical steps.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            id="filter-hw-class"
            value={filterClass}
            onChange={e => setFilterClass(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold bg-white"
          >
            <option value="all">All Classes</option>
            <option value={7}>Class 7th</option>
            <option value={8}>Class 8th</option>
            <option value={9}>Class 9th</option>
            <option value={10}>Class 10th</option>
            <option value={11}>Class 11th</option>
            <option value={12}>Class 12th</option>
          </select>

          <button
            id="btn-assign-new-homework"
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Assign Homework</span>
          </button>
        </div>
      </div>

      {/* Homework Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHomework.map(hw => {
          const totalSubs = hw.submissions.length;
          const checkedSubs = hw.submissions.filter(s => s.status === 'Checked').length;

          return (
            <div
              key={hw.id}
              id={`hw-card-${hw.id}`}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-slate-900 text-white">
                    Class {hw.classLevel}th
                  </span>

                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                      hw.priority === 'Mandatory'
                        ? 'bg-red-50 text-red-700 border-red-200'
                        : 'bg-blue-50 text-blue-700 border-blue-200'
                    }`}
                  >
                    {hw.priority}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 font-sans">{hw.title}</h3>
                <p className="text-xs text-blue-700 font-semibold mt-0.5">{hw.chapter}</p>

                <p className="text-xs text-slate-600 mt-2 leading-relaxed line-clamp-3">
                  {hw.description}
                </p>

                {hw.attachmentName && (
                  <div className="mt-3 p-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700 truncate max-w-[180px]">
                      📎 {hw.attachmentName}
                    </span>
                    {hw.attachmentUrl && (
                      <button
                        onClick={() => downloadFile(hw.attachmentUrl!, hw.attachmentName!)}
                        className="text-blue-600 hover:text-blue-800 font-bold text-xs"
                      >
                        Download
                      </button>
                    )}
                  </div>
                )}

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Due: <strong>{hw.dueDate}</strong></span>
                  <span>Batch: <strong>{hw.batchName}</strong></span>
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
                  id={`btn-view-subs-${hw.id}`}
                  onClick={() => setViewingHomework(hw)}
                  className="flex-1 py-2 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Review Submissions ({totalSubs})</span>
                </button>

                <button
                  id={`btn-del-hw-${hw.id}`}
                  onClick={() => {
                    if (confirm('Delete this homework task?')) deleteHomework(hw.id);
                  }}
                  className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100"
                  title="Delete Homework"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL: ASSIGN NEW HOMEWORK */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 bg-blue-700 text-white flex items-center justify-between">
              <h3 className="font-bold text-base">Assign Mathematics Homework / DPP</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 rounded-lg hover:bg-white/10">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Homework Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DPP #08 - Quadratic Equations Nature of Roots"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Class *</label>
                  <select
                    value={classLevel}
                    onChange={e => setClassLevel(Number(e.target.value) as ClassLevel)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm bg-white font-medium"
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Chapter Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chapter 4: Quadratic Equations"
                    value={chapter}
                    onChange={e => setChapter(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                  />
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
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Instructions & Question List
                </label>
                <textarea
                  rows={4}
                  placeholder="Enter specific question numbers from NCERT or list practice problems here..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                />
              </div>

              {/* Real File Upload */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Attach Worksheet / DPP PDF or Question Image (Optional)
                </label>
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                  onChange={handleFileUpload}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
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
                  id="submit-create-homework"
                  className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold"
                >
                  Publish Homework
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: REVIEW SUBMISSIONS */}
      {viewingHomework && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">{viewingHomework.title}</h3>
                <p className="text-xs text-slate-300">
                  {viewingHomework.batchName} • Due: {viewingHomework.dueDate}
                </p>
              </div>
              <button onClick={() => setViewingHomework(null)} className="p-1 rounded-lg hover:bg-white/10">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              {viewingHomework.submissions.length === 0 ? (
                <div className="text-center py-10 text-slate-400">
                  <BookOpen className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No student submissions submitted yet.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {viewingHomework.submissions.map(sub => (
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
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : sub.status === 'Needs Improvement'
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : 'bg-blue-50 text-blue-700 border-blue-200'
                            }`}
                          >
                            {sub.status}
                          </span>

                          <button
                            onClick={() => {
                              setSelectedSubmission(sub);
                              setGradeScore(sub.scoreRating || 5);
                              setGradeStatus(sub.status || 'Checked');
                              setTeacherRemarks(sub.teacherRemarks || '');
                            }}
                            className="px-3 py-1 bg-slate-900 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors"
                          >
                            Review & Grade
                          </button>
                        </div>
                      </div>

                      {/* Student response note */}
                      {sub.submissionNotes && (
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                          <strong className="block text-slate-900 mb-0.5">Student Work Notes:</strong>
                          {sub.submissionNotes}
                        </div>
                      )}

                      {/* File attachment */}
                      {sub.attachmentName && (
                        <div className="flex items-center gap-2 text-xs">
                          <span className="font-semibold text-slate-600">Attachment:</span>
                          <span className="text-slate-800 font-medium">{sub.attachmentName}</span>
                          {sub.attachmentUrl && (
                            <button
                              onClick={() => downloadFile(sub.attachmentUrl!, sub.attachmentName!)}
                              className="text-blue-600 hover:underline font-bold"
                            >
                              Download Work PDF / Image
                            </button>
                          )}
                        </div>
                      )}

                      {/* Existing feedback if checked */}
                      {sub.teacherRemarks && (
                        <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900">
                          <span className="font-bold block">
                            Teacher Remarks (Rating: {sub.scoreRating}/5 ★):
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

      {/* SUB-MODAL: ENTER GRADE & REMARKS */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 bg-blue-700 text-white flex items-center justify-between">
              <h3 className="font-bold text-base">Grade: {selectedSubmission.studentName}</h3>
              <button onClick={() => setSelectedSubmission(null)} className="p-1 rounded-lg hover:bg-white/10">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGrade} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Evaluation Status *</label>
                <select
                  value={gradeStatus}
                  onChange={e => setGradeStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm bg-white"
                >
                  <option value="Checked">Checked & Approved</option>
                  <option value="Needs Improvement">Needs Improvement / Re-solve</option>
                  <option value="Pending">Pending Review</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Understanding Rating (1 to 5 Stars) *
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setGradeScore(star)}
                      className={`p-2 rounded-xl text-lg font-bold transition-all ${
                        gradeScore >= star
                          ? 'bg-amber-100 text-amber-600 scale-105'
                          : 'bg-slate-100 text-slate-300'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                  <span className="text-xs font-bold text-slate-700 ml-2">{gradeScore} / 5</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Teacher Remarks & Calculation Feedback *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Accurate steps! Be careful when transposing negative signs in Step 3."
                  value={teacherRemarks}
                  onChange={e => setTeacherRemarks(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedSubmission(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="submit-grade-btn"
                  className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold"
                >
                  Save Feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
