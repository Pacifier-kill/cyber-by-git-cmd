'use client';

import React, { useState, useEffect } from 'react';
import { Send, MessageSquare, CheckCircle, AlertCircle, Sparkles, User, Mail, Phone, MapPin, BookOpen } from 'lucide-react';
import confetti from 'canvas-confetti';
import emailjs from '@emailjs/browser';
import { COURSES, ACADEMY_INFO } from '../data/courses';
import { useCourses } from '../context/CoursesContext';
import { RegistrationFormData, Course } from '../types';

interface RegistrationSectionProps {
  selectedCourseId?: string;
  onRegistered: (data: {
    name: string;
    email: string;
    phone: string;
    courseName: string;
    fee: number;
  }) => void;
}

const EMAILJS_CONFIG = {
  serviceId: 'service_f3ri0dp',
  templateId: 'template_elm6jqr',
  publicKey: 'L4IGGcxR1XaRzcOt8'
};

export const RegistrationSection: React.FC<RegistrationSectionProps> = ({
  selectedCourseId,
  onRegistered
}) => {
  const { courses } = useCourses();
  const [formData, setFormData] = useState<RegistrationFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: 'Karachi',
    courseId: selectedCourseId || (courses[0]?.id ?? 'ms-office'),
    experience: ''
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successState, setSuccessState] = useState(false);

  // Sync if selected course changes from parent
  useEffect(() => {
    if (selectedCourseId) {
      setFormData((prev) => ({ ...prev, courseId: selectedCourseId }));
    }
  }, [selectedCourseId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage(null);
  };

  const selectedCourseObj = courses.find((c) => c.id === formData.courseId) || courses[0] || COURSES[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setErrorMessage('Please enter your complete first and last name.');
      return;
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrorMessage('Please provide a valid email address.');
      return;
    }
    if (!formData.phone.trim() || formData.phone.length < 10) {
      setErrorMessage('Please enter a valid contact phone number (e.g. 0319-8647809).');
      return;
    }
    if (!formData.courseId) {
      setErrorMessage('Please select a course to enroll.');
      return;
    }

    setLoading(true);

    const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`;
    const courseName = selectedCourseObj.name;
    const feeAmount = selectedCourseObj.fee;

    // Store completed registration in localStorage
    const regRecord = {
      id: `REG-${Date.now().toString().slice(-6)}`,
      fullName,
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      city: formData.city,
      courseId: selectedCourseObj.id,
      courseName,
      fee: feeAmount,
      experience: formData.experience || 'Beginner',
      registeredAt: new Date().toISOString()
    };

    try {
      localStorage.setItem('cybernova_active_registration', JSON.stringify(regRecord));
      const existing = JSON.parse(localStorage.getItem('cybernova_all_registrations') || '[]');
      existing.unshift(regRecord);
      localStorage.setItem('cybernova_all_registrations', JSON.stringify(existing));
    } catch (err) {
      console.error('Failed to save student registration locally:', err);
    }

    // 1. Prepare WhatsApp text
    const waText = encodeURIComponent(
      `*New Registration - Cyber Nova Computer Academy*\n` +
      `Name: ${fullName}\n` +
      `Email: ${formData.email}\n` +
      `Phone: ${formData.phone}\n` +
      `City: ${formData.city}\n` +
      `Course: ${courseName} (Rs. ${feeAmount.toLocaleString()})\n` +
      `Experience: ${formData.experience.trim() || 'Beginner'}`
    );

    // 2. Open WhatsApp in new tab
    try {
      window.open(`https://wa.me/${ACADEMY_INFO.whatsappNumber}?text=${waText}`, '_blank');
    } catch {
      // browser pop-up guard
    }

    // 3. EmailJS Dispatch (best-effort)
    try {
      await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        {
          from_name: fullName,
          from_email: formData.email,
          reply_to: formData.email,
          phone: formData.phone,
          city: formData.city,
          course: `${courseName} — Rs. ${feeAmount}`,
          experience: formData.experience || 'Not provided',
          submit_time: new Date().toLocaleString('en-PK', { timeZone: 'Asia/Karachi' })
        },
        EMAILJS_CONFIG.publicKey
      );
    } catch (err) {
      console.warn('EmailJS notification was caught (proceeding normally):', err);
    }

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // Confetti fallback
    }

    setLoading(false);
    setSuccessState(true);

    // Call parent handler to transfer into payment flow or confirmation
    onRegistered({
      name: fullName,
      email: formData.email,
      phone: formData.phone,
      courseName,
      fee: feeAmount
    });
  };

  return (
    <section id="register" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#111118]/80 border-t border-[#2a2a3a]">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Info Column & Steps */}
          <div className="lg:col-span-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6c63ff]/10 text-[#818cf8] text-xs font-semibold tracking-wider uppercase mb-3 border border-[#6c63ff]/20">
              Enrolment 2026
            </div>
            <h2 className="font-syne text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
              Register <br />
              <span className="text-[#6c63ff]">Today</span>
            </h2>
            <p className="text-[#888899] text-sm sm:text-base leading-relaxed mb-8">
              Seats are limited per batch to ensure individual attention. Fill in your details and our admissions desk will confirm your enrollment within 24 hours.
            </p>

            {/* Steps Timeline */}
            <div className="space-y-4">
              <div className="flex gap-4 items-start p-3.5 rounded-xl bg-[#13131e] border border-[#2a2a3a]">
                <div className="w-8 h-8 rounded-lg bg-[#6c63ff] text-white flex items-center justify-center font-syne font-bold text-xs shrink-0">
                  1
                </div>
                <div>
                  <h4 className="font-syne text-sm font-bold text-white">Fill the Form</h4>
                  <p className="text-xs text-[#888899] mt-0.5">Enter your personal details and choose your preferred course.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start p-3.5 rounded-xl bg-[#13131e] border border-[#2a2a3a]">
                <div className="w-8 h-8 rounded-lg bg-[#6c63ff] text-white flex items-center justify-center font-syne font-bold text-xs shrink-0">
                  2
                </div>
                <div>
                  <h4 className="font-syne text-sm font-bold text-white">Get Confirmation</h4>
                  <p className="text-xs text-[#888899] mt-0.5">We will message you on WhatsApp to confirm your batch timings.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start p-3.5 rounded-xl bg-[#13131e] border border-[#2a2a3a]">
                <div className="w-8 h-8 rounded-lg bg-[#00a651] text-white flex items-center justify-center font-syne font-bold text-xs shrink-0">
                  3
                </div>
                <div>
                  <h4 className="font-syne text-sm font-bold text-white">Fee Payment</h4>
                  <p className="text-xs text-[#888899] mt-0.5">Pay via Easypaisa, JazzCash, or Bank Transfer to secure your seat.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start p-3.5 rounded-xl bg-[#13131e] border border-[#2a2a3a]">
                <div className="w-8 h-8 rounded-lg bg-[#818cf8] text-white flex items-center justify-center font-syne font-bold text-xs shrink-0">
                  4
                </div>
                <div>
                  <h4 className="font-syne text-sm font-bold text-white">Start Learning</h4>
                  <p className="text-xs text-[#888899] mt-0.5">Join the Karachi campus or attend your first live online session!</p>
                </div>
              </div>
            </div>

            {/* Direct Contact reminder */}
            <div className="mt-8 p-4 rounded-2xl bg-[#00a651]/10 border border-[#00a651]/30 flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-[#02fd88] shrink-0" />
              <div className="text-xs text-[#e8e8f0]">
                Need immediate help? WhatsApp our coordinator directly at{' '}
                <a
                  href={`https://wa.me/${ACADEMY_INFO.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold underline text-[#02fd88]"
                >
                  {ACADEMY_INFO.phone}
                </a>
              </div>
            </div>
          </div>

          {/* Right Form Card */}
          <div className="lg:col-span-7">
            <div className="bg-[#13131e] border border-[#2a2a3a] rounded-3xl p-6 sm:p-8 shadow-2xl relative">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#2a2a3a]">
                <h3 className="font-syne text-xl font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#6c63ff]" />
                  <span>Student Registration Form</span>
                </h3>
                <span className="text-xs text-[#888899]">All fields marked with * are required</span>
              </div>

              {errorMessage && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs sm:text-sm flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {successState && (
                <div className="mb-6 p-4 rounded-xl bg-[#00a651]/15 border border-[#00a651]/40 text-[#02fd88] text-xs sm:text-sm flex items-start gap-2.5">
                  <CheckCircle className="w-5 h-5 text-[#43e97b] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-white">Registration Submitted Successfully!</div>
                    <div>A copy was sent to the academy WhatsApp desk. Proceeding to the fee payment section...</div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#888899] mb-1.5 flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-[#6c63ff]" />
                      <span>First Name *</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="e.g. Ali"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1a1a26] border border-[#2a2a3a] text-white text-sm focus:outline-none focus:border-[#6c63ff] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#888899] mb-1.5 flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-[#6c63ff]" />
                      <span>Last Name *</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="e.g. Hassan"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1a1a26] border border-[#2a2a3a] text-white text-sm focus:outline-none focus:border-[#6c63ff] transition-colors"
                    />
                  </div>
                </div>

                {/* Email and Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#888899] mb-1.5 flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-[#6c63ff]" />
                      <span>Email Address *</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="you@example.com"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1a1a26] border border-[#2a2a3a] text-white text-sm focus:outline-none focus:border-[#6c63ff] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#888899] mb-1.5 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-[#6c63ff]" />
                      <span>Phone / WhatsApp *</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="03XX-XXXXXXX"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1a1a26] border border-[#2a2a3a] text-white text-sm focus:outline-none focus:border-[#6c63ff] transition-colors"
                    />
                  </div>
                </div>

                {/* City and Course */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#888899] mb-1.5 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#6c63ff]" />
                      <span>City *</span>
                    </label>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1a1a26] border border-[#2a2a3a] text-white text-sm focus:outline-none focus:border-[#6c63ff] transition-colors"
                    >
                      <option value="Karachi">Karachi (Campus / Online)</option>
                      <option value="Lahore">Lahore</option>
                      <option value="Islamabad">Islamabad</option>
                      <option value="Rawalpindi">Rawalpindi</option>
                      <option value="Peshawar">Peshawar</option>
                      <option value="Quetta">Quetta</option>
                      <option value="Hyderabad">Hyderabad</option>
                      <option value="Faisalabad">Faisalabad</option>
                      <option value="Other">Other City / Overseas</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#888899] mb-1.5 flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-[#6c63ff]" />
                      <span>Course to Enroll *</span>
                    </label>
                    <select
                      name="courseId"
                      value={formData.courseId}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1a1a26] border border-[#2a2a3a] text-white text-sm focus:outline-none focus:border-[#6c63ff] transition-colors"
                    >
                      {courses.map((course) => (
                        <option key={course.id} value={course.id}>
                          {course.name} — Rs. {course.fee.toLocaleString()}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Prior Experience */}
                <div>
                  <label className="block text-xs font-medium text-[#888899] mb-1.5">
                    Prior Coding or Academic Background (Optional)
                  </label>
                  <textarea
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Briefly describe if you are a beginner, high school student, graduate, or have any prior software experience..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1a1a26] border border-[#2a2a3a] text-white text-sm focus:outline-none focus:border-[#6c63ff] transition-colors resize-none"
                  />
                  {/* The exact glowing morning note from the user's HTML */}
                  <p className="glow-emerald text-xs sm:text-sm font-semibold mt-2">
                    Note : For Morning Classes Plz contact us on Whatsapp
                  </p>
                </div>

                {/* Submit button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-6 rounded-xl bg-[#6c63ff] hover:bg-[#5b52e0] text-white font-semibold text-sm sm:text-base transition-all shadow-xl shadow-[#6c63ff]/35 hover:shadow-[#6c63ff]/50 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {loading ? (
                      <span>Submitting Registration...</span>
                    ) : (
                      <>
                        <span>Submit Registration & Proceed →</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                  <p className="text-center text-[11px] text-[#888899] mt-2.5">
                    Submitting opens WhatsApp with your pre-filled inquiry and routes to the fee payment portal.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
