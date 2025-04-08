
import { Assignment, Submission, Question, StudentPerformance } from '../types';

// Mock assignments
export const mockAssignments: Assignment[] = [
  {
    id: '1',
    title: 'Introduction to React',
    description: 'Create a simple React application with components and state management.',
    deadline: '2025-04-15T23:59:59',
    teacherId: 'teacher1',
    createdAt: '2025-04-01T10:00:00'
  },
  {
    id: '2',
    title: 'Data Structures Analysis',
    description: 'Analyze the time and space complexity of common data structures.',
    deadline: '2025-04-20T23:59:59',
    teacherId: 'teacher1',
    createdAt: '2025-04-05T14:30:00'
  },
  {
    id: '3',
    title: 'Database Design Project',
    description: 'Design a normalized database schema for an e-commerce application.',
    deadline: '2025-05-01T23:59:59',
    teacherId: 'teacher1',
    createdAt: '2025-04-10T09:15:00'
  }
];

// Mock submissions
export const mockSubmissions: Submission[] = [
  {
    id: '101',
    assignmentId: '1',
    studentId: 'student1',
    submissionDate: '2025-04-14T18:30:00',
    fileUrl: 'submissions/react-project-student1.zip',
    grade: 85,
    plagiarismPercentage: 5,
    status: 'graded'
  },
  {
    id: '102',
    assignmentId: '2',
    studentId: 'student1',
    submissionDate: '2025-04-19T22:45:00',
    fileUrl: 'submissions/data-structures-student1.pdf',
    grade: 92,
    plagiarismPercentage: 3,
    status: 'graded'
  },
  {
    id: '103',
    assignmentId: '1',
    studentId: 'student2',
    submissionDate: '2025-04-14T14:20:00',
    fileUrl: 'submissions/react-project-student2.zip',
    grade: 75,
    plagiarismPercentage: 15,
    status: 'graded'
  },
  {
    id: '104',
    assignmentId: '1',
    studentId: 'student3',
    submissionDate: '2025-04-15T10:05:00',
    fileUrl: 'submissions/react-project-student3.zip',
    plagiarismPercentage: 75,
    status: 'flagged'
  },
  {
    id: '105',
    assignmentId: '2',
    studentId: 'student2',
    submissionDate: '2025-04-18T16:40:00',
    fileUrl: 'submissions/data-structures-student2.pdf',
    status: 'submitted'
  }
];

// Mock questions
export const mockQuestions: Question[] = [
  {
    id: '201',
    studentId: 'student1',
    assignmentId: '1',
    question: 'How do I implement state management in my React components?',
    answer: 'You can use React\'s useState hook for simple state management or useReducer for more complex state logic. For larger applications, consider using libraries like Redux or Zustand.',
    createdAt: '2025-04-12T11:20:00'
  },
  {
    id: '202',
    studentId: 'student2',
    assignmentId: '2',
    question: 'What\'s the space complexity of a binary search tree?',
    answer: 'The space complexity of a binary search tree is O(n) where n is the number of nodes in the tree.',
    createdAt: '2025-04-17T09:45:00'
  },
  {
    id: '203',
    studentId: 'student1',
    assignmentId: '3',
    question: 'Can you explain the difference between 2NF and 3NF?',
    createdAt: '2025-04-11T15:30:00'
  }
];

// Mock student performance data
export const mockPerformanceData: StudentPerformance[] = [
  {
    studentId: 'student1',
    studentName: 'Alice Johnson',
    assignment: 'Introduction to React',
    grade: 85,
    plagiarismPercentage: 5,
    submissionStatus: 'graded',
    submissionDate: '2025-04-14T18:30:00'
  },
  {
    studentId: 'student2',
    studentName: 'Bob Smith',
    assignment: 'Introduction to React',
    grade: 75,
    plagiarismPercentage: 15,
    submissionStatus: 'graded',
    submissionDate: '2025-04-14T14:20:00'
  },
  {
    studentId: 'student3',
    studentName: 'Charlie Brown',
    assignment: 'Introduction to React',
    plagiarismPercentage: 75,
    submissionStatus: 'flagged',
    submissionDate: '2025-04-15T10:05:00'
  },
  {
    studentId: 'student4',
    studentName: 'Diana Prince',
    assignment: 'Introduction to React',
    submissionStatus: 'pending'
  },
  {
    studentId: 'student1',
    studentName: 'Alice Johnson',
    assignment: 'Data Structures Analysis',
    grade: 92,
    plagiarismPercentage: 3,
    submissionStatus: 'graded',
    submissionDate: '2025-04-19T22:45:00'
  },
  {
    studentId: 'student2',
    studentName: 'Bob Smith',
    assignment: 'Data Structures Analysis',
    submissionStatus: 'submitted',
    submissionDate: '2025-04-18T16:40:00'
  }
];
