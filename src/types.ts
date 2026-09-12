export type UserRole = 'admin' | 'teacher' | 'student' | 'parent';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  phone: string;
  avatar?: string;
  linkedStudentId?: string; // For parent or student
  classLevel?: number; // 7 to 12
  batchId?: string;
}

export type ClassLevel = 7 | 8 | 9 | 10 | 11 | 12;

export interface Batch {
  id: string;
  classLevel: ClassLevel;
  name: string;
  capacity: number;
  enrolledCount: number;
  room: string;
  teacher: string;
  scheduleDays: string[]; // e.g. ['Mon', 'Wed', 'Fri']
  timeSlot: string; // e.g. '05:00 PM - 06:15 PM'
  status: 'Active' | 'Upcoming' | 'Completed';
  startDate: string;
  endDate?: string;
  enrolledStudentIds: string[];
}

export type ClassScheduleStatus = 'Scheduled' | 'Completed' | 'Cancelled' | 'Rescheduled';

export interface DailyClassSchedule {
  id: string;
  date: string; // YYYY-MM-DD
  day: string; // Monday, etc.
  dayOfWeek?: string;
  batchId: string;
  batchName: string;
  classLevel: ClassLevel;
  subject: string; // "Mathematics"
  teacher: string;
  startTime: string; // e.g. "05:00 PM"
  endTime: string; // e.g. "06:15 PM"
  timeSlot?: string;
  room: string;
  topic: string;
  chapterFocus?: string;
  status: ClassScheduleStatus;
  originalTime?: string;
  rescheduleReason?: string;
  updatedAt: string;
}

export type StudentStatus = 'Active' | 'Inactive' | 'Left' | 'Trial' | 'Pending Admission';

export interface Student {
  id: string;
  studentId: string; // e.g. "AMH-2026-101"
  fullName: string;
  name?: string; // alias for fullName
  photo?: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  classLevel: ClassLevel;
  batchId: string;
  parentName: string;
  parentPhone: string;
  studentPhone: string;
  whatsApp: string;
  email: string;
  address: string;
  admissionDate: string;
  schoolName: string;
  rollNumber: string;
  status: StudentStatus;
  notes?: string;
  attendancePercentage?: number;
}

export type EnquiryStatus = 
  | 'New Enquiries' 
  | 'Contacted' 
  | 'Trial Scheduled' 
  | 'Trial Completed' 
  | 'Admission Confirmed' 
  | 'Not Interested';

export type EnquiryStage = EnquiryStatus | 'New Enquiry';

export interface Enquiry {
  id: string;
  studentName: string;
  parentName: string;
  classLevel: ClassLevel;
  phone: string;
  whatsApp: string;
  preferredBatch: string;
  preferredTiming: string;
  message: string;
  status: EnquiryStatus;
  followUpDate?: string;
  notes?: string;
  createdAt: string;
}

export type FreeTrialStatus = 'New' | 'Approved' | 'Scheduled' | 'Rejected' | 'Completed' | 'Converted';
export type TrialStatus = FreeTrialStatus | 'Requested' | 'Attending';

export interface FreeTrial {
  id: string;
  studentName: string;
  parentName: string;
  classLevel: ClassLevel;
  phone: string;
  whatsApp: string;
  preferredDate: string;
  preferredBatch: string;
  message?: string;
  status: FreeTrialStatus;
  assignedBatchId?: string;
  scheduledDate?: string;
  day1Attended: boolean;
  day2Attended: boolean;
  day3Attended: boolean;
  adminNotes?: string;
  createdAt: string;
}

export type FreeTrialRequest = FreeTrial & {
  attendanceDays?: { day1: boolean; day2: boolean; day3: boolean };
};

export type AttendanceStatus = 'Present' | 'Absent' | 'Late';

export interface AttendanceRecord {
  id: string;
  batchId: string;
  classLevel: ClassLevel;
  date: string; // YYYY-MM-DD
  studentId: string;
  studentName: string;
  status: AttendanceStatus;
  remark?: string;
  markedAt: string;
}

export interface Homework {
  id: string;
  title: string;
  description: string;
  classLevel: ClassLevel;
  batchId: string;
  batchName?: string;
  targetStudentId?: string; // Optional if for specific student
  chapter: string;
  topic: string;
  assignedDate: string;
  dueDate: string;
  questions: string[];
  questionsList?: string[];
  attachmentName?: string;
  attachmentData?: string; // Base64 or sample text
  attachmentUrl?: string;
  attachmentSize?: number;
  priority: 'Normal' | 'High' | 'Urgent' | 'Mandatory';
  status: 'Active' | 'Archived';
  submissions?: HomeworkSubmission[];
}

