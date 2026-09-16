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
  GraduationCap,
  ArrowLeft,
  FileSpreadsheet,
  QrCode,
  Sparkles,
  Download,
  Image as ImageIcon
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { INITIAL_CERTIFICATES, StudentCertificate } from '../../data/students';
import { Navbar } from '../../components/Navbar';
import { Footer } from '../../components/Footer';

interface ExtendedStudentCertificate extends StudentCertificate {
  fileName?: string;
  filePath?: string;
}

function VerifyContent() {
  const searchParams = useSearchParams();
  const urlCertId = searchParams.get('id') || searchParams.get('verify') || searchParams.get('hash') || '';

  const [certDatabase, setCertDatabase] = useState<Record<string, ExtendedStudentCertificate>>(INITIAL_CERTIFICATES);
  const [searchInput, setSearchInput] = useState(urlCertId);
  const [verifiedCert, setVerifiedCert] = useState<ExtendedStudentCertificate | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [customFileLoaded, setCustomFileLoaded] = useState<string | null>(null);

  // Fetch Excel from /api/certificates (Server data/students.xlsx)
  useEffect(() => {
    async function loadServerExcelData() {
      try {
        const res = await fetch('/api/certificates');
        const json = await res.json();
        if (json.success && json.certificates) {
          setCertDatabase((prev) => ({
            ...prev,
            ...json.certificates
          }));
          setCustomFileLoaded('data/students.xlsx (Server)');
        }
      } catch (err) {
        console.error('Failed to load server excel file:', err);
      }
    }

    loadServerExcelData();
  }, []);

  // Auto-verify URL Query params
  useEffect(() => {
    if (urlCertId) {
      setSearchInput(urlCertId);
      performVerification(urlCertId, certDatabase);
    }
  }, [urlCertId, certDatabase]);

  const getCertificatePath = (cert: ExtendedStudentCertificate) => {
    if (cert.filePath) return cert.filePath;
    if (cert.fileName) return `/certificates/${cert.fileName}`;
    return `/certificates/${cert.certificateId}.png`;
  };

  const performVerification = (query: string, db: Record<string, ExtendedStudentCertificate>) => {
    const cleanId = query.trim().toUpperCase();
    if (!cleanId) {
      setVerificationStatus('error');
      setStatusMessage('Please enter a valid Certificate ID or Hash.');
      setVerifiedCert(null);
      return;
    }

    // Match by certificate_id OR crypto_hash
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
      setStatusMessage(`Certificate Record "${cleanId}" was not found in registry.`);
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

  // Manual Upload Fallback with exact column headers mapping
  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const data: any[] = XLSX.utils.sheet_to_json(ws);

        const newDb: Record<string, ExtendedStudentCertificate> = { ...certDatabase };
        data.forEach((row) => {
          const certId = String(row['certificate_id'] || '').trim().toUpperCase();
          if (!certId) return;

          newDb[certId] = {
            certificateId: certId,
            studentName: String(row['student_name'] || '').trim(),
            courseName: String(row['course_name'] || '').trim(),
            cryptoHash: String(row['crypto_hash'] || '').trim(),
            issueDate: String(row['issue_date'] || '').trim(),
            grade: 'Verified',
            instructor: 'Cyber Nova Faculty',
            fileName: `${certId}.png`,
            filePath: `/certificates/${certId}.png`
          };
        });

        setCertDatabase(newDb);
        setCustomFileLoaded(file.name);
        if (searchInput) performVerification(searchInput, newDb);
      } catch (err) {
        console.error('Error parsing excel sheet:', err);
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
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

      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6c63ff]/15 text-[#818cf8] text-xs font-semibold uppercase tracking-wider mb-3 border border-[#6c63ff]/30">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Official Registry Verification</span>
        </div>
        <h1 className="font-syne text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-3">
          Verify Student Certificate
        </h1>
        <p className="text-sm sm:text-base text-[#888899] max-w-xl mx-auto leading-relaxed">
          Verify authenticity via Certificate ID or Crypto Hash.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Controls */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#13131e] border border-[#2a2a3a] rounded-3xl p-6 sm:p-7 shadow-xl">
            <h3 className="font-syne text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Search className="w-4 h-4 text-[#6c63ff]" />
              <span>Enter Certificate ID / Hash</span>
            </h3>

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
                  Certificate ID or Hash
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

            <div className="mt-6 pt-5 border-t border-[#2a2a3a]">
              <div className="text-xs font-semibold text-[#888899] mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#f59e0b]" />
                <span>Sample IDs:</span>
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

          <div className="bg-[#13131e] border border-[#2a2a3a] rounded-2xl p-5 text-xs text-[#888899]">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-white flex items-center gap-1.5">
                <FileSpreadsheet className="w-4 h-4 text-[#02fd88]" />
                <span>Excel Status</span>
              </span>
              {customFileLoaded && (
                <span className="text-[10px] text-[#02fd88] bg-[#00a651]/20 px-2 py-0.5 rounded font-mono">
                  Loaded
                </span>
              )}
            </div>
            <p className="mb-3 leading-relaxed">
              Mapped columns: <code className="text-white">certificate_id</code>, <code className="text-white">student_name</code>, <code className="text-white">course_name</code>, <code className="text-white">crypto_hash</code>, <code className="text-white">issue_date</code>.
            </p>
            <label className="block w-full py-2 px-3 rounded-lg bg-[#1a1a26] hover:bg-[#252538] border border-[#2a2a3a] text-center text-white cursor-pointer font-medium transition-colors">
              <span>{customFileLoaded ? `Re-upload File (${customFileLoaded})` : 'Upload Custom Excel'}</span>
              <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleExcelUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Right Preview */}
        <div className="lg:col-span-7">
          {verifiedCert ? (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 rounded-2xl bg-[#13131e] border border-[#00a651]/40 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-[#888899] block text-[10px] uppercase font-bold">Student Name</span>
                  <span className="font-syne text-sm font-bold text-white">{verifiedCert.studentName}</span>
                </div>
                <div>
                  <span className="text-[#888899] block text-[10px] uppercase font-bold">Course</span>
                  <span className="text-[#818cf8] font-semibold">{verifiedCert.courseName}</span>
                </div>
                <div>
                  <span className="text-[#888899] block text-[10px] uppercase font-bold">Issue Date</span>
                  <span className="text-white font-medium">{verifiedCert.issueDate}</span>
                </div>
              </div>

              {/* Hash Bar */}
              {verifiedCert.cryptoHash && (
                <div className="p-3 rounded-xl bg-[#1a1a26] border border-[#2a2a3a] text-xs font-mono text-[#888899] flex items-center justify-between">
                  <span>Crypto Hash:</span>
                  <span className="text-[#02fd88] truncate max-w-[300px]">{verifiedCert.cryptoHash}</span>
                </div>
              )}

              {/* Image Frame */}
              <div className="relative bg-[#13131e] border-2 border-[#6c63ff]/40 rounded-3xl p-3 sm:p-4 shadow-2xl overflow-hidden">
                <div className="relative rounded-2xl overflow-hidden border border-[#2a2a3a] bg-[#0a0a0f]">
                  <img
                    src={getCertificatePath(verifiedCert)}
                    alt={`Certificate for ${verifiedCert.studentName}`}
                    className="w-full h-auto object-contain max-h-[600px] mx-auto rounded-xl"
                    onError={(e) => {
                      const target = e.target as HTMLElement;
                      target.style.display = 'none';
                      const fallbackDiv = document.getElementById('cert-img-fallback');
                      if (fallbackDiv) fallbackDiv.style.display = 'block';
                    }}
                  />

                  <div id="cert-img-fallback" className="hidden p-8 sm:p-12 text-center bg-[#151522]">
                    <ImageIcon className="w-12 h-12 text-[#6c63ff] mx-auto mb-3" />
                    <h4 className="font-syne font-bold text-white text-base mb-1">
                      Image File Not Found
                    </h4>
                    <p className="text-xs text-[#888899] max-w-sm mx-auto">
                      Save image as <code className="text-[#02fd88]">{verifiedCert.certificateId}.png</code> inside <code className="text-white">public/certificates/</code>.
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="py-3 px-4 rounded-xl bg-[#6c63ff] hover:bg-[#5b52e0] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Certificate</span>
                </button>

                <a
                  href={getCertificatePath(verifiedCert)}
                  download={`${verifiedCert.certificateId}_Certificate`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 rounded-xl bg-[#00a651] hover:bg-[#009247] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer text-center"
                >
                  <Download className="w-4 h-4" />
                  <span>Download File</span>
                </a>

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
            <div className="bg-[#13131e] border-2 border-dashed border-[#2a2a3a] rounded-3xl p-10 sm:p-14 text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#1a1a26] border border-[#2a2a3a] mx-auto flex items-center justify-center mb-4 text-[#6c63ff]">
                <GraduationCap className="w-8 h-8" />
              </div>
              <h3 className="font-syne text-lg font-bold text-white mb-2">No Certificate Loaded</h3>
              <p className="text-xs sm:text-sm text-[#888899] max-w-md mx-auto mb-6 leading-relaxed">
                Enter your Certificate ID or Crypto Hash to load credential.
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
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-sm text-[#888899]">Loading...</div>}>
        <VerifyContent />
      </Suspense>
      <Footer />
    </div>
  );
}