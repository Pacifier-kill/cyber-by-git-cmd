export interface Course {
  id: string;
  name: string;
  categoryTag: string;
  categoryType: 'office' | 'typing' | 'design' | 'ecommerce' | 'marketing' | 'trading' | 'development' | 'programming';
  description: string;
  fullOverview?: string;
  duration: string;
  classesPerWeek: string;
  fee: number;
  badge?: string;
  topics: string[];
  curriculum: string[];
  gradient: string;
  accentColor: string;
  iconName: string;
}

export interface RegistrationFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  courseId: string;
  experience: string;
}

export interface PaymentDetails {
  studentName: string;
  email: string;
  phone: string;
  courseName: string;
  feeAmount: number;
  paymentMethod: 'easypaisa' | 'jazzcash' | 'bank' | 'nayapay';
  transactionId?: string;
  receiptNumber?: string;
  paymentDate?: string;
  status: 'pending' | 'completed';
}

export interface CertificateRecord {
  id: string;
  certificateNumber: string;
  studentName: string;
  fatherName?: string;
  rollNumber: string;
  courseName: string;
  duration: string;
  grade: 'A+' | 'A' | 'B+' | 'B';
  completionDate: string;
  issueDate: string;
  instructor: string;
  qrCodeUrl?: string;
  verificationStatus: 'verified' | 'revoked';
}
