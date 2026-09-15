'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Copy, 
  Check, 
  Building2, 
  MessageSquare, 
  ShieldCheck, 
  Download, 
  Printer, 
  CheckCircle2,
  Smartphone,
  CreditCard,
  GraduationCap,
  AlertCircle,
  Lock,
  UserCheck,
  FileEdit,
  Sparkles,
  Search
} from 'lucide-react';
import { ACADEMY_INFO } from '../../data/courses';
import { useCourses } from '../../context/CoursesContext';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { courses } = useCourses();

  // Check URL params
  const urlRegistered = searchParams.get('registered') === 'true';
  const urlName = searchParams.get('name') || '';
  const urlPhone = searchParams.get('phone') || '';
  const urlEmail = searchParams.get('email') || '';
  const urlCourse = searchParams.get('course') || '';
  const urlFee = searchParams.get('fee') ? Number(searchParams.get('fee')) : 0;

  // Registration state
  const [isRegistrationVerified, setIsRegistrationVerified] = useState(false);
  const [registeredStudent, setRegisteredStudent] = useState<any>(null);
  const [lookupPhone, setLookupPhone] = useState('');
  const [lookupError, setLookupError] = useState<string | null>(null);

  // Form payment states
  const [studentName, setStudentName] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [selectedCourseName, setSelectedCourseName] = useState('Basic Computer & MS Office');
  const [selectedFee, setSelectedFee] = useState(7000);

  const [paymentMethod, setPaymentMethod] = useState<'nbp' | 'easypaisa' | 'jazzcash' | 'meezan'>('nbp');
  const [transactionId, setTransactionId] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [voucherGenerated, setVoucherGenerated] = useState(false);
  const [voucherData, setVoucherData] = useState<any>(null);

  // Evaluate registration on mount or searchParams change
  useEffect(() => {
    // 1. If explicit URL registration params exist
    if ((urlRegistered || urlName) && urlPhone) {
      setIsRegistrationVerified(true);
      setStudentName(urlName);
      setStudentPhone(urlPhone);
      setStudentEmail(urlEmail);
      if (urlCourse) {
        setSelectedCourseName(urlCourse);
        const match = courses.find(c => c.name.toLowerCase() === urlCourse.toLowerCase());
        setSelectedFee(urlFee || match?.fee || 7000);
      }
      setRegisteredStudent({
        fullName: urlName,
        phone: urlPhone,
        email: urlEmail,
        courseName: urlCourse,
        fee: urlFee
      });
      return;
    }

    // 2. Otherwise check localStorage for active registration
    try {
      const stored = localStorage.getItem('cybernova_active_registration');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.fullName && parsed.phone) {
          setIsRegistrationVerified(true);
          setRegisteredStudent(parsed);
          setStudentName(parsed.fullName);
          setStudentPhone(parsed.phone);
          setStudentEmail(parsed.email || '');
          setSelectedCourseName(parsed.courseName || courses[0]?.name || 'Basic Computer & MS Office');
          setSelectedFee(parsed.fee || courses[0]?.fee || 7000);
          return;
        }
      }
    } catch (e) {
      console.error(e);
    }

    setIsRegistrationVerified(false);
  }, [urlRegistered, urlName, urlPhone, urlEmail, urlCourse, urlFee, courses]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedKey(key);
      showToast(`Copied: ${text}`);
      setTimeout(() => setCopiedKey(null), 2500);
    });
  };

  const handleLookupByPhone = (e: React.FormEvent) => {
    e.preventDefault();
    setLookupError(null);
    const cleaned = lookupPhone.trim().replace(/[-\s]/g, '');
    if (!cleaned || cleaned.length < 9) {
      setLookupError('Please enter a valid Pakistani phone number (e.g. 03198647809).');
      return;
    }

    try {
      const allRegs = JSON.parse(localStorage.getItem('cybernova_all_registrations') || '[]');
      const found = allRegs.find((r: any) => 
        r.phone && r.phone.replace(/[-\s]/g, '').includes(cleaned)
      );

      if (found) {
        setIsRegistrationVerified(true);
        setRegisteredStudent(found);
        setStudentName(found.fullName);
        setStudentPhone(found.phone);
        setStudentEmail(found.email || '');
        setSelectedCourseName(found.courseName);
        setSelectedFee(found.fee);
        showToast(`Registration verified for ${found.fullName}!`);
      } else {
        setLookupError('No existing registration record was found with this phone number. Please fill the enrollment form first.');
      }
    } catch (e) {
      setLookupError('Lookup failed. Please fill the registration form.');
    }
  };

  const handleConfirmOnWhatsApp = () => {
    const nameStr = studentName.trim() || 'Student';
    const phoneStr = studentPhone.trim() || 'Not provided';
    const msg = 
      `*Payment Confirmation - Cyber Nova Computer Academy*\n` +
      `Name: ${nameStr}\n` +
      `Phone: ${phoneStr}\n` +
      `Course: ${selectedCourseName}\n` +
      `Amount: Rs. ${selectedFee.toLocaleString('en-PK')}\n` +
      `Method: ${paymentMethod.toUpperCase()}\n` +
      `Transaction ID: ${transactionId.trim() || 'Attaching screenshot'}\n` +
      `(Attaching payment screenshot)`;
    
    window.open(`https://wa.me/${ACADEMY_INFO.whatsappNumber}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleGenerateVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !studentPhone.trim()) {
      showToast('Please enter your full name and phone number.');
      return;
    }

    const data = {
      receiptNo: `CN-${Date.now().toString().slice(-6)}`,
      date: new Date().toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' }),
      studentName: studentName.trim(),
      studentPhone: studentPhone.trim(),
      course: selectedCourseName,
      amount: selectedFee,
      method: paymentMethod.toUpperCase(),
      transactionId: transactionId.trim() || 'PENDING_SLIP',
      status: 'VERIFIED & ENROLLED'
    };

    setVoucherData(data);
    setVoucherGenerated(true);
    showToast('Enrollment voucher created successfully!');
  };

  // If user has NOT filled registration form, show clean guard
  if (!isRegistrationVerified) {
    return (
      <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto text-center">
        <div className="bg-[#13131e] border border-[#2a2a3a] rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          {/* Subtle top background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-24 bg-[#ff6584]/15 blur-3xl pointer-events-none" />

          {/* Lock Icon */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#ff6584]/15 border border-[#ff6584]/30 text-[#ff6584] mx-auto flex items-center justify-center mb-6 shadow-xl">
            <Lock className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ff6584]/15 text-[#ff6584] text-xs font-semibold uppercase tracking-wider mb-3 border border-[#ff6584]/30">
            Registration Required First
          </div>

          <h1 className="font-syne text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-4">
            Complete Student Registration Before Payment
          </h1>

          <p className="text-sm sm:text-base text-[#888899] max-w-xl mx-auto leading-relaxed mb-8">
            Fee payments can only be processed after your official registration record is submitted. This ensures your student ID, enrolled batch, and verification credentials match our records.
          </p>

          {/* Action to fill form */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-10">
            <Link
              href="/#register"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#6c63ff] hover:bg-[#5b52e0] text-white font-bold text-sm transition-all shadow-xl shadow-[#6c63ff]/30 hover:shadow-[#6c63ff]/50 flex items-center justify-center gap-2"
            >
              <FileEdit className="w-4 h-4" />
              <span>Fill Registration Form Now →</span>
            </Link>
            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#1a1a26] hover:bg-[#252538] border border-[#2a2a3a] text-white font-medium text-sm transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Home</span>
            </Link>
          </div>

          {/* Lookup alternative for previously registered users */}
          <div className="pt-8 border-t border-[#2a2a3a] text-left max-w-md mx-auto">
            <div className="text-xs font-semibold text-[#888899] uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-[#6c63ff]" />
              <span>Already registered? Verify by phone:</span>
            </div>

            {lookupError && (
              <div className="p-3 mb-3 rounded-xl bg-[#ff6584]/15 border border-[#ff6584]/30 text-[#ff6584] text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{lookupError}</span>
              </div>
            )}

            <form onSubmit={handleLookupByPhone} className="flex gap-2">
              <input
                type="tel"
                value={lookupPhone}
                onChange={(e) => setLookupPhone(e.target.value)}
                placeholder="e.g. 0319-8647809"
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#1a1a26] border border-[#2a2a3a] text-white text-xs sm:text-sm focus:outline-none focus:border-[#6c63ff]"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-[#1a1a26] hover:bg-[#252538] border border-[#2a2a3a] text-[#02fd88] hover:text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Verify
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // If registration is verified, display full payment flow
  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#13131e] border border-[#6c63ff] text-white text-xs sm:text-sm px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#02fd88]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top back navigation */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm text-[#888899] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00a651]/15 text-[#02fd88] text-xs font-semibold border border-[#00a651]/30">
          <UserCheck className="w-3.5 h-3.5" />
          <span>Registration Verified</span>
        </div>
      </div>

      {/* Header */}
      <div className="text-center mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#6c63ff]/15 text-[#818cf8] text-xs font-semibold uppercase tracking-wider mb-3 border border-[#6c63ff]/30">
          <CreditCard className="w-3.5 h-3.5" />
          <span>Official Fee Settlement Portal</span>
        </div>
        <h1 className="font-syne text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-3">
          Course Fee Payment
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-[#888899] max-w-xl mx-auto leading-relaxed">
          Welcome <strong className="text-white">{studentName}</strong>! Please deposit your course dues using the institutional accounts below and confirm your deposit.
        </p>
      </div>

      {/* Verified Student Candidate Card */}
      <div className="bg-[#13131e] border border-[#2a2a3a] rounded-2xl sm:rounded-3xl p-5 sm:p-6 mb-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#2a2a3a]/80">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#888899] tracking-wider block">
              Enrolled Candidate
            </span>
            <div className="font-syne text-lg sm:text-xl font-bold text-white flex items-center gap-2 mt-0.5">
              <span>{studentName}</span>
              <span className="text-xs font-mono font-normal text-[#02fd88] bg-[#00a651]/20 px-2 py-0.5 rounded">
                Active Enrollee
              </span>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-[10px] uppercase font-bold text-[#888899] tracking-wider block">
              Registered Course
            </span>
            <span className="font-syne text-sm sm:text-base font-semibold text-[#818cf8]">
              {selectedCourseName}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 text-xs">
          <div>
            <span className="text-[#888899] block text-[10px] uppercase">Contact Phone</span>
            <span className="font-mono text-white text-sm">{studentPhone}</span>
          </div>
          <div>
            <span className="text-[#888899] block text-[10px] uppercase">Email Address</span>
            <span className="text-white text-sm truncate block">{studentEmail || 'Registered on file'}</span>
          </div>
          <div>
            <span className="text-[#888899] block text-[10px] uppercase">Course Fee</span>
            <span className="font-syne text-base sm:text-lg font-black text-[#02fd88]">
              Rs. {selectedFee.toLocaleString('en-PK')}
            </span>
          </div>
        </div>
      </div>

      {/* Payment Channel Selector Tabs */}
      <div className="mb-8">
        <label className="block text-xs font-semibold text-[#888899] uppercase tracking-wider mb-3">
          Select Payment Channel:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* NBP */}
          <button
            type="button"
            onClick={() => setPaymentMethod('nbp')}
            className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all cursor-pointer ${
              paymentMethod === 'nbp'
                ? 'bg-[#1e88e5]/15 border-[#1e88e5] text-white shadow-lg shadow-[#1e88e5]/20'
                : 'bg-[#13131e] border-[#2a2a3a] text-[#888899] hover:text-white'
            }`}
          >
            <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-[#1e88e5] mb-2" />
            <div className="font-syne text-xs font-bold">National Bank</div>
            <div className="text-[10px] text-[#888899]">NBP Main Account</div>
          </button>

          {/* Easypaisa */}
          <button
            type="button"
            onClick={() => setPaymentMethod('easypaisa')}
            className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all cursor-pointer ${
              paymentMethod === 'easypaisa'
                ? 'bg-[#00a651]/15 border-[#00a651] text-white shadow-lg shadow-[#00a651]/20'
                : 'bg-[#13131e] border-[#2a2a3a] text-[#888899] hover:text-white'
            }`}
          >
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-md bg-[#00a651] text-white font-black text-[11px] flex items-center justify-center mb-2">
              EP
            </div>
            <div className="font-syne text-xs font-bold">Easypaisa</div>
            <div className="text-[10px] text-[#02fd88] font-medium">Instant Mobile</div>
          </button>

          {/* JazzCash */}
          <button
            type="button"
            onClick={() => setPaymentMethod('jazzcash')}
            className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all cursor-pointer ${
              paymentMethod === 'jazzcash'
                ? 'bg-[#d61f26]/15 border-[#d61f26] text-white shadow-lg shadow-[#d61f26]/20'
                : 'bg-[#13131e] border-[#2a2a3a] text-[#888899] hover:text-white'
            }`}
          >
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-md bg-[#d61f26] text-white font-black text-[11px] flex items-center justify-center mb-2">
              JC
            </div>
            <div className="font-syne text-xs font-bold">JazzCash</div>
            <div className="text-[10px] text-[#888899]">All Pakistan</div>
          </button>

          {/* Meezan Bank */}
          <button
            type="button"
            onClick={() => setPaymentMethod('meezan')}
            className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all cursor-pointer ${
              paymentMethod === 'meezan'
                ? 'bg-[#6c63ff]/15 border-[#6c63ff] text-white shadow-lg shadow-[#6c63ff]/20'
                : 'bg-[#13131e] border-[#2a2a3a] text-[#888899] hover:text-white'
            }`}
          >
            <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-[#6c63ff] mb-2" />
            <div className="font-syne text-xs font-bold">Meezan Bank</div>
            <div className="text-[10px] text-[#888899]">Online IBFT</div>
          </button>
        </div>
      </div>

      {/* Account Details Display Card */}
      <div className="bg-[#13131e] border border-[#2a2a3a] rounded-2xl sm:rounded-3xl p-5 sm:p-8 mb-8 shadow-2xl">
        {paymentMethod === 'nbp' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-4 border-b border-[#2a2a3a]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#1e88e5]/20 border border-[#1e88e5]/40 flex items-center justify-center text-[#1e88e5]">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-syne text-base sm:text-lg font-bold text-white">National Bank of Pakistan (NBP)</h3>
                  <p className="text-xs text-[#888899]">Official Institutional Account · Mirpur Sakro Branch</p>
                </div>
              </div>
              <span className="self-start sm:self-auto text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded bg-[#1e88e5]/20 text-[#1e88e5] border border-[#1e88e5]/30">
                Primary Account
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Account Title */}
              <div className="p-4 rounded-xl bg-[#1a1a26] border border-[#2a2a3a] flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#888899] tracking-wider block">Account Title</span>
                  <span className="font-syne text-sm sm:text-base font-bold text-white">{ACADEMY_INFO.bankAccounts.nbp.accountTitle}</span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(ACADEMY_INFO.bankAccounts.nbp.accountTitle, 'title')}
                  className="p-2 rounded-lg bg-[#252538] hover:bg-[#2f2f48] text-[#888899] hover:text-white transition-colors cursor-pointer"
                  title="Copy Account Title"
                >
                  {copiedKey === 'title' ? <Check className="w-4 h-4 text-[#02fd88]" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Account Number */}
              <div className="p-4 rounded-xl bg-[#1a1a26] border border-[#2a2a3a] flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#888899] tracking-wider block">Account Number</span>
                  <span className="font-mono text-sm sm:text-base font-bold text-[#02fd88] tracking-wider">{ACADEMY_INFO.bankAccounts.nbp.accountNumber}</span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(ACADEMY_INFO.bankAccounts.nbp.accountNumber, 'acc')}
                  className="p-2 rounded-lg bg-[#252538] hover:bg-[#2f2f48] text-[#888899] hover:text-white transition-colors cursor-pointer"
                  title="Copy Account Number"
                >
                  {copiedKey === 'acc' ? <Check className="w-4 h-4 text-[#02fd88]" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* IBAN */}
              <div className="md:col-span-2 p-4 rounded-xl bg-[#1a1a26] border border-[#2a2a3a] flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#888899] tracking-wider block">IBAN (All 1Link / Raast Transfers)</span>
                  <span className="font-mono text-xs sm:text-sm font-bold text-white break-all">{ACADEMY_INFO.bankAccounts.nbp.iban}</span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(ACADEMY_INFO.bankAccounts.nbp.iban, 'iban')}
                  className="p-2 rounded-lg bg-[#252538] hover:bg-[#2f2f48] text-[#888899] hover:text-white transition-colors shrink-0 ml-2 cursor-pointer"
                  title="Copy IBAN"
                >
                  {copiedKey === 'iban' ? <Check className="w-4 h-4 text-[#02fd88]" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        )}

        {paymentMethod === 'easypaisa' && (
          <div>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#2a2a3a]">
              <div className="w-10 h-10 rounded-xl bg-[#00a651]/20 border border-[#00a651]/40 flex items-center justify-center text-[#00a651] font-black text-xs">
                EP
              </div>
              <div>
                <h3 className="font-syne text-base sm:text-lg font-bold text-white">Easypaisa Mobile Account</h3>
                <p className="text-xs text-[#888899]">Instant mobile wallet transfer (No fees)</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#1a1a26] border border-[#2a2a3a] flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#888899] tracking-wider block">Account Title</span>
                  <span className="font-syne text-sm sm:text-base font-bold text-white">{ACADEMY_INFO.bankAccounts.easypaisa.accountTitle}</span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(ACADEMY_INFO.bankAccounts.easypaisa.accountTitle, 'ep_title')}
                  className="p-2 rounded-lg bg-[#252538] hover:bg-[#2f2f48] text-[#888899] hover:text-white transition-colors cursor-pointer"
                >
                  {copiedKey === 'ep_title' ? <Check className="w-4 h-4 text-[#02fd88]" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="p-4 rounded-xl bg-[#1a1a26] border border-[#2a2a3a] flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#888899] tracking-wider block">Mobile Number</span>
                  <span className="font-mono text-sm sm:text-base font-bold text-[#02fd88]">{ACADEMY_INFO.bankAccounts.easypaisa.mobileNumber}</span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(ACADEMY_INFO.bankAccounts.easypaisa.mobileNumber, 'ep_mob')}
                  className="p-2 rounded-lg bg-[#252538] hover:bg-[#2f2f48] text-[#888899] hover:text-white transition-colors cursor-pointer"
                >
                  {copiedKey === 'ep_mob' ? <Check className="w-4 h-4 text-[#02fd88]" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        )}

        {paymentMethod === 'jazzcash' && (
          <div>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#2a2a3a]">
              <div className="w-10 h-10 rounded-xl bg-[#d61f26]/20 border border-[#d61f26]/40 flex items-center justify-center text-[#d61f26] font-black text-xs">
                JC
              </div>
              <div>
                <h3 className="font-syne text-base sm:text-lg font-bold text-white">JazzCash Account</h3>
                <p className="text-xs text-[#888899]">Transfer via JazzCash App or any retailer across Pakistan</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#1a1a26] border border-[#2a2a3a] flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#888899] tracking-wider block">Account Title</span>
                  <span className="font-syne text-sm sm:text-base font-bold text-white">{ACADEMY_INFO.bankAccounts.jazzcash.accountTitle}</span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(ACADEMY_INFO.bankAccounts.jazzcash.accountTitle, 'jc_title')}
                  className="p-2 rounded-lg bg-[#252538] hover:bg-[#2f2f48] text-[#888899] hover:text-white transition-colors cursor-pointer"
                >
                  {copiedKey === 'jc_title' ? <Check className="w-4 h-4 text-[#02fd88]" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="p-4 rounded-xl bg-[#1a1a26] border border-[#2a2a3a] flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#888899] tracking-wider block">Mobile Number</span>
                  <span className="font-mono text-sm sm:text-base font-bold text-[#02fd88]">{ACADEMY_INFO.bankAccounts.jazzcash.mobileNumber}</span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(ACADEMY_INFO.bankAccounts.jazzcash.mobileNumber, 'jc_mob')}
                  className="p-2 rounded-lg bg-[#252538] hover:bg-[#2f2f48] text-[#888899] hover:text-white transition-colors cursor-pointer"
                >
                  {copiedKey === 'jc_mob' ? <Check className="w-4 h-4 text-[#02fd88]" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        )}

        {paymentMethod === 'meezan' && (
          <div>
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#2a2a3a]">
              <div className="w-10 h-10 rounded-xl bg-[#6c63ff]/20 border border-[#6c63ff]/40 flex items-center justify-center text-[#6c63ff]">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-syne text-base sm:text-lg font-bold text-white">Meezan Bank Limited</h3>
                <p className="text-xs text-[#888899]">Islamic Banking · Free Inter-Bank Fund Transfer (IBFT)</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#1a1a26] border border-[#2a2a3a] flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#888899] tracking-wider block">Account Title</span>
                  <span className="font-syne text-sm sm:text-base font-bold text-white">{ACADEMY_INFO.bankAccounts.meezan.accountTitle}</span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(ACADEMY_INFO.bankAccounts.meezan.accountTitle, 'mz_title')}
                  className="p-2 rounded-lg bg-[#252538] hover:bg-[#2f2f48] text-[#888899] hover:text-white transition-colors cursor-pointer"
                >
                  {copiedKey === 'mz_title' ? <Check className="w-4 h-4 text-[#02fd88]" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="p-4 rounded-xl bg-[#1a1a26] border border-[#2a2a3a] flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#888899] tracking-wider block">Account Number</span>
                  <span className="font-mono text-sm sm:text-base font-bold text-[#02fd88]">{ACADEMY_INFO.bankAccounts.meezan.accountNumber}</span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(ACADEMY_INFO.bankAccounts.meezan.accountNumber, 'mz_acc')}
                  className="p-2 rounded-lg bg-[#252538] hover:bg-[#2f2f48] text-[#888899] hover:text-white transition-colors cursor-pointer"
                >
                  {copiedKey === 'mz_acc' ? <Check className="w-4 h-4 text-[#02fd88]" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="md:col-span-2 p-4 rounded-xl bg-[#1a1a26] border border-[#2a2a3a] flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#888899] tracking-wider block">IBAN</span>
                  <span className="font-mono text-xs sm:text-sm font-bold text-white break-all">{ACADEMY_INFO.bankAccounts.meezan.iban}</span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(ACADEMY_INFO.bankAccounts.meezan.iban, 'mz_iban')}
                  className="p-2 rounded-lg bg-[#252538] hover:bg-[#2f2f48] text-[#888899] hover:text-white transition-colors shrink-0 ml-2 cursor-pointer"
                >
                  {copiedKey === 'mz_iban' ? <Check className="w-4 h-4 text-[#02fd88]" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation & Voucher Generation Box */}
      <div className="bg-[#13131e] border border-[#2a2a3a] rounded-2xl sm:rounded-3xl p-5 sm:p-8 mb-12 shadow-2xl">
        <h3 className="font-syne text-lg font-bold text-white mb-2 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#02fd88]" />
          <span>Confirm Payment & Generate Voucher</span>
        </h3>
        <p className="text-xs sm:text-sm text-[#888899] mb-6 leading-relaxed">
          After completing your transfer, enter the Transaction ID / Reference Number provided by your bank or mobile app.
        </p>

        <form onSubmit={handleGenerateVoucher} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#888899] uppercase tracking-wider mb-1.5">
              Transaction ID / TID / Reference No.
            </label>
            <input
              type="text"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              placeholder="e.g. 1029384756 (from your bank SMS or app receipt)"
              className="w-full px-4 py-3 rounded-xl bg-[#1a1a26] border border-[#2a2a3a] text-white font-mono text-sm focus:outline-none focus:border-[#6c63ff] transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              type="submit"
              className="py-3.5 px-4 rounded-xl bg-[#6c63ff] hover:bg-[#5b52e0] text-white font-bold text-sm transition-all shadow-xl shadow-[#6c63ff]/30 hover:shadow-[#6c63ff]/50 cursor-pointer flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Generate Student Voucher</span>
            </button>

            <button
              type="button"
              onClick={handleConfirmOnWhatsApp}
              className="py-3.5 px-4 rounded-xl bg-[#00a651] hover:bg-[#009247] text-white font-bold text-sm transition-all shadow-xl shadow-[#00a651]/30 hover:shadow-[#00a651]/50 cursor-pointer flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Confirm on WhatsApp Desk</span>
            </button>
          </div>
        </form>

        {/* Generated Voucher Slip Display */}
        {voucherGenerated && voucherData && (
          <div className="mt-8 pt-6 border-t border-[#2a2a3a] animate-fade-in">
            <div
              id="payment-voucher-area"
              className="p-6 sm:p-8 rounded-2xl bg-white text-[#111118] font-sans border-4 border-dashed border-[#d4af37] shadow-2xl relative"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b-2 border-slate-200 pb-4 mb-4">
                <div>
                  <h4 className="font-syne font-extrabold text-xl sm:text-2xl text-[#111118] tracking-tight">
                    CYBER NOVA COMPUTER ACADEMY
                  </h4>
                  <p className="text-xs text-slate-500 font-medium">
                    Admission Fee Deposit Voucher · Official Receipt
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-[10px] font-mono text-slate-400 block">VOUCHER NO</span>
                  <span className="font-mono text-sm font-black text-[#6c63ff]">{voucherData.receiptNo}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs py-2 mb-4 bg-slate-50 p-3 rounded-lg">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Issue Date</span>
                  <strong className="text-slate-800">{voucherData.date}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Channel</span>
                  <strong className="text-slate-800">{voucherData.method}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Txn Reference</span>
                  <strong className="text-slate-800 font-mono">{voucherData.transactionId}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Status</span>
                  <strong className="text-[#00a651] font-bold">REGISTERED</strong>
                </div>
              </div>

              <div className="space-y-2 text-xs border-b-2 border-slate-200 pb-4 mb-4">
                <div className="flex justify-between">
                  <span className="text-slate-500">Student Name:</span>
                  <span className="font-bold text-slate-900">{voucherData.studentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Phone:</span>
                  <span className="font-mono text-slate-900">{voucherData.studentPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Enrolled Course:</span>
                  <span className="font-bold text-slate-900">{voucherData.course}</span>
                </div>
                <div className="flex justify-between items-baseline pt-2 text-sm font-bold text-slate-900 border-t border-slate-200">
                  <span>Total Fee Paid:</span>
                  <span className="text-lg font-black text-[#00a651]">Rs. {voucherData.amount.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-[10px] text-slate-400">
                <span>Verified by Cyber Nova Admission Desk</span>
                <span>Karachi, Pakistan</span>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => window.print()}
                className="py-2.5 px-4 rounded-xl bg-[#1a1a26] hover:bg-[#252538] border border-[#2a2a3a] text-white text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4 text-[#818cf8]" />
                <span>Print Official Voucher</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#e8e8f0]">
      <Navbar />
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-sm text-[#888899]">Loading fee payment portal...</div>}>
        <PaymentContent />
      </Suspense>
      <Footer />
    </div>
  );
}
