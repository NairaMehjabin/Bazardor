'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Product {
  id?: number | string;
  slug: string;
  nameBn?: string;
  name?: string;
  category: string;
  categoryNameBn?: string;
  categoryIcon?: string;
  unit: string;
  image?: string;
  today: number;
  change: {
    dir: 'up' | 'down' | 'flat';
    pct: number;
  };
}

interface Category {
  id: string;
  slug: string;
  nameBn: string;
  icon: string;
}

// বাংলা সংখ্যায় কনভার্ট করার হেল্পার
const toBn = (num: number | string) => {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/\d/g, (d) => bnDigits[parseInt(d)]);
};

function CategoryPageContent() {
  const params = useParams();
  const slug = params?.slug as string;

  const [categoryInfo, setCategoryInfo] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sortOrder, setSortOrder] = useState<'default' | 'low-high' | 'high-low'>('default');

  useEffect(() => {
    if (!slug) return;
    setLoading(true);

    // ১. ক্যাটাগরি ইনফো ফেচ করা
    fetch(`https://openapi.programming-hero.com/api/bazardor/categories/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.data || data) {
          setCategoryInfo(data.data || data);
        }
      })
      .catch((err) => console.error('Error fetching category info:', err));

    // ২. প্রোডাক্ট লিস্ট ফেচ করা
    fetch(`https://openapi.programming-hero.com/api/bazardor/products?category=${slug}`)
      .then((res) => res.json())
      .then((data) => {
        const list = data?.data || data;
        if (Array.isArray(list)) {
          setProducts(list);
        } else {
          setProducts([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching category products:', err);
        setProducts([]);
        setLoading(false);
      });
  }, [slug]);

  // সাজানোর লজিক (Sorting)
  const getSortedProducts = () => {
    const list = [...products];
    if (sortOrder === 'low-high') {
      return list.sort((a, b) => (a.today || 0) - (b.today || 0));
    }
    if (sortOrder === 'high-low') {
      return list.sort((a, b) => (b.today || 0) - (a.today || 0));
    }
    return list;
  };

  const sortedProducts = getSortedProducts();

  // Loading State - Skeleton Loader
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f2f6f3] py-8">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="h-16 bg-white/60 animate-pulse rounded-2xl w-1/3"></div>
          <div className="h-12 bg-white/60 animate-pulse rounded-xl w-full"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white rounded-2xl p-5 h-36 animate-pulse"></div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  // Empty State
  if (!categoryInfo && products.length === 0) {
    return (
      <div className="min-h-screen bg-[#f2f6f3] py-20 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">ক্যাটাগরি বা পণ্য পাওয়া যায়নি</h2>
        <p className="text-sm text-gray-500 mb-6">আপনার অনুরোধকৃত ক্যাটাগরিতে বর্তমানে কোনো পণ্য উপলব্ধ নেই।</p>
        <Link
          href="/"
          className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-emerald-700 transition inline-block shadow-sm"
        >
          হোম পেজে ফিরে যান
        </Link>
      </div>
    );
  }

  const categoryName = categoryInfo?.nameBn || slug;
  const categoryIcon = categoryInfo?.icon || '🍚';

  return (
    <div className="min-h-screen bg-[#f2f6f3] pb-16">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 pt-12">
        
        {/* Category Header (No White Container Box, Direct Text & Icon on Green BG) */}
        <div className="flex items-center gap-4 py-2">
          <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-3xl border border-gray-100 shrink-0">
            {categoryIcon}
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              {categoryName}
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 font-medium mt-0.5">
              {toBn(products.length)}টি পণ্যের আজকের দাম ও পরিবর্তন
            </p>
          </div>
        </div>

        {/* Sort Control Box */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex justify-end items-center gap-3">
          <label htmlFor="sort" className="text-xs font-bold text-gray-600">
            সাজান:
          </label>
          <select
            id="sort"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as any)}
            className="bg-[#f7f9f8] border border-gray-200 text-xs sm:text-sm font-semibold text-gray-800 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500/20 transition cursor-pointer"
          >
            <option value="default">ডিফল্ট</option>
            <option value="low-high">দাম: কম থেকে বেশি</option>
            <option value="high-low">দাম: বেশি থেকে কম</option>
          </select>
        </div>

        {/* Products Counter Bar */}
        <p className="text-xs text-gray-600 font-medium px-1">
          মোট {toBn(sortedProducts.length)}টি পণ্য দেখানো হচ্ছে
        </p>

        {/* Product Cards Grid */}
        {sortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedProducts.map((product, idx) => (
              <ProductCard key={product.slug || product.id || idx} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center space-y-4">
            <p className="text-gray-500 text-sm font-medium">এই ক্যাটাগরিতে এখনো কোনো পণ্য যুক্ত করা হয়নি।</p>
            <Link
              href="/"
              className="inline-block text-xs font-bold text-emerald-600 hover:underline"
            >
              হোম পেজে ফিরে যান →
            </Link>
          </div>
        )}

      </main>
    </div>
  );
}

// Product Card Component
function ProductCard({ product }: { product: Product }) {
  const nameStr = product.nameBn || product.name || 'নামহীন পণ্য';
  const unitStr =
    product.unit === 'kg'
      ? 'প্রতি কেজি'
      : product.unit === 'litre'
      ? 'প্রতি লিটার'
      : product.unit || 'প্রতি কেজি';
  const priceVal = product.today ?? 0;

  const changeObj = product.change || { dir: 'flat', pct: 0 };
  const pctNum = Math.abs(changeObj.pct || 0);
  const isUp = changeObj.dir === 'up';
  const isDown = changeObj.dir === 'down';

  let badgeText = `— ${toBn(pctNum.toFixed(1))}%`;
  let badgeColor = 'text-gray-500 bg-gray-100';

  if (isUp) {
    badgeText = `▲ ${toBn(pctNum.toFixed(1))}%`;
    badgeColor = 'text-red-600 bg-red-50';
  } else if (isDown) {
    badgeText = `▼ ${toBn(pctNum.toFixed(1))}%`;
    badgeColor = 'text-emerald-600 bg-emerald-50';
  }

  const iconDisplay = product.image || product.categoryIcon || '🛒';

  return (
    <Link
      href={`/product/${product.slug || 'item'}`}
      className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between group"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-[#f7f9f8] flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition">
          {iconDisplay}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-gray-900 truncate">{nameStr}</h3>
          <p className="text-xs text-gray-400 mt-0.5">{unitStr}</p>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-50 flex items-end justify-between">
        <div>
          <span className="text-[11px] text-gray-400 block font-medium">আজকের দাম</span>
          <span className="text-lg font-extrabold text-gray-900">
            {toBn(priceVal)} <span className="text-xs font-medium text-gray-500">টাকা</span>
          </span>
        </div>
        <div className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${badgeColor}`}>
          <span>{badgeText}</span>
        </div>
      </div>
    </Link>
  );
}

export default function CategoryPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center bg-[#f2f6f3] min-h-screen">লোড হচ্ছে...</div>}>
      <CategoryPageContent />
    </Suspense>
  );
}