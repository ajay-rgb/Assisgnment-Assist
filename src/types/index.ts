
// Definition of a user
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'teacher' | 'student';
}

// Definition of an assignment
export interface Assignment {
  id: string;
  title: string;
  description: string;
  deadline: string;
  teacherId: string;
  createdAt: string;
}

// Definition of a student's submission for an assignment
export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  submissionDate: string;
  content?: string;
  fileUrl?: string;
  grade?: number;
  feedback?: string;
  plagiarismPercentage?: number;
  status: 'pending' | 'submitted' | 'graded' | 'flagged';
}

// Definition of a question/doubt asked by a student
export interface Question {
  id: string;
  studentId: string;
  assignmentId?: string;
  question: string;
  answer?: string;
  createdAt: string;
}

// Data for the performance table
export interface StudentPerformance {
  studentId: string;
  studentName: string;
  assignment: string;
  grade?: number;
  plagiarismPercentage?: number;
  submissionStatus: 'pending' | 'submitted' | 'graded' | 'flagged';
  submissionDate?: string;
}
