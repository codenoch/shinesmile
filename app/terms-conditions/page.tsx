import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsConditions() {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#004de6] selection:text-white pb-20">
      <header className="px-4 md:px-8 lg:px-12 py-8 border-b border-white/10">
        <Link href="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors">
          <ArrowLeft size={20} /> Back to Home
        </Link>
      </header>
      <main className="max-w-4xl mx-auto px-4 pt-16">
        <h1 className="text-4xl md:text-6xl font-medium mb-8">Terms & Conditions</h1>
        <p className="text-white/60 mb-12">Last updated: March 27, 2026</p>
        
        <div className="space-y-8 text-white/80 leading-relaxed">
          <section>
            <h2 className="text-2xl font-medium text-white mb-4">1. Acceptance of Terms</h2>
            <p>By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using this website&apos;s particular services, you shall be subject to any posted guidelines or rules applicable to such services.</p>
          </section>
          <section>
            <h2 className="text-2xl font-medium text-white mb-4">2. Provision of Services</h2>
            <p>ShineSmile reserves the right to modify or discontinue, temporarily or permanently, the services with or without notice to the user. You agree that ShineSmile shall not be liable to you or any third party for any modification or discontinuance of the service.</p>
          </section>
          <section>
            <h2 className="text-2xl font-medium text-white mb-4">3. Medical Disclaimer</h2>
            <p>The content on this website is provided for informational purposes only and is not intended as medical advice, or as a substitute for the medical advice of a physician or dentist. Always seek the advice of your dentist or other qualified health provider with any questions you may have regarding a medical condition.</p>
          </section>
          <section>
            <h2 className="text-2xl font-medium text-white mb-4">4. Limitation of Liability</h2>
            <p>In no event shall ShineSmile be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or the inability to use the website or services.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
