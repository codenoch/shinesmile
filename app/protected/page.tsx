"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Lock, Unlock } from 'lucide-react';
import { motion } from 'motion/react';

export default function ProtectedPage() {
  const [password, setPassword] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState(false);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'shinesmile2026') {
      setUnlocked(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#004de6] selection:text-white flex flex-col">
      <header className="px-4 md:px-8 lg:px-12 py-8 border-b border-white/10">
        <Link href="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors">
          <ArrowLeft size={20} /> Back to Home
        </Link>
      </header>
      
      <main className="flex-1 flex items-center justify-center p-4">
        {!unlocked ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 border border-white/10 p-8 md:p-12 rounded-3xl max-w-md w-full text-center"
          >
            <div className="w-20 h-20 bg-[#004de6]/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock size={32} className="text-[#004de6]" />
            </div>
            <h1 className="text-3xl font-medium mb-4">Protected Page</h1>
            <p className="text-white/60 mb-8">Enter the password to access this content. (Hint: shinesmile2026)</p>
            
            <form onSubmit={handleUnlock} className="space-y-4">
              <div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password" 
                  className={`w-full px-5 py-4 rounded-2xl border ${error ? 'border-red-500' : 'border-white/20'} bg-black/50 text-white focus:outline-none focus:border-[#004de6] transition-colors`}
                />
                {error && <p className="text-red-500 text-sm mt-2 text-left">Incorrect password. Please try again.</p>}
              </div>
              <button type="submit" className="w-full bg-[#004de6] text-white py-4 rounded-2xl font-medium hover:bg-[#003bb3] transition-colors">
                Unlock Content
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-3xl w-full"
          >
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-8">
              <Unlock size={32} className="text-green-500" />
            </div>
            <h1 className="text-4xl md:text-5xl font-medium mb-6">Confidential Clinic Data</h1>
            <p className="text-xl text-white/60 mb-10">You have successfully unlocked the protected area.</p>
            
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
              <div className="flex justify-between items-center border-b border-white/10 pb-6">
                <span className="text-white/60">Internal Protocol Document</span>
                <button className="text-[#004de6] hover:text-white transition-colors">Download PDF</button>
              </div>
              <div className="flex justify-between items-center border-b border-white/10 pb-6">
                <span className="text-white/60">Staff Directory 2026</span>
                <button className="text-[#004de6] hover:text-white transition-colors">View Roster</button>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/60">Equipment Maintenance Logs</span>
                <button className="text-[#004de6] hover:text-white transition-colors">Access Portal</button>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
