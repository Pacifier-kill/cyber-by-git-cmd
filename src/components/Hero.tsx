'use client';

import React from 'react';
import { ArrowRight, Sparkles, Users, BookOpen, Award, MapPin, CheckCircle, ShieldCheck } from 'lucide-react';
import { ACADEMY_INFO } from '../data/courses';
import { div } from 'motion/react-client';

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
    <div id="home" className="relative min-h-[90vh] flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 pt-32 pb-20 overflow-hidden">
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
          Skills that you can learn <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6c63ff] via-[#818cf8] to-[#a855f7]">Knowledge that you can apply</span>
          <br />
        </h1>

        {/* Admissions Open Badge*/}
        <div className="inline-flex items-center justify-center gap-3 px-6 py-2.5 bg-cyan-950/20 border border-cyan-400/40 rounded shadow-[0_0_10px_rgba(0,180,255,0.1)] text-sm md:text-base font-semibold tracking-widest text-white uppercase backdrop-blur-xs">
          {/* Cap Icon */}
          <svg
            className="w-5 h-5 text-cyan-400/90 drop-shadow-[0_0_3px_rgba(0,212,255,0.3)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          </svg>

          <span className="border-l border-white/20 pl-3">
            ADMISSIONS OPEN — BATCH 2026
          </span>
        </div>

        {/* Subhead */}
        <div><br /><p className="text-base sm:text-lg md:text-xl text-[#888899] max-w-2xl mx-auto leading-relaxed mb-8 sm:mb-10 font-normal">
          Learn through structured courses, practical exercises,<br className="hidden sm:inline" />
          instructor guidance, and consistent practice—<br className="hidden sm:inline" />
          with online learning available for students beyond your local area.
        </p>
        </div>

        <div className="relative pt-5 border-t border-cyan-500/20 flex items-center justify-center gap-3 text-xs md:text-sm font-mono font-bold tracking-widest text-slate-200">
          {/* Center Top Glowing Notch */}
          <div className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-20 h-[2px] bg-cyan-400 shadow-[0_0_8px_#00bfff]" />

          <span>LEARN</span>
          <span className="text-cyan-400 text-xs drop-shadow-[0_0_5px_#00bfff]">•</span>
          <span>PRACTICE</span>
          <span className="text-cyan-400 text-xs drop-shadow-[0_0_5px_#00bfff]">•</span>
          <span>CREATE</span>
          <span className="text-cyan-400 text-xs drop-shadow-[0_0_5px_#00bfff]">•</span>
          <span>PROGRESS</span>
        </div>
      </div>
      <br />
      <br />
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
  );
};
