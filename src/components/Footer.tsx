import React from 'react';
import Link from 'next/link';
import { GraduationCap, Mail, Phone, MessageSquare, MapPin } from 'lucide-react';
import { ACADEMY_INFO, COURSES } from '../data/courses';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#111118] border-t border-[#2a2a3a] pt-14 pb-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Col */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#6c63ff] via-[#818cf8] to-[#43e97b] p-[2px]">
                <div className="w-full h-full bg-[#111118] rounded-[10px] flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-[#6c63ff]" />
                </div>
              </div>
              <span className="font-syne text-xl font-extrabold text-white">
                Cyber <span className="text-[#6c63ff]">Nova</span> Computer Academy
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-[#888899] leading-relaxed max-w-sm mb-6">
              Pakistan's leading institute for programming & IT education. Learn from experts, build real projects, and launch your career — all in a real classroom and interactive online sessions.
            </p>
            <div className="flex items-center gap-3">
              <a
                href={`https://wa.me/${ACADEMY_INFO.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-[#00a651]/15 text-[#02fd88] border border-[#00a651]/30 hover:bg-[#00a651]/25 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp Coordinator</span>
              </a>
              <a
                href={`tel:${ACADEMY_INFO.phoneInternational}`}
                className="px-3.5 py-2 rounded-xl bg-[#1a1a26] text-white border border-[#2a2a3a] hover:border-[#6c63ff]/50 text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#6c63ff]" />
                <span>Direct Call</span>
              </a>
            </div>
          </div>

          {/* Courses Col */}
          <div>
            <h4 className="font-syne text-sm font-bold text-white uppercase tracking-wider mb-4">
              Courses
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#888899]">
              {COURSES.slice(0, 5).map((c) => (
                <li key={c.id}>
                  <Link href={`/#courses`} className="hover:text-white transition-colors">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-syne text-sm font-bold text-white uppercase tracking-wider mb-4">
              More Courses
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#888899]">
              {COURSES.slice(5).map((c) => (
                <li key={c.id}>
                  <Link href={`/#courses`} className="hover:text-white transition-colors">
                    {c.name}
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <Link href="/verify" className="text-[#6c63ff] hover:underline font-semibold">
                  🔍 Verify Certificate
                </Link>
              </li>
              <li>
                <Link href="/payment" className="text-[#02fd88] hover:underline font-semibold">
                  💳 Fee Payment Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Col */}
          <div>
            <h4 className="font-syne text-sm font-bold text-white uppercase tracking-wider mb-4">
              Karachi Campus
            </h4>
            <ul className="space-y-3 text-xs text-[#888899]">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#ff6584] shrink-0 mt-0.5" />
                <span>{ACADEMY_INFO.address} (Plus Code: {ACADEMY_INFO.plusCode})</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#6c63ff] shrink-0" />
                <a href={`tel:${ACADEMY_INFO.phoneInternational}`} className="hover:text-white transition-colors">
                  {ACADEMY_INFO.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#43e97b] shrink-0" />
                <a href={`mailto:${ACADEMY_INFO.email}`} className="hover:text-white transition-colors break-all">
                  {ACADEMY_INFO.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Sub-footer */}
        <div className="pt-8 border-t border-[#2a2a3a] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#888899]">
          <p>© 2026 Cyber Nova Computer Academy. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Link href="/payment" className="hover:text-white transition-colors">Fee Payment</Link>
            <Link href="/verify" className="hover:text-white transition-colors">Certificate Verification</Link>
            <span className="text-[#2a2a3a]">|</span>
            <span>Batch 2026 Enrolment</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
