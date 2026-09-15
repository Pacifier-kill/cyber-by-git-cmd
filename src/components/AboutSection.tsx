'use client';

import React from 'react';
import { Target, Monitor, Award, Handshake, CheckCircle, Sparkles } from 'lucide-react';
import { SATISFACTION_METRICS } from '../data/courses';

export const AboutSection: React.FC = () => {
  const features = [
    {
      icon: Target,
      color: 'text-[#ff6584]',
      bg: 'bg-[#ff6584]/10',
      border: 'border-[#ff6584]/20',
      title: 'Project-Based Learning',
      desc: 'Every course culminates in a real capstone portfolio project you can showcase to employers and freelance clients — not just abstract theory.'
    },
    {
      icon: Monitor,
      color: 'text-[#6c63ff]',
      bg: 'bg-[#6c63ff]/10',
      border: 'border-[#6c63ff]/20',
      title: 'In-Person & Online Live Classes',
      desc: 'Learn directly from seasoned mentors in our modern air-conditioned computer lab in Karachi, or join interactive live classes with screen sharing.'
    },
    {
      icon: Award,
      color: 'text-[#43e97b]',
      bg: 'bg-[#43e97b]/10',
      border: 'border-[#43e97b]/20',
      title: 'Industry-Recognised Certificate',
      desc: 'Receive a digitally verifiable QR-enabled certificate upon completion, instantly sharable on LinkedIn and verifiable via our online portal.'
    },
    {
      icon: Handshake,
      color: 'text-[#f59e0b]',
      bg: 'bg-[#f59e0b]/10',
      border: 'border-[#f59e0b]/20',
      title: 'Career & Freelance Support',
      desc: 'Resume reviews, Upwork/Fiverr freelance optimization, mock interviews, and job placement recommendations for top-performing students.'
    }
  ];

  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0a0a0f]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Mission & Features */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6c63ff]/10 text-[#818cf8] text-xs font-semibold tracking-wider uppercase mb-3 border border-[#6c63ff]/20">
              Why Cyber Nova Academy
            </div>

            <h2 className="font-syne text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
              Learn in a Real <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6c63ff] to-[#43e97b]">
                Classroom Environment
              </span>
            </h2>

            <p className="text-[#888899] text-base sm:text-lg leading-relaxed mb-8">
              We don't just teach syntax — we build real problem-solvers. Our instructors are experienced industry professionals who mentor hands-on, face-to-face at our institute.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={index}
                    className="p-5 rounded-2xl bg-[#111118] border border-[#2a2a3a] hover:border-[#6c63ff]/50 transition-all duration-200 group"
                  >
                    <div className={`w-11 h-11 rounded-xl ${item.bg} border ${item.border} flex items-center justify-center mb-3.5 group-hover:scale-105 transition-transform`}>
                      <Icon className={`w-5 h-5 ${item.color}`} />
                    </div>
                    <h3 className="font-syne text-base font-bold text-white mb-1.5">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#888899] leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Student Satisfaction Visual Metrics */}
          <div className="lg:col-span-5">
            <div className="bg-[#111118] border border-[#2a2a3a] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#2a2a3a]">
                <div>
                  <h3 className="font-syne text-lg font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#43e97b]" />
                    <span>Student Satisfaction</span>
                  </h3>
                  <p className="text-xs text-[#888899] mt-0.5">Based on 1,000+ course evaluations</p>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#43e97b]/15 text-[#02fd88] border border-[#43e97b]/30">
                  98% Avg.
                </span>
              </div>

              {/* Progress Bars */}
              <div className="space-y-4">
                {SATISFACTION_METRICS.map((item, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-xs font-medium mb-1.5">
                      <span className="text-[#e8e8f0]">{item.course}</span>
                      <span className="font-bold text-white">{item.percentage}%</span>
                    </div>
                    <div className="h-2 w-full bg-[#1a1a26] rounded-full overflow-hidden border border-[#2a2a3a]/40">
                      <div
                        className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-1000`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Lab Facilities Note */}
              <div className="mt-8 pt-6 border-t border-[#2a2a3a] bg-[#1a1a26]/40 -mx-6 -mb-6 p-6 rounded-b-3xl">
                <div className="text-xs font-semibold uppercase tracking-wider text-[#6c63ff] mb-2 flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Campus Infrastructure Highlights</span>
                </div>
                <p className="text-xs text-[#888899] leading-relaxed">
                  High-speed fiber-optic connectivity, dedicated workstations, uninterrupted solar & generator backup power, and central Soldier Bazaar location.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
