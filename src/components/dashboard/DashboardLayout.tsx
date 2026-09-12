import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Layers,
  BookOpen,
  CheckCircle,
  FileText,
  Award,
  Bell,
  Sparkles,
  MessageSquare,
  FileCheck,
  User,
  ArrowLeft,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react';

import { TeacherOverview } from './TeacherOverview';
import { BatchManager } from './BatchManager';
import { TimetableManager } from './TimetableManager';
import { StudentManager } from './StudentManager';
import { FreeTrialManager } from './FreeTrialManager';
import { AttendanceManager } from './AttendanceManager';
import { HomeworkManager } from './HomeworkManager';
import { AssignmentManager } from './AssignmentManager';
import { TestManager } from './TestManager';
import { StudyMaterialManager } from './StudyMaterialManager';
import { AnnouncementManager } from './AnnouncementManager';
import { EnquiryCRM } from './EnquiryCRM';
import { StudentPortal } from './StudentPortal';

export const DashboardLayout: React.FC = () => {
  const { currentUser, setCurrentUser, setCurrentView, unreadNotificationsCount, setIsNotificationsOpen } =
    useData();

  const [activeTab, setActiveTab] = useState<string>(
    currentUser.role === 'student' || currentUser.role === 'parent' ? 'student-portal' : 'overview'
  );
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const isStudentOrParent = currentUser.role === 'student' || currentUser.role === 'parent';

  // Navigation menu items
  const teacherNavItems = [
    { id: 'overview', label: 'Teacher Overview', icon: LayoutDashboard },
    { id: 'batches', label: 'Batches & Strength', icon: Layers },
    { id: 'timetable', label: 'Timetable & Rooms', icon: Calendar },
    { id: 'students', label: 'Student Admissions', icon: Users },
    { id: 'freetrials', label: '3-Day Free Trials', icon: Sparkles },
    { id: 'attendance', label: 'Daily Attendance', icon: CheckCircle },
    { id: 'homework', label: 'Homework & DPP', icon: BookOpen },
    { id: 'assignments', label: 'Subjective Assignments', icon: FileCheck },
    { id: 'tests', label: 'Tests & Marksheets', icon: Award },
    { id: 'materials', label: 'Study Material / Notes', icon: FileText },
    { id: 'announcements', label: 'Circulars & Notices', icon: Bell },
    { id: 'enquiries', label: 'Admission CRM Leads', icon: MessageSquare },
  ];

  const studentNavItems = [
    { id: 'student-portal', label: 'Student & Parent Portal', icon: User },
    { id: 'timetable', label: 'Class Timetable', icon: Calendar },
    { id: 'materials', label: 'Study Material & Notes', icon: FileText },
    { id: 'announcements', label: 'Institute Notices', icon: Bell },
  ];

  const navItems = isStudentOrParent ? studentNavItems : teacherNavItems;

  const renderActiveModule = () => {
    switch (activeTab) {
      case 'overview':
        return <TeacherOverview onNavigateTab={tabId => setActiveTab(tabId)} />;
      case 'batches':
        return <BatchManager />;
      case 'timetable':
        return <TimetableManager />;
      case 'students':
        return <StudentManager />;
      case 'freetrials':
        return <FreeTrialManager />;
      case 'attendance':
        return <AttendanceManager />;
      case 'homework':
        return <HomeworkManager />;
      case 'assignments':
        return <AssignmentManager />;
      case 'tests':
        return <TestManager />;
      case 'materials':
        return <StudyMaterialManager />;
      case 'announcements':
        return <AnnouncementManager />;
      case 'enquiries':
        return <EnquiryCRM />;
      case 'student-portal':
      default:
        return <StudentPortal />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Header Bar */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40">
        <div className="px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              className="lg:hidden p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800"
            >
              {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-700 flex items-center justify-center font-black text-amber-300 shadow-md">
                AMH
              </div>
              <div>
                <span className="font-black text-white text-base tracking-tight block leading-none">
                  AVNEET MATHS HUB
                </span>
                <span className="text-[10px] text-amber-400 font-semibold tracking-wide">
                  COACHING MANAGEMENT SYSTEM
                </span>
              </div>
            </div>
          </div>

          {/* Header Controls */}
          <div className="flex items-center gap-3">
            {/* Role Switcher Pill */}
            <div className="hidden sm:flex items-center bg-slate-800 rounded-xl p-1 border border-slate-700 text-xs">
              <button
                id="header-switch-teacher"
                onClick={() => {
                  setCurrentUser({
                    id: 'teacher-1',
                    name: 'Mr. Avneet Chauhan',
                    role: 'teacher',
                  });
                  setActiveTab('overview');
                }}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  currentUser.role === 'teacher' || currentUser.role === 'admin'
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Teacher/Admin
              </button>

              <button
                id="header-switch-student"
                onClick={() => {
                  setCurrentUser({
                    id: 'std-1',
                    name: 'Priyanshu Sharma',
                    role: 'student',
                    classLevel: 10,
                  });
                  setActiveTab('student-portal');
                }}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  currentUser.role === 'student'
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Student View
              </button>

              <button
                id="header-switch-parent"
                onClick={() => {
                  setCurrentUser({
                    id: 'parent-1',
                    name: 'Mr. R. K. Sharma (Parent)',
                    role: 'parent',
                  });
                  setActiveTab('student-portal');
                }}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  currentUser.role === 'parent'
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Parent View
              </button>
            </div>

            {/* Notification Bell */}
            <button
              id="header-bell-btn"
              onClick={() => setIsNotificationsOpen(true)}
              className="relative p-2 text-slate-300 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* Return to Public Website */}
            <button
              id="header-back-to-website"
              onClick={() => setCurrentView('public')}
              className="px-3.5 py-1.5 bg-blue-800 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors border border-blue-600 shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Public Website</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 ${
            isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* User Profile Card */}
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-700 text-white font-black flex items-center justify-center shadow-xs">
                {currentUser.name.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <span className="font-bold text-slate-900 text-xs sm:text-sm block truncate">
                  {currentUser.name}
                </span>
                <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-blue-800 px-1.5 py-0.2 rounded bg-blue-100">
                  {currentUser.role}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  id={`side-nav-${item.id}`}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileSidebarOpen(false);
                  }}
                  className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-3 transition-all ${
                    isActive
                      ? 'bg-blue-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Bottom Footer */}
          <div className="p-3 border-t border-slate-200 bg-slate-50 space-y-2">
            <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-[11px] text-blue-900">
              <span className="font-bold block">Offline Centre:</span>
              <p className="text-slate-600 truncate">Rohalki Kishanpur, Bahadrabad</p>
              <p className="text-slate-600 font-semibold mt-0.5">📞 +91 9528665136</p>
            </div>

            <button
              onClick={() => setCurrentView('public')}
              className="w-full py-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Exit to Public Website</span>
            </button>
          </div>
        </aside>

        {/* Backdrop for mobile */}
        {isMobileSidebarOpen && (
          <div
            onClick={() => setIsMobileSidebarOpen(false)}
            className="fixed inset-0 bg-black/40 z-20 lg:hidden backdrop-blur-2xs"
          />
        )}

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">{renderActiveModule()}</div>
        </main>
      </div>
    </div>
  );
};
