import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { X, Shield, GraduationCap, BookOpen, Users, KeyRound, Check, ArrowRight } from 'lucide-react';
import { UserRole } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { switchRole, loginUser, users } = useData();
  const [selectedRole, setSelectedRole] = useState<UserRole>('admin');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('maths123');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleQuickLogin = (role: UserRole) => {
    switchRole(role);
    onSuccess();
    onClose();
  };

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const success = loginUser(identifier.trim() || 'demo', selectedRole);
    if (success) {
      onSuccess();
      onClose();
    } else {
      setErrorMsg('Account not found for this role. Try the one-click demo credentials below.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-150">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 to-blue-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-white">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Portal Access Login</h3>
              <p className="text-xs text-slate-300">AVNEET MATHS HUB Management</p>
            </div>
          </div>
          <button
            id="close-login-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Quick Demo Access Pills */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
              1-Click Instant Demo Login (Choose Role):
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                id="quick-login-admin"
                onClick={() => handleQuickLogin('admin')}
                className="p-3 text-left rounded-xl border border-amber-200 bg-amber-50/60 hover:bg-amber-100/80 transition-all group"
              >
                <div className="flex items-center gap-2 font-bold text-xs text-amber-900">
                  <Shield className="w-4 h-4 text-amber-600" />
                  <span>Admin / Owner</span>
                </div>
                <p className="text-[11px] text-amber-700 mt-1 font-medium">Mr. Avneet Chauhan</p>
              </button>

              <button
                type="button"
                id="quick-login-teacher"
                onClick={() => handleQuickLogin('teacher')}
                className="p-3 text-left rounded-xl border border-blue-200 bg-blue-50/60 hover:bg-blue-100/80 transition-all group"
              >
                <div className="flex items-center gap-2 font-bold text-xs text-blue-900">
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                  <span>Teacher</span>
                </div>
                <p className="text-[11px] text-blue-700 mt-1 font-medium">Class Management</p>
              </button>

              <button
                type="button"
                id="quick-login-student"
                onClick={() => handleQuickLogin('student')}
                className="p-3 text-left rounded-xl border border-emerald-200 bg-emerald-50/60 hover:bg-emerald-100/80 transition-all group"
              >
                <div className="flex items-center gap-2 font-bold text-xs text-emerald-900">
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  <span>Student Portal</span>
                </div>
                <p className="text-[11px] text-emerald-700 mt-1 font-medium">Aarav (Class 10-A)</p>
              </button>

              <button
                type="button"
                id="quick-login-parent"
                onClick={() => handleQuickLogin('parent')}
                className="p-3 text-left rounded-xl border border-purple-200 bg-purple-50/60 hover:bg-purple-100/80 transition-all group"
              >
                <div className="flex items-center gap-2 font-bold text-xs text-purple-900">
                  <Users className="w-4 h-4 text-purple-600" />
                  <span>Parent Portal</span>
                </div>
                <p className="text-[11px] text-purple-700 mt-1 font-medium">Mr. Rajesh Sharma</p>
              </button>
            </div>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="grow border-t border-slate-200"></div>
            <span className="shrink mx-4 text-slate-400 text-xs uppercase font-medium">or login manually</span>
            <div className="grow border-t border-slate-200"></div>
          </div>

          {/* Form */}
          <form onSubmit={handleManualLogin} className="space-y-4">
            {errorMsg && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Select Your Role</label>
              <select
                id="login-role-select"
                value={selectedRole}
                onChange={e => setSelectedRole(e.target.value as UserRole)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden bg-slate-50 font-medium"
              >
                <option value="admin">Super Admin / Owner (Mr. Avneet Chauhan)</option>
                <option value="teacher">Teacher (Class & Attendance)</option>
                <option value="student">Student (Timetable, DPP, Homework)</option>
                <option value="parent">Parent (Attendance, Marks, Timetable)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email or Phone Number</label>
              <input
                id="login-identifier-input"
                type="text"
                placeholder="e.g. +91 9528665136 or student email"
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
              <input
                id="login-password-input"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

            <button
              type="submit"
              id="login-submit-btn"
              className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Sign In to Coaching Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="text-center text-[11px] text-slate-400">
            Avneet Maths Hub • Rohalki Kishanpur, Bahadrabad (PIN: 249402)
          </p>
        </div>
      </div>
    </div>
  );
};
