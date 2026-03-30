import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-4 text-center font-sans">
      <h1 className="text-8xl md:text-[12rem] font-bold text-[#004de6] mb-4 tracking-tighter">404</h1>
      <h2 className="text-3xl md:text-5xl font-medium mb-6">Page Not Found</h2>
      <p className="text-white/60 mb-10 max-w-md text-lg">The page you are looking for doesn&apos;t exist or has been moved.</p>
      <Link href="/" className="bg-white text-black px-8 py-4 rounded-full font-medium hover:bg-gray-200 transition flex items-center gap-2">
        <ArrowLeft size={20} /> Back to Home
      </Link>
    </div>
  );
}
