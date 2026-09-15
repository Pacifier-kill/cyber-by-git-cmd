'use client';

import React from 'react';
import { CoursesProvider } from '../context/CoursesContext';
import { AuthProvider } from '../context/AuthContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CoursesProvider>
        {children}
      </CoursesProvider>
    </AuthProvider>
  );
}
