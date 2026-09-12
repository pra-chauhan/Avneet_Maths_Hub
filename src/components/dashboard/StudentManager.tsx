import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Student, ClassLevel, StudentStatus } from '../../types';
import {
  Users,
  Search,
  Plus,
  Edit2,
  Trash2,
  Phone,
  MessageSquare,
  Eye,
  XCircle,
  CheckCircle,
  Filter,
  Calendar,
  BookOpen,
} from 'lucide-react';

export const StudentManager: React.FC = () => {
  const { students, batches, addStudent, updateStudent, deleteStudent } = useData();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState<number | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [viewingProfile, setViewingProfile] = useState<Student | null>(null);

  // Form fields
  const [studentId, setStudentId] = useState('');
  const [name, setName] = useState('');
  const [classLevel, setClassLevel] = useState<ClassLevel>(10);
  const [batchId, setBatchId] = useState(batches[0]?.id || '');
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [status, setStatus] = useState<StudentStatus>('Active');
  const [address, setAddress] = useState('Bahadrabad');
  const [notes, setNotes] = useState('');

  const filteredStudents = students.filter(st => {
    const sName = st.fullName || st.name || '';
    const matchesSearch =
      sName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      st.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      st.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      st.parentPhone.includes(searchTerm);

    const matchesClass = filterClass === 'all' || st.classLevel === filterClass;
    const matchesStatus = filterStatus === 'all' || st.status === filterStatus;

    return matchesSearch && matchesClass && matchesStatus;
  });

  const handleOpenAdd = () => {
    setEditingStudent(null);
    const newId = `AMH-2026-${String(students.length + 1).padStart(3, '0')}`;
    setStudentId(newId);
    setName('');
    setClassLevel(10);
    setBatchId(batches.find(b => b.classLevel === 10)?.id || batches[0]?.id || '');
    setParentName('');
    setParentPhone('+91 ');
    setStudentPhone('');
    setSchoolName('');
    setRollNumber(String(students.length + 1));
    setStatus('Active');
    setAddress('Bahadrabad');
    setNotes('');
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (st: Student) => {
    setEditingStudent(st);
    setStudentId(st.studentId);
    setName(st.fullName || st.name || '');
    setClassLevel(st.classLevel);
    setBatchId(st.batchId);
    setParentName(st.parentName);
    setParentPhone(st.parentPhone);
    setStudentPhone(st.studentPhone || '');
    setSchoolName(st.schoolName || '');
    setRollNumber(st.rollNumber);
    setStatus(st.status);
    setAddress(st.address || '');
    setNotes(st.notes || '');
    setIsAddModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !parentPhone.trim()) return;

    const batch = batches.find(b => b.id === batchId);
    const batchName = batch ? batch.name : 'Unassigned';

    if (editingStudent) {
      updateStudent(editingStudent.id, {
        name,
        classLevel,
        batchId,
        batchName,
        parentName,
        parentPhone,
        studentPhone,
        schoolName,
        rollNumber,
        status,
        address,
        notes,
      });
    } else {
      addStudent({
        studentId: studentId || `AMH-2026-${String(Date.now()).slice(-4)}`,
        name,
        classLevel,
        batchId,
        batchName,
        parentName,
        parentPhone,
        studentPhone,
        schoolName,
        rollNumber: rollNumber || String(students.length + 1),
        status,
        admissionDate: new Date().toISOString().split('T')[0],
        address,
        notes,
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
            <span className="p-2 rounded-xl bg-blue-100 text-blue-800">
              <Users className="w-5 h-5" />
            </span>
            <h2 className="text-2xl font-black text-slate-900 font-sans">
              Student Information & CRM
            </h2>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Total Enrolled: {students.length} students across Classes 7th to 12th.
          </p>
        </div>

        <button
          id="btn-add-new-student"
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Enroll New Student</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            id="search-student-input"
            placeholder="Search by name, roll number, ID, or parent phone..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            id="filter-student-class"
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

          <select
            id="filter-student-status"
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold bg-white"
          >
            <option value="all">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Trial">Trial</option>
            <option value="Pending Admission">Pending</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Student Name & ID</th>
                <th className="py-3.5 px-4">Class & Batch</th>
                <th className="py-3.5 px-4">Parent & Contact</th>
                <th className="py-3.5 px-4">Attendance</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No students match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredStudents.map(st => (
                  <tr key={st.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-sm">
                          {(st.fullName || st.name || '?').charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{st.fullName || st.name}</p>
                          <p className="text-[11px] text-slate-500">
                            ID: {st.studentId} • Roll: {st.rollNumber}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-800 block">Class {st.classLevel}th</span>
                      <span className="text-[11px] text-slate-500">{st.batchName}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="text-slate-800 font-medium">{st.parentName}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <a
                          href={`tel:${st.parentPhone}`}
                          className="text-slate-600 hover:text-blue-700 flex items-center gap-1 text-xs"
                        >
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{st.parentPhone}</span>
                        </a>
                        <a
                          href={`https://wa.me/${st.parentPhone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-emerald-700 hover:text-emerald-800 p-0.5"
                          title="WhatsApp Parent"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                        </a>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`font-bold text-xs ${
                          (st.attendancePercentage ?? 90) < 75
                            ? 'text-red-600'
                            : (st.attendancePercentage ?? 90) < 85
                            ? 'text-amber-600'
                            : 'text-emerald-600'
                        }`}
                      >
                        {st.attendancePercentage ?? 92}%
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                          st.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : st.status === 'Trial'
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {st.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          id={`btn-view-profile-${st.id}`}
                          onClick={() => setViewingProfile(st)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="View Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          id={`btn-edit-student-${st.id}`}
                          onClick={() => handleOpenEdit(st)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="Edit Student"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          id={`btn-delete-student-${st.id}`}
                          onClick={() => {
                            if (confirm(`Are you sure you want to remove ${st.name}?`)) {
                              deleteStudent(st.id);
                            }
                          }}
                          className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                          title="Delete Student"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: ADD / EDIT STUDENT */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 bg-blue-700 text-white flex items-center justify-between">
              <h3 className="font-bold text-base">
                {editingStudent ? 'Edit Student Record' : 'Enroll New Student'}
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 rounded-lg hover:bg-white/10">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Student ID *</label>
                  <input
                    type="text"
                    required
                    value={studentId}
                    onChange={e => setStudentId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm bg-slate-50"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Student Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aarav Sharma"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Class Level *</label>
                  <select
                    value={classLevel}
                    onChange={e => {
                      const lvl = Number(e.target.value) as ClassLevel;
                      setClassLevel(lvl);
                      const matchingBatch = batches.find(b => b.classLevel === lvl);
                      if (matchingBatch) setBatchId(matchingBatch.id);
                    }}
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

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Assigned Batch *</label>
                  <select
                    value={batchId}
                    onChange={e => setBatchId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm bg-white"
                  >
                    {batches.map(b => (
                      <option key={b.id} value={b.id}>
                        Class {b.classLevel}th - {b.name} ({b.timeSlot})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Parent / Guardian Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mr. Rajesh Sharma"
                    value={parentName}
                    onChange={e => setParentName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Parent Phone / WhatsApp *</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 9528665136"
                    value={parentPhone}
                    onChange={e => setParentPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Roll Number</label>
                  <input
                    type="text"
                    value={rollNumber}
                    onChange={e => setRollNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">School Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Delhi Public School"
                    value={schoolName}
                    onChange={e => setSchoolName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm bg-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Trial">Trial</option>
                    <option value="Pending Admission">Pending Admission</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Left">Left</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Residential Address / Area</label>
                <input
                  type="text"
                  placeholder="e.g. Rohalki Kishanpur, Bahadrabad"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Teacher Notes / Weak Topics</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Strong in Geometry, needs extra practice in Quadratic factorisation"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
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
                  id="save-student-btn"
                  className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold"
                >
                  {editingStudent ? 'Update Student' : 'Enroll Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: VIEW STUDENT PROFILE */}
      {viewingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
            <div className="px-6 py-5 bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/10 text-white font-bold text-lg flex items-center justify-center border border-white/20">
                  {(viewingProfile.fullName || viewingProfile.name || '?').charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-base">{viewingProfile.fullName || viewingProfile.name}</h3>
                  <p className="text-xs text-blue-200">
                    ID: {viewingProfile.studentId} • Roll No: {viewingProfile.rollNumber}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewingProfile(null)}
                className="p-1 rounded-lg hover:bg-white/10"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-500 block text-[11px]">Class & Batch:</span>
                  <span className="font-bold text-slate-900">
                    Class {viewingProfile.classLevel}th • {viewingProfile.batchName}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Attendance Record:</span>
                  <span className="font-bold text-emerald-600 text-sm">
                    {viewingProfile.attendancePercentage ?? 92}% Present
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Parent / Guardian:</span>
                  <span className="font-bold text-slate-900">{viewingProfile.parentName}</span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Parent Phone:</span>
                  <span className="font-semibold text-slate-900">{viewingProfile.parentPhone}</span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">School:</span>
                  <span className="text-slate-900">{viewingProfile.schoolName || 'Not specified'}</span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Address:</span>
                  <span className="text-slate-900">{viewingProfile.address || 'Bahadrabad'}</span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Admission Date:</span>
                  <span className="text-slate-900">{viewingProfile.admissionDate}</span>
                </div>
              </div>

              {viewingProfile.notes && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
                  <strong className="block mb-0.5">Faculty Remarks:</strong>
                  {viewingProfile.notes}
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                <a
                  href={`https://wa.me/${viewingProfile.parentPhone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(viewingProfile.parentName)},%20this%20is%20Avneet%20Maths%20Hub%20regarding%20${encodeURIComponent(viewingProfile.name)}.`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp Parent</span>
                </a>

                <button
                  onClick={() => setViewingProfile(null)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
