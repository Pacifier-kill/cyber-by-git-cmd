'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldAlert,
  SlidersHorizontal,
  Plus,
  Edit3,
  Trash2,
  Save,
  RefreshCw,
  CheckCircle2,
  Users,
  BookOpen,
  DollarSign,
  TrendingUp,
  Search,
  X,
  ArrowLeft,
  Key,
  GraduationCap,
  Calendar,
  Clock,
  Tag,
  Check,
  Phone,
  Mail,
  UserCheck
} from 'lucide-react';
import { useCourses } from '../../context/CoursesContext';
import { useAuth } from '../../context/AuthContext';
import { Course } from '../../types';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';

function AdminContent() {
  const router = useRouter();
  const { courses, updateCourseFee, updateCourse, addCourse, deleteCourse, resetCourses } = useCourses();
  const { user, isAdmin, login } = useAuth();
  const [adminusername, setAdminUsername] = useState('');
  const [adminPasscode, setAdminPasscode] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'courses' | 'registrations'>('courses');

  // Course Editing Modal State
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // New/Edit course form state
  const [formData, setFormData] = useState<Partial<Course>>({
    name: '',
    categoryTag: 'Computer Science',
    categoryType: 'development',
    fee: 10000,
    duration: '2 Months',
    classesPerWeek: '3 Days / Week',
    description: '',
    badge: 'Popular',
    accentColor: '#6c63ff',
    iconName: 'Code'
  });

  // Registrations state
  const [registrations, setRegistrations] = useState<any[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('cybernova_all_registrations');
      if (stored) {
        setRegistrations(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleAdminUnlock = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setAuthError(null);

    const isValidUsername = adminusername.trim() === 'Zayan' || adminusername.trim() === 'cybernova@gmail.com';
    const isValidPassword = adminPasscode === 'admin123';

    if (isValidUsername && isValidPassword) {
      login('admin@cybernova.edu.pk', 'admin', 'Academy Admin');
      showToast('Admin mode granted!');
    } else {
      setAuthError('Invalid Admin Credentials. Please enter valid username and password.');
    }
  };

  const handleEditClick = (course: Course) => {
    setEditingCourse(course);
    setIsAddingNew(false);
    setFormData({ ...course });
  };

  const handleAddNewClick = () => {
    setEditingCourse(null);
    setIsAddingNew(true);
    setFormData({
      id: `course-${Date.now()}`,
      name: '',
      categoryTag: 'Development',
      categoryType: 'development',
      fee: 8000,
      duration: '2 Months',
      classesPerWeek: '3 Days / Week',
      description: 'Comprehensive hands-on curriculum with mentor support and verified certificate.',
      badge: 'New Batch',
      accentColor: '#6c63ff',
      iconName: 'Terminal'
    });
  };

  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      showToast('Course name is required.');
      return;
    }
    if (!formData.fee || formData.fee <= 0) {
      showToast('Please enter a valid course fee.');
      return;
    }

    if (isAddingNew) {
      const newCourse: Course = {
        id: formData.id || `course-${Date.now()}`,
        name: formData.name.trim(),
        categoryTag: formData.categoryTag || 'Course',
        categoryType: formData.categoryType || 'development',
        fee: Number(formData.fee),
        duration: formData.duration || '2 Months',
        classesPerWeek: formData.classesPerWeek || '3 Days / Week',
        description: formData.description || '',
        badge: formData.badge || undefined,
        accentColor: formData.accentColor || '#6c63ff',
        iconName: formData.iconName || 'Code',
        topics: ['Core Fundamentals', 'Practical Projects', 'Certification'],
        curriculum: ['Module 1: Foundations', 'Module 2: Applied Skills', 'Capstone Evaluation'],
        gradient: 'from-[#6c63ff]/30 via-indigo-600/20 to-transparent'
      };
      addCourse(newCourse);
      showToast(`Added "${newCourse.name}" successfully!`);
    } else if (editingCourse) {
      updateCourse(editingCourse.id, {
        name: formData.name.trim(),
        categoryTag: formData.categoryTag,
        categoryType: formData.categoryType,
        fee: Number(formData.fee),
        duration: formData.duration,
        classesPerWeek: formData.classesPerWeek,
        description: formData.description,
        badge: formData.badge,
        accentColor: formData.accentColor,
        iconName: formData.iconName
      });
      showToast(`Updated "${formData.name}" successfully!`);
    }

    setEditingCourse(null);
    setIsAddingNew(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove "${name}"?`)) {
      deleteCourse(id);
      showToast(`Deleted "${name}".`);
    }
  };

  const handleReset = () => {
    if (confirm('Reset all courses to the official default academy curriculum?')) {
      resetCourses();
      showToast('Reset to default course catalog.');
    }
  };

  const filteredCourses = courses.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.categoryTag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalFeeSum = courses.reduce((acc, c) => acc + c.fee, 0);
  const avgFee = Math.round(totalFeeSum / (courses.length || 1));

  // If not logged in as Admin, show Passcode / Login screen
  if (!isAdmin) {
    return (
      <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-md mx-auto">
        <div className="bg-[#13131e] border border-[#2a2a3a] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#6c63ff]/15 border border-[#6c63ff]/30 text-[#818cf8] mx-auto flex items-center justify-center mb-5 shadow-xl">
            <ShieldAlert className="w-7 h-7" />
          </div>

          <h1 className="font-syne text-2xl font-bold text-white mb-2">
            Administrator Access
          </h1>
          <p className="text-xs sm:text-sm text-[#888899] mb-6 leading-relaxed">
            Please unlock with your administrator credentials or passcode to access curriculum and fee management.
          </p>

          {authError && (
            <div className="p-3 mb-4 rounded-xl bg-[#ff6584]/15 border border-[#ff6584]/30 text-[#ff6584] text-xs">
              {authError}
            </div>
          )}

          <form onSubmit={handleAdminUnlock} className="space-y-3 mb-6">
            {/* Username Input */}
            <div className="relative">
              <input
                type="text"
                value={adminusername}
                onChange={(e) => setAdminUsername(e.target.value)}
                placeholder="Username or Email"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1a1a26] border border-[#2a2a3a] text-white text-sm focus:outline-none focus:border-[#6c63ff]"
              />
              <Users className="w-4 h-4 text-[#888899] absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>

            {/* Password Input */}
            <div className="relative">
              <input
                type="password"
                value={adminPasscode}
                onChange={(e) => setAdminPasscode(e.target.value)}
                placeholder="Enter Admin Password"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1a1a26] border border-[#2a2a3a] text-white text-sm focus:outline-none focus:border-[#6c63ff]"
              />
              <Key className="w-4 h-4 text-[#888899] absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#6c63ff] hover:bg-[#5b52e0] text-white text-xs sm:text-sm font-bold transition-all shadow-lg shadow-[#6c63ff]/25 cursor-pointer"
            >
              Unlock Admin Panel
            </button>
          </form>

          <div className="pt-4 border-t border-[#2a2a3a] text-xs text-[#888899] flex flex-col gap-2">
            <div>
              <span>Or sign in with an official admin account: </span>
              <Link href="/login?redirect=/admin" className="text-[#818cf8] font-semibold hover:underline">
                Go to Login →
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#13131e] border border-[#6c63ff] text-white text-xs sm:text-sm px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#02fd88]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6c63ff]/15 text-[#818cf8] text-xs font-semibold uppercase tracking-wider mb-2 border border-[#6c63ff]/30">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Cyber Nova Management Portal</span>
          </div>
          <h1 className="font-syne text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Courses & Price Management
          </h1>
          <p className="text-xs sm:text-sm text-[#888899] mt-1">
            Logged in as <strong className="text-white">{user?.name || 'Administrator'}</strong> ({user?.email})
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleAddNewClick}
            className="py-2.5 px-4 rounded-xl bg-[#6c63ff] hover:bg-[#5b52e0] text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-lg shadow-[#6c63ff]/25 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Course</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="py-2.5 px-3.5 rounded-xl bg-[#1a1a26] hover:bg-[#252538] border border-[#2a2a3a] text-[#888899] hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Reset courses to initial defaults"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Defaults</span>
          </button>

          <Link
            href="/"
            className="py-2.5 px-3.5 rounded-xl bg-[#1a1a26] hover:bg-[#252538] border border-[#2a2a3a] text-[#888899] hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>View Site</span>
          </Link>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#13131e] border border-[#2a2a3a] rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#888899] uppercase tracking-wider">Active Courses</span>
            <BookOpen className="w-4 h-4 text-[#6c63ff]" />
          </div>
          <div className="font-syne text-2xl sm:text-3xl font-black text-white">{courses.length}</div>
          <span className="text-[11px] text-[#02fd88] font-medium">Published on site</span>
        </div>

        <div className="bg-[#13131e] border border-[#2a2a3a] rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#888899] uppercase tracking-wider">Average Fee</span>
            <DollarSign className="w-4 h-4 text-[#02fd88]" />
          </div>
          <div className="font-syne text-2xl sm:text-3xl font-black text-white">Rs. {avgFee.toLocaleString()}</div>
          <span className="text-[11px] text-[#888899]">Per full course</span>
        </div>

        <div className="bg-[#13131e] border border-[#2a2a3a] rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#888899] uppercase tracking-wider">Student Enrolments</span>
            <Users className="w-4 h-4 text-[#818cf8]" />
          </div>
          <div className="font-syne text-2xl sm:text-3xl font-black text-white">{registrations.length}</div>
          <span className="text-[11px] text-[#818cf8]">Form submissions</span>
        </div>

        <div className="bg-[#13131e] border border-[#2a2a3a] rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#888899] uppercase tracking-wider">Pipeline Volume</span>
            <TrendingUp className="w-4 h-4 text-[#f59e0b]" />
          </div>
          <div className="font-syne text-2xl sm:text-3xl font-black text-[#02fd88]">
            Rs. {registrations.reduce((acc, r) => acc + (Number(r.fee) || 0), 0).toLocaleString()}
          </div>
          <span className="text-[11px] text-[#888899]">Total tuition logged</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-[#2a2a3a] mb-6">
        <div className="flex items-center gap-6">
          <button
            onClick={() => setActiveTab('courses')}
            className={`pb-3 text-sm font-bold transition-all relative cursor-pointer ${activeTab === 'courses' ? 'text-white' : 'text-[#888899] hover:text-white'
              }`}
          >
            <span>Courses Catalog ({courses.length})</span>
            {activeTab === 'courses' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6c63ff]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('registrations')}
            className={`pb-3 text-sm font-bold transition-all relative cursor-pointer ${activeTab === 'registrations' ? 'text-white' : 'text-[#888899] hover:text-white'
              }`}
          >
            <span>Student Submissions ({registrations.length})</span>
            {activeTab === 'registrations' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6c63ff]" />
            )}
          </button>
        </div>

        {activeTab === 'courses' && (
          <div className="relative min-w-[200px] sm:min-w-[260px] pb-2">
            <Search className="w-3.5 h-3.5 text-[#888899] absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#1a1a26] border border-[#2a2a3a] rounded-xl text-white placeholder-[#888899] focus:outline-none focus:border-[#6c63ff]"
            />
          </div>
        )}
      </div>

      {/* TAB 1: COURSES & PRICE MANAGEMENT */}
      {activeTab === 'courses' && (
        <div>
          {/* Table Container for Desktop, Cards for Mobile */}
          <div className="bg-[#13131e] border border-[#2a2a3a] rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#2a2a3a] bg-[#171724] text-[11px] font-bold text-[#888899] uppercase tracking-wider">
                    <th className="py-4 px-4 sm:px-6">Course Name</th>
                    <th className="py-4 px-4">Category</th>
                    <th className="py-4 px-4">Duration & Schedule</th>
                    <th className="py-4 px-4">Current Fee (PKR)</th>
                    <th className="py-4 px-4">Badge</th>
                    <th className="py-4 px-4 sm:px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2a2a3a]/60 text-xs sm:text-sm">
                  {filteredCourses.map((course) => (
                    <tr key={course.id} className="hover:bg-[#181827] transition-colors">
                      {/* Name & ID */}
                      <td className="py-4 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                            style={{ backgroundColor: `${course.accentColor}25`, color: course.accentColor }}
                          >
                            <BookOpen className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-syne font-bold text-white text-sm sm:text-base">
                              {course.name}
                            </div>
                            <div className="text-[11px] text-[#888899] line-clamp-1 max-w-xs">
                              {course.description}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span
                          className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
                          style={{ backgroundColor: `${course.accentColor}20`, color: course.accentColor }}
                        >
                          {course.categoryTag}
                        </span>
                      </td>

                      {/* Duration */}
                      <td className="py-4 px-4 whitespace-nowrap text-[#888899]">
                        <div>{course.duration}</div>
                        <div className="text-[11px] text-slate-500">{course.classesPerWeek}</div>
                      </td>

                      {/* Course Fee with Quick Inline Update */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="font-syne font-extrabold text-white text-base text-[#02fd88]">
                            Rs. {course.fee.toLocaleString()}
                          </span>
                          <button
                            onClick={() => {
                              const newFeeStr = prompt(`Update fee for ${course.name}:`, course.fee.toString());
                              if (newFeeStr) {
                                const parsed = parseInt(newFeeStr.replace(/[^0-9]/g, ''), 10);
                                if (!isNaN(parsed) && parsed > 0) {
                                  updateCourseFee(course.id, parsed);
                                  showToast(`Fee for ${course.name} updated to Rs. ${parsed.toLocaleString()}!`);
                                }
                              }
                            }}
                            className="text-[10px] px-2 py-0.5 rounded bg-[#1a1a26] hover:bg-[#252538] text-[#818cf8] border border-[#2a2a3a] cursor-pointer"
                            title="Quick price change"
                          >
                            Edit Rs
                          </button>
                        </div>
                      </td>

                      {/* Badge */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        {course.badge ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#6c63ff]/20 text-[#818cf8] border border-[#6c63ff]/30">
                            {course.badge}
                          </span>
                        ) : (
                          <span className="text-[11px] text-[#888899]">—</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditClick(course)}
                            className="p-2 rounded-xl bg-[#1a1a26] hover:bg-[#252538] text-white border border-[#2a2a3a] transition-colors cursor-pointer"
                            title="Edit Course Details"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-[#818cf8]" />
                          </button>
                          <button
                            onClick={() => handleDelete(course.id, course.name)}
                            className="p-2 rounded-xl bg-[#1a1a26] hover:bg-[#ff6584]/20 text-[#ff6584] border border-[#2a2a3a] transition-colors cursor-pointer"
                            title="Delete Course"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STUDENT REGISTRATIONS */}
      {activeTab === 'registrations' && (
        <div className="bg-[#13131e] border border-[#2a2a3a] rounded-2xl sm:rounded-3xl p-6 shadow-xl">
          {registrations.length === 0 ? (
            <div className="text-center py-16">
              <Users className="w-12 h-12 text-[#888899] mx-auto mb-3 opacity-50" />
              <h3 className="font-syne text-lg font-bold text-white mb-1">No Registrations Yet</h3>
              <p className="text-xs text-[#888899]">
                When students fill out the enrollment form on the home page, their submissions will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#2a2a3a] text-[11px] font-bold text-[#888899] uppercase tracking-wider">
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-4">Phone / WhatsApp</th>
                    <th className="py-3 px-4">Enrolled Course</th>
                    <th className="py-3 px-4">Fee Payable</th>
                    <th className="py-3 px-4">City</th>
                    <th className="py-3 px-4">Submission Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2a2a3a]/60 text-xs sm:text-sm">
                  {registrations.map((reg, idx) => (
                    <tr key={reg.id || idx} className="hover:bg-[#181827]">
                      <td className="py-3.5 px-4 font-semibold text-white">
                        {reg.fullName}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[#818cf8]">
                        {reg.phone}
                      </td>
                      <td className="py-3.5 px-4 text-white">
                        {reg.courseName}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[#02fd88]">
                        Rs. {Number(reg.fee || 0).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-[#888899]">
                        {reg.city || 'Karachi'}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 text-xs">
                        {reg.registeredAt ? new Date(reg.registeredAt).toLocaleDateString() : 'Recent'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* EDIT / CREATE COURSE MODAL */}
      {(editingCourse || isAddingNew) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#13131e] border border-[#2a2a3a] rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#2a2a3a]">
              <div>
                <h3 className="font-syne text-xl font-bold text-white">
                  {isAddingNew ? 'Add New Course' : `Edit: ${editingCourse?.name}`}
                </h3>
                <p className="text-xs text-[#888899]">
                  Changes are persisted and instantly update the public curriculum and payment fees.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingCourse(null);
                  setIsAddingNew(false);
                }}
                className="p-2 rounded-xl bg-[#1a1a26] text-[#888899] hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#888899] uppercase tracking-wider mb-1">
                  Course Name *
                </label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Artificial Intelligence & Python"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1a1a26] border border-[#2a2a3a] text-white text-sm focus:outline-none focus:border-[#6c63ff]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#888899] uppercase tracking-wider mb-1">
                    Course Fee (PKR) *
                  </label>
                  <input
                    type="number"
                    value={formData.fee || ''}
                    onChange={(e) => setFormData({ ...formData, fee: Number(e.target.value) })}
                    placeholder="8000"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1a1a26] border border-[#2a2a3a] text-white font-mono text-sm focus:outline-none focus:border-[#6c63ff]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#888899] uppercase tracking-wider mb-1">
                    Category Tag *
                  </label>
                  <input
                    type="text"
                    value={formData.categoryTag || ''}
                    onChange={(e) => setFormData({ ...formData, categoryTag: e.target.value })}
                    placeholder="e.g. Web Development"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1a1a26] border border-[#2a2a3a] text-white text-sm focus:outline-none focus:border-[#6c63ff]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#888899] uppercase tracking-wider mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={formData.duration || ''}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g. 2 Months"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1a1a26] border border-[#2a2a3a] text-white text-sm focus:outline-none focus:border-[#6c63ff]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#888899] uppercase tracking-wider mb-1">
                    Classes Per Week
                  </label>
                  <input
                    type="text"
                    value={formData.classesPerWeek || ''}
                    onChange={(e) => setFormData({ ...formData, classesPerWeek: e.target.value })}
                    placeholder="e.g. 3 Days / Week"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1a1a26] border border-[#2a2a3a] text-white text-sm focus:outline-none focus:border-[#6c63ff]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#888899] uppercase tracking-wider mb-1">
                    Badge / Tag (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.badge || ''}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="e.g. Most Popular"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1a1a26] border border-[#2a2a3a] text-white text-sm focus:outline-none focus:border-[#6c63ff]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#888899] uppercase tracking-wider mb-1">
                    Accent Color Hex
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={formData.accentColor || '#6c63ff'}
                      onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                      className="w-10 h-10 rounded-xl bg-transparent cursor-pointer border border-[#2a2a3a]"
                    />
                    <input
                      type="text"
                      value={formData.accentColor || '#6c63ff'}
                      onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                      className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#1a1a26] border border-[#2a2a3a] text-white font-mono text-xs focus:outline-none focus:border-[#6c63ff]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#888899] uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  placeholder="Summary of skills and career outcomes..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1a1a26] border border-[#2a2a3a] text-white text-sm focus:outline-none focus:border-[#6c63ff]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#2a2a3a]">
                <button
                  type="button"
                  onClick={() => {
                    setEditingCourse(null);
                    setIsAddingNew(false);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#1a1a26] hover:bg-[#252538] text-[#888899] hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#6c63ff] hover:bg-[#5b52e0] text-white text-xs font-bold transition-all shadow-lg shadow-[#6c63ff]/25 flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{isAddingNew ? 'Create Course' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#e8e8f0]">
      <Navbar />
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-sm text-[#888899]">Loading admin panel...</div>}>
        <AdminContent />
      </Suspense>
      <Footer />
    </div>
  );
}
