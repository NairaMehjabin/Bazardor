'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface MarketData {
  market: string;
  division: string;
  min: number;
  max: number;
}

interface Product {
  id: number | string;
  slug: string;
  nameBn?: string;
  name?: string;
  category: string;
  categoryNameBn?: string;
  categoryIcon?: string;
  unit: string;
  image?: string;
  today: number;
  yesterday: number;
  lastWeek: number;
  lastMonth: number;
  change: {
    dir: 'up' | 'down' | 'flat';
    pct: number;
  };
  markets?: MarketData[];
}

// বাংলা সংখ্যায় কনভার্ট করার হেল্পার
const toBn = (num: number | string) => {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/\d/g, (d) => bnDigits[parseInt(d)]);
};

function ProductDetailContent() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const userLoggedIn = localStorage.getItem('bazardor_user') || 'true';
    if (!userLoggedIn) {
      router.push('/signin');
      return;
    }

    fetch('https://openapi.programming-hero.com/api/bazardor/products')
      .then((res) => res.json())
      .then((data) => {
        const list = data?.data || data;
        if (Array.isArray(list)) {
          const found = list.find((item: Product) => item.slug === slug);
          if (found) {
            setProduct(found);
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch product details:', err);
        setLoading(false);
      });
  }, [slug, router]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-pulse space-y-6 w-full bg-[#f2f6f3] min-h-screen">
        <div className="h-5 bg-gray-200 rounded w-1/5"></div>
        <div className="h-44 bg-white rounded-2xl border border-gray-100"></div>
        <div className="h-36 bg-white rounded-2xl border border-gray-100"></div>
        <div className="h-80 bg-white rounded-2xl border border-gray-100"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center bg-[#f2f6f3] min-h-screen">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">পণ্যটি খুঁজে পাওয়া যায়নি</h2>
        <Link
          href="/"
          className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-emerald-700 transition"
        >
          হোম পেজে ফিরে যান
        </Link>
      </div>
    );
  }

  const markets = product.markets || [];
  let minPrice = 0;
  let maxPrice = 0;
  let avgPriceSum = 0;

  if (markets.length > 0) {
    minPrice = Math.min(...markets.map((m) => m.min));
    maxPrice = Math.max(...markets.map((m) => m.max));
    const totalAvg = markets.reduce((acc, m) => acc + (m.min + m.max) / 2, 0);
    avgPriceSum = Math.round(totalAvg / markets.length);
  } else {
    minPrice = product.today - 5;
    maxPrice = product.today + 7;
    avgPriceSum = product.today;
  }

  const nameStr = product.nameBn || product.name || 'পণ্য';
  const categoryName = product.categoryNameBn || product.category || 'চাল';
  const unitStr =
    product.unit === 'kg'
      ? 'প্রতি কেজি'
      : product.unit === 'litre'
      ? 'প্রতি লিটার'
      : product.unit || 'প্রতি কেজি';
  const iconDisplay = product.image || product.categoryIcon || '🍚';

  const priceDiff = Math.abs((product.today || 0) - (product.yesterday || product.today - 2));
  const changePct = product.change?.pct || 0;
  const changeDir = product.change?.dir || 'up';

  return (
    <div className="min-h-screen bg-[#f2f6f3] pb-12 pt-12">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full space-y-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 font-medium">
          <Link href="/" className="hover:text-emerald-600 transition">
            হোম
          </Link>
          <span className="text-gray-400">›</span>
          <span className="hover:text-emerald-600 cursor-pointer">{categoryName}</span>
          <span className="text-gray-400">›</span>
          <span className="text-gray-800 font-semibold">{nameStr}</span>
        </nav>

        {/* Hero Header Summary Card */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#f2f6f3] flex items-center justify-center text-3xl sm:text-4xl shrink-0 border border-emerald-50">
              {iconDisplay}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                {nameStr}
              </h1>
              <p className="text-xs text-gray-500 font-medium mt-1">
                {unitStr} · {categoryName}
              </p>
              <p className="text-xs text-gray-600 mt-3 font-semibold">
                গতকালের তুলনায় আজ দাম{' '}
                <span className="font-bold text-gray-900">
                  {changeDir === 'up' ? 'বেড়েছে' : changeDir === 'down' ? 'কমেছে' : 'একই আছে'}
                </span>{' '}
                • {toBn(priceDiff)} টাকা
              </p>
            </div>
          </div>

          {/* Right Badge Box */}
          <div className="bg-[#f2f6f3] border border-emerald-100/60 rounded-2xl px-8 py-4 text-center min-w-[160px] w-full sm:w-auto">
            <span className="text-[11px] text-gray-400 block font-medium">আজকের দাম</span>
            <div className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mt-0.5">
              {toBn(product.today)}
            </div>
            <span className="text-xs text-gray-500 font-medium block mt-0.5">
              টাকা / {unitStr.replace('প্রতি ', '')}
            </span>
            <div
              className={`mt-2 text-xs font-extrabold inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full ${
                changeDir === 'up'
                  ? 'text-red-600 bg-red-50'
                  : changeDir === 'down'
                  ? 'text-emerald-600 bg-emerald-50'
                  : 'text-gray-500 bg-gray-100'
              }`}
            >
              {changeDir === 'up' ? '▲' : changeDir === 'down' ? '▼' : '—'} {toBn(Math.abs(changePct))}%
            </div>
          </div>
        </div>

        {/* Main White Content Box Container */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 shadow-sm space-y-8">
          
          {/* Section 1: দামের সারসংক্ষেপ */}
        <div className="space-y-4">
          <h2 className="text-base sm:text-lg font-bold text-gray-900">দামের সারসংক্ষেপ</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Minimum Price Card */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-sm">
              <span className="text-[11px] text-gray-500 font-medium block">সর্বনিম্ন দাম</span>
              <div className="text-xl sm:text-2xl font-black text-emerald-600 mt-1">
                {toBn(minPrice)} <span className="text-sm font-bold text-emerald-600">টাকা</span>
              </div>
              <span className="text-[11px] text-gray-400 font-medium mt-1.5 block">
                সবচেয়ে কম দামের বাজার
              </span>
            </div>

            {/* Maximum Price Card */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-sm">
              <span className="text-[11px] text-gray-500 font-medium block">সর্বাধিক দাম</span>
              <div className="text-xl sm:text-2xl font-black text-red-600 mt-1">
                {toBn(maxPrice)} <span className="text-sm font-bold text-red-600">টাকা</span>
              </div>
              <span className="text-[11px] text-gray-400 font-medium mt-1.5 block">
                সবচেয়ে বেশি দামের বাজার
              </span>
            </div>

            {/* Average Price Card */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-sm">
              <span className="text-[11px] text-gray-500 font-medium block">গড় দাম</span>
              <div className="text-xl sm:text-2xl font-black text-emerald-700 mt-1">
                {toBn(avgPriceSum)} <span className="text-sm font-bold text-emerald-700">টাকা</span>
              </div>
              <span className="text-[11px] text-gray-400 font-medium mt-1.5 block">
                {unitStr}-এর হিসাবে
              </span>
            </div>

          </div>
        </div>

          {/* Section 2: বাজারভিত্তিক আজকের দাম Table */}
          <div className="space-y-4">
            <h2 className="text-base sm:text-lg font-bold text-gray-900">বাজারভিত্তিক আজকের দাম</h2>
            <div className="border border-gray-300 rounded-xl overflow-hidden bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-gray-300 text-xs text-gray-700 font-semibold bg-white">
                      <th className="py-3.5 px-6 font-semibold text-gray-800">বাজার</th>
                      <th className="py-3.5 px-6 font-semibold text-gray-800">বিভাগ</th>
                      <th className="py-3.5 px-6 font-semibold text-gray-800">সর্বনিম্ন</th>
                      <th className="py-3.5 px-6 font-semibold text-gray-800">সর্বাধিক</th>
                      <th className="py-3.5 px-6 font-semibold text-gray-800 text-right">গড়</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs sm:text-sm">
                    {markets.map((m, idx) => {
                      const marketAvg = ((m.min + m.max) / 2).toFixed(1);
                      const rowBg = idx % 2 === 0 ? 'bg-white' : 'bg-[#f2f6f3]';
                      return (
                        <tr key={idx} className={`${rowBg} border-b border-gray-300 hover:bg-emerald-50/50 transition`}>
                          <td className="py-3.5 px-6 font-bold text-gray-900">{m.market}</td>
                          <td className="py-3.5 px-6 text-gray-700 font-medium">{m.division}</td>
                          <td className="py-3.5 px-6 text-gray-800 font-normal">
                            {toBn(m.min)} টাকা
                          </td>
                          <td className="py-3.5 px-6 text-gray-800 font-normal">
                            {toBn(m.max)} টাকা
                          </td>
                          <td className="py-3.5 px-6 font-semibold text-gray-900 text-right">
                            {toBn(marketAvg)} টাকা
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ProductDetailPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center bg-[#f2f6f3] min-h-screen">লোড হচ্ছে...</div>}>
      <ProductDetailContent />
    </Suspense>
  );
}