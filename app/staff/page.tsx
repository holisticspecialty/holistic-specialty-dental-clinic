'use client';

import { useState } from 'react';

import { motion } from 'motion/react';
import { Lock, Mail, Eye, EyeOff, Leaf } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';

export default function StaffLoginPage() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError || !data.session) {
      setError('Invalid credentials. Please check your email and password.');
      setLoading(false);
      return;
    }

    // Use a hard redirect so the browser sends the newly-written auth cookie
    // to the server. client-side router.push() can hit middleware before the
    // cookie is committed, causing an infinite redirect loop.
    window.location.href = '/staff/portal';
  };

  return (
    <main className="min-h-[100dvh] flex flex-col px-6 py-12 bg-brand-bg overflow-y-auto relative">
      <Link 
        href="/" 
        className="absolute top-6 left-6 inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-500 font-medium text-sm rounded-full border border-gray-200 hover:text-brand-primary hover:border-brand-primary transition-colors shadow-sm z-10"
      >
        ← Back to home
      </Link>
      
      {/* Subtle background pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-brand-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-brand-accent/5 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative w-full max-w-md m-auto"
      >
        {/* Card */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/80 p-10">
          {/* Logo */}
          <div className="flex flex-col items-center mb-10">
            <Image src="/logo.svg" alt="Logo" width={48} height={48} className="w-12 h-12 mb-3" />
            <span className="font-[family-name:var(--font-playfair)] text-lg text-brand-primary tracking-tight">
              <span className="font-bold">HOLISTIC</span>{' '}
              <span className="italic text-brand-accent">SPECIALTY</span>
            </span>
            <div className="mt-4 flex items-center gap-1.5 text-xs text-gray-400">
              <Lock className="w-3 h-3" />
              <span className="uppercase tracking-widest font-semibold">Staff Portal</span>
            </div>
          </div>

          <h1 className="font-serif text-2xl text-brand-text text-center mb-1">
            Welcome back
          </h1>
          <p className="text-center text-gray-400 text-sm mb-8">
            Sign in to manage appointments
          </p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-brand-text uppercase tracking-wider mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(''); }}
                  placeholder="staff@holisticdental.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-brand-bg text-brand-text text-sm placeholder:text-gray-300 focus:outline-none focus:border-brand-primary transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-text uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                <input
                  type={showPw ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 bg-brand-bg text-brand-text text-sm placeholder:text-gray-300 focus:outline-none focus:border-brand-primary transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-xs bg-red-50 px-4 py-3 rounded-xl border border-red-100">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center px-6 py-3.5 bg-brand-primary text-white text-sm font-semibold rounded-full hover:bg-brand-primary/90 transition-colors shadow-lg shadow-brand-primary/20 disabled:opacity-60 mt-2"
            >
              {loading ? 'Signing in...' : 'Sign In to Portal'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center gap-1.5 text-xs text-gray-400">
            <Leaf className="w-3 h-3 text-brand-accent" />
            <span>Holistic Specialty Dental · Staff Access Only</span>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
