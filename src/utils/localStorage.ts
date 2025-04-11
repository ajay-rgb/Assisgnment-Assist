
// Local Storage utility functions for storing and retrieving data

import { Assignment, Submission } from '../types';

// Keys for local storage
export const STORAGE_KEYS = {
  ASSIGNMENTS: 'grade-guardian-assignments',
  SUBMISSIONS: 'grade-guardian-submissions',
  USERS: 'grade-guardian-users',
};

// Function to get assignments from local storage
export const getAssignmentsFromStorage = (): Assignment[] => {
  const storedAssignments = localStorage.getItem(STORAGE_KEYS.ASSIGNMENTS);
  return storedAssignments ? JSON.parse(storedAssignments) : [];
};

// Function to save assignments to local storage
export const saveAssignmentsToStorage = (assignments: Assignment[]): void => {
  localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(assignments));
};

// Function to add a new assignment to local storage
export const addAssignmentToStorage = (assignment: Assignment): void => {
  const assignments = getAssignmentsFromStorage();
  assignments.push(assignment);
  saveAssignmentsToStorage(assignments);
};

// Function to update an assignment in local storage
export const updateAssignmentInStorage = (updatedAssignment: Assignment): void => {
  const assignments = getAssignmentsFromStorage();
  const index = assignments.findIndex(a => a.id === updatedAssignment.id);
  
  if (index !== -1) {
    assignments[index] = updatedAssignment;
    saveAssignmentsToStorage(assignments);
  }
};

// Function to delete an assignment from local storage
export const deleteAssignmentFromStorage = (assignmentId: string): void => {
  const assignments = getAssignmentsFromStorage();
  const filteredAssignments = assignments.filter(a => a.id !== assignmentId);
  saveAssignmentsToStorage(filteredAssignments);
};

// Function to get submissions from local storage
export const getSubmissionsFromStorage = (): Submission[] => {
  const storedSubmissions = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
  return storedSubmissions ? JSON.parse(storedSubmissions) : [];
};

// Function to save submissions to local storage
export const saveSubmissionsToStorage = (submissions: Submission[]): void => {
  localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions));
};

// Function to add a new submission to local storage
export const addSubmissionToStorage = (submission: Submission): void => {
  const submissions = getSubmissionsFromStorage();
  submissions.push(submission);
  saveSubmissionsToStorage(submissions);
};

// Function to update a submission in local storage
export const updateSubmissionInStorage = (updatedSubmission: Submission): void => {
  const submissions = getSubmissionsFromStorage();
  const index = submissions.findIndex(s => s.id === updatedSubmission.id);
  
  if (index !== -1) {
    submissions[index] = updatedSubmission;
    saveSubmissionsToStorage(submissions);
  }
};

// Function to get submissions for a specific student
export const getStudentSubmissions = (studentId: string): Submission[] => {
  const submissions = getSubmissionsFromStorage();
  return submissions.filter(s => s.studentId === studentId);
};

// Function to get submissions for a specific assignment
export const getSubmissionsForAssignment = (assignmentId: string): Submission[] => {
  const submissions = getSubmissionsFromStorage();
  return submissions.filter(s => s.assignmentId === assignmentId);
};
