'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import HeroBanner from './components/HeroBanner';
import Footer from './components/Footer';

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
  icon?: string;
}

const fallbackProducts: Product[] = [
  { slug: 'sorno-machi-chal', nameBn: 'স্বর্ণমাছি চাল', category: 'chal', unit: 'kg', today: 148, change: { dir: 'up', pct: 2.1 }, image: '🍚' },
  { slug: 'miniket-chal', nameBn: 'মিনিকেট চাল', category: 'chal', unit: 'kg', today: 99, change: { dir: 'down', pct: -2.9 }, image: '🍚' },
  { slug: 'mosur-dal', nameBn: 'মসুর ডাল', category: 'dal', unit: 'kg', today: 142, change: { dir: 'up', pct: 2.9 }, image: '🫘' },
  { slug: 'alu', nameBn: 'আলু', category: 'sobji', unit: 'kg', today: 30, change: { dir: 'down', pct: -6.2 }, image: '🥔' },
];

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [fromApi, setFromApi] = useState<boolean>(false);

  useEffect(() => {
    fetch('https://openapi.programming-hero.com/api/bazardor/products')
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((data) => {
        const fetchedList = data?.data || data;
        if (Array.isArray(fetchedList) && fetchedList.length > 0) {
          setProducts(fetchedList);
          setFromApi(true);
        } else {
          setProducts(fallbackProducts);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.warn('API fetch failed, utilizing fallback:', err);
        setProducts(fallbackProducts);
        setLoading(false);
      });
  }, []);

  const getPctValue = (change: any) => {
    if (!change) return 0;
    if (typeof change === 'object') return Number(change.pct) || 0;
    return 0;
  };

  const risers = [...products].filter((p) => {
    const dir = p.change?.dir;
    const pct = getPctValue(p.change);
    return dir === 'up' || pct > 0;
  }).slice(0, 6);

  const fallers = [...products].filter((p) => {
    const dir = p.change?.dir;
    const pct = getPctValue(p.change);
    return dir === 'down' || pct < 0;
  }).slice(0, 6);

  return (
    <main className="min-h-screen bg-[#f2f6f3] flex flex-col justify-between">
      <div>
        {/* Hero / Banner Component */}
        <HeroBanner />

        {/* Product Sections (Risers, Fallers, All Products) */}
        {loading ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center justify-center min-h-[450px]">
            {/* Modern Central Spinner Loader */}
            <div className="relative flex flex-col items-center space-y-4">
              <div className="w-14 h-14 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
              <p className="text-sm font-bold text-gray-600 tracking-wide animate-pulse">
                বাজারের তথ্য লোড হচ্ছে...
              </p>
            </div>

            {/* Skeleton Grid Preview */}
            <div className="w-full max-w-7xl mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 opacity-60">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="bg-white border border-gray-100 rounded-2xl p-5 h-36 animate-pulse flex flex-col justify-between">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="flex justify-between items-end pt-4">
                    <div className="h-5 bg-gray-100 rounded w-1/3"></div>
                    <div className="h-5 bg-gray-100 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
            {/* Section A: আজ দাম বেড়েছে ▲ */}
            {risers.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-red-600 text-lg font-bold">▲</span>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">আজ দাম বেড়েছে</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {risers.map((product, idx) => (
                    <ProductCard key={product.slug || product.id || idx} product={product} />
                  ))}
                </div>
              </section>
            )}

            {/* Section B: আজ দাম কমেছে ▼ */}
            {fallers.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-emerald-600 text-lg font-bold">▼</span>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">আজ দাম কমেছে</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {fallers.map((product, idx) => (
                    <ProductCard key={product.slug || product.id || idx} product={product} />
                  ))}
                </div>
              </section>
            )}

            {/* Section C: সব পণ্য */}
            <section id="সব-পণ্য" className="pt-6">
              <div className="mb-6 flex justify-between items-end">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">সব পণ্য</h2>
                  <p className="text-xs text-gray-500 mt-1">মোট {products.length}টি পণ্য দেখানো হচ্ছে</p>
                </div>
                <span className="text-[11px] text-gray-400 font-medium">
                  {fromApi ? '🟢 Live API Data' : '🟡 Fallback Mode'}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product, idx) => (
                  <ProductCard key={product.slug || product.id || idx} product={product} />
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}

function ProductCard({ product }: { product: Product }) {
  const nameStr = product.nameBn || product.name || 'নামহীন পণ্য';
  const unitStr = product.unit === 'kg' ? 'প্রতি কেজি' : product.unit === 'litre' ? 'প্রতি লিটার' : product.unit || 'প্রতি কেজি';
  const priceVal = product.today ?? 0;

  const changeObj = product.change || { dir: 'flat', pct: 0 };
  const pctNum = Math.abs(changeObj.pct || 0);
  const isUp = changeObj.dir === 'up';
  const isDown = changeObj.dir === 'down';

  let badgeText = `— ${pctNum.toFixed(1)}%`;
  let badgeColor = 'text-gray-500 bg-gray-100';

  if (isUp) {
    badgeText = `▲ ${pctNum.toFixed(1)}%`;
    badgeColor = 'text-red-600 bg-red-50';
  } else if (isDown) {
    badgeText = `▼ ${pctNum.toFixed(1)}%`;
    badgeColor = 'text-emerald-600 bg-emerald-50';
  }

  const iconDisplay = product.image || product.categoryIcon || '🛒';

  return (
    <Link
      href={`/product/${product.slug || 'item'}`}
      className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between relative group"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 transition">
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
            {priceVal} <span className="text-xs font-medium text-gray-500">টাকা</span>
          </span>
        </div>
        <div className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${badgeColor}`}>
          <span>{badgeText}</span>
        </div>
      </div>
    </Link>
  );
}