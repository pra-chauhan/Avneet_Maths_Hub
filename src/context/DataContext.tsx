import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  User,
  UserRole,
  Batch,
  DailyClassSchedule,
  Student,
  Enquiry,
  EnquiryStage,
  FreeTrial,
  AttendanceRecord,
  AttendanceStatus,
  Homework,
  HomeworkSubmission,
  Assignment,
  AssignmentSubmission,
  StudyMaterial,
  Announcement,
  AppNotification,
  TestExam,
  TestResult,
  ClassLevel,
  EnquiryStatus,
  FreeTrialStatus,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_BATCHES,
  INITIAL_SCHEDULES,
  INITIAL_STUDENTS,
  INITIAL_ENQUIRIES,
  INITIAL_FREE_TRIALS,
  INITIAL_ATTENDANCE,
  INITIAL_HOMEWORK,
  INITIAL_HOMEWORK_SUBMISSIONS,
  INITIAL_ASSIGNMENTS,
  INITIAL_ASSIGNMENT_SUBMISSIONS,
  INITIAL_STUDY_MATERIALS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_TESTS,
  INITIAL_TEST_RESULTS,
} from '../data/mockData';

interface DataContextType {
  // Navigation & View State
  currentView: 'public' | 'dashboard';
  setCurrentView: (view: 'public' | 'dashboard') => void;
  isLoginOpen: boolean;
  setIsLoginOpen: (open: boolean) => void;
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;
  unreadNotificationsCount: number;

  // Auth & Role
  users: User[];
  currentUser: User;
  setCurrentUser: (user: User) => void;
  switchRole: (role: UserRole, userId?: string) => void;
  loginUser: (emailOrPhone: string, role: UserRole) => boolean;
  logout: () => void;
  isLoggedIn: boolean;

  // Batches
  batches: Batch[];
  addBatch: (batch: Omit<Batch, 'id' | 'enrolledCount' | 'enrolledStudentIds'>) => void;
  updateBatch: (id: string, updates: Partial<Batch>) => void;
  deleteBatch: (id: string) => void;

  // Timetable & Daily Schedule
  schedules: DailyClassSchedule[];
  timetable: (DailyClassSchedule & { dayOfWeek: string; timeSlot: string; chapterFocus: string; room: string })[];
  addSchedule: (schedule: Omit<DailyClassSchedule, 'id' | 'updatedAt'>) => void;
  updateSchedule: (id: string, updates: Partial<DailyClassSchedule>) => void;
  rescheduleClass: (id: string, newStartTime: string, newEndTime: string, reason: string) => void;
  deleteSchedule: (id: string) => void;

  // Students
  students: Student[];
  addStudent: (student: Omit<Student, 'id' | 'studentId'>) => string;
  updateStudent: (id: string, updates: Partial<Student>) => void;
  deleteStudent: (id: string) => void;

  // Enquiries CRM
  enquiries: Enquiry[];
  addEnquiry: (enquiry: Omit<Enquiry, 'id' | 'status' | 'createdAt'>) => void;
  updateEnquiryStatus: (id: string, status: EnquiryStatus, followUpDate?: string, notes?: string) => void;
  updateEnquiryStage: (id: string, stage: EnquiryStage) => void;
  addEnquiryFollowUp: (id: string, note: string, nextFollowUpDate?: string) => void;
  deleteEnquiry: (id: string) => void;

  // Free Trial System
  freeTrials: FreeTrial[];
  addFreeTrial: (trial: Omit<FreeTrial, 'id' | 'status' | 'day1Attended' | 'day2Attended' | 'day3Attended' | 'createdAt'>) => void;
  updateFreeTrialStatus: (id: string, status: FreeTrialStatus, assignedBatchId?: string, scheduledDate?: string, notes?: string) => void;
  toggleTrialAttendance: (id: string, day: 1 | 2 | 3, attended: boolean) => void;
  updateTrialAttendance: (id: string, day: 'day1' | 'day2' | 'day3' | 1 | 2 | 3, attended: boolean) => void;
  convertTrialToStudent: (trialId: string, batchId: string) => void;

  // Attendance
  attendanceRecords: AttendanceRecord[];
  attendances: AttendanceRecord[];
  markBatchAttendance: (batchId: string, classLevel: ClassLevel, date: string, records: { studentId: string; studentName: string; status: 'Present' | 'Absent' | 'Late'; remark?: string }[]) => void;
  markAttendance: (record: { studentId: string; batchId: string; date: string; status: AttendanceStatus; remarks?: string }) => void;
  markBulkAttendance: (records: { studentId: string; studentName?: string; batchId: string; date: string; status: AttendanceStatus; remarks?: string }[]) => void;
  getStudentAttendanceStats: (studentId: string) => { total: number; present: number; absent: number; late: number; percentage: number };

