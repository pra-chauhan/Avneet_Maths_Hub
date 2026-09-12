import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Enquiry, EnquiryStage, ClassLevel } from '../../types';
import {
  MessageSquare,
  Phone,
  Calendar,
  CheckCircle,
  Plus,
  ArrowRight,
  Sparkles,
  UserCheck,
  Clock,
  Trash2,
  XCircle,
} from 'lucide-react';

export const EnquiryCRM: React.FC = () => {
  const { enquiries, updateEnquiryStage, addEnquiryFollowUp, addEnquiry, deleteEnquiry, batches } =
    useData();

  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [followUpNote, setFollowUpNote] = useState('');
  const [nextFollowUpDate, setNextFollowUpDate] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New enquiry state
  const [studentName, setStudentName] = useState('');
  const [parentName, setParentName] = useState('');
  const [classLevel, setClassLevel] = useState<ClassLevel>(10);
  const [phone, setPhone] = useState('+91 ');
  const [message, setMessage] = useState('');

  const stages: EnquiryStage[] = [
    'New Enquiry',
    'Contacted',
    'Trial Scheduled',
    'Trial Completed',
    'Admission Confirmed',
    'Not Interested',
  ];

  const handleAddFollowUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEnquiry || !followUpNote.trim()) return;

    addEnquiryFollowUp(selectedEnquiry.id, followUpNote.trim(), nextFollowUpDate || undefined);
    setFollowUpNote('');
    setNextFollowUpDate('');
    setSelectedEnquiry(null);
  };

  const handleCreateEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !phone.trim()) return;

    addEnquiry({
      studentName: studentName.trim(),
      parentName: parentName.trim(),
      classLevel,
      phone: phone.trim(),
      message: message.trim(),
    });

    setIsAddModalOpen(false);
    setStudentName('');
    setParentName('');
    setMessage('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-100 text-blue-800">
              <MessageSquare className="w-5 h-5" />
            </span>
            <h2 className="text-2xl font-black text-slate-900 font-sans">
              Admission Enquiries & Lead Pipeline
            </h2>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Manage inquiries received via website, phone, and walk-ins. Track conversion funnel to offline admission.
          </p>
        </div>

        <button
          id="btn-add-manual-enquiry"
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Log New Inquiry</span>
        </button>
      </div>

      {/* Kanban Pipeline Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 overflow-x-auto pb-4">
        {stages.map(stage => {
          const stageEnquiries = enquiries.filter(e => e.stage === stage);

          return (
            <div
              key={stage}
              className="bg-slate-50/80 rounded-2xl p-3 border border-slate-200 min-w-[240px] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-200 mb-3">
                  <h4 className="font-bold text-xs text-slate-800 tracking-tight">{stage}</h4>
                  <span className="px-2 py-0.5 rounded-full bg-white text-[11px] font-bold text-slate-600 border border-slate-200">
                    {stageEnquiries.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {stageEnquiries.map(enq => (
                    <div
                      key={enq.id}
                      id={`enquiry-card-${enq.id}`}
                      className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-2xs hover:shadow-sm transition-all space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                          Class {enq.classLevel}th
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(enq.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div>
                        <h5 className="font-bold text-slate-900 text-xs">{enq.studentName}</h5>
                        <p className="text-[11px] text-slate-500">Parent: {enq.parentName}</p>
                      </div>

                      {enq.message && (
                        <p className="text-[11px] text-slate-600 italic line-clamp-2 bg-slate-50 p-1.5 rounded">
                          "{enq.message}"
                        </p>
                      )}

                      {/* Contact row */}
                      <div className="flex items-center justify-between gap-1 pt-1 border-t border-slate-100">
                        <a
                          href={`https://wa.me/${enq.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(enq.parentName)},%20this%20is%20Mr.%20Avneet%20Chauhan%20from%20Avneet%20Maths%20Hub%20Bahadrabad%20regarding%20your%20inquiry.`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded text-[10px] font-bold flex items-center gap-1 border border-emerald-200"
                        >
                          <MessageSquare className="w-3 h-3" />
                          <span>WhatsApp</span>
                        </a>

                        <button
                          onClick={() => setSelectedEnquiry(enq)}
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[10px] font-bold"
                        >
                          Update
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL: UPDATE ENQUIRY STAGE & FOLLOW-UP */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">{selectedEnquiry.studentName}</h3>
                <p className="text-xs text-slate-300">
                  Class {selectedEnquiry.classLevel}th • Parent: {selectedEnquiry.parentName}
                </p>
              </div>
              <button onClick={() => setSelectedEnquiry(null)} className="p-1 rounded-lg hover:bg-white/10">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddFollowUp} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Pipeline Stage *</label>
                <select
                  value={selectedEnquiry.stage}
                  onChange={e => {
                    const newStage = e.target.value as EnquiryStage;
                    updateEnquiryStage(selectedEnquiry.id, newStage);
                    setSelectedEnquiry({ ...selectedEnquiry, stage: newStage });
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm bg-white font-medium"
                >
                  {stages.map(st => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Add Follow-Up Note / Conversation Log *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Called parent. They agreed to attend 3-day trial this Thursday at 5:00 PM."
                  value={followUpNote}
                  onChange={e => setFollowUpNote(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Next Follow-up Date (Optional)
                </label>
                <input
                  type="date"
                  value={nextFollowUpDate}
                  onChange={e => setNextFollowUpDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                />
              </div>

              {/* Past follow-ups */}
              {selectedEnquiry.followUps && selectedEnquiry.followUps.length > 0 && (
                <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-2 max-h-32 overflow-y-auto">
                  <span className="font-bold text-slate-800 block">Previous Logs:</span>
                  {selectedEnquiry.followUps.map(fu => (
                    <div key={fu.id} className="border-b border-slate-200/60 pb-1 text-slate-600">
                      <span>{fu.notes}</span>
                      <span className="block text-[10px] text-slate-400">
                        {new Date(fu.date).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedEnquiry(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Close
                </button>
                <button
                  type="submit"
                  id="save-followup-btn"
                  className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold"
                >
                  Save Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: LOG NEW ENQUIRY */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 bg-blue-700 text-white flex items-center justify-between">
              <h3 className="font-bold text-base">Log Walk-In / Phone Inquiry</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 rounded-lg hover:bg-white/10">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEnquiry} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Student Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aman Negi"
                  value={studentName}
                  onChange={e => setStudentName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Parent Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mr. R. S. Negi"
                  value={parentName}
                  onChange={e => setParentName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Class *</label>
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
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 9528665136"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Inquiry Notes</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Came through poster in Bahadrabad. Interested in 10th board prep."
                  value={message}
                  onChange={e => setMessage(e.target.value)}
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
                  id="submit-enquiry-crm-btn"
                  className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold"
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
