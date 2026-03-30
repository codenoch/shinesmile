import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#004de6] selection:text-white pb-20">
      <header className="px-4 md:px-8 lg:px-12 py-8 border-b border-white/10">
        <Link href="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors">
          <ArrowLeft size={20} /> Back to Home
        </Link>
      </header>
      <main className="max-w-4xl mx-auto px-4 pt-16">
        <h1 className="text-4xl md:text-6xl font-medium mb-8">Privacy Policy</h1>
        <p className="text-white/60 mb-12">Last updated: March 27, 2026</p>
        
        <div className="space-y-8 text-white/80 leading-relaxed">
          <section>
            <h2 className="text-2xl font-medium text-white mb-4">1. Information We Collect</h2>
            <p>We collect information that you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us. This information may include: name, email, phone number, postal address, profile picture, payment method, and other information you choose to provide.</p>
          </section>
          <section>
            <h2 className="text-2xl font-medium text-white mb-4">2. How We Use Your Information</h2>
            <p>We may use the information we collect about you to provide, maintain, and improve our services, including, for example, to facilitate payments, send receipts, provide products and services you request (and send related information), develop new features, provide customer support to Users and Drivers, develop safety features, authenticate users, and send product updates and administrative messages.</p>
          </section>
          <section>
            <h2 className="text-2xl font-medium text-white mb-4">3. Sharing of Information</h2>
            <p>We may share the information we collect about you as described in this Statement or as described at the time of collection or sharing, including as follows: with third parties to provide you a service you requested through a partnership or promotional offering made by a third party or us; with the general public if you submit content in a public forum, such as blog comments, social media posts, or other features of our services that are viewable by the general public.</p>
          </section>
          <section>
            <h2 className="text-2xl font-medium text-white mb-4">4. Security</h2>
            <p>We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
