export interface StudentCertificate {
  certificateId: string;
  studentName: string;
  courseName: string;
  issueDate: string;
  cryptoHash: string;
  grade?: string;
  instructor?: string;
}

export const INITIAL_CERTIFICATES: Record<string, StudentCertificate> = {
  'CNA-2026-001': {
    certificateId: 'CNA-2026-001',
    studentName: 'Muhammad Bilal Khan',
    courseName: 'Web Development',
    issueDate: 'January 15, 2026',
    cryptoHash: '9a8f7b6c5d4e3f2a1b0c9d8e7f6a5b4c',
    grade: 'A+ (Distinction)',
    instructor: 'Engr. Qurban Ali'
  },
  'CNA-2026-002': {
    certificateId: 'CNA-2026-002',
    studentName: 'Ayesha Fatima',
    courseName: 'Graphic Designing with AI',
    issueDate: 'January 28, 2026',
    cryptoHash: '8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e',
    grade: 'A (Excellent)',
    instructor: 'Senior Faculty'
  },
  'CNA-2026-003': {
    certificateId: 'CNA-2026-003',
    studentName: 'Hamza Ahmed Siddiqui',
    courseName: 'Python Programming',
    issueDate: 'February 10, 2026',
    cryptoHash: '7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f',
    grade: 'A+ (Distinction)',
    instructor: 'Lead Software Architect'
  },
  'CNA-2026-004': {
    certificateId: 'CNA-2026-004',
    studentName: 'Zainab Noor',
    courseName: 'Basic Computer & MS Office',
    issueDate: 'February 20, 2026',
    cryptoHash: '6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a',
    grade: 'A (High Honor)',
    instructor: 'Certified IT Trainer'
  },
  'CNA-2026-005': {
    certificateId: 'CNA-2026-005',
    studentName: 'Syed Usman Ali',
    courseName: 'Shopify E-Commerce Store Development',
    issueDate: 'March 02, 2026',
    cryptoHash: '5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b',
    grade: 'A+ (Distinction)',
    instructor: 'E-commerce Specialist'
  },
  'CNA-2026-006': {
    certificateId: 'CNA-2026-006',
    studentName: 'Danish Raza',
    courseName: 'Crypto & Forex Technical Analysis',
    issueDate: 'March 10, 2026',
    cryptoHash: '4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c',
    grade: 'A (Excellent)',
    instructor: 'Financial Market Analyst'
  },
  'CNA-2026-007': {
    certificateId: 'CNA-2026-007',
    studentName: 'Sana Tariq',
    courseName: 'Typing Course (Urdu, English & Sindhi)',
    issueDate: 'March 12, 2026',
    cryptoHash: '3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d',
    grade: '65 WPM — Distinction',
    instructor: 'Speed Typing Master'
  },
  'CNA-2026-008': {
    certificateId: 'CNA-2026-008',
    studentName: 'Kashif Mehmood',
    courseName: 'C++ Programming & OOP',
    issueDate: 'March 14, 2026',
    cryptoHash: '2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e',
    grade: 'A+ (Distinction)',
    instructor: 'Engr. Qurban Ali'
  }
};
