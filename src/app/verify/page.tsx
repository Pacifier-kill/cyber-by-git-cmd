'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  ShieldCheck, 
  Search, 
  Printer, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  Award, 
  GraduationCap, 
  Calendar, 
  User, 
  BookOpen, 
  ArrowLeft,
  FileSpreadsheet,
  QrCode,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { INITIAL_CERTIFICATES, StudentCertificate } from '../../data/students';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';

function VerifyContent() {
  const searchParams = useSearchParams();
  const urlCertId = searchParams.get('id') || searchParams.get('verify') || searchParams.get('hash') || '';

  const [certDatabase, setCertDatabase] = useState<Record<string, StudentCertificate>>(INITIAL_CERTIFICATES);
  const [searchInput, setSearchInput] = useState(urlCertId);
  const [verifiedCert, setVerifiedCert] = useState<StudentCertificate | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [customFileLoaded, setCustomFileLoaded] = useState<string | null>(null);

  // Auto-verify if query param exists
  useEffect(() => {
    if (urlCertId) {
      setSearchInput(urlCertId);
      performVerification(urlCertId, certDatabase);
    }
  }, [urlCertId]);

  const performVerification = (query: string, db: Record<string, StudentCertificate>) => {
    const cleanId = query.trim().toUpperCase();
    if (!cleanId) {
      setVerificationStatus('error');
      setStatusMessage('Please enter a valid Certificate ID (e.g. CNA-2026-001).');
      setVerifiedCert(null);
      return;
    }

    // Lookup by Certificate ID or hash
    const found = db[cleanId] || Object.values(db).find(
      (c) => c.certificateId.toUpperCase() === cleanId || (c.cryptoHash && c.cryptoHash.toUpperCase() === cleanId)
    );

    if (found) {
      setVerifiedCert(found);
      setVerificationStatus('success');
      setStatusMessage(`Verified: Authentic credential issued to ${found.studentName}`);
    } else {
      setVerifiedCert(null);
      setVerificationStatus('error');
      setStatusMessage(`Certificate ID "${cleanId}" was not found in the verified registry. Please check for typos.`);
    }
  };

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performVerification(searchInput, certDatabase);
  };

  const handleReset = () => {
    setSearchInput('');
    setVerifiedCert(null);
    setVerificationStatus('idle');
    setStatusMessage('');
  };

  const handleSampleClick = (id: string) => {
    setSearchInput(id);
    performVerification(id, certDatabase);
  };

  // Optional Excel upload handler to support uploaded students.xlsx
  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data: any[] = XLSX.utils.sheet_to_json(ws);

        const newDb: Record<string, StudentCertificate> = { ...certDatabase };
        data.forEach((row) => {
          const rawId = String(row['certificate_id'] || row['Certificate ID'] || row['ID'] || '').trim().toUpperCase();
          if (!rawId) return;
          newDb[rawId] = {
            certificateId: rawId,
            studentName: String(row['student_name'] || row['Student Name'] || row['Name'] || '').trim(),
            courseName: String(row['course_name'] || row['Course Name'] || row['Course'] || '').trim(),
            issueDate: String(row['issue_date'] || row['Issue Date'] || row['Date'] || 'March 2026').trim(),
            cryptoHash: String(row['crypto_hash'] || row['Hash'] || '').trim(),
            grade: String(row['grade'] || 'A+ (Distinction)').trim(),
            instructor: 'Cyber Nova Faculty'
          };
        });

        setCertDatabase(newDb);
        setCustomFileLoaded(file.name);
        if (searchInput) {
          performVerification(searchInput, newDb);
        }
      } catch (err) {
        console.error('Error parsing excel sheet:', err);
      }
    };
    reader.readAsBinaryString(file);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Top back navigation */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm text-[#888899] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
        <Link
          href="/payment"
          className="inline-flex items-center gap-1.5 text-xs text-[#02fd88] hover:underline"
        >
          <span>Need to pay course fees? Visit Payment Portal →</span>
        </Link>
      </div>

      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6c63ff]/15 text-[#818cf8] text-xs font-semibold uppercase tracking-wider mb-3 border border-[#6c63ff]/30">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Official Registry Verification</span>
        </div>
        <h1 className="font-syne text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-3">
          Verify Student Certificate
        </h1>
        <p className="text-sm sm:text-base text-[#888899] max-w-xl mx-auto leading-relaxed">
          Verify the authenticity of graduation certificates issued by Cyber Nova Computer Academy. Search by Certificate ID or scan the QR code printed on the physical credential.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Search & Controls */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#13131e] border border-[#2a2a3a] rounded-3xl p-6 sm:p-7 shadow-xl">
            <h3 className="font-syne text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Search className="w-4 h-4 text-[#6c63ff]" />
              <span>Enter Certificate ID</span>
            </h3>

            {/* Status Alert Box */}
            {verificationStatus !== 'idle' && (
              <div
                className={`mb-4 p-3.5 rounded-xl text-xs sm:text-sm font-medium flex items-start gap-2.5 ${
                  verificationStatus === 'success'
                    ? 'bg-[#00a651]/15 border border-[#00a651]/40 text-[#02fd88]'
                    : 'bg-[#ff6584]/15 border border-[#ff6584]/40 text-[#ff6584]'
                }`}
              >
                {verificationStatus === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                )}
                <span>{statusMessage}</span>
              </div>
            )}

            <form onSubmit={handleVerifySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#888899] mb-1.5">
                  Unique Certificate ID
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="e.g. CNA-2026-001"
                    required
                    className="w-full pl-3.5 pr-10 py-3 rounded-xl bg-[#1a1a26] border border-[#2a2a3a] text-white font-mono text-sm uppercase focus:outline-none focus:border-[#6c63ff] transition-colors"
                  />
                  <ShieldCheck className="w-4 h-4 text-[#888899] absolute right-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#6c63ff] hover:bg-[#5b52e0] text-white font-bold text-sm transition-all shadow-xl shadow-[#6c63ff]/30 hover:shadow-[#6c63ff]/50 cursor-pointer flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" />
                <span>Verify Certificate Record</span>
              </button>
            </form>

            {/* Quick Test Samples */}
            <div className="mt-6 pt-5 border-t border-[#2a2a3a]">
              <div className="text-xs font-semibold text-[#888899] mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#f59e0b]" />
                <span>Click sample ID to test:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {Object.keys(certDatabase).slice(0, 5).map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => handleSampleClick(id)}
                    className="px-2.5 py-1 rounded-lg bg-[#1a1a26] hover:bg-[#252538] text-white font-mono text-xs border border-[#2a2a3a] transition-colors cursor-pointer"
                  >
                    {id}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Database Import Box (Optional for Academy Admin) */}
          <div className="bg-[#13131e] border border-[#2a2a3a] rounded-2xl p-5 text-xs text-[#888899]">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-white flex items-center gap-1.5">
                <FileSpreadsheet className="w-4 h-4 text-[#02fd88]" />
                <span>Custom Registry File</span>
              </span>
              {customFileLoaded && (
                <span className="text-[10px] text-[#02fd88] bg-[#00a651]/20 px-2 py-0.5 rounded">
                  Loaded
                </span>
              )}
            </div>
            <p className="mb-3 leading-relaxed">
              Upload <code className="text-white bg-[#1a1a26] px-1 py-0.5 rounded">students.xlsx</code> to load batch graduation records dynamically.
            </p>
            <label className="block w-full py-2 px-3 rounded-lg bg-[#1a1a26] hover:bg-[#252538] border border-[#2a2a3a] text-center text-white cursor-pointer font-medium transition-colors">
              <span>{customFileLoaded ? `Re-upload Excel` : 'Upload students.xlsx'}</span>
              <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleExcelUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Right Column: Certificate Display or Empty Placeholder */}
        <div className="lg:col-span-7">
          {verifiedCert ? (
            <div className="space-y-4 animate-fade-in">
              {/* Printable Certificate Frame */}
              <div
                id="certificate-print-area"
                className="relative bg-gradient-to-br from-[#11111d] via-[#151522] to-[#0c0c14] border-4 border-[#d4af37]/60 rounded-3xl p-6 sm:p-10 shadow-2xl text-center overflow-hidden"
              >
                {/* Decorative Golden Corner Accents */}
                <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-[#d4af37]/80 pointer-events-none" />
                <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-[#d4af37]/80 pointer-events-none" />
                <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-[#d4af37]/80 pointer-events-none" />
                <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-[#d4af37]/80 pointer-events-none" />

                {/* Header Crest */}
                <div className="flex justify-center mb-3">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#d4af37] to-[#f6e05e] p-0.5 shadow-lg shadow-[#d4af37]/20">
                    <div className="w-full h-full bg-[#111118] rounded-[14px] flex items-center justify-center">
                      <GraduationCap className="w-7 h-7 text-[#d4af37]" />
                    </div>
                  </div>
                </div>

                <div className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[#d4af37] mb-1 font-syne">
                  Cyber Nova Computer Academy
                </div>
                <div className="text-[10px] text-[#888899] mb-4">
                  Karachi Campus · Directorate of Technical Education
                </div>

                <h2 className="font-syne text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-wide border-y border-[#d4af37]/30 py-2.5 mb-5 uppercase">
                  Certificate of Completion
                </h2>

                <p className="text-xs sm:text-sm text-[#888899] italic mb-2">
                  This official credential is proudly awarded to
                </p>

                {/* Recipient Name */}
                <div className="font-syne text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#f6e05e] mb-4 tracking-tight">
                  {verifiedCert.studentName}
                </div>

                <p className="text-xs sm:text-sm text-[#888899] mb-2">
                  for successfully mastering the curriculum and projects of
                </p>

                {/* Course Name */}
                <div className="inline-block px-5 py-2 rounded-xl bg-[#6c63ff]/15 border border-[#6c63ff]/40 text-white font-syne text-base sm:text-xl font-bold mb-6">
                  {verifiedCert.courseName}
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-left p-4 rounded-xl bg-[#1a1a26]/70 border border-[#2a2a3a] mb-6 text-xs">
                  <div>
                    <span className="text-[#888899] block text-[10px] uppercase">Certificate ID</span>
                    <strong className="font-mono text-white text-xs sm:text-sm">{verifiedCert.certificateId}</strong>
                  </div>
                  <div>
                    <span className="text-[#888899] block text-[10px] uppercase">Issue Date</span>
                    <strong className="text-white text-xs sm:text-sm">{verifiedCert.issueDate}</strong>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <span className="text-[#888899] block text-[10px] uppercase">Grade Awarded</span>
                    <strong className="text-[#02fd88] text-xs sm:text-sm">{verifiedCert.grade || 'A+ Distinction'}</strong>
                  </div>
                </div>

                {/* Signatures & Seal */}
                <div className="flex items-center justify-between pt-4 border-t border-[#2a2a3a] text-xs">
                  <div className="text-left">
                    <div className="font-syne font-bold text-white text-xs sm:text-sm">Engr. Qurban Ali</div>
                    <div className="text-[10px] text-[#888899]">Head of Academy & Faculty</div>
                  </div>

                  {/* Golden Seal badge */}
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-dashed border-[#d4af37] flex flex-col items-center justify-center text-[8px] sm:text-[9px] font-bold text-[#d4af37] uppercase p-1">
                    <span>SEAL OF</span>
                    <span className="text-[#02fd88]">VERIFIED</span>
                  </div>

                  <div className="text-right">
                    <div className="font-syne font-bold text-white text-xs sm:text-sm">Karachi, PK</div>
                    <div className="text-[10px] text-[#888899]">Credential Registry</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="py-3 px-4 rounded-xl bg-[#6c63ff] hover:bg-[#5b52e0] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#6c63ff]/30 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Certificate</span>
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="py-3 px-4 rounded-xl bg-[#1a1a26] hover:bg-[#252538] border border-[#2a2a3a] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Verify Another</span>
                </button>
              </div>
            </div>
          ) : (
            /* Empty State */
            <div className="bg-[#13131e] border-2 border-dashed border-[#2a2a3a] rounded-3xl p-10 sm:p-14 text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#1a1a26] border border-[#2a2a3a] mx-auto flex items-center justify-center mb-4 text-[#6c63ff]">
                <GraduationCap className="w-8 h-8" />
              </div>
              <h3 className="font-syne text-lg font-bold text-white mb-2">
                No Certificate Loaded
              </h3>
              <p className="text-xs sm:text-sm text-[#888899] max-w-md mx-auto mb-6 leading-relaxed">
                Enter your certificate serial ID in the input box on the left, or select one of the test IDs above to see the official verified credential.
              </p>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1a1a26] text-[#888899] text-xs">
                <QrCode className="w-3.5 h-3.5 text-[#6c63ff]" />
                <span>Supports QR Code Direct Scans</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#e8e8f0]">
      <Navbar />
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-sm text-[#888899]">Loading certificate verification...</div>}>
        <VerifyContent />
      </Suspense>
      <Footer />
    </div>
  );
}
