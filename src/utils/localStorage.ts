
// Local Storage utility functions for storing and retrieving data

import { Assignment } from '../types';

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
