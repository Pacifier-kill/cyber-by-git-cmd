import React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '../components/Providers';

export const metadata: Metadata = {
  title: 'Cyber Nova Computer Academy — Coding & IT Institute',
  description: "Pakistan's premier coding institute. Learn Python, C++, Web Development, Shopify, Graphic Designing with AI, and Crypto & Forex from expert instructors — in-person & hands-on classes.",
  keywords: ['Cyber Nova', 'Computer Academy', 'Karachi', 'Coding Classes', 'Web Development', 'Python', 'Shopify', 'Certificate Verification'],
  openGraph: {
    title: 'Cyber Nova Computer Academy',
    description: "Pakistan's premier coding institute. Admissions Open — Batch 2026.",
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Syne:wght@400..800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#0a0a0f] text-[#e8e8f0] antialiased selection:bg-[#6c63ff] selection:text-white">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
