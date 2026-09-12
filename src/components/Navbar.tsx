import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import {
  BookOpen,
  Phone,
  Bell,
  UserCheck,
  Shield,
  GraduationCap,
  Users,
  Menu,
  X,
  ExternalLink,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { UserRole } from '../types';

interface NavbarProps {
  currentView: 'public' | 'dashboard';
  setCurrentView: (view: 'public' | 'dashboard') => void;
  activePublicSection: string;
  setActivePublicSection: (section: string) => void;
  openLoginModal: () => void;
  openNotificationModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  activePublicSection,
  setActivePublicSection,
  openLoginModal,
  openNotificationModal,
}) => {
  const { currentUser, switchRole, notifications, isLoggedIn, logout } = useData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'classes', label: 'Classes 7th-12th' },
    { id: 'batches', label: 'Batches' },
    { id: 'why-us', label: 'Why Choose Us' },
    { id: 'teacher', label: 'Teacher' },
    { id: 'free-trial', label: '3-Day Free Trial' },
    { id: 'notices', label: 'Notices' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (sectionId: string) => {
    setCurrentView('public');
    setActivePublicSection(sectionId);
    setMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return { label: 'Admin / Owner', color: 'bg-amber-100 text-amber-800 border-amber-300', icon: Shield };
      case 'teacher':
        return { label: 'Teacher', color: 'bg-blue-100 text-blue-800 border-blue-300', icon: GraduationCap };
      case 'student':
        return { label: 'Student (Class 10)', color: 'bg-emerald-100 text-emerald-800 border-emerald-300', icon: BookOpen };
      case 'parent':
        return { label: 'Parent Portal', color: 'bg-purple-100 text-purple-800 border-purple-300', icon: Users };
    }
  };

  const currentRoleInfo = getRoleBadge(currentUser.role);
  const CurrentRoleIcon = currentRoleInfo.icon;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-xs">
      {/* Top emergency / notice ticker */}
      <div className="bg-slate-900 text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded text-[11px] font-semibold border border-emerald-500/30">
              OFFLINE COACHING
            </span>
            <span className="text-slate-300 hidden sm:inline">
              Rohalki Kishanpur, Bahadrabad (PIN: 249402) • Classes 7th to 12th
            </span>
            <span className="text-amber-300 font-medium sm:hidden">
              Classes 7th to 12th • Bahadrabad
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-300">
            <a
              id="top-phone-link"
              href="tel:+919528665136"
              className="flex items-center gap-1 hover:text-emerald-400 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>+91 9528665136</span>
            </a>
            <div className="hidden md:flex items-center gap-2 border-l border-slate-700 pl-3">
              <span className="text-slate-400 text-[11px]">Demo Role Switcher:</span>
              {(['admin', 'teacher', 'student', 'parent'] as UserRole[]).map(r => (
                <button
                  key={r}
                  id={`role-quick-${r}`}
                  onClick={() => {
                    switchRole(r);
                    setCurrentView('dashboard');
                  }}
                  className={`text-[11px] px-2 py-0.5 rounded capitalize transition-all ${
                    currentUser.role === r
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & Brand */}
          <div
            id="brand-logo-button"
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-700 via-indigo-800 to-slate-900 flex items-center justify-center text-white shadow-md shadow-blue-900/10 group-hover:scale-105 transition-transform">
              <span className="font-bold text-lg tracking-tighter">AMH</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 font-sans">
                  AVNEET MATHS HUB
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium tracking-normal hidden sm:block">
                “Empowering Minds, Building Futures!”
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map(item => (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  currentView === 'public' && activePublicSection === item.id
                    ? 'text-blue-700 bg-blue-50 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Notification Bell */}
            <button
              id="notification-bell-btn"
              onClick={openNotificationModal}
              className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Dashboard / Public view toggle button */}
            <button
              id="view-toggle-btn"
              onClick={() => setCurrentView(currentView === 'public' ? 'dashboard' : 'public')}
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-all shadow-xs ${
                currentView === 'dashboard'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'
                  : 'bg-gradient-to-r from-blue-700 to-indigo-700 text-white hover:opacity-95'
              }`}
            >
              {currentView === 'dashboard' ? (
                <>
                  <ExternalLink className="w-4 h-4" />
                  <span>Public Website</span>
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  <span className="hidden sm:inline">Coaching Portal</span>
                  <span className="sm:hidden">Portal</span>
                </>
              )}
            </button>

            {/* User role indicator & switcher dropdown */}
            <div className="relative">
              <button
                id="role-dropdown-btn"
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-all ${currentRoleInfo.color}`}
              >
                <CurrentRoleIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{currentRoleInfo.label}</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50">
                  <div className="px-3 py-2 border-b border-slate-100 mb-1">
                    <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-500">{currentUser.email}</p>
                  </div>

                  <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Switch Test Role:
                  </p>

                  <button
                    id="switch-admin-btn"
                    onClick={() => {
                      switchRole('admin');
                      setRoleDropdownOpen(false);
                      setCurrentView('dashboard');
                    }}
                    className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-slate-100 flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2 font-medium">
                      <Shield className="w-3.5 h-3.5 text-amber-600" /> Super Admin / Owner
                    </span>
                    {currentUser.role === 'admin' && <span className="text-emerald-600 font-bold">✓</span>}
                  </button>

                  <button
                    id="switch-teacher-btn"
                    onClick={() => {
                      switchRole('teacher');
                      setRoleDropdownOpen(false);
                      setCurrentView('dashboard');
                    }}
                    className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-slate-100 flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2 font-medium">
                      <GraduationCap className="w-3.5 h-3.5 text-blue-600" /> Teacher (Mr. Avneet)
                    </span>
                    {currentUser.role === 'teacher' && <span className="text-emerald-600 font-bold">✓</span>}
                  </button>

                  <button
                    id="switch-student-btn"
                    onClick={() => {
                      switchRole('student');
                      setRoleDropdownOpen(false);
                      setCurrentView('dashboard');
                    }}
                    className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-slate-100 flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2 font-medium">
                      <BookOpen className="w-3.5 h-3.5 text-emerald-600" /> Student (Aarav - Cl. 10)
                    </span>
                    {currentUser.role === 'student' && <span className="text-emerald-600 font-bold">✓</span>}
                  </button>

                  <button
                    id="switch-parent-btn"
                    onClick={() => {
                      switchRole('parent');
                      setRoleDropdownOpen(false);
                      setCurrentView('dashboard');
                    }}
                    className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-slate-100 flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2 font-medium">
                      <Users className="w-3.5 h-3.5 text-purple-600" /> Parent (Mr. Rajesh)
                    </span>
                    {currentUser.role === 'parent' && <span className="text-emerald-600 font-bold">✓</span>}
                  </button>

                  <div className="border-t border-slate-100 my-1 pt-1">
                    <button
                      id="open-login-modal-btn"
                      onClick={() => {
                        setRoleDropdownOpen(false);
                        openLoginModal();
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-blue-700 hover:bg-blue-50 rounded-lg font-medium"
                    >
                      Login with credentials...
                    </button>
                    {isLoggedIn && (
                      <button
                        id="logout-btn"
                        onClick={() => {
                          setRoleDropdownOpen(false);
                          logout();
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-lg font-medium"
                      >
                        Sign Out
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu hamburger */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-6 space-y-1 shadow-lg">
          <div className="grid grid-cols-2 gap-1 mb-3 pb-3 border-b border-slate-100">
            {navItems.map(item => (
              <button
                key={item.id}
                id={`mobile-nav-link-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`text-left px-3 py-2 rounded-lg text-sm font-medium ${
                  activePublicSection === item.id && currentView === 'public'
                    ? 'text-blue-700 bg-blue-50 font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              id="mobile-switch-view-btn"
              onClick={() => {
                setCurrentView(currentView === 'public' ? 'dashboard' : 'public');
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 bg-blue-700 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2"
            >
              <Shield className="w-4 h-4" />
              {currentView === 'public' ? 'Open Management Dashboard' : 'Open Public Website'}
            </button>

            <a
              id="mobile-call-link"
              href="tel:+919528665136"
              className="w-full py-2 bg-emerald-600 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" /> Call / WhatsApp (+91 9528665136)
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
