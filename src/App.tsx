import React, { useState } from 'react';
import { DataProvider, useData } from './context/DataContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LoginModal } from './components/LoginModal';
import { NotificationModal } from './components/NotificationModal';

// Public sections
import { HeroSection } from './components/public/HeroSection';
import { KeyBenefitsSection } from './components/public/KeyBenefitsSection';
import { ClassesSection } from './components/public/ClassesSection';
import { BatchesSection } from './components/public/BatchesSection';
import { TeacherSection } from './components/public/TeacherSection';
import { FreeTrialSection } from './components/public/FreeTrialSection';
import { NoticesSection } from './components/public/NoticesSection';
import { AboutSection } from './components/public/AboutSection';
import { ContactSection } from './components/public/ContactSection';

// Dashboard layout
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { ClassLevel, UserRole } from './types';
import { MessageSquare, Phone, Shield, ArrowUp, Sparkles, GraduationCap, BookOpen, Users } from 'lucide-react';

const MainApp: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    isLoginOpen,
    setIsLoginOpen,
    isNotificationsOpen,
    setIsNotificationsOpen,
    currentUser,
    switchRole,
  } = useData();

  const [activePublicSection, setActivePublicSection] = useState('home');
  const [trialPreselectedClass, setTrialPreselectedClass] = useState<ClassLevel>(10);
  const [trialPreselectedBatch, setTrialPreselectedBatch] = useState<string>('');

  const handleBookTrial = (classLevel: ClassLevel = 10, batchName: string = '') => {
    setCurrentView('public');
    setTrialPreselectedClass(classLevel);
    setTrialPreselectedBatch(batchName);
    const element = document.getElementById('free-trial');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans relative">
      {/* Floating Demo Persona Switcher Ribbon */}
      <aside aria-label="Demo role selector" className="fixed bottom-4 left-4 z-40 hidden sm:flex items-center gap-1.5 p-1.5 bg-slate-900/90 backdrop-blur-md rounded-2xl shadow-xl border border-slate-700 text-xs text-white">
        <span className="text-[10px] font-bold text-amber-300 uppercase px-2 tracking-wide">
          Live Demo Switch:
        </span>

        <button
          id="quick-demo-public"
          onClick={() => setCurrentView('public')}
          className={`px-2.5 py-1 rounded-xl font-bold transition-all ${
            currentView === 'public'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          Public Website
        </button>

        <button
          id="quick-demo-teacher"
          onClick={() => {
            switchRole('teacher');
            setCurrentView('dashboard');
          }}
          className={`px-2.5 py-1 rounded-xl font-bold flex items-center gap-1 transition-all ${
            currentView === 'dashboard' && currentUser.role === 'teacher'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Teacher / Admin</span>
        </button>

        <button
          id="quick-demo-student"
          onClick={() => {
            switchRole('student');
            setCurrentView('dashboard');
          }}
          className={`px-2.5 py-1 rounded-xl font-bold flex items-center gap-1 transition-all ${
            currentView === 'dashboard' && currentUser.role === 'student'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Student Portal</span>
        </button>

        <button
          id="quick-demo-parent"
          onClick={() => {
            switchRole('parent');
            setCurrentView('dashboard');
          }}
          className={`px-2.5 py-1 rounded-xl font-bold flex items-center gap-1 transition-all ${
            currentView === 'dashboard' && currentUser.role === 'parent'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Parent Portal</span>
        </button>
      </aside>

      {/* Floating Direct WhatsApp CTA to Teacher */}
      <a
        id="floating-whatsapp-btn"
        href="https://wa.me/919528665136?text=Hello%20Mr.%20Avneet%20Chauhan,%20I%20would%20like%20to%20inquire%20about%20mathematics%20offline%20coaching%20at%20Avneet%20Maths%20Hub,%20Bahadrabad."
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-4 right-4 z-40 p-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl shadow-xl flex items-center gap-2 transition-transform hover:scale-105 group border border-emerald-400/40"
        title="WhatsApp Teacher Mr. Avneet Chauhan (+91 9528665136)"
      >
        <MessageSquare className="w-5 h-5 fill-current" />
        <span className="text-xs font-bold hidden md:inline">
          Chat with Mr. Avneet Chauhan
        </span>
      </a>

      {currentView === 'public' ? (
        <>
          {/* Public Website Navbar */}
          <Navbar
            currentView={currentView}
            setCurrentView={setCurrentView}
            activePublicSection={activePublicSection}
            setActivePublicSection={setActivePublicSection}
            openLoginModal={() => setIsLoginOpen(true)}
            openNotificationModal={() => setIsNotificationsOpen(true)}
          />

          {/* Main Website Sections */}
          <main className="flex-1">
            <HeroSection
              onBookTrial={() => handleBookTrial(10)}
              onOpenPortal={() => setCurrentView('dashboard')}
            />
            <KeyBenefitsSection />
            <ClassesSection onSelectClassForTrial={lvl => handleBookTrial(lvl)} />
            <BatchesSection
              onSelectBatchForTrial={(lvl, batchName) => handleBookTrial(lvl, batchName)}
            />
            <TeacherSection onBookTrial={() => handleBookTrial(10)} />
            <FreeTrialSection
              preselectedClass={trialPreselectedClass}
              preselectedBatch={trialPreselectedBatch}
            />
            <NoticesSection />
            <AboutSection />
            <ContactSection />
          </main>

          {/* Public Footer */}
          <Footer onNavigate={id => setActivePublicSection(id)} />
        </>
      ) : (
        /* Management Dashboard View */
        <DashboardLayout />
      )}

      {/* Global Modals */}
      {isLoginOpen && <LoginModal onClose={() => setIsLoginOpen(false)} />}
      {isNotificationsOpen && <NotificationModal onClose={() => setIsNotificationsOpen(false)} />}
    </div>
  );
};

export default function App() {
  return (
    <DataProvider>
      <MainApp />
    </DataProvider>
  );
}
