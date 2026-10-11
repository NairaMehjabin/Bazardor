'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession, updateUser } from '@/lib/auth-client';
import toast from 'react-hot-toast';

export default function UpdateProfilePage() {
  const router = useRouter();
  const { data: session, isPending, refetch } = useSession();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  // Protected route check
  useEffect(() => {
    if (!isPending && !session) {
      toast.error('প্রবেশ করতে প্রথমে সাইন ইন করুন');
      router.push('/signin');
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (session?.user?.name) {
      setName(session.user.name);
    }
  }, [session]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('নাম খালি রাখা যাবে না');
      return;
    }

    setLoading(true);

    try {
      await updateUser(
        {
          name: name.trim(),
        },
        {
          onSuccess: () => {
            setLoading(false);
            toast.success('প্রোফাইল সফলভাবে আপডেট করা হয়েছে!');
            refetch();
            router.push('/profile');
          },
          onError: (ctx) => {
            setLoading(false);
            toast.error(ctx.error.message || 'আপডেট করতে সমস্যা হয়েছে');
          },
        }
      );
    } catch (err) {
      setLoading(false);
      toast.error('একটি ত্রুটি ঘটেছে');
    }
  };

  if (isPending) {
    return (
      <div className="min-h-screen bg-[#f2f6f3] flex flex-col items-center justify-center py-20 px-4">
        <div className="relative flex flex-col items-center space-y-4">
          <div className="w-14 h-14 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
          <p className="text-sm font-bold text-gray-600 tracking-wide animate-pulse">
            যাচাই করা হচ্ছে...
          </p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-[calc(100vh-160px)] bg-[#f4f7f5] py-12 px-4 sm:px-6">
      <div className="max-w-xl mx-auto space-y-6">
        
        {/* Back Link */}
        <div>
          <Link href="/profile" className="text-xs font-bold text-emerald-600 hover:underline inline-flex items-center gap-1">
            <span>←</span> প্রোফাইলে ফিরে যান
          </Link>
        </div>

        {/* Header */}
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            তথ্য আপডেট করুন
          </h1>
          <p className="text-xs text-gray-500 font-medium mt-1">
            আপনার প্রোফাইলের নাম পরিবর্তন করুন।
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-5">
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                নাম
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-800 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/10 transition"
                placeholder="আপনার নাম লিখুন"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#009b4c] hover:bg-[#00813f] text-white font-bold py-3.5 rounded-xl shadow-md transition text-xs sm:text-sm tracking-wide cursor-pointer disabled:opacity-70"
            >
              {loading ? 'আপডেট হচ্ছে...' : 'আপডেট ইনফরমেশন'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}