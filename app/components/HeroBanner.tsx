'use client';

import React from 'react';
import Image from 'next/image';

export default function HeroBanner() {
  const scrollToProducts = () => {
    const section = document.getElementById('সব-পণ্য');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      {/* Banner is WHITE, background page is greenish */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative overflow-hidden shadow-sm">
        {/* Left Content */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 bg-[#e2ede6] text-emerald-800 px-4 py-1.5 rounded-full text-sm font-semibold">
            <span>📅</span>
            <span>মঙ্গলবার, ৬ অক্টোবর, ২০২৬</span>
          </div>

          <h1 
            className="text-[36px] font-extrabold text-gray-900 tracking-tight leading-tight"
            style={{ fontWeight: 900 }}
          >
            আজকের বাজারের দাম এক নজরে
          </h1>

          <p className="text-gray-600 text-base sm:text-lg max-w-xl leading-relaxed">
            চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বাধিক এবং দামের পরিবর্তন এক জায়গায়।
          </p>

          <div>
            <button
              onClick={scrollToProducts}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition transform active:scale-95 flex items-center gap-2"
            >
              সব পণ্য দেখুন
            </button>
          </div>
        </div>

        {/* Right Illustration / Image */}
        <div className="lg:col-span-5 flex justify-center items-center relative">
          <div className="relative w-72 h-72 sm:w-96 sm:h-80 flex items-center justify-center">
            <Image
              src="/assets/bazar-hero.png"
              alt="বাজার হিরো বাস্কেট"
              fill
              className="object-contain drop-shadow-xl"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}