'use client';

import React from 'react';
import { X, Clock, Calendar, CheckCircle2, Award, Sparkles, ArrowRight, BookOpen } from 'lucide-react';
import { Course } from '../types';

interface CourseDetailModalProps {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
  onEnroll: (course: Course) => void;
}

export const CourseDetailModal: React.FC<CourseDetailModalProps> = ({
  course,
  isOpen,
  onClose,
  onEnroll
}) => {
  if (!isOpen || !course) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#13131e] border border-[#2a2a3a] rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80 text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-[#1a1a26] text-[#888899] hover:text-white hover:bg-[#2a2a3a] transition-colors focus:outline-none"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Course Category Badge & Name */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-[#6c63ff]/20 text-[#818cf8] border border-[#6c63ff]/30">
            {course.categoryTag}
          </span>
          {course.badge && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#43e97b]/15 text-[#02fd88] border border-[#43e97b]/30">
              {course.badge}
            </span>
          )}
        </div>

        <h2 className="font-syne text-2xl sm:text-3xl font-extrabold text-white mb-3">
          {course.name}
        </h2>

        <p className="text-sm sm:text-base text-[#888899] leading-relaxed mb-6">
          {course.fullOverview || course.description}
        </p>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-[#1a1a26] border border-[#2a2a3a] mb-6">
          <div className="flex items-center gap-2.5">
            <Clock className="w-5 h-5 text-[#6c63ff] shrink-0" />
            <div>
              <div className="text-[11px] text-[#888899] uppercase font-medium">Duration</div>
              <div className="text-xs sm:text-sm font-semibold text-white">{course.duration}</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Calendar className="w-5 h-5 text-[#43e97b] shrink-0" />
            <div>
              <div className="text-[11px] text-[#888899] uppercase font-medium">Schedule</div>
              <div className="text-xs sm:text-sm font-semibold text-white">{course.classesPerWeek}</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 col-span-2 sm:col-span-1">
            <Award className="w-5 h-5 text-[#ff6584] shrink-0" />
            <div>
              <div className="text-[11px] text-[#888899] uppercase font-medium">Certification</div>
              <div className="text-xs sm:text-sm font-semibold text-white">Verified Certificate</div>
            </div>
          </div>
        </div>

        {/* Syllabus / Curriculum */}
        <div className="mb-6">
          <h3 className="font-syne text-base font-bold text-white flex items-center gap-2 mb-3">
            <BookOpen className="w-4 h-4 text-[#6c63ff]" />
            <span>Course Syllabus & Modules</span>
          </h3>
          <div className="space-y-2.5">
            {course.curriculum.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-[#111118] border border-[#2a2a3a]/80">
                <span className="w-5 h-5 rounded-full bg-[#6c63ff]/20 text-[#818cf8] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="text-xs sm:text-sm text-[#e8e8f0] font-normal">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Key skills pills */}
        <div className="mb-8">
          <div className="text-xs font-bold uppercase tracking-wider text-[#888899] mb-2">
            Key Competencies Acquired
          </div>
          <div className="flex flex-wrap gap-2">
            {course.topics.map((topic, i) => (
              <span key={i} className="px-3 py-1 rounded-lg text-xs font-medium bg-[#1a1a26] text-white border border-[#2a2a3a] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#43e97b]" />
                {topic}
              </span>
            ))}
          </div>
        </div>

        {/* Price & Action Bar */}
        <div className="pt-4 border-t border-[#2a2a3a] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-xs text-[#888899]">Complete Course Fee</div>
            <div className="font-syne text-2xl sm:text-3xl font-extrabold text-[#02fd88]">
              Rs. {course.fee.toLocaleString()}
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial px-5 py-3 rounded-xl bg-[#1a1a26] hover:bg-[#2a2a3a] text-white text-sm font-medium transition-colors cursor-pointer"
            >
              Back
            </button>
            <button
              onClick={() => {
                onEnroll(course);
                onClose();
              }}
              className="flex-1 sm:flex-initial px-6 py-3 rounded-xl bg-[#6c63ff] hover:bg-[#5b52e0] text-white text-sm font-semibold transition-all shadow-lg shadow-[#6c63ff]/30 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Enroll In Course</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
