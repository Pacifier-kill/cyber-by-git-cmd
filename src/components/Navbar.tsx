'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Menu, 
  X, 
  GraduationCap, 
  Phone, 
  MessageSquare, 
  Shield, 
  User, 
  LogIn, 
  LogOut, 
  Settings, 
  SlidersHorizontal,
  UserPlus
} from 'lucide-react';
import { ACADEMY_INFO } from '../data/courses';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onNavigateSection?: (sectionId: string) => void;
  activeSection?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigateSection, activeSection }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout, isAdmin } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    if (pathname === '/') {
      if (onNavigateSection) {
        onNavigateSection(sectionId);
      } else {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0a0a0f]/95 backdrop-blur-xl border-b border-[#2a2a3a] py-3 shadow-2xl shadow-black/60'
          : 'bg-[#0a0a0f]/80 backdrop-blur-md border-b border-[#2a2a3a]/60 py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 sm:gap-3 text-left group focus:outline-none shrink-0"
        >
          <img src="logo.jpg" alt="" />
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-[#6c63ff] via-[#818cf8] to-[#43e97b] p-[2px] shadow-lg shadow-[#6c63ff]/20">
            <div className="w-full h-full bg-[#111118] rounded-[10px] flex items-center justify-center group-hover:bg-[#1a1a26] transition-colors">
              <GraduationCap className="w-5 h-5 text-[#6c63ff] group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div>
            <div className="font-syne text-base sm:text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
              <span>Cyber</span>
              <span className="text-[#6c63ff]">Nova</span>
            </div>
            <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-[#888899] font-medium -mt-1 hidden xs:block">
              Computer Academy
            </p>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-1 xl:gap-1.5">
          {pathname === '/' ? (
            <>
              <button
                onClick={() => handleNavClick('home')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  activeSection === 'home' ? 'text-white bg-[#1a1a26] border border-[#2a2a3a]' : 'text-[#888899] hover:text-white'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => handleNavClick('courses')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  activeSection === 'courses' ? 'text-white bg-[#1a1a26] border border-[#2a2a3a]' : 'text-[#888899] hover:text-white'
                }`}
              >
                Courses
              </button>
              <button
                onClick={() => handleNavClick('about')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  activeSection === 'about' ? 'text-white bg-[#1a1a26] border border-[#2a2a3a]' : 'text-[#888899] hover:text-white'
                }`}
              >
                About Us
              </button>
              <button
                onClick={() => handleNavClick('register')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  activeSection === 'register' ? 'text-white bg-[#1a1a26] border border-[#2a2a3a]' : 'text-[#888899] hover:text-white'
                }`}
              >
                Register
              </button>
            </>
          ) : (
            <>
              <Link
                href="/"
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-[#888899] hover:text-white transition-all"
              >
                Home
              </Link>
              <Link
                href="/#courses"
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-[#888899] hover:text-white transition-all"
              >
                Courses
              </Link>
              <Link
                href="/#about"
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-[#888899] hover:text-white transition-all"
              >
                About Us
              </Link>
              <Link
                href="/#register"
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-[#888899] hover:text-white transition-all"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Desktop Action Buttons & Auth */}
        <div className="hidden sm:flex items-center gap-2 lg:gap-2.5">
          <a
            href={`https://wa.me/${ACADEMY_INFO.whatsappNumber}?text=Hi%20Cyber%20Nova,%20I%20have%20an%20inquiry%20about%20admissions`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-[#00a651]/15 text-[#02fd88] border border-[#00a651]/30 hover:bg-[#00a651]/25 transition-all"
            title="Chat on WhatsApp"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>0319-8647809</span>
          </a>

          {/* Auth Controls */}
          {user ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1a1a26] border border-[#2a2a3a] text-xs text-white">
                <div className="w-5 h-5 rounded-full bg-[#6c63ff] flex items-center justify-center text-[10px] font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="max-w-[100px] truncate font-medium">{user.name}</span>
                {user.role === 'admin' && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#6c63ff]/30 text-[#818cf8] border border-[#6c63ff]/40">
                    Admin
                  </span>
                )}
              </div>
              <button
                onClick={logout}
                className="p-1.5 rounded-lg text-[#888899] hover:text-white hover:bg-[#1a1a26] transition-colors"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <Link
                href="/login"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  pathname === '/login'
                    ? 'text-white bg-[#1a1a26] border border-[#2a2a3a]'
                    : 'text-[#888899] hover:text-white hover:bg-white/5'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Log In</span>
              </Link>
              <Link
                href="/signup"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1a1a26] hover:bg-[#252538] text-white border border-[#2a2a3a] hover:border-[#6c63ff]/50 text-xs sm:text-sm font-medium transition-all"
              >
                <UserPlus className="w-3.5 h-3.5 text-[#6c63ff]" />
                <span>Sign Up</span>
              </Link>
            </div>
          )}

          {pathname === '/' ? (
            <button
              onClick={() => handleNavClick('register')}
              className="px-3.5 py-1.5 rounded-lg bg-[#6c63ff] hover:bg-[#5b52e0] text-white text-xs sm:text-sm font-semibold transition-all shadow-md shadow-[#6c63ff]/30 hover:shadow-[#6c63ff]/50 cursor-pointer"
            >
              Enroll Now
            </button>
          ) : (
            <Link
              href="/#register"
              className="px-3.5 py-1.5 rounded-lg bg-[#6c63ff] hover:bg-[#5b52e0] text-white text-xs sm:text-sm font-semibold transition-all shadow-md shadow-[#6c63ff]/30 hover:shadow-[#6c63ff]/50"
            >
              Enroll Now
            </Link>
          )}
        </div>

        {/* Mobile Controls */}
        <div className="flex sm:hidden items-center gap-2">
          {user ? (
            <button
              onClick={logout}
              className="p-1.5 rounded-lg bg-[#1a1a26] text-[#888899] text-xs"
              title="Log Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          ) : (
            <Link
              href="/login"
              className="px-2.5 py-1 rounded-md bg-[#1a1a26] border border-[#2a2a3a] text-white text-xs font-medium"
            >
              Log In
            </Link>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-[#1a1a26] border border-[#2a2a3a] text-[#e8e8f0] hover:text-white focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0e0e15] border-b border-[#2a2a3a] px-4 pt-3 pb-6 mt-2 space-y-1 shadow-2xl">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-left text-sm font-medium text-[#888899] hover:bg-[#1a1a26] hover:text-white"
          >
            <span>Home</span>
          </Link>
          <Link
            href="/#courses"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-left text-sm font-medium text-[#888899] hover:bg-[#1a1a26] hover:text-white"
          >
            <span>Courses</span>
          </Link>
          <Link
            href="/#about"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-left text-sm font-medium text-[#888899] hover:bg-[#1a1a26] hover:text-white"
          >
            <span>About Us</span>
          </Link>
          <Link
            href="/#register"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-left text-sm font-medium text-[#888899] hover:bg-[#1a1a26] hover:text-white"
          >
            <span>Register Form</span>
          </Link>

          {/* Admin Panel in Mobile */}
          <Link
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-left text-sm font-medium ${
              pathname === '/admin' ? 'bg-[#6c63ff]/20 text-white' : 'text-[#888899] hover:bg-[#1a1a26] hover:text-white'
            }`}
          >
            <span className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#818cf8]" />
              <span>Admin Panel (Courses & Prices)</span>
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#6c63ff]/30 text-[#818cf8] font-bold">
              Manage
            </span>
          </Link>

          {/* User Auth Section in Mobile */}
          <div className="pt-2 border-t border-[#2a2a3a]">
            {user ? (
              <div className="p-3 bg-[#13131e] rounded-xl border border-[#2a2a3a] mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#6c63ff] flex items-center justify-center font-bold text-white text-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">{user.name}</div>
                    <div className="text-[10px] text-[#888899] capitalize">{user.role} Account</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs px-2.5 py-1 rounded bg-[#1a1a26] text-[#ff6584] hover:bg-[#252538]"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 my-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#1a1a26] border border-[#2a2a3a] text-white text-xs font-semibold"
                >
                  <LogIn className="w-3.5 h-3.5 text-[#6c63ff]" />
                  <span>Log In</span>
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#6c63ff] text-white text-xs font-semibold"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Sign Up</span>
                </Link>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-[#2a2a3a] flex flex-col gap-2">
            <a
              href={`https://wa.me/${ACADEMY_INFO.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#00a651]/20 text-[#02fd88] border border-[#00a651]/40 text-xs font-semibold"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Admission Desk (0319-8647809)</span>
            </a>
            <a
              href={`tel:${ACADEMY_INFO.phoneInternational}`}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#1a1a26] text-white border border-[#2a2a3a] text-xs font-semibold"
            >
              <Phone className="w-4 h-4 text-[#6c63ff]" />
              <span>Direct Call Institute</span>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};
