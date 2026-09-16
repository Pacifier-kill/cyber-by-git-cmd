'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  GraduationCap,
  Mail,
  Lock,
  User,
  Phone,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';

function SignUpContent() {
  const router = useRouter();
  const { signup } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'student' | 'admin'>('student');
  const [adminKey, setAdminKey] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!phone.trim() || phone.length < 10) {
      setError('Please enter a valid phone number (e.g. 0319-8647809).');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!agreeTerms) {
      setError('You must agree to the Terms of Service.');
      return;
    }

    // If choosing admin role, optionally check a passcode or grant admin
    signup(name, email, phone, role);
    setSuccess(true);
    setTimeout(() => {
      if (role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    }, 700);
  };

  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-lg mx-auto">
      <div className="bg-[#13131e] border border-[#2a2a3a] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-[#43e97b]/20 blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#6c63ff] via-[#818cf8] to-[#43e97b] p-0.5 mx-auto mb-3 shadow-lg shadow-[#6c63ff]/20">
            <div className="w-full h-full bg-[#111118] rounded-[14px] flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-[#43e97b]" />
            </div>
          </div>
          <h1 className="font-syne text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Create an Account
          </h1>
          <p className="text-xs sm:text-sm text-[#888899] mt-1">
            Join Cyber Nova Computer Academy Portal
          </p>
        </div>

        {/* Success Alert */}
        {success && (
          <div className="mb-4 p-3 rounded-xl bg-[#00a651]/15 border border-[#00a651]/40 text-[#02fd88] text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Account created successfully! Redirecting...</span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-[#ff6584]/15 border border-[#ff6584]/40 text-[#ff6584] text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Role Tab */}
        <div className="flex justify-center mb-5">
          <div className="p-1 bg-[#1a1a26] rounded-xl border border-[#2a2a3a] inline-flex">
            <button
              type="button"
              onClick={() => setRole('student')}
              className="px-6 py-2 rounded-lg text-xs font-semibold bg-[#6c63ff] text-white shadow-md transition-all cursor-pointer">
              Student Account
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-medium text-[#888899] mb-1">
              Full Name *
            </label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Muhammad Bilal Khan"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1a1a26] border border-[#2a2a3a] text-white text-sm focus:outline-none focus:border-[#6c63ff]"
              />
              <User className="w-4 h-4 text-[#888899] absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#888899] mb-1">
                Email Address *
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#1a1a26] border border-[#2a2a3a] text-white text-xs sm:text-sm focus:outline-none focus:border-[#6c63ff]"
                />
                <Mail className="w-4 h-4 text-[#888899] absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#888899] mb-1">
                Phone / WhatsApp *
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0319-8647809"
                  required
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#1a1a26] border border-[#2a2a3a] text-white text-xs sm:text-sm focus:outline-none focus:border-[#6c63ff]"
                />
                <Phone className="w-4 h-4 text-[#888899] absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#888899] mb-1">
                Password *
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 chars"
                  required
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#1a1a26] border border-[#2a2a3a] text-white text-xs sm:text-sm focus:outline-none focus:border-[#6c63ff]"
                />
                <Lock className="w-4 h-4 text-[#888899] absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#888899] mb-1">
                Confirm Password *
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  required
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#1a1a26] border border-[#2a2a3a] text-white text-xs sm:text-sm focus:outline-none focus:border-[#6c63ff]"
                />
                <Lock className="w-4 h-4 text-[#888899] absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>

          <div className="pt-1">
            <label className="flex items-start gap-2 text-xs text-[#888899] cursor-pointer">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 rounded bg-[#1a1a26] border-[#2a2a3a] text-[#6c63ff]"
              />
              <span>
                I agree to the Cyber Nova Academy rules, batch timings, and credential verification policies.
              </span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[#6c63ff] hover:bg-[#5b52e0] text-white font-bold text-sm transition-all shadow-xl shadow-[#6c63ff]/30 hover:shadow-[#6c63ff]/50 cursor-pointer flex items-center justify-center gap-2 mt-3"
          >
            <span>Complete Registration & Sign Up</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-6 text-center text-xs text-[#888899]">
          Already registered?{' '}
          <Link href="/login" className="text-[#818cf8] font-semibold hover:underline">
            Log in to existing account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#e8e8f0]">
      <Navbar />
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-sm text-[#888899]">Loading registration...</div>}>
        <SignUpContent />
      </Suspense>
      <Footer />
    </div>
  );
}
