'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSession, updateUser, signOut } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending, refetch } = useSession();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

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

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success('সফলভাবে সাইন আউট করা হয়েছে');
          router.push('/');
        },
      },
    });
  };

  if (isPending) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#f4f7f5]">
        <p className="text-sm font-semibold text-gray-500">লোড হচ্ছে...</p>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#f4f7f5] px-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md w-full border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-2">অনুগ্রহ করে সাইন ইন করুন</h2>
          <p className="text-xs text-gray-500 mb-6">প্রোফাইল দেখতে আপনাকে প্রথমে সাইন ইন করতে হবে।</p>
          <button
            onClick={() => router.push('/signin')}
            className="w-full bg-[#009b4c] hover:bg-[#00813f] text-white py-3 rounded-xl font-bold text-xs transition"
          >
            সাইন ইন করুন
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-160px)] bg-[#f4f7f5] py-10 px-4 sm:px-6 py-20">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            আমার প্রোফাইল
          </h1>
          <p className="text-xs text-gray-500 font-medium mt-1">
            আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন ও আপডেট করুন।
          </p>
        </div>

        {/* User Card */}
        <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 relative shrink-0 shadow-inner">
              {session.user.image ? (
                <Image src={session.user.image} alt={session.user.name || 'User'} fill className="object-cover" />
              ) : (
                <span className="flex items-center justify-center h-full text-xl font-black text-gray-600">
                  {session.user.name ? session.user.name.charAt(0) : 'U'}
                </span>
              )}
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">{session.user.name}</h2>
              <p className="text-xs text-gray-500 font-medium">{session.user.email}</p>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 border border-red-200 text-red-600 hover:bg-red-50 px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            সাইন আউট
          </button>
        </div>

        {/* Update Information Card */}
        <div className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-5">
          <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3">
            তথ্য
          </h3>

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
              {loading ? 'আপডেট হচ্ছে...' : 'আপডেট'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}