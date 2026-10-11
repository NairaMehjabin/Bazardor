'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from '@/lib/auth-client';
import toast from 'react-hot-toast';

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('ইমেইল এবং পাসওয়ার্ড দিন');
      toast.error('ইমেইল এবং পাসওয়ার্ড দিন');
      return;
    }

    setLoading(true);

    await signIn.email(
      {
        email,
        password,
      },
      {
        onSuccess: () => {
          setLoading(false);
          toast.success('সফলভাবে সাইন ইন করা হয়েছে!');
          router.push('/');
        },
        onError: (ctx) => {
          setLoading(false);
          const errorMsg = ctx.error.message || 'সাইন ইন করতে সমস্যা হয়েছে';
          setError(errorMsg);
          toast.error(errorMsg);
        },
      }
    );
  };

  const handleSocialSignIn = async (provider: 'google' | 'github') => {
    setError('');
    setLoading(true);
    try {
      await signIn.social({
        provider,
        callbackURL: '/',
      });
    } catch (err: any) {
      setLoading(false);
      const msg = err?.message || 'সোশ্যাল সাইন ইন করতে সমস্যা হয়েছে';
      setError(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-[calc(100vh-120px)] bg-[#f2f6f3] flex flex-col items-center pt-16 sm:pt-20 px-4 pb-4">
      {/* Header Title Section */}
      <div className="text-center mb-4">
        <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
          সাইন ইন
        </h1>
        <p className="text-[11px] sm:text-xs text-gray-600 font-medium mt-1">
          বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে ঢুকুন।
        </p>
      </div>

      {/* Main White Form Container */}
      <div className="bg-[#ffffff] border border-[#d6d3d1] rounded-[16px] p-6 shadow-sm w-full max-w-[416px] space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-xs font-semibold p-2.5 rounded-xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Email Field */}
          <div>
            <label className="block text-[11px] font-bold text-gray-700 mb-1.5">
              ইমেইল
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#ffffff] border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-gray-800 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/10 transition placeholder:text-gray-400"
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-[11px] font-bold text-gray-700 mb-1.5">
              পাসওয়ার্ড
            </label>
            <input
              type="password"
              placeholder="কমপক্ষে ৮ অক্ষর"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#ffffff] border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-gray-800 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/10 transition placeholder:text-gray-400"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#009b4c] hover:bg-[#00813f] text-white font-semibold py-3 rounded-xl shadow-md transition text-xs sm:text-sm tracking-wide mt-1 cursor-pointer disabled:opacity-70"
          >
            {loading ? 'সাইন ইন হচ্ছে...' : 'সাইন ইন'}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="flex-shrink mx-4 text-gray-400 text-[11px]">অথবা</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        {/* Social Sign In Options */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            disabled={loading}
            onClick={() => handleSocialSignIn('google')}
            className="flex items-center justify-center gap-1.5 border border-gray-200 hover:bg-gray-50/80 transition py-2.5 px-2 rounded-xl text-xs font-semibold text-gray-700 shadow-sm whitespace-nowrap cursor-pointer disabled:opacity-70"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.13 0-5.78-2.11-6.73-4.96H1.19v3.15C3.21 21.34 7.27 24 12 24z"/>
              <path fill="#FBBC05" d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.19C.43 8.14 0 9.87 0 12s.43 3.86 1.19 5.39l4.08-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.27 0 3.21 2.66 1.19 6.61l4.08 3.15c.95-2.85 3.6-4.96 6.73-4.96z"/>
            </svg>
            <span className="text-[11px] font-bold">Google দিয়ে চালিয়ে যান</span>
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={() => handleSocialSignIn('github')}
            className="flex items-center justify-center gap-1.5 border border-gray-200 hover:bg-gray-50/80 transition py-2.5 px-2 rounded-xl text-xs font-semibold text-gray-700 shadow-sm whitespace-nowrap cursor-pointer disabled:opacity-70"
          >
            <svg className="w-4 h-4 shrink-0 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            <span className="text-[11px] font-bold">GitHub দিয়ে চালিয়ে যান</span>
          </button>
        </div>

        {/* Footer Link to Sign Up */}
        <div className="text-center text-xs text-gray-500 pt-1">
          অ্যাকাউন্ট নেই?{' '}
          <Link href="/signup" className="text-emerald-600 font-bold hover:underline">
            সাইন আপ করুন
          </Link>
        </div>
      </div>

      {/* Back to Home Link */}
      <div className="mt-4 text-center">
        <Link href="/" className="text-xs text-gray-500 hover:text-emerald-600 font-medium transition">
          ← হোম পেজে ফিরে যান
        </Link>
      </div>
    </div>
  );
}