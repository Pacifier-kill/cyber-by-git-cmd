'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { CoursesSection } from '../components/CoursesSection';
import { AboutSection } from '../components/AboutSection';
import { RegistrationSection } from '../components/RegistrationSection';
import { CourseDetailModal } from '../components/CourseDetailModal';
import { Footer } from '../components/Footer';
import { Course } from '../types';
import { ShieldCheck, CreditCard, ArrowRight, CheckCircle2, Award, Building2 } from 'lucide-react';
import { ACADEMY_INFO } from '../data/courses';

export default function HomePage() {
  const router = useRouter();
  const [selectedCourseId, setSelectedCourseId] = useState<string>('ms-office');
  const [activeModalCourse, setActiveModalCourse] = useState<Course | null>(null);
  const [activeSection, setActiveSection] = useState<string>('home');

  const scrollTo = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectCourseToEnroll = (course: Course) => {
    setSelectedCourseId(course.id);
    scrollTo('register');
  };

  const handleViewCourseDetails = (course: Course) => {
    setActiveModalCourse(course);
  };

  const handleRegistrationCompleted = (data: {
    name: string;
    email: string;
    phone: string;
    courseName: string;
    fee: number;
  }) => {
    // Forward directly to dedicated payment page with pre-filled query params
    const params = new URLSearchParams({
      registered: 'true',
      name: data.name,
      email: data.email,
      phone: data.phone,
      course: data.courseName,
      fee: String(data.fee)
    });
    router.push(`/payment?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#e8e8f0]">
      {/* Top Fixed Navbar */}
      <Navbar onNavigateSection={scrollTo} activeSection={activeSection} />

      {/* Hero Section */}
      <Hero
        onExploreCourses={() => scrollTo('courses')}
        onRegister={() => scrollTo('register')}
        onVerifyCertificate={() => router.push('/verify')}
      />

      {/* Courses Section */}
      <CoursesSection
        onSelectCourse={handleSelectCourseToEnroll}
        onViewDetails={handleViewCourseDetails}
      />

      {/* Why Choose Us / About Section */}
      <AboutSection />

      {/* Registration Section */}
      <RegistrationSection
        selectedCourseId={selectedCourseId}
        onRegistered={handleRegistrationCompleted}
      />

      {/* Certificate Verification Banner */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#111118] border-t border-[#2a2a3a]">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#6c63ff]/10 text-[#818cf8] text-xs font-semibold tracking-wider uppercase mb-4 border border-[#6c63ff]/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verify Your Achievement</span>
          </div>
          <h2 className="font-syne text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            Certificate Verification
          </h2>
          <p className="text-sm sm:text-base text-[#888899] max-w-2xl mx-auto mb-8 leading-relaxed">
            Verify your course completion certificate authenticity in real time using your unique certificate ID (e.g. <span className="font-mono text-[#818cf8]">CNA-2026-001</span>) or by scanning the QR code printed on your credential.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/verify"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#6c63ff] hover:bg-[#5b52e0] text-white font-bold text-sm sm:text-base transition-all shadow-xl shadow-[#6c63ff]/35 hover:shadow-[#6c63ff]/50 flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-5 h-5" />
              <span>Go to Verification Portal →</span>
            </Link>
            <Link
              href="/payment"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#1a1a26] hover:bg-[#252538] text-white border border-[#2a2a3a] font-semibold text-sm sm:text-base transition-all flex items-center justify-center gap-2"
            >
              <CreditCard className="w-5 h-5 text-[#02fd88]" />
              <span>Fee Payment Portal</span>
            </Link>
          </div>

          <p className="text-xs text-[#888899] mt-6">
            Your unique certificate code is delivered via official email upon capstone evaluation.
          </p>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Detailed Syllabus Modal */}
      <CourseDetailModal
        course={activeModalCourse}
        isOpen={Boolean(activeModalCourse)}
        onClose={() => setActiveModalCourse(null)}
        onEnroll={(course) => {
          setActiveModalCourse(null);
          handleSelectCourseToEnroll(course);
        }}
      />
    </div>
  );
}
