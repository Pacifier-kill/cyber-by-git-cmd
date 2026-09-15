'use client';

import React from 'react';
import { ArrowRight, Sparkles, Users, BookOpen, Award, MapPin, CheckCircle, ShieldCheck } from 'lucide-react';
import { ACADEMY_INFO } from '../data/courses';

interface HeroProps {
  onExploreCourses: () => void;
  onRegister: () => void;
  onVerifyCertificate: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreCourses,
  onRegister,
  onVerifyCertificate
}) => {
  return (
    <section id="home" className="relative min-h-[90vh] flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 pt-32 pb-20 overflow-hidden">
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[800px] h-[350px] sm:h-[450px] bg-[#6c63ff]/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-2/3 right-10 w-[350px] h-[350px] bg-[#ff6584]/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute top-2/3 left-10 w-[350px] h-[350px] bg-[#43e97b]/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f2e15_1px,transparent_1px),linear-gradient(to_bottom,#1f1f2e15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
        {/* Batch Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1a1a26]/90 border border-[#2a2a3a] text-xs sm:text-sm font-medium text-[#6c63ff] shadow-lg shadow-black/40 mb-6 hover:border-[#6c63ff]/50 transition-colors">
          <span className="w-2 h-2 rounded-full bg-[#43e97b] animate-pulse-dot" />
          <span>Admissions Open — Batch 2026</span>
          <span className="text-[#888899]">•</span>
          <span className="text-white text-xs">Karachi Campus & Online</span>
        </div>

        {/* Main Display Headline */}
        <h1 className="font-syne text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.08] mb-6">
          Master <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6c63ff] via-[#818cf8] to-[#a855f7]">Coding</span>
          <br />
          <span className="text-[#888899]">Shape Your Future</span>
        </h1>

        {/* Subhead */}
        <p className="text-base sm:text-lg md:text-xl text-[#888899] max-w-2xl mx-auto leading-relaxed mb-8 sm:mb-10 font-normal">
          Pakistan's premier computer academy. Learn Python, C++, Modern Web Development, 
          Shopify, Facebook Meta Ads, and Graphic Designing with AI from expert instructors in hands-on, in-person & online batches.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto mb-14">
          <button
            onClick={onExploreCourses}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#6c63ff] hover:bg-[#5b52e0] text-white font-semibold text-base transition-all duration-200 shadow-xl shadow-[#6c63ff]/35 hover:shadow-[#6c63ff]/50 hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Explore Courses</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onRegister}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#13131e] hover:bg-[#1a1a26] text-white border border-[#2a2a3a] hover:border-[#6c63ff] font-medium text-base transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Register Free</span>
            <Sparkles className="w-4 h-4 text-[#43e97b]" />
          </button>

          <button
            onClick={onVerifyCertificate}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-transparent hover:bg-[#1a1a26]/50 text-[#888899] hover:text-white border border-transparent hover:border-[#2a2a3a] text-sm font-medium transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-[#6c63ff]" />
            <span>Verify Certificate</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="w-full max-w-3xl grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-8 border-t border-[#2a2a3a]/60">
          <div className="bg-[#111118]/80 backdrop-blur-sm border border-[#2a2a3a] rounded-2xl p-4 text-center hover:border-[#6c63ff]/40 transition-colors">
            <div className="flex items-center justify-center gap-1 text-[#6c63ff] mb-1">
              <Users className="w-4 h-4" />
            </div>
            <div className="font-syne text-2xl sm:text-3xl font-extrabold text-white">
              1,000<span className="text-[#6c63ff]">+</span>
            </div>
            <div className="text-xs text-[#888899] font-medium mt-0.5">Students Enrolled</div>
          </div>

          <div className="bg-[#111118]/80 backdrop-blur-sm border border-[#2a2a3a] rounded-2xl p-4 text-center hover:border-[#6c63ff]/40 transition-colors">
            <div className="flex items-center justify-center gap-1 text-[#43e97b] mb-1">
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="font-syne text-2xl sm:text-3xl font-extrabold text-white">
              9<span className="text-[#43e97b]"> Courses</span>
            </div>
            <div className="text-xs text-[#888899] font-medium mt-0.5">Offered in 2026</div>
          </div>

          <div className="bg-[#111118]/80 backdrop-blur-sm border border-[#2a2a3a] rounded-2xl p-4 text-center hover:border-[#6c63ff]/40 transition-colors">
            <div className="flex items-center justify-center gap-1 text-[#ff6584] mb-1">
              <Award className="w-4 h-4" />
            </div>
            <div className="font-syne text-2xl sm:text-3xl font-extrabold text-white">
              98<span className="text-[#ff6584]">%</span>
            </div>
            <div className="text-xs text-[#888899] font-medium mt-0.5">Completion Rate</div>
          </div>

          <div className="bg-[#111118]/80 backdrop-blur-sm border border-[#2a2a3a] rounded-2xl p-4 text-center hover:border-[#6c63ff]/40 transition-colors">
            <div className="flex items-center justify-center gap-1 text-[#02fd88] mb-1">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="font-syne text-xl sm:text-2xl font-extrabold text-white">
              Karachi
            </div>
            <div className="text-xs text-[#888899] font-medium mt-0.5">Campus & Online</div>
          </div>
        </div>

        {/* Campus Trust Points */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-8 text-xs text-[#888899]">
          <div className="flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-[#43e97b]" />
            <span>Verified Digital Certificates</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-[#43e97b]" />
            <span>Modern Air-Conditioned Computer Labs</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-[#43e97b]" />
            <span>1-on-1 Instructor Project Mentorship</span>
          </div>
        </div>
      </div>
    </section>
  );
};
