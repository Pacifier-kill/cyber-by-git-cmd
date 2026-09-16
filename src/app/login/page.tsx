'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  GraduationCap,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  User,
  SlidersHorizontal,
  CheckCircle2,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';
import { text } from 'stream/consumers';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/';

  const { login, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'admin'>('student');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedIdentifier = email.trim();

    if (!trimmedIdentifier) {
      setError('Please enter your email or username.');
      return;
    }

    if (role === 'admin') {
      // Strictly validate Admin credentials:
      // Username: 'Zayan' OR 'cybernova@gmail.com'
      // Password: 'admin123'
      const isValidAdminUser =
        trimmedIdentifier === 'Zayan' ||
        trimmedIdentifier.toLowerCase() === 'cybernova@gmail.com';
      const isValidAdminPass = password === 'admin123';

      if (!isValidAdminUser || !isValidAdminPass) {
        setError('Invalid Admin credentials. Please check your username and password.');
        return;
      }

      // Valid admin
      login('admin@cybernova.edu.pk', 'admin', 'Academy Admin');
      setSuccess(true);
      setTimeout(() => {
        router.push('/admin');
      }, 600);
    } else {
      // Student Login Flow
      if (!password || password.length < 4) {
        setError('Password must be at least 4 characters.');
        return;
      }

      login(email, role);
      setSuccess(true);
      setTimeout(() => {
        router.push(redirectPath);
      }, 600);
    }
  };

  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-md mx-auto">
      <div className="bg-[#13131e] border border-[#2a2a3a] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-[#6c63ff]/20 blur-3xl pointer-events-none" />

        {/* Icon & Title */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#6c63ff] via-[#818cf8] to-[#43e97b] p-0.5 mx-auto mb-3 shadow-lg shadow-[#6c63ff]/20">
            <div className="w-full h-full bg-[#111118] rounded-[14px] flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-[#6c63ff]" />
            </div>
          </div>
          <h1 className="font-syne text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome Back
          </h1>
          <p className="text-xs sm:text-sm text-[#888899] mt-1">
            Log in to your Cyber Nova account
          </p>
        </div>

        {/* Success Alert */}
        {success && (
          <div className="mb-4 p-3 rounded-xl bg-[#00a651]/15 border border-[#00a651]/40 text-[#02fd88] text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Login successful! Redirecting...</span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-[#ff6584]/15 border border-[#ff6584]/40 text-[#ff6584] text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-[#1a1a26] rounded-xl border border-[#2a2a3a] mb-5">
          <button
            type="button"
            onClick={() => setRole('student')}
            className={`py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${role === 'student'
                ? 'bg-[#6c63ff] text-white shadow-md'
                : 'text-[#888899] hover:text-white'
              }`}
          >
            Student Account
          </button>
          <button
            type="button"
            onClick={() => setRole('admin')}
            className={`py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${role === 'admin'
                ? 'bg-[#6c63ff] text-white shadow-md'
                : 'text-[#888899] hover:text-white'
              }`}
          >
            Academy Admin
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#888899] mb-1.5">
              Email Address / Username
            </label>
            <div className="relative">
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={role === 'admin' ? 'Enter admin username or Email' : 'Enter your email or username'}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1a1a26] border border-[#2a2a3a] text-white text-sm focus:outline-none focus:border-[#6c63ff] transition-colors"
              />
              <Mail className="w-4 h-4 text-[#888899] absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#888899] mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1a1a26] border border-[#2a2a3a] text-white text-sm focus:outline-none focus:border-[#6c63ff] transition-colors"
              />
              <Lock className="w-4 h-4 text-[#888899] absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 text-[#888899] cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded bg-[#1a1a26] border-[#2a2a3a] text-[#6c63ff]" />
              <span>Remember me</span>
            </label>
            <span className="text-[#818cf8] hover:underline cursor-pointer">Forgot password?</span>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[#6c63ff] hover:bg-[#5b52e0] text-white font-bold text-sm transition-all shadow-xl shadow-[#6c63ff]/30 hover:shadow-[#6c63ff]/50 cursor-pointer flex items-center justify-center gap-2 mt-2"
          >
            <span>{role === 'admin' ? 'Log In as Administrator' : 'Log In to Student Portal'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Signup Link */}
        <div className="mt-6 text-center text-xs text-[#888899]">
          Don't have an account?{' '}
          <Link href="/signup" className="text-[#818cf8] font-semibold hover:underline">
            Sign up here
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#e8e8f0]">
      <Navbar />
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-sm text-[#888899]">Loading login...</div>}>
        <LoginContent />
      </Suspense>
      <Footer />
    </div>
  );
}
