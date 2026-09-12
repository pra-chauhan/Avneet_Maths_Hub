import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Batch, ClassLevel } from '../../types';
import {
  Layers,
  Plus,
  Users,
  Clock,
  MapPin,
  User,
  Calendar,
  Edit2,
  Trash2,
  XCircle,
  CheckCircle,
  Eye,
} from 'lucide-react';

export const BatchManager: React.FC = () => {
  const { batches, addBatch, updateBatch, deleteBatch, students } = useData();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null);
  const [viewingBatchStudents, setViewingBatchStudents] = useState<Batch | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [classLevel, setClassLevel] = useState<ClassLevel>(10);
  const [room, setRoom] = useState('Room 101');
  const [capacity, setCapacity] = useState(20);
  const [timeSlot, setTimeSlot] = useState('05:00 PM - 06:15 PM');
  const [teacher, setTeacher] = useState('Mr. Avneet Chauhan');
  const [selectedDays, setSelectedDays] = useState<string[]>(['Mon', 'Wed', 'Fri']);
  const [status, setStatus] = useState<'Active' | 'Upcoming' | 'Completed' | 'Archived'>('Active');

  const daysOptions = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const handleToggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleOpenAdd = () => {
    setEditingBatch(null);
    setName('');
    setClassLevel(10);
    setRoom('Room 101');
    setCapacity(20);
    setTimeSlot('05:00 PM - 06:15 PM');
    setSelectedDays(['Mon', 'Wed', 'Fri']);
    setStatus('Active');
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (batch: Batch) => {
    setEditingBatch(batch);
    setName(batch.name);
    setClassLevel(batch.classLevel);
    setRoom(batch.room);
    setCapacity(batch.capacity);
    setTimeSlot(batch.timeSlot);
    setSelectedDays(batch.scheduleDays);
    setStatus(batch.status);
    setIsAddModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingBatch) {
      updateBatch(editingBatch.id, {
        name,
        classLevel,
        room,
        capacity,
        timeSlot,
        teacher,
        scheduleDays: selectedDays,
        status,
      });
    } else {
      addBatch({
        name,
        classLevel,
        room,
        capacity,
        timeSlot,
        teacher,
        scheduleDays: selectedDays,
        status,
        startDate: new Date().toISOString().split('T')[0],
      });
    }

    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-100 text-indigo-800">
              <Layers className="w-5 h-5" />
            </span>
            <h2 className="text-2xl font-black text-slate-900 font-sans">
              Batch Management System
            </h2>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Create, modify, and monitor active classroom batches for Classes 7th to 12th.
          </p>
        </div>

        <button
          id="btn-add-new-batch"
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Batch</span>
        </button>
      </div>

      {/* Batches Table / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {batches.map(b => {
          const enrolled = students.filter(s => s.batchId === b.id);
          const seatsLeft = b.capacity - enrolled.length;

          return (
            <div
              key={b.id}
              id={`mgmt-batch-card-${b.id}`}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-slate-900 text-white">
                    Class {b.classLevel}th
                  </span>
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                      b.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {b.status}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 font-sans">{b.name}</h3>

                <div className="mt-4 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50">
                    <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                    <span className="font-semibold text-slate-800">{b.timeSlot}</span>
                  </div>

                  <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50">
                    <Calendar className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>{b.scheduleDays.join(', ')}</span>
                  </div>

                  <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50">
                    <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{b.room}</span>
                  </div>

                  <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50">
                    <User className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Faculty: <strong>{b.teacher}</strong></span>
                  </div>
                </div>

                {/* Capacity */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="flex justify-between text-xs text-slate-500 font-medium mb-1">
                    <span>Enrolled Strength</span>
                    <span className="font-bold text-slate-800">
                      {enrolled.length} / {b.capacity} Students
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        seatsLeft <= 3 ? 'bg-red-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, (enrolled.length / b.capacity) * 100)}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {seatsLeft > 0 ? `${seatsLeft} seats remaining` : 'Batch at maximum capacity'}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  id={`btn-view-students-batch-${b.id}`}
                  onClick={() => setViewingBatchStudents(b)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Students ({enrolled.length})</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    id={`btn-edit-batch-${b.id}`}
                    onClick={() => handleOpenEdit(b)}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit Batch"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    id={`btn-delete-batch-${b.id}`}
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete batch ${b.name}?`)) {
                        deleteBatch(b.id);
                      }
                    }}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Batch"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL: ADD / EDIT BATCH */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-base">
                {editingBatch ? 'Edit Batch Details' : 'Create New Mathematics Batch'}
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 rounded-lg hover:bg-white/10">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Batch Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Class 10th Evening Batch C"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Class *</label>
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
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Room / Hall</label>
                  <input
                    type="text"
                    value={room}
                    onChange={e => setRoom(e.target.value)}
                    placeholder="Room 101"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Maximum Capacity</label>
                  <input
                    type="number"
                    min={5}
                    max={40}
                    value={capacity}
                    onChange={e => setCapacity(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Time Slot *</label>
                  <input
                    type="text"
                    required
                    value={timeSlot}
                    onChange={e => setTimeSlot(e.target.value)}
                    placeholder="05:00 PM - 06:15 PM"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm bg-white font-medium"
                  >
                    <option value="Active">Active</option>
                    <option value="Upcoming">Upcoming</option>
                    <option value="Completed">Completed</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Schedule Days</label>
                <div className="flex flex-wrap gap-2">
                  {daysOptions.map(day => {
                    const isSelected = selectedDays.includes(day);
                    return (
                      <button
                        type="button"
                        key={day}
                        onClick={() => handleToggleDay(day)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                          isSelected
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Faculty Name</label>
                <input
                  type="text"
                  value={teacher}
                  onChange={e => setTeacher(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm bg-slate-50"
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
                  id="save-batch-btn"
                  className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold"
                >
                  {editingBatch ? 'Update Batch' : 'Create Batch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: VIEW ENROLLED STUDENTS */}
      {viewingBatchStudents && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">{viewingBatchStudents.name}</h3>
                <p className="text-xs text-slate-300">
                  Class {viewingBatchStudents.classLevel}th • {viewingBatchStudents.timeSlot}
                </p>
              </div>
              <button
                onClick={() => setViewingBatchStudents(null)}
                className="p-1 rounded-lg hover:bg-white/10"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              {(() => {
                const batchStudents = students.filter(s => s.batchId === viewingBatchStudents.id);
                if (batchStudents.length === 0) {
                  return (
                    <div className="text-center py-10 text-slate-400">
                      <Users className="w-10 h-10 mx-auto mb-2 opacity-30" />
                      <p className="text-sm">No students currently enrolled in this batch.</p>
                    </div>
                  );
                }

                return (
                  <div className="divide-y divide-slate-100">
                    {batchStudents.map(st => (
                      <div key={st.id} className="py-3 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-sm">
                            {st.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-900">{st.name}</h4>
                            <p className="text-xs text-slate-500">
                              Roll: {st.rollNumber} • Parent: {st.parentName} ({st.parentPhone})
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            {st.status}
                          </span>
                          <a
                            href={`https://wa.me/${st.parentPhone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200"
                          >
                            WhatsApp
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
