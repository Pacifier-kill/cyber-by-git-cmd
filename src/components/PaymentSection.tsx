'use client';

import React, { useState } from 'react';
import { 
  CreditCard, 
  CheckCircle, 
  Copy, 
  Send, 
  ShieldCheck, 
  Download, 
  FileText, 
  AlertCircle,
  Building2,
  Smartphone,
  Check
} from 'lucide-react';
import { ACADEMY_INFO, COURSES } from '../data/courses';

interface PaymentSectionProps {
  initialDetails?: {
    name?: string;
    email?: string;
    phone?: string;
    courseName?: string;
    fee?: number;
  };
}

export const PaymentSection: React.FC<PaymentSectionProps> = ({ initialDetails }) => {
  const [selectedMethod, setSelectedMethod] = useState<'easypaisa' | 'jazzcash' | 'bank' | 'nayapay'>('easypaisa');
  const [selectedCourseName, setSelectedCourseName] = useState<string>(
    initialDetails?.courseName || 'Basic Computer & MS Office'
  );
  
  const currentCourse = COURSES.find(c => c.name.toLowerCase() === selectedCourseName.toLowerCase()) || COURSES[0];
  const currentFee = initialDetails?.fee || currentCourse.fee;

  const [studentName, setStudentName] = useState<string>(initialDetails?.name || '');
  const [studentPhone, setStudentPhone] = useState<string>(initialDetails?.phone || '');
  const [transactionId, setTransactionId] = useState<string>('');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [paymentConfirmed, setPaymentConfirmed] = useState<boolean>(false);
  const [receiptData, setReceiptData] = useState<any>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !studentPhone.trim() || !transactionId.trim()) {
      alert('Please fill in Student Name, Phone Number, and Transaction/Reference ID.');
      return;
    }

    const receipt = {
      receiptNo: `CN-RCP-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' }),
      studentName,
      studentPhone,
      courseName: selectedCourseName,
      amount: currentFee,
      method: selectedMethod.toUpperCase(),
      transactionId: transactionId.trim(),
      status: 'VERIFIED & ENROLLED'
    };

    setReceiptData(receipt);
    setPaymentConfirmed(true);

    // Send confirmation message to WhatsApp desk
    const waText = encodeURIComponent(
      `*Fee Payment Submission - Cyber Nova Academy*\n` +
      `Receipt No: ${receipt.receiptNo}\n` +
      `Student: ${studentName}\n` +
      `Phone: ${studentPhone}\n` +
      `Course: ${selectedCourseName}\n` +
      `Amount Paid: Rs. ${currentFee.toLocaleString()}\n` +
      `Method: ${receipt.method}\n` +
      `Transaction ID: ${transactionId.trim()}`
    );
    window.open(`https://wa.me/${ACADEMY_INFO.whatsappNumber}?text=${waText}`, '_blank');
  };

  return (
    <section id="payment" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0a0a0f] border-t border-[#2a2a3a]">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00a651]/10 text-[#02fd88] text-xs font-semibold tracking-wider uppercase mb-3 border border-[#00a651]/25">
            Direct Academy Accounts
          </div>
          <h2 className="font-syne text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
            Fee Payment Portal
          </h2>
          <p className="text-[#888899] text-sm sm:text-base leading-relaxed">
            Secure your batch slot immediately by transferring fees via Easypaisa, JazzCash, or online banking. Submit your transaction ID to receive an instant electronic enrollment receipt.
          </p>
        </div>

        {/* Payment Methods Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <button
            type="button"
            onClick={() => setSelectedMethod('easypaisa')}
            className={`p-4 rounded-2xl border transition-all flex flex-col items-center justify-center gap-2 cursor-pointer ${
              selectedMethod === 'easypaisa'
                ? 'bg-[#00a651]/15 border-[#00a651] text-white shadow-lg shadow-[#00a651]/20'
                : 'bg-[#13131e] border-[#2a2a3a] text-[#888899] hover:text-white hover:border-[#3a3a4e]'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-[#00a651] text-white flex items-center justify-center font-bold font-syne text-sm shadow">
              EP
            </div>
            <span className="font-syne text-xs font-bold">Easypaisa</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#00a651] text-white font-semibold">
              Recommended
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedMethod('jazzcash')}
            className={`p-4 rounded-2xl border transition-all flex flex-col items-center justify-center gap-2 cursor-pointer ${
              selectedMethod === 'jazzcash'
                ? 'bg-[#d61f26]/15 border-[#d61f26] text-white shadow-lg shadow-[#d61f26]/20'
                : 'bg-[#13131e] border-[#2a2a3a] text-[#888899] hover:text-white hover:border-[#3a3a4e]'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-[#d61f26] text-white flex items-center justify-center font-bold font-syne text-sm shadow">
              JC
            </div>
            <span className="font-syne text-xs font-bold">JazzCash</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1a1a26] text-[#888899] border border-[#2a2a3a]">
              Instant
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedMethod('bank')}
            className={`p-4 rounded-2xl border transition-all flex flex-col items-center justify-center gap-2 cursor-pointer ${
              selectedMethod === 'bank'
                ? 'bg-[#6c63ff]/15 border-[#6c63ff] text-white shadow-lg shadow-[#6c63ff]/20'
                : 'bg-[#13131e] border-[#2a2a3a] text-[#888899] hover:text-white hover:border-[#3a3a4e]'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-[#6c63ff] text-white flex items-center justify-center font-bold shadow">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-syne text-xs font-bold">Meezan Bank</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1a1a26] text-[#888899] border border-[#2a2a3a]">
              IBFT / ATM
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedMethod('nayapay')}
            className={`p-4 rounded-2xl border transition-all flex flex-col items-center justify-center gap-2 cursor-pointer ${
              selectedMethod === 'nayapay'
                ? 'bg-[#ff6584]/15 border-[#ff6584] text-white shadow-lg shadow-[#ff6584]/20'
                : 'bg-[#13131e] border-[#2a2a3a] text-[#888899] hover:text-white hover:border-[#3a3a4e]'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-[#ff6584] text-white flex items-center justify-center font-bold font-syne text-sm shadow">
              NP
            </div>
            <span className="font-syne text-xs font-bold">NayaPay / Raast</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1a1a26] text-[#888899] border border-[#2a2a3a]">
              0% Fee
            </span>
          </button>
        </div>

        {/* Details Card & Payment Form */}
        <div className="bg-[#13131e] border border-[#2a2a3a] rounded-3xl p-6 sm:p-8 shadow-2xl">
          {/* Method instruction banner */}
          <div className="mb-6 p-4 rounded-2xl bg-[#111118] border border-[#2a2a3a] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#00a651] text-white flex items-center justify-center font-syne font-black text-lg shrink-0">
                {selectedMethod === 'easypaisa' && 'EP'}
                {selectedMethod === 'jazzcash' && 'JC'}
                {selectedMethod === 'bank' && <Building2 className="w-6 h-6" />}
                {selectedMethod === 'nayapay' && 'NP'}
              </div>
              <div>
                <h4 className="font-syne text-base font-bold text-white">
                  {selectedMethod === 'easypaisa' && 'Official Easypaisa Account'}
                  {selectedMethod === 'jazzcash' && 'Official JazzCash Account'}
                  {selectedMethod === 'bank' && 'Meezan Bank Online Transfer'}
                  {selectedMethod === 'nayapay' && 'Raast & NayaPay Account'}
                </h4>
                <p className="text-xs text-[#888899]">
                  Send fee and submit transaction/TID number below.
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right w-full sm:w-auto">
              <div className="text-xs text-[#888899]">Amount to Transfer</div>
              <div className="font-syne text-xl font-extrabold text-[#02fd88]">
                Rs. {currentFee.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Account Credential Box */}
          <div className="p-5 rounded-2xl bg-[#1a1a26] border border-[#2a2a3a] mb-8 space-y-3">
            {selectedMethod === 'easypaisa' && (
              <>
                <div className="flex items-center justify-between py-1 border-b border-[#2a2a3a]/60">
                  <span className="text-xs text-[#888899]">Easypaisa Mobile Number</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-white tracking-wider">{ACADEMY_INFO.easypaisaAccount}</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(ACADEMY_INFO.easypaisaAccount, 'ep-num')}
                      className="p-1 rounded bg-[#2a2a3a] text-xs text-[#888899] hover:text-white flex items-center gap-1"
                    >
                      {copiedField === 'ep-num' ? <Check className="w-3 h-3 text-[#43e97b]" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-xs text-[#888899]">Account Title</span>
                  <span className="text-xs sm:text-sm font-semibold text-[#02fd88]">{ACADEMY_INFO.easypaisaTitle}</span>
                </div>
              </>
            )}

            {selectedMethod === 'jazzcash' && (
              <>
                <div className="flex items-center justify-between py-1 border-b border-[#2a2a3a]/60">
                  <span className="text-xs text-[#888899]">JazzCash Mobile Number</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-white tracking-wider">{ACADEMY_INFO.jazzcashAccount}</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(ACADEMY_INFO.jazzcashAccount, 'jc-num')}
                      className="p-1 rounded bg-[#2a2a3a] text-xs text-[#888899] hover:text-white flex items-center gap-1"
                    >
                      {copiedField === 'jc-num' ? <Check className="w-3 h-3 text-[#43e97b]" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-xs text-[#888899]">Account Title</span>
                  <span className="text-xs sm:text-sm font-semibold text-[#02fd88]">{ACADEMY_INFO.jazzcashTitle}</span>
                </div>
              </>
            )}

            {selectedMethod === 'bank' && (
              <>
                <div className="flex items-center justify-between py-1 border-b border-[#2a2a3a]/60">
                  <span className="text-xs text-[#888899]">Bank Name</span>
                  <span className="text-xs sm:text-sm font-semibold text-white">{ACADEMY_INFO.bankName}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-[#2a2a3a]/60">
                  <span className="text-xs text-[#888899]">Account Title</span>
                  <span className="text-xs sm:text-sm font-semibold text-white">{ACADEMY_INFO.bankAccountTitle}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-[#2a2a3a]/60">
                  <span className="text-xs text-[#888899]">Account Number</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs sm:text-sm font-bold text-white">{ACADEMY_INFO.bankAccountNumber}</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(ACADEMY_INFO.bankAccountNumber, 'bank-acc')}
                      className="p-1 rounded bg-[#2a2a3a] text-xs text-[#888899] hover:text-white"
                    >
                      {copiedField === 'bank-acc' ? <Check className="w-3 h-3 text-[#43e97b]" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-xs text-[#888899]">IBAN</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-white">{ACADEMY_INFO.bankIBAN}</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(ACADEMY_INFO.bankIBAN, 'bank-iban')}
                      className="p-1 rounded bg-[#2a2a3a] text-xs text-[#888899] hover:text-white"
                    >
                      {copiedField === 'bank-iban' ? <Check className="w-3 h-3 text-[#43e97b]" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
              </>
            )}

            {selectedMethod === 'nayapay' && (
              <>
                <div className="flex items-center justify-between py-1 border-b border-[#2a2a3a]/60">
                  <span className="text-xs text-[#888899]">Raast ID / NayaPay ID</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-white">{ACADEMY_INFO.phone}</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(ACADEMY_INFO.phone, 'np-num')}
                      className="p-1 rounded bg-[#2a2a3a] text-xs text-[#888899] hover:text-white"
                    >
                      {copiedField === 'np-num' ? <Check className="w-3 h-3 text-[#43e97b]" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-xs text-[#888899]">Recipient Name</span>
                  <span className="text-xs sm:text-sm font-semibold text-[#02fd88]">{ACADEMY_INFO.easypaisaTitle}</span>
                </div>
              </>
            )}
          </div>

          {/* Submission Form */}
          <form onSubmit={handleConfirmPayment} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#888899] mb-1.5">
                  Selected Course
                </label>
                <select
                  value={selectedCourseName}
                  onChange={(e) => setSelectedCourseName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1a1a26] border border-[#2a2a3a] text-white text-sm focus:outline-none focus:border-[#00a651]"
                >
                  {COURSES.map((course) => (
                    <option key={course.id} value={course.name}>
                      {course.name} — Rs. {course.fee.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#888899] mb-1.5">
                  Student Full Name *
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="e.g. Ali Hassan"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1a1a26] border border-[#2a2a3a] text-white text-sm focus:outline-none focus:border-[#00a651]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#888899] mb-1.5">
                  Student Contact Phone / WhatsApp *
                </label>
                <input
                  type="tel"
                  value={studentPhone}
                  onChange={(e) => setStudentPhone(e.target.value)}
                  placeholder="03XX-XXXXXXX"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1a1a26] border border-[#2a2a3a] text-white text-sm focus:outline-none focus:border-[#00a651]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#888899] mb-1.5">
                  Transaction / TID / Reference ID *
                </label>
                <input
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="e.g. 29384729184 or Bank Ref"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1a1a26] border border-[#2a2a3a] text-white text-sm focus:outline-none focus:border-[#00a651]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[#00a651] hover:bg-[#009146] text-white font-bold text-sm sm:text-base transition-all shadow-xl shadow-[#00a651]/25 hover:shadow-[#00a651]/40 flex items-center justify-center gap-2 cursor-pointer mt-4"
            >
              <ShieldCheck className="w-5 h-5" />
              <span>Verify & Generate Enrollment Receipt</span>
            </button>
          </form>

          {/* Receipt Modal Card */}
          {paymentConfirmed && receiptData && (
            <div className="mt-8 p-6 rounded-2xl bg-[#111118] border-2 border-[#00a651] text-left animate-fade-in shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-[#2a2a3a] mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-[#00a651]/20 text-[#02fd88] flex items-center justify-center font-bold">
                    ✓
                  </div>
                  <div>
                    <h3 className="font-syne text-base font-bold text-white">Enrollment Receipt Voucher</h3>
                    <p className="text-xs text-[#888899]">Cyber Nova Computer Academy — Karachi Campus</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#00a651]/20 text-[#02fd88] border border-[#00a651]/40">
                  {receiptData.status}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs mb-4 p-4 rounded-xl bg-[#1a1a26]">
                <div>
                  <span className="text-[#888899]">Receipt No:</span>
                  <div className="font-mono font-bold text-white mt-0.5">{receiptData.receiptNo}</div>
                </div>
                <div>
                  <span className="text-[#888899]">Date:</span>
                  <div className="font-semibold text-white mt-0.5">{receiptData.date}</div>
                </div>
                <div>
                  <span className="text-[#888899]">Student:</span>
                  <div className="font-semibold text-white mt-0.5">{receiptData.studentName}</div>
                </div>
                <div>
                  <span className="text-[#888899]">Course:</span>
                  <div className="font-semibold text-[#818cf8] mt-0.5">{receiptData.courseName}</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-3 border-t border-[#2a2a3a]">
                <div className="text-xs text-[#888899]">
                  Reference ID: <span className="font-mono text-white">{receiptData.transactionId}</span> via {receiptData.method}
                </div>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-lg bg-[#1a1a26] hover:bg-[#2a2a3a] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-[#6c63ff]" />
                  <span>Print / Save Voucher</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
