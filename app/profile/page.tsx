'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession, signOut } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

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
      <div className="min-h-[70vh] flex items-center justify-center bg-[#f2f6f3]">
        <p className="text-sm font-semibold text-gray-500">লোড হচ্ছে...</p>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#f2f6f3] px-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md w-full border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-2">অনুগ্রহ করে সাইন ইন করুন</h2>
          <p className="text-xs text-gray-500 mb-6">প্রোফাইল দেখতে আপনাকে প্রথমে সাইন ইন করতে হবে।</p>
          <button
            onClick={() => router.push('/signin')}
            className="w-full bg-[#009b4c] hover:bg-[#00813f] text-white py-3 rounded-xl font-bold text-xs transition cursor-pointer"
          >
            সাইন ইন করুন
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-160px)] bg-[#f2f6f3] py-10 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            আমার প্রোফাইল
          </h1>
          <p className="text-xs text-gray-400 font-medium mt-1">
            আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।
          </p>
        </div>

        {/* User Profile Card */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Rounded Square Avatar UI */}
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 relative shrink-0 border border-gray-200">
              {session.user.image ? (
                <Image 
                  src={session.user.image} 
                  alt={session.user.name || 'User'} 
                  fill 
                  className="object-cover" 
                />
              ) : (
                <span className="flex items-center justify-center h-full text-xl font-bold text-gray-600">
                  {session.user.name ? session.user.name.charAt(0) : 'U'}
                </span>
              )}
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">{session.user.name}</h2>
              <p className="text-xs text-gray-400 font-medium">{session.user.email}</p>
            </div>
          </div>

          {/* Outlined Sign Out Button with Left Arrow */}
          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 border border-red-300 text-red-500 hover:bg-red-50 px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            <span>←</span>
            <span>সাইন আউট</span>
          </button>
        </div>

        {/* Info Update Section Card */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-gray-900">
            তথ্য
          </h3>
          <p className="text-xs text-gray-500">
            আপনার নাম পরিবর্তন বা প্রোফাইলের বিস্তারিত তথ্য আপডেট করুন।
          </p>

          <Link
            href="/profile/update"
            className="w-full inline-block text-center bg-[#009b4c] hover:bg-[#00813f] text-white font-bold py-3 rounded-xl shadow-sm transition text-xs tracking-wide cursor-pointer"
          >
            তথ্য আপডেট করুন
          </Link>
        </div>

      </div>
    </div>
  );
}