export interface HomeworkSubmission {
  id: string;
  homeworkId: string;
  studentId: string;
  studentName: string;
  status: 'Pending' | 'Submitted' | 'Checked' | 'Needs Improvement';
  submittedAt?: string;
  submissionText?: string;
  attachmentName?: string;
  attachmentData?: string;
  teacherRemarks?: string;
  rating?: number; // 1-5 or marks
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  classLevel: ClassLevel;
  batchId: string;
  batchName?: string;
  targetStudentId?: string;
  chapter: string;
  topic: string;
  startDate: string;
  dueDate: string;
  maxMarks: number;
  attachmentName?: string;
  attachmentData?: string;
  attachmentUrl?: string;
  attachmentSize?: number;
  submissionRequired: boolean;
  submissions?: AssignmentSubmission[];
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  submittedAt: string;
  submissionText?: string;
  attachmentName?: string;
  attachmentData?: string;
  marksAwarded?: number;
  teacherFeedback?: string;
  isChecked: boolean;
}

export type MaterialCategory = 
  | 'Notes' 
  | 'DPP' 
  | 'Worksheets' 
  | 'Practice Sets' 
  | 'Formula Sheets' 
  | 'Previous Questions' 
  | 'Mock Tests' 
  | 'Assignments' 
  | 'Revision Material' 
  | 'Other';

export type StudyMaterialCategory = MaterialCategory;

export interface StudyMaterial {
  id: string;
  title: string;
  description: string;
  category: MaterialCategory;
  classLevel: ClassLevel;
  batchId?: string;
  chapter: string;
  topic: string;
  fileName: string;
  fileData?: string; // Base64 or download payload
  fileSize?: string;
  uploadedBy: string;
  uploadDate: string;
  visibility: 'All students' | 'Specific class' | 'Specific batch' | 'Specific student';
  targetStudentId?: string;
}

export type AnnouncementPriority = 'Normal' | 'Important' | 'Urgent';

export type AnnouncementCategory =
  | 'Important Notice'
  | 'Holiday'
  | 'Holiday Notice'
  | 'Class Cancellation'
  | 'Timing Change'
  | 'Class Timing Change'
  | 'Exam Notice'
  | 'Mock Test Schedule'
  | 'Parent Teacher Meeting'
  | 'Fee Reminder'
  | 'General Circular'
  | 'General Announcement';

export interface Announcement {
  id: string;
  title: string;
  message: string;
  priority: AnnouncementPriority;
  target: 'All' | 'Class' | 'Batch' | 'Individual Student';
  targetClass?: ClassLevel;
  targetBatchId?: string;
  targetStudentId?: string;
  startDate: string;
  expiryDate: string;
  createdAt: string;
  category: AnnouncementCategory;
}

export interface AppNotification {
  id: string;
  userId?: string; // specific user or undefined for all matching role
  targetRole?: UserRole | 'all';
  title: string;
  message: string;
  type: 'timetable' | 'homework' | 'dpp' | 'assignment' | 'announcement' | 'attendance' | 'trial';
  isRead: boolean;
  createdAt: string;
  linkTab?: string;
}

export type TestType = 
  | 'Chapter Test' 
  | 'Weekly Test' 
  | 'Monthly Test' 
  | 'Mock Test' 
  | 'Half-Yearly Test' 
  | 'Final Revision Test';

export interface TestExam {
  id: string;
  testName: string;
  name?: string;
  testType: TestType;
  classLevel: ClassLevel;
  batchId: string;
  batchName?: string;
  chapter: string;
  date: string;
  testDate?: string;
  startTime: string;
  durationMinutes: number;
  maxMarks: number;
  passingMarks: number;
  instructions: string;
  isCompleted: boolean;
  results?: TestResult[];
}

export type TestRecord = TestExam & {
  results?: TestResult[];
  name?: string;
  testDate?: string;
  batchName?: string;
};

export interface TestResult {
  id: string;
  testId: string;
  studentId: string;
  studentName: string;
  marksObtained: number;
  maxMarks: number;
  percentage: number;
  grade: string;
  teacherRemark: string;
  teacherRemarks?: string;
  isAbsent?: boolean;
}
