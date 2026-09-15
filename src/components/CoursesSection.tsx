'use client';

import React, { useState, useMemo } from 'react';
import { 
  FileSpreadsheet, 
  Keyboard, 
  Palette, 
  ShoppingBag, 
  Megaphone, 
  TrendingUp, 
  Code, 
  Terminal, 
  Cpu,
  Clock,
  Calendar,
  Search,
  ArrowRight,
  Info,
  Check,
  Tag
} from 'lucide-react';
import { useCourses } from '../context/CoursesContext';
import { Course } from '../types';

interface CoursesSectionProps {
  onSelectCourse: (course: Course) => void;
  onViewDetails: (course: Course) => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  FileSpreadsheet,
  Keyboard,
  Palette,
  ShoppingBag,
  Megaphone,
  TrendingUp,
  Code,
  Terminal,
  Cpu
};

export const CoursesSection: React.FC<CoursesSectionProps> = ({
  onSelectCourse,
  onViewDetails
}) => {
  const { courses } = useCourses();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'all', label: 'All Courses' },
    { id: 'programming', label: 'Coding & Development' },
    { id: 'ecommerce', label: 'E-Commerce & Ads' },
    { id: 'design', label: 'Graphic Design & Office' },
    { id: 'trading', label: 'Crypto & Forex' }
  ];

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      // Category match
      let matchesCat = true;
      if (activeCategory === 'programming') {
        matchesCat = ['development', 'programming'].includes(course.categoryType);
      } else if (activeCategory === 'ecommerce') {
        matchesCat = ['ecommerce', 'marketing'].includes(course.categoryType);
      } else if (activeCategory === 'design') {
        matchesCat = ['office', 'typing', 'design'].includes(course.categoryType);
      } else if (activeCategory === 'trading') {
        matchesCat = course.categoryType === 'trading';
      }

      // Search match
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        course.name.toLowerCase().includes(query) ||
        course.description.toLowerCase().includes(query) ||
        course.categoryTag.toLowerCase().includes(query);

      return matchesCat && matchesSearch;
    });
  }, [courses, activeCategory, searchQuery]);

  return (
    <section id="courses" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#111118]/60 border-t border-b border-[#2a2a3a]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6c63ff]/10 text-[#818cf8] text-xs font-semibold tracking-wider uppercase mb-3 border border-[#6c63ff]/20">
            Our Curriculum
          </div>
          <h2 className="font-syne text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
            Courses We Offer
          </h2>
          <p className="text-[#888899] text-sm sm:text-base md:text-lg leading-relaxed">
            Structured courses designed by industry experts. Each course includes hands-on projects, personalized mentor feedback, live sessions, and a verified graduation credential.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-10">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-[#6c63ff] text-white shadow-lg shadow-[#6c63ff]/25 font-semibold'
                    : 'bg-[#1a1a26] text-[#888899] hover:text-white hover:bg-[#232334] border border-[#2a2a3a]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[240px] sm:min-w-[280px]">
            <Search className="w-4 h-4 text-[#888899] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-[#1a1a26] border border-[#2a2a3a] rounded-xl text-white placeholder-[#888899] focus:outline-none focus:border-[#6c63ff] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#888899] hover:text-white"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Courses Grid */}
        {filteredCourses.length === 0 ? (
          <div className="text-center py-16 bg-[#13131e] rounded-2xl border border-[#2a2a3a]">
            <p className="text-[#888899] text-base mb-3">No courses match your filter criteria.</p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 text-xs font-semibold text-[#6c63ff] hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {filteredCourses.map((course) => {
              const IconComponent = ICON_MAP[course.iconName] || Code;
              return (
                <div
                  key={course.id}
                  className="group bg-[#13131e] hover:bg-[#161624] border border-[#2a2a3a] hover:border-[#6c63ff]/60 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-[#6c63ff]/10 flex flex-col justify-between"
                >
                  <div>
                    {/* Visual Card Banner with Icon */}
                    <div className="relative h-40 sm:h-44 w-full bg-gradient-to-br from-[#1c1c2b] via-[#11111a] to-[#0d0d14] flex items-center justify-center overflow-hidden border-b border-[#2a2a3a]">
                      {/* Ambient Accent Radial */}
                      <div
                        className="absolute inset-0 opacity-40 group-hover:opacity-75 transition-opacity"
                        style={{
                          background: `radial-gradient(circle at 50% 50%, ${course.accentColor}33 0%, transparent 70%)`
                        }}
                      />

                      {/* Icon Graphics Center */}
                      <div className="relative z-10 flex flex-col items-center gap-2.5">
                        <div 
                          className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-xl"
                          style={{
                            backgroundColor: `${course.accentColor}20`,
                            border: `1px solid ${course.accentColor}50`
                          }}
                        >
                          <IconComponent 
                            className="w-7 h-7 sm:w-8 sm:h-8" 
                            style={{ color: course.accentColor }} 
                          />
                        </div>
                        <span 
                          className="text-[10px] sm:text-[11px] font-bold tracking-widest uppercase px-3 py-0.5 rounded-full"
                          style={{
                            backgroundColor: `${course.accentColor}18`,
                            color: course.accentColor,
                            border: `1px solid ${course.accentColor}40`
                          }}
                        >
                          {course.categoryTag}
                        </span>
                      </div>

                      {/* Top Badges */}
                      <div className="absolute top-3 right-3 z-10 flex gap-1.5">
                        {course.badge && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#111118]/80 backdrop-blur-md text-[#43e97b] border border-[#43e97b]/40 shadow">
                            {course.badge}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Card Content Body - Syllabus / Topic Pills REMOVED as requested */}
                    <div className="p-5 sm:p-6 text-left">
                      <h3 className="font-syne text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-[#818cf8] transition-colors">
                        {course.name}
                      </h3>

                      <p className="text-xs sm:text-sm text-[#888899] line-clamp-3 leading-relaxed mb-4">
                        {course.description}
                      </p>

                      {/* Meta info: Duration & Classes */}
                      <div className="flex items-center gap-4 text-xs text-[#888899]">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#6c63ff]" />
                          <span>{course.duration}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[#43e97b]" />
                          <span>{course.classesPerWeek}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Actions Footer with Fee & Buttons */}
                  <div className="p-5 sm:p-6 pt-3 border-t border-[#2a2a3a]/80 bg-[#101018]">
                    <div className="flex items-baseline justify-between mb-4">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#888899] block tracking-wider">
                          Course Fee
                        </span>
                        <div className="text-lg sm:text-xl font-extrabold text-white font-syne">
                          Rs. {course.fee.toLocaleString()}
                          <span className="text-xs font-normal text-[#888899] ml-1">/ total</span>
                        </div>
                      </div>
                      <span className="text-[11px] text-[#02fd88] font-semibold bg-[#00a651]/15 px-2 py-0.5 rounded border border-[#00a651]/30">
                        Certificate Included
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        onClick={() => onViewDetails(course)}
                        className="py-2.5 px-3 rounded-xl bg-[#1a1a26] hover:bg-[#252538] text-white border border-[#2a2a3a] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Info className="w-3.5 h-3.5 text-[#888899]" />
                        <span>Details</span>
                      </button>

                      <button
                        onClick={() => onSelectCourse(course)}
                        className="py-2.5 px-3 rounded-xl bg-[#6c63ff] hover:bg-[#5b52e0] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-[#6c63ff]/25 cursor-pointer"
                      >
                        <span>Enroll</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
