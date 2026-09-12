import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { StudyMaterial, StudyMaterialCategory, ClassLevel } from '../../types';
import { fileToBase64, formatFileSize, downloadFile } from '../../utils/fileHelpers';
import {
  FileText,
  Plus,
  Download,
  Search,
  Filter,
  Trash2,
  XCircle,
  UploadCloud,
  BookOpen,
  FileCheck,
  CheckCircle,
} from 'lucide-react';

export const StudyMaterialManager: React.FC = () => {
  const { studyMaterials, addStudyMaterial, deleteStudyMaterial, batches, currentUser } = useData();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterClass, setFilterClass] = useState<number | 'all'>('all');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<StudyMaterialCategory>('DPP');
  const [classLevel, setClassLevel] = useState<ClassLevel>(10);
  const [batchId, setBatchId] = useState('');
  const [chapter, setChapter] = useState('');
  const [topic, setTopic] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [fileSize, setFileSize] = useState(0);

  const categoriesList: StudyMaterialCategory[] = [
    'Notes',
    'DPP',
    'Worksheets',
    'Practice Sets',
    'Formula Sheets',
    'Previous Questions',
    'Mock Tests',
    'Revision Material',
  ];

  const filteredMaterials = studyMaterials.filter(m => {
    const matchesSearch =
      m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.chapter.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.topic.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = filterCategory === 'all' || m.category === filterCategory;
    const matchesClass = filterClass === 'all' || m.classLevel === filterClass;

    return matchesSearch && matchesCategory && matchesClass;
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await fileToBase64(file);
      setFileName(file.name);
      setFileUrl(base64);
      setFileSize(file.size);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !fileName) return;

    addStudyMaterial({
      title: title.trim(),
      description: description.trim(),
      category,
      classLevel,
      batchId: batchId || undefined,
      chapter: chapter.trim() || 'Mathematics Foundations',
      topic: topic.trim(),
      fileName,
      fileUrl,
      fileSize,
      fileType: fileName.split('.').pop() || 'pdf',
      uploadedBy: 'Mr. Avneet Chauhan',
      uploadDate: new Date().toISOString().split('T')[0],
      visibility: 'Specific Class',
      downloadCount: 0,
    });

    setIsAddModalOpen(false);
    setTitle('');
    setDescription('');
    setChapter('');
    setTopic('');
    setFileName('');
    setFileUrl('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <FileText className="w-5 h-5" />
            </span>
            <h2 className="text-2xl font-black text-slate-900 font-sans">
              Study Material & DPP Repository
            </h2>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Offline classroom notes, formula sheets, chapter DPPs, and board question banks.
          </p>
        </div>

        {(currentUser.role === 'admin' || currentUser.role === 'teacher') && (
          <button
            id="btn-upload-study-material"
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Upload New Material</span>
          </button>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            id="search-material-input"
            placeholder="Search by title, chapter (e.g. Quadratic Equations, Trigonometry)..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            id="filter-material-category"
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold bg-white"
          >
            <option value="all">All Categories</option>
            {categoriesList.map(cat => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            id="filter-material-class"
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
        </div>
      </div>

      {/* Materials Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMaterials.map(mat => (
          <div
            key={mat.id}
            id={`mat-card-${mat.id}`}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-blue-100 text-blue-800">
                  {mat.category}
                </span>

                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-900 text-white">
                  Class {mat.classLevel}th
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 font-sans">{mat.title}</h3>
              <p className="text-xs font-semibold text-blue-700 mt-1">{mat.chapter}</p>

              <p className="text-xs text-slate-600 mt-2 leading-relaxed line-clamp-2">
                {mat.description}
              </p>

              <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-slate-800 truncate max-w-[160px]">{mat.fileName}</p>
                  <p className="text-[11px] text-slate-400">
                    {formatFileSize(mat.fileSize)} • Added {mat.uploadDate}
                  </p>
                </div>
                <button
                  id={`btn-download-mat-${mat.id}`}
                  onClick={() => downloadFile(mat.fileUrl, mat.fileName)}
                  className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors shadow-2xs"
                  title="Download File"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span>Author: {mat.uploadedBy}</span>
              {(currentUser.role === 'admin' || currentUser.role === 'teacher') && (
                <button
                  onClick={() => {
                    if (confirm('Delete this material?')) deleteStudyMaterial(mat.id);
                  }}
                  className="text-red-500 hover:text-red-700 p-1"
                  title="Delete File"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* MODAL: UPLOAD STUDY MATERIAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 bg-emerald-700 text-white flex items-center justify-between">
              <h3 className="font-bold text-base">Upload Study Material / DPP</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 rounded-lg hover:bg-white/10">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Formula Master Sheet - Trigonometric Identities"
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
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm bg-white"
                  >
                    {categoriesList.map(cat => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
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
                  <label className="block text-xs font-bold text-slate-700 mb-1">Chapter Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chapter 8: Introduction to Trigonometry"
                    value={chapter}
                    onChange={e => setChapter(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Specific Topic</label>
                  <input
                    type="text"
                    placeholder="e.g. Complementary Angles & Identities"
                    value={topic}
                    onChange={e => setTopic(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Summary notes for students before taking the chapter test..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Choose File *</label>
                <input
                  type="file"
                  required
                  accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                  onChange={handleFileUpload}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                />
                {fileName && (
                  <p className="text-xs text-emerald-600 mt-1 font-semibold">
                    Selected: {fileName} ({formatFileSize(fileSize)})
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
                  id="submit-material-btn"
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs"
                >
                  Upload & Distribute
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
