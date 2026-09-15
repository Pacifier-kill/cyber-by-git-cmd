'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Course } from '../types';
import { COURSES as DEFAULT_COURSES } from '../data/courses';

interface CoursesContextType {
  courses: Course[];
  updateCourse: (id: string, updatedFields: Partial<Course>) => void;
  updateCoursePrice: (id: string, newFee: number) => void;
  updateCourseFee: (id: string, newFee: number) => void;
  addCourse: (course: Course) => void;
  deleteCourse: (id: string) => void;
  resetToDefaults: () => void;
  resetCourses: () => void;
  getCourseById: (id: string) => Course | undefined;
}

const CoursesContext = createContext<CoursesContextType | undefined>(undefined);

const STORAGE_KEY = 'cybernova_courses_v1';

export const CoursesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [courses, setCourses] = useState<Course[]>(DEFAULT_COURSES);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCourses(parsed);
        }
      }
    } catch (err) {
      console.error('Failed to load courses from storage:', err);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Sync to localStorage whenever courses change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
      } catch (err) {
        console.error('Failed to save courses to storage:', err);
      }
    }
  }, [courses, isLoaded]);

  const updateCourse = (id: string, updatedFields: Partial<Course>) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updatedFields } : c))
    );
  };

  const updateCoursePrice = (id: string, newFee: number) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, fee: Math.max(0, newFee) } : c))
    );
  };

  const addCourse = (newCourse: Course) => {
    setCourses((prev) => [newCourse, ...prev]);
  };

  const deleteCourse = (id: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== id));
  };

  const resetToDefaults = () => {
    setCourses(DEFAULT_COURSES);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.error(err);
    }
  };

  const getCourseById = (id: string) => {
    return courses.find((c) => c.id === id);
  };

  return (
    <CoursesContext.Provider
      value={{
        courses,
        updateCourse,
        updateCoursePrice,
        updateCourseFee: updateCoursePrice,
        addCourse,
        deleteCourse,
        resetToDefaults,
        resetCourses: resetToDefaults,
        getCourseById
      }}
    >
      {children}
    </CoursesContext.Provider>
  );
};

export const useCourses = () => {
  const context = useContext(CoursesContext);
  if (!context) {
    throw new Error('useCourses must be used within a CoursesProvider');
  }
  return context;
};
