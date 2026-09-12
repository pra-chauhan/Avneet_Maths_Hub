import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Announcement, AnnouncementPriority, AnnouncementCategory, ClassLevel } from '../../types';
import {
  Bell,
  Plus,
  AlertTriangle,
  Calendar,
  Trash2,
  XCircle,
  Tag,
  Users,
} from 'lucide-react';

export const AnnouncementManager: React.FC = () => {
  const { announcements, addAnnouncement, deleteAnnouncement, batches, currentUser } = useData();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState<AnnouncementPriority>('Important');
  const [category, setCategory] = useState<AnnouncementCategory>('Important Notice');
  const [targetType, setTargetType] = useState<'All' | 'Specific Class' | 'Specific Batch'>('All');
  const [targetClass, setTargetClass] = useState<ClassLevel>(10);
  const [targetBatchId, setTargetBatchId] = useState('');

  const categories: AnnouncementCategory[] = [
    'Important Notice',
    'Holiday Notice',
    'Class Timing Change',
    'Mock Test Schedule',
    'Parent Teacher Meeting',
    'Fee Reminder',
    'General Circular',
  ];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    addAnnouncement({
      title: title.trim(),
      message: message.trim(),
      priority,
      category,
      targetRole: 'all',
      targetClass: targetType === 'Specific Class' ? targetClass : undefined,
      targetBatchId: targetType === 'Specific Batch' ? targetBatchId : undefined,
      authorName: 'Mr. Avneet Chauhan',
    });

    setIsAddModalOpen(false);
    setTitle('');
    setMessage('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <Bell className="w-5 h-5" />
            </span>
            <h2 className="text-2xl font-black text-slate-900 font-sans">
              Institute Announcements & Circulars
            </h2>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Broadcast offline class updates, timetable notices, holiday circulars, and test dates.
          </p>
        </div>

        {(currentUser.role === 'admin' || currentUser.role === 'teacher') && (
          <button
            id="btn-create-announcement"
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Post Announcement</span>
          </button>
        )}
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.map(ann => {
          const isUrgent = ann.priority === 'Urgent';
          const isImportant = ann.priority === 'Important';

          return (
            <div
              key={ann.id}
              id={`announcement-${ann.id}`}
              className={`rounded-2xl p-6 border transition-all ${
                isUrgent
                  ? 'bg-red-50/70 border-red-200 shadow-xs'
                  : isImportant
                  ? 'bg-amber-50/70 border-amber-200 shadow-xs'
                  : 'bg-white border-slate-200 shadow-xs'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${
                      isUrgent
                        ? 'bg-red-600 text-white'
                        : isImportant
                        ? 'bg-amber-600 text-white'
                        : 'bg-slate-800 text-white'
                    }`}
                  >
                    {ann.priority}
                  </span>

                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white text-slate-700 border border-slate-200">
                    {ann.category}
                  </span>

                  {ann.targetClass && (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                      Class {ann.targetClass}th
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(ann.createdAt).toLocaleDateString()}</span>
                  </div>

                  {(currentUser.role === 'admin' || currentUser.role === 'teacher') && (
                    <button
                      onClick={() => {
                        if (confirm('Delete this circular?')) deleteAnnouncement(ann.id);
                      }}
                      className="text-slate-400 hover:text-red-600 p-1"
                      title="Delete Notice"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <h3 className="text-lg font-bold text-slate-900 font-sans mb-2">{ann.title}</h3>
              <p className="text-sm text-slate-700 leading-relaxed">{ann.message}</p>

              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
                <span>By: {ann.authorName}</span>
                <span>Notice ID: {ann.id.toUpperCase()}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL: POST ANNOUNCEMENT */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 bg-blue-700 text-white flex items-center justify-between">
              <h3 className="font-bold text-base">Broadcast Notice to Students & Parents</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 rounded-lg hover:bg-white/10">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Notice Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Schedule Update for Class 10th Mock Test"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category *</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm bg-white font-medium"
                  >
                    {categories.map(c => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Priority *</label>
                  <select
                    value={priority}
                    onChange={e => setPriority(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm bg-white font-medium"
                  >
                    <option value="Normal">Normal</option>
                    <option value="Important">Important</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Audience</label>
                  <select
                    value={targetType}
                    onChange={e => setTargetType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm bg-white"
                  >
                    <option value="All">All Students & Parents</option>
                    <option value="Specific Class">Specific Class</option>
                    <option value="Specific Batch">Specific Batch</option>
                  </select>
                </div>

                {targetType === 'Specific Class' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Select Class</label>
                    <select
                      value={targetClass}
                      onChange={e => setTargetClass(Number(e.target.value) as ClassLevel)}
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
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Circular Message Content *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Type the full announcement message here..."
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
                  id="submit-broadcast-btn"
                  className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold"
                >
                  Broadcast Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