  // Homework
  homeworks: Homework[];
  homeworkList: (Homework & { submissions: HomeworkSubmission[]; questionsList: string[]; batchName?: string })[];
  homeworkSubmissions: HomeworkSubmission[];
  addHomework: (hw: Omit<Homework, 'id' | 'status'>) => void;
  updateHomework: (id: string, updates: Partial<Homework>) => void;
  deleteHomework: (id: string) => void;
  submitHomework: (homeworkId: string, studentId: string, studentName: string, text: string, attachmentName?: string, attachmentData?: string) => void;
  reviewHomeworkSubmission: (submissionId: string, status: 'Checked' | 'Needs Improvement', remarks: string, rating?: number) => void;
  gradeHomeworkSubmission: (submissionId: string, status: any, remarks: string, rating?: number) => void;

  // Assignments
  assignments: (Assignment & { submissions: AssignmentSubmission[]; batchName?: string })[];
  assignmentSubmissions: AssignmentSubmission[];
  addAssignment: (asg: Omit<Assignment, 'id'>) => void;
  updateAssignment: (id: string, updates: Partial<Assignment>) => void;
  deleteAssignment: (id: string) => void;
  submitAssignment: (assignmentId: string, studentId: string, studentName: string, text: string, attachmentName?: string, attachmentData?: string) => void;
  gradeAssignmentSubmission: (submissionId: string, marks: number, feedback: string) => void;

  // Study Material / DPP
  studyMaterials: StudyMaterial[];
  addStudyMaterial: (material: Omit<StudyMaterial, 'id' | 'uploadDate'>) => void;
  deleteStudyMaterial: (id: string) => void;

  // Announcements
  announcements: Announcement[];
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'createdAt'>) => void;
  deleteAnnouncement: (id: string) => void;

  // Notifications
  notifications: AppNotification[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  addNotification: (notif: Omit<AppNotification, 'id' | 'createdAt' | 'isRead'>) => void;

  // Tests & Exams
  tests: (TestExam & { results: TestResult[]; name: string; testDate: string; batchName?: string })[];
  testResults: TestResult[];
  addTest: (test: Omit<TestExam, 'id' | 'isCompleted'>) => void;
  updateTest: (id: string, updates: Partial<TestExam>) => void;
  deleteTest: (id: string) => void;
  recordTestResult: (result: Omit<TestResult, 'id'>) => void;
  recordBatchTestResults: (testId: string, results: { studentId: string; studentName: string; marksObtained: number; maxMarks: number; remark: string }[]) => void;
  recordTestResults: (testId: string, results: any[]) => void;

  // System
  resetToSampleData: () => void;
  exportDatabaseJSON: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'AMH_COACHING_V1_';

function getStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(STORAGE_KEY_PREFIX + key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error('Error loading storage key:', key, e);
    return defaultValue;
  }
}

function setStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.error('Error saving storage key:', key, e);
  }
}

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<'public' | 'dashboard'>(() => getStorage('CURRENT_VIEW', 'public'));
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const [users] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User>(() => getStorage('CURRENT_USER', INITIAL_USERS[0]));
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => getStorage('IS_LOGGED_IN', true));

  const [batches, setBatches] = useState<Batch[]>(() => getStorage('BATCHES', INITIAL_BATCHES));
  const [schedules, setSchedules] = useState<DailyClassSchedule[]>(() => getStorage('SCHEDULES', INITIAL_SCHEDULES));
  const [students, setStudents] = useState<Student[]>(() => getStorage('STUDENTS', INITIAL_STUDENTS));
  const [enquiries, setEnquiries] = useState<Enquiry[]>(() => getStorage('ENQUIRIES', INITIAL_ENQUIRIES));
  const [freeTrials, setFreeTrials] = useState<FreeTrial[]>(() => getStorage('FREE_TRIALS', INITIAL_FREE_TRIALS));
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => getStorage('ATTENDANCE', INITIAL_ATTENDANCE));
  const [homeworks, setHomeworks] = useState<Homework[]>(() => getStorage('HOMEWORK', INITIAL_HOMEWORK));
  const [homeworkSubmissions, setHomeworkSubmissions] = useState<HomeworkSubmission[]>(() => getStorage('HOMEWORK_SUBMISSIONS', INITIAL_HOMEWORK_SUBMISSIONS));
  const [assignments, setAssignments] = useState<Assignment[]>(() => getStorage('ASSIGNMENTS', INITIAL_ASSIGNMENTS));
  const [assignmentSubmissions, setAssignmentSubmissions] = useState<AssignmentSubmission[]>(() => getStorage('ASSIGNMENT_SUBMISSIONS', INITIAL_ASSIGNMENT_SUBMISSIONS));
  const [studyMaterials, setStudyMaterials] = useState<StudyMaterial[]>(() => getStorage('STUDY_MATERIALS', INITIAL_STUDY_MATERIALS));
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => getStorage('ANNOUNCEMENTS', INITIAL_ANNOUNCEMENTS));
  const [notifications, setNotifications] = useState<AppNotification[]>(() => getStorage('NOTIFICATIONS', INITIAL_NOTIFICATIONS));
  const [tests, setTests] = useState<TestExam[]>(() => getStorage('TESTS', INITIAL_TESTS));
  const [testResults, setTestResults] = useState<TestResult[]>(() => getStorage('TEST_RESULTS', INITIAL_TEST_RESULTS));

  // Sync to storage
  useEffect(() => { setStorage('CURRENT_VIEW', currentView); }, [currentView]);
  useEffect(() => { setStorage('CURRENT_USER', currentUser); }, [currentUser]);
  useEffect(() => { setStorage('IS_LOGGED_IN', isLoggedIn); }, [isLoggedIn]);
  useEffect(() => { setStorage('BATCHES', batches); }, [batches]);
  useEffect(() => { setStorage('SCHEDULES', schedules); }, [schedules]);
  useEffect(() => { setStorage('STUDENTS', students); }, [students]);
  useEffect(() => { setStorage('ENQUIRIES', enquiries); }, [enquiries]);
  useEffect(() => { setStorage('FREE_TRIALS', freeTrials); }, [freeTrials]);
  useEffect(() => { setStorage('ATTENDANCE', attendanceRecords); }, [attendanceRecords]);
  useEffect(() => { setStorage('HOMEWORK', homeworks); }, [homeworks]);
  useEffect(() => { setStorage('HOMEWORK_SUBMISSIONS', homeworkSubmissions); }, [homeworkSubmissions]);
  useEffect(() => { setStorage('ASSIGNMENTS', assignments); }, [assignments]);
  useEffect(() => { setStorage('ASSIGNMENT_SUBMISSIONS', assignmentSubmissions); }, [assignmentSubmissions]);
  useEffect(() => { setStorage('STUDY_MATERIALS', studyMaterials); }, [studyMaterials]);
  useEffect(() => { setStorage('ANNOUNCEMENTS', announcements); }, [announcements]);
  useEffect(() => { setStorage('NOTIFICATIONS', notifications); }, [notifications]);
  useEffect(() => { setStorage('TESTS', tests); }, [tests]);
  useEffect(() => { setStorage('TEST_RESULTS', testResults); }, [testResults]);

  // Auth
  const switchRole = (role: UserRole, userId?: string) => {
    let target = users.find(u => u.role === role);
    if (userId) {
      const specific = users.find(u => u.id === userId);
      if (specific) target = specific;
    }
    if (target) {
      setCurrentUser(target);
      setIsLoggedIn(true);
    }
  };

  const loginUser = (emailOrPhone: string, role: UserRole): boolean => {
    const found = users.find(
      u => (u.email.toLowerCase() === emailOrPhone.toLowerCase() || u.phone === emailOrPhone) && u.role === role
    );
    if (found) {
      setCurrentUser(found);
      setIsLoggedIn(true);
      return true;
    }
    // Fallback: match by role
    const fallback = users.find(u => u.role === role);
    if (fallback) {
      setCurrentUser(fallback);
      setIsLoggedIn(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsLoggedIn(false);
  };

  // Notification helper
  const addNotification = (notif: Omit<AppNotification, 'id' | 'createdAt' | 'isRead'>) => {
    const newNotif: AppNotification = {
      ...notif,
      id: 'notif-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5),
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Batches
  const addBatch = (batch: Omit<Batch, 'id' | 'enrolledCount' | 'enrolledStudentIds'>) => {
    const newBatch: Batch = {
      ...batch,
      id: 'batch-' + Date.now().toString().slice(-4),
      enrolledCount: 0,
      enrolledStudentIds: [],
    };
    setBatches(prev => [...prev, newBatch]);
  };

  const updateBatch = (id: string, updates: Partial<Batch>) => {
    setBatches(prev => prev.map(b => (b.id === id ? { ...b, ...updates } : b)));
  };

  const deleteBatch = (id: string) => {
    setBatches(prev => prev.filter(b => b.id !== id));
  };

  // Timetable
  const addSchedule = (schedule: Omit<DailyClassSchedule, 'id' | 'updatedAt'>) => {
    const newSchedule: DailyClassSchedule = {
      ...schedule,
      id: 'sch-' + Date.now().toString().slice(-4),
      updatedAt: new Date().toISOString(),
    };
    setSchedules(prev => [newSchedule, ...prev]);
  };

  const updateSchedule = (id: string, updates: Partial<DailyClassSchedule>) => {
    setSchedules(prev => prev.map(s => (s.id === id ? { ...s, ...updates, updatedAt: new Date().toISOString() } : s)));
  };

  const rescheduleClass = (id: string, newStartTime: string, newEndTime: string, reason: string) => {
    setSchedules(prev =>
      prev.map(s => {
        if (s.id === id) {
          const original = s.originalTime || `${s.startTime} - ${s.endTime}`;
          const updated: DailyClassSchedule = {
            ...s,
            startTime: newStartTime,
            endTime: newEndTime,
            originalTime: original,
            status: 'Rescheduled',
            rescheduleReason: reason,
            updatedAt: new Date().toISOString(),
          };

          // Automatically push notification to batch students & parents
          addNotification({
            targetRole: 'student',
            title: `Class Rescheduled: ${s.batchName}`,
            message: `Today's ${s.subject} class is moved to ${newStartTime} - ${newEndTime}. Note: ${reason}`,
            type: 'timetable',
            linkTab: 'timetable',
          });

          addNotification({
            targetRole: 'parent',
            title: `Class Timing Updated for ${s.batchName}`,
            message: `Class session will be held at ${newStartTime}. Reason: ${reason}`,
            type: 'timetable',
            linkTab: 'timetable',
          });

          return updated;
        }
        return s;
      })
    );
  };

  const deleteSchedule = (id: string) => {
    setSchedules(prev => prev.filter(s => s.id !== id));
  };

  // Students
  const addStudent = (student: Omit<Student, 'id' | 'studentId'>): string => {
    const count = students.length + 1;
    const studentIdCode = `AMH-2026-${String(count).padStart(3, '0')}`;
    const newStudent: Student = {
      ...student,
      id: 'std-' + Date.now().toString().slice(-4),
      studentId: studentIdCode,
    };
    setStudents(prev => [...prev, newStudent]);

    // Update batch enrolled count
    if (student.batchId) {
      setBatches(prev =>
        prev.map(b =>
          b.id === student.batchId
            ? {
                ...b,
                enrolledCount: b.enrolledCount + 1,
                enrolledStudentIds: [...b.enrolledStudentIds, newStudent.id],
              }
            : b
        )
      );
    }
    return newStudent.id;
  };

  const updateStudent = (id: string, updates: Partial<Student>) => {
    setStudents(prev => prev.map(s => (s.id === id ? { ...s, ...updates } : s)));
  };

  const deleteStudent = (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
  };

  // Enquiries CRM
  const addEnquiry = (enquiry: Omit<Enquiry, 'id' | 'status' | 'createdAt'>) => {
    const newEnquiry: Enquiry = {
      ...enquiry,
      id: 'enq-' + Date.now().toString().slice(-4),
      status: 'New Enquiries',
      createdAt: new Date().toISOString(),
    };
    setEnquiries(prev => [newEnquiry, ...prev]);

    addNotification({
      targetRole: 'admin',
      title: 'New Admission Enquiry',
      message: `${enquiry.studentName} (Class ${enquiry.classLevel}) submitted an inquiry from ${enquiry.phone}.`,
      type: 'trial',
      linkTab: 'crm',
    });
  };

  const updateEnquiryStatus = (id: string, status: EnquiryStatus, followUpDate?: string, notes?: string) => {
    setEnquiries(prev =>
      prev.map(e =>
        e.id === id
          ? {
              ...e,
              status,
              ...(followUpDate ? { followUpDate } : {}),
              ...(notes ? { notes } : {}),
            }
          : e
      )
    );
  };

  // Free Trial System
  const addFreeTrial = (trial: Omit<FreeTrial, 'id' | 'status' | 'day1Attended' | 'day2Attended' | 'day3Attended' | 'createdAt'>) => {
    const newTrial: FreeTrial = {
      ...trial,
      id: 'trial-' + Date.now().toString().slice(-4),
      status: 'New',
      day1Attended: false,
      day2Attended: false,
      day3Attended: false,
      createdAt: new Date().toISOString(),
    };
    setFreeTrials(prev => [newTrial, ...prev]);

    addNotification({
      targetRole: 'admin',
      title: '3-Day Free Trial Booked!',
      message: `${trial.studentName} booked 3-Day Free Trial for Class ${trial.classLevel}. Phone: ${trial.phone}`,
      type: 'trial',
      linkTab: 'trials',
    });
  };

  const updateFreeTrialStatus = (id: string, status: FreeTrialStatus, assignedBatchId?: string, scheduledDate?: string, notes?: string) => {
    setFreeTrials(prev =>
      prev.map(t =>
        t.id === id
          ? {
              ...t,
              status,
              ...(assignedBatchId ? { assignedBatchId } : {}),
              ...(scheduledDate ? { scheduledDate } : {}),
              ...(notes ? { adminNotes: notes } : {}),
            }
          : t
      )
    );
  };

  const toggleTrialAttendance = (id: string, day: 1 | 2 | 3, attended: boolean) => {
    setFreeTrials(prev =>
      prev.map(t => {
        if (t.id === id) {
          const updated = {
            ...t,
            ...(day === 1 ? { day1Attended: attended } : {}),
            ...(day === 2 ? { day2Attended: attended } : {}),
            ...(day === 3 ? { day3Attended: attended } : {}),
          };
          if (updated.day1Attended && updated.day2Attended && updated.day3Attended && updated.status !== 'Converted') {
            updated.status = 'Completed';
          }
          return updated;
        }
        return t;
      })
    );
  };

  const convertTrialToStudent = (trialId: string, batchId: string) => {
    const trial = freeTrials.find(t => t.id === trialId);
    if (!trial) return;

    addStudent({
      fullName: trial.studentName,
      dob: '2011-01-01',
      gender: 'Male',
      classLevel: trial.classLevel,
      batchId: batchId || trial.assignedBatchId || 'batch-10a',
      parentName: trial.parentName,
      parentPhone: trial.phone,
      studentPhone: trial.phone,
      whatsApp: trial.whatsApp || trial.phone,
      email: `${trial.studentName.toLowerCase().replace(/\s+/g, '')}@example.com`,
      address: 'Bahadrabad, Haridwar',
      admissionDate: new Date().toISOString().split('T')[0],
      schoolName: 'Local School',
      rollNumber: `${trial.classLevel}-${Math.floor(Math.random() * 80 + 10)}`,
      status: 'Active',
      notes: 'Successfully converted from 3-Day Free Trial.',
    });

    updateFreeTrialStatus(trialId, 'Converted');
  };

  // Attendance
  const markBatchAttendance = (
    batchId: string,
    classLevel: ClassLevel,
    date: string,
    records: { studentId: string; studentName: string; status: 'Present' | 'Absent' | 'Late'; remark?: string }[]
  ) => {
    const newRecords: AttendanceRecord[] = records.map(r => ({
      id: 'att-' + Date.now() + '-' + r.studentId,
      batchId,
      classLevel,
      date,
      studentId: r.studentId,
      studentName: r.studentName,
      status: r.status,
      remark: r.remark,
      markedAt: new Date().toISOString(),
    }));

    // Remove existing records for this batch on this date, then add new ones
    setAttendanceRecords(prev => {
      const filtered = prev.filter(a => !(a.batchId === batchId && a.date === date));
      return [...newRecords, ...filtered];
    });

    // Notify for any absent student
    records.forEach(r => {
      if (r.status === 'Absent') {
        addNotification({
          targetRole: 'parent',
          title: `Attendance Alert: ${r.studentName}`,
          message: `${r.studentName} was marked ABSENT on ${date} for offline Mathematics class.`,
          type: 'attendance',
          linkTab: 'attendance',
        });
      }
    });
  };

  const getStudentAttendanceStats = (studentId: string) => {
    const studentRecords = attendanceRecords.filter(a => a.studentId === studentId);
    const total = studentRecords.length;
    if (total === 0) return { total: 0, present: 0, absent: 0, late: 0, percentage: 100 };
    const present = studentRecords.filter(a => a.status === 'Present').length;
    const absent = studentRecords.filter(a => a.status === 'Absent').length;
    const late = studentRecords.filter(a => a.status === 'Late').length;
    const percentage = Math.round(((present + late * 0.5) / total) * 1000) / 10;
    return { total, present, absent, late, percentage };
  };

  // Homework
  const addHomework = (hw: Omit<Homework, 'id' | 'status'>) => {
    const newHw: Homework = {
      ...hw,
      id: 'hw-' + Date.now().toString().slice(-4),
      status: 'Active',
    };
    setHomeworks(prev => [newHw, ...prev]);

    addNotification({
      targetRole: 'student',
      title: `New Homework Assigned: ${hw.chapter}`,
      message: `${hw.title} has been assigned for Class ${hw.classLevel}. Due: ${hw.dueDate}`,
      type: 'homework',
      linkTab: 'homework',
    });
  };

  const updateHomework = (id: string, updates: Partial<Homework>) => {
    setHomeworks(prev => prev.map(h => (h.id === id ? { ...h, ...updates } : h)));
  };

  const deleteHomework = (id: string) => {
    setHomeworks(prev => prev.filter(h => h.id !== id));
  };

  const submitHomework = (
    homeworkId: string,
    studentId: string,
    studentName: string,
    text: string,
    attachmentName?: string,
    attachmentData?: string
  ) => {
    const existing = homeworkSubmissions.find(s => s.homeworkId === homeworkId && s.studentId === studentId);
    if (existing) {
      setHomeworkSubmissions(prev =>
        prev.map(s =>
          s.id === existing.id
            ? {
                ...s,
                status: 'Submitted',
                submittedAt: new Date().toISOString(),
                submissionText: text,
                attachmentName: attachmentName || s.attachmentName,
                attachmentData: attachmentData || s.attachmentData,
              }
            : s
        )
      );
    } else {
      const newSubmission: HomeworkSubmission = {
        id: 'sub-' + Date.now().toString().slice(-4),
        homeworkId,
        studentId,
        studentName,
        status: 'Submitted',
        submittedAt: new Date().toISOString(),
        submissionText: text,
        attachmentName,
        attachmentData,
      };
      setHomeworkSubmissions(prev => [newSubmission, ...prev]);
    }
  };

  const reviewHomeworkSubmission = (
    submissionId: string,
    status: 'Checked' | 'Needs Improvement',
    remarks: string,
    rating?: number
  ) => {
    setHomeworkSubmissions(prev =>
      prev.map(s =>
        s.id === submissionId
          ? {
              ...s,
              status,
              teacherRemarks: remarks,
              rating,
            }
          : s
      )
    );
  };

  // Assignments
  const addAssignment = (asg: Omit<Assignment, 'id'>) => {
    const newAsg: Assignment = {
      ...asg,
      id: 'asg-' + Date.now().toString().slice(-4),
    };
    setAssignments(prev => [newAsg, ...prev]);

    addNotification({
      targetRole: 'student',
      title: `New Assignment: ${asg.chapter}`,
      message: `${asg.title} is published. Max Marks: ${asg.maxMarks}. Due: ${asg.dueDate}`,
      type: 'assignment',
      linkTab: 'assignments',
    });
  };

  const updateAssignment = (id: string, updates: Partial<Assignment>) => {
    setAssignments(prev => prev.map(a => (a.id === id ? { ...a, ...updates } : a)));
  };

  const deleteAssignment = (id: string) => {
    setAssignments(prev => prev.filter(a => a.id !== id));
  };

  const submitAssignment = (
    assignmentId: string,
    studentId: string,
    studentName: string,
    text: string,
    attachmentName?: string,
    attachmentData?: string
  ) => {
    const newSubmission: AssignmentSubmission = {
      id: 'asub-' + Date.now().toString().slice(-4),
      assignmentId,
      studentId,
      studentName,
      submittedAt: new Date().toISOString(),
      submissionText: text,
      attachmentName,
      attachmentData,
      isChecked: false,
    };
    setAssignmentSubmissions(prev => [newSubmission, ...prev.filter(s => !(s.assignmentId === assignmentId && s.studentId === studentId))]);
  };

  const gradeAssignmentSubmission = (submissionId: string, marks: number, feedback: string) => {
    setAssignmentSubmissions(prev =>
      prev.map(s =>
        s.id === submissionId
          ? {
              ...s,
              marksAwarded: marks,
              teacherFeedback: feedback,
              isChecked: true,
            }
          : s
      )
    );
  };

  // Study Materials
  const addStudyMaterial = (material: Omit<StudyMaterial, 'id' | 'uploadDate'>) => {
    const newMat: StudyMaterial = {
      ...material,
      id: 'mat-' + Date.now().toString().slice(-4),
      uploadDate: new Date().toISOString().split('T')[0],
    };
    setStudyMaterials(prev => [newMat, ...prev]);

    addNotification({
      targetRole: 'student',
      title: `New ${material.category}: ${material.title}`,
      message: `Uploaded for Class ${material.classLevel} (${material.chapter}). Available to view and download.`,
      type: 'dpp',
      linkTab: 'materials',
    });
  };

  const deleteStudyMaterial = (id: string) => {
    setStudyMaterials(prev => prev.filter(m => m.id !== id));
  };

  // Announcements
  const addAnnouncement = (ann: Omit<Announcement, 'id' | 'createdAt'>) => {
    const newAnn: Announcement = {
      ...ann,
      id: 'ann-' + Date.now().toString().slice(-4),
      createdAt: new Date().toISOString(),
    };
    setAnnouncements(prev => [newAnn, ...prev]);

    addNotification({
      targetRole: 'all',
      title: `Notice: ${ann.title}`,
      message: ann.message,
      type: 'announcement',
      linkTab: 'announcements',
    });
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  // Tests & Exams
  const addTest = (test: Omit<TestExam, 'id' | 'isCompleted'>) => {
    const newTest: TestExam = {
      ...test,
      id: 'test-' + Date.now().toString().slice(-4),
      isCompleted: false,
    };
    setTests(prev => [newTest, ...prev]);

    addNotification({
      targetRole: 'student',
      title: `New Test Scheduled: ${test.testName}`,
      message: `Class ${test.classLevel} Test on ${test.chapter} on ${test.date} at ${test.startTime}.`,
      type: 'announcement',
      linkTab: 'tests',
    });
  };

  const updateTest = (id: string, updates: Partial<TestExam>) => {
    setTests(prev => prev.map(t => (t.id === id ? { ...t, ...updates } : t)));
  };

  const deleteTest = (id: string) => {
    setTests(prev => prev.filter(t => t.id !== id));
  };

  const recordTestResult = (result: Omit<TestResult, 'id'>) => {
    const newRes: TestResult = {
      ...result,
      id: 'tr-' + Date.now().toString().slice(-4),
    };
    setTestResults(prev => [...prev.filter(r => !(r.testId === result.testId && r.studentId === result.studentId)), newRes]);
  };

  const recordBatchTestResults = (
    testId: string,
    results: { studentId: string; studentName: string; marksObtained: number; maxMarks: number; remark: string }[]
  ) => {
    const newResults: TestResult[] = results.map(r => {
      const percentage = Math.round((r.marksObtained / r.maxMarks) * 1000) / 10;
      let grade = 'F';
      if (percentage >= 90) grade = 'A+';
      else if (percentage >= 80) grade = 'A';
      else if (percentage >= 70) grade = 'B+';
      else if (percentage >= 60) grade = 'B';
      else if (percentage >= 50) grade = 'C';
      else if (percentage >= 40) grade = 'D';

      return {
        id: 'tr-' + Date.now() + '-' + r.studentId,
        testId,
        studentId: r.studentId,
        studentName: r.studentName,
        marksObtained: r.marksObtained,
        maxMarks: r.maxMarks,
        percentage,
        grade,
        teacherRemark: r.remark || (percentage >= 80 ? 'Good conceptual clarity.' : 'Needs continuous practice.'),
      };
    });

    setTestResults(prev => {
      const filtered = prev.filter(t => t.testId !== testId);
      return [...filtered, ...newResults];
    });

    // Mark test as completed
    updateTest(testId, { isCompleted: true });

    addNotification({
      targetRole: 'student',
      title: 'Test Marks Published',
      message: 'Scores and teacher remarks for the mathematics test have been published.',
      type: 'announcement',
      linkTab: 'tests',
    });
  };

  // Backup & Reset
  const resetToSampleData = () => {
    localStorage.clear();
    setBatches(INITIAL_BATCHES);
    setSchedules(INITIAL_SCHEDULES);
    setStudents(INITIAL_STUDENTS);
    setEnquiries(INITIAL_ENQUIRIES);
    setFreeTrials(INITIAL_FREE_TRIALS);
    setAttendanceRecords(INITIAL_ATTENDANCE);
    setHomeworks(INITIAL_HOMEWORK);
    setHomeworkSubmissions(INITIAL_HOMEWORK_SUBMISSIONS);
    setAssignments(INITIAL_ASSIGNMENTS);
    setAssignmentSubmissions(INITIAL_ASSIGNMENT_SUBMISSIONS);
    setStudyMaterials(INITIAL_STUDY_MATERIALS);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setTests(INITIAL_TESTS);
    setTestResults(INITIAL_TEST_RESULTS);
    setCurrentUser(INITIAL_USERS[0]);
    setIsLoggedIn(true);
  };

  const exportDatabaseJSON = () => {
    const data = {
      exportTimestamp: new Date().toISOString(),
      institute: 'AVNEET MATHS HUB',
      batches,
      schedules,
      students,
      enquiries,
      freeTrials,
      attendanceRecords,
      homeworks,
      homeworkSubmissions,
      assignments,
      assignmentSubmissions,
      studyMaterials,
      announcements,
      tests,
      testResults,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `avneet_maths_hub_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;

  const timetable = useMemo(() => {
    return schedules.map(s => {
      const b = batches.find(batch => batch.id === s.batchId);
      return {
        ...s,
        dayOfWeek: s.day || 'Monday',
        timeSlot: `${s.startTime} - ${s.endTime}`,
        chapterFocus: s.topic || s.subject || 'Mathematics',
        room: s.room || b?.room || 'Room 101',
      };
    });
  }, [schedules, batches]);

  const homeworkList = useMemo(() => {
    return homeworks.map(hw => {
      const batch = batches.find(b => b.id === hw.batchId);
      return {
        ...hw,
        batchName: batch?.name || 'Class ' + hw.classLevel,
        questionsList: hw.questions || [],
        submissions: homeworkSubmissions.filter(s => s.homeworkId === hw.id),
      };
    });
  }, [homeworks, homeworkSubmissions, batches]);

  const gradeHomeworkSubmission = (
    submissionId: string,
    status: any,
    remarks: string,
    rating?: number
  ) => {
    reviewHomeworkSubmission(submissionId, status || 'Checked', remarks, rating);
  };

  const enrichedAssignments = useMemo(() => {
    return assignments.map(asg => {
      const batch = batches.find(b => b.id === asg.batchId);
      return {
        ...asg,
        batchName: batch?.name || 'Class ' + asg.classLevel,
        submissions: assignmentSubmissions.filter(s => s.assignmentId === asg.id),
      };
    });
  }, [assignments, assignmentSubmissions, batches]);

  const enrichedTests = useMemo(() => {
    return tests.map(t => {
      const batch = batches.find(b => b.id === t.batchId);
      return {
        ...t,
        name: t.testName || t.name || 'Mathematics Test',
        testDate: t.date || t.testDate || '2026-03-20',
        batchName: batch?.name || 'Class ' + t.classLevel,
        results: testResults.filter(r => r.testId === t.id),
      };
    });
  }, [tests, testResults, batches]);

  const attendances = attendanceRecords;

  const markAttendance = (record: {
    studentId: string;
    batchId: string;
    date: string;
    status: AttendanceStatus;
    remarks?: string;
  }) => {
    const student = students.find(s => s.id === record.studentId);
    const newRec: AttendanceRecord = {
      id: 'att-' + Date.now() + '-' + record.studentId,
      batchId: record.batchId,
      classLevel: student?.classLevel || 10,
      date: record.date,
      studentId: record.studentId,
      studentName: student?.fullName || student?.name || 'Student',
      status: record.status,
      remark: record.remarks,
      markedAt: new Date().toISOString(),
    };

    setAttendanceRecords(prev => [
      ...prev.filter(
        a => !(a.studentId === record.studentId && a.date === record.date && a.batchId === record.batchId)
      ),
      newRec,
    ]);
  };

  const markBulkAttendance = (
    records: {
      studentId: string;
      studentName?: string;
      batchId: string;
      date: string;
      status: AttendanceStatus;
      remarks?: string;
    }[]
  ) => {
    if (!records || records.length === 0) return;
    const { batchId, date } = records[0];
    const newRecords: AttendanceRecord[] = records.map(r => {
      const student = students.find(s => s.id === r.studentId);
      return {
        id: 'att-' + Date.now() + '-' + r.studentId,
        batchId: r.batchId,
        classLevel: student?.classLevel || 10,
        date: r.date,
        studentId: r.studentId,
        studentName: r.studentName || student?.fullName || student?.name || 'Student',
        status: r.status,
        remark: r.remarks,
        markedAt: new Date().toISOString(),
      };
    });

    setAttendanceRecords(prev => [
      ...prev.filter(a => !(a.batchId === batchId && a.date === date)),
      ...newRecords,
    ]);
  };

  const updateTrialAttendance = (
    trialId: string,
    day: 'day1' | 'day2' | 'day3' | 1 | 2 | 3,
    attended: boolean
  ) => {
    const dayNum = typeof day === 'string' ? (parseInt(day.replace('day', ''), 10) as 1 | 2 | 3) : day;
    toggleTrialAttendance(trialId, dayNum, attended);
  };

  const updateEnquiryStage = (enquiryId: string, stage: EnquiryStage) => {
    updateEnquiryStatus(enquiryId, stage as EnquiryStatus);
  };

  const addEnquiryFollowUp = (enquiryId: string, note: string, nextFollowUpDate?: string) => {
    setEnquiries(prev =>
      prev.map(e =>
        e.id === enquiryId
          ? {
              ...e,
              notes: (e.notes ? e.notes + '\n' : '') + `[${new Date().toLocaleDateString()}]: ${note}`,
              followUpDate: nextFollowUpDate || e.followUpDate,
            }
          : e
      )
    );
  };

  const deleteEnquiry = (id: string) => {
    setEnquiries(prev => prev.filter(e => e.id !== id));
  };

  const recordTestResults = (testId: string, results: any[]) => {
    const newResults: TestResult[] = results.map(r => {
      const marksObtained = r.marksObtained ?? 0;
      const maxMarks = r.maxMarks ?? 40;
      const percentage = r.isAbsent ? 0 : Math.round((marksObtained / maxMarks) * 100);
      return {
        id: 'tr-' + Date.now() + '-' + r.studentId,
        testId,
        studentId: r.studentId,
        studentName: r.studentName,
        marksObtained,
        maxMarks,
        percentage,
        grade: r.isAbsent ? 'AB' : r.grade || (percentage >= 80 ? 'A' : percentage >= 60 ? 'B' : 'C'),
        teacherRemark: r.teacherRemarks || r.teacherRemark || 'Checked by teacher.',
        teacherRemarks: r.teacherRemarks || r.teacherRemark || 'Checked by teacher.',
        isAbsent: r.isAbsent,
      };
    });

    setTestResults(prev => [
      ...prev.filter(t => t.testId !== testId),
      ...newResults,
    ]);

    updateTest(testId, { isCompleted: true });
  };

  return (
    <DataContext.Provider
      value={{
        currentView,
        setCurrentView,
        isLoginOpen,
        setIsLoginOpen,
        isNotificationsOpen,
        setIsNotificationsOpen,
        unreadNotificationsCount,
        users,
        currentUser,
        setCurrentUser,
        switchRole,
        loginUser,
        logout,
        isLoggedIn,
        batches,
        addBatch,
        updateBatch,
        deleteBatch,
        schedules,
        timetable,
        addSchedule,
        updateSchedule,
        rescheduleClass,
        deleteSchedule,
        students,
        addStudent,
        updateStudent,
        deleteStudent,
        enquiries,
        addEnquiry,
        updateEnquiryStatus,
        updateEnquiryStage,
        addEnquiryFollowUp,
        deleteEnquiry,
        freeTrials,
        addFreeTrial,
        updateFreeTrialStatus,
        toggleTrialAttendance,
        updateTrialAttendance,
        convertTrialToStudent,
        attendanceRecords,
        attendances,
        markBatchAttendance,
        markAttendance,
        markBulkAttendance,
        getStudentAttendanceStats,
        homeworks,
        homeworkList,
        homeworkSubmissions,
        addHomework,
        updateHomework,
        deleteHomework,
        submitHomework,
        reviewHomeworkSubmission,
        gradeHomeworkSubmission,
        assignments: enrichedAssignments,
        assignmentSubmissions,
        addAssignment,
        updateAssignment,
        deleteAssignment,
        submitAssignment,
        gradeAssignmentSubmission,
        studyMaterials,
        addStudyMaterial,
        deleteStudyMaterial,
        announcements,
        addAnnouncement,
        deleteAnnouncement,
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        addNotification,
        tests: enrichedTests,
        testResults,
        addTest,
        updateTest,
        deleteTest,
        recordTestResult,
        recordBatchTestResults,
        recordTestResults,
        resetToSampleData,
        exportDatabaseJSON,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
