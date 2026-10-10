'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
}

interface TickerItem {
  name: string;
  price: string;
  unit: string;
  change: string;
  isUp: boolean;
}

const fallbackCategories: Category[] = [
  { id: '1', name: 'চাল', slug: 'chal', icon: '🍚' },
  { id: '2', name: 'ডাল', slug: 'dal', icon: '🫘' },
  { id: '3', name: 'তেল', slug: 'tel', icon: '🫙' },
  { id: '4', name: 'সবজি', slug: 'sobji', icon: '🥬' },
  { id: '5', name: 'মাছ', slug: 'mach', icon: '🐟' },
  { id: '6', name: 'মাংস', slug: 'mangs', icon: '🍗' },
  { id: '7', name: 'ডিম-দুধ', slug: 'dim-dudh', icon: '🥛' },
  { id: '8', name: 'মসলা', slug: 'mosla', icon: '🌶️' },
];

function NavbarContent() {
  const pathname = usePathname();
  const [categories, setCategories] = useState<Category[]>(fallbackCategories);
  const [tickerItems, setTickerItems] = useState<TickerItem[]>([]);
  const [user] = useState<{ name: string; image?: string } | null>({
    name: 'Rezwan',
  });

  useEffect(() => {
    fetch('https://openapi.programming-hero.com/api/bazardor/categories')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.data && Array.isArray(data.data) && data.data.length > 0) {
          setCategories(data.data);
        }
      })
      .catch((err) => console.error('Error fetching categories, using fallback:', err));

    setTickerItems([
      { name: 'স্বর্ণমাছি চাল', price: '১৪৮', unit: 'কেজি', change: '২.১%', isUp: true },
      { name: 'মিনিকেট চাল', price: '৯৯', unit: 'কেজি', change: '২.৯%', isUp: false },
      { name: 'বাটাম সাইজ চাল', price: '৬৬', unit: 'কেজি', change: '৩.১%', isUp: true },
      { name: 'মসুর ডাল', price: '১৪২', unit: 'কেজি', change: '২.৯%', isUp: true },
      { name: 'ছোলা', price: '১২০', unit: 'কেজি', change: '২.৪%', isUp: false },
    ]);
  }, []);

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      {/* Top Main Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Left: Logo & Bengali Date */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-12 h-12 bg-emerald-700 rounded-xl flex items-center justify-center shadow-md">
            <Image
              src="/assets/logo-icon.png"
              alt="বাজার দর লোগো"
              width={28}
              height={28}
              className="object-contain"
            />
          </div>
          <div>
            <span 
              className="text-[20px] font-extrabold text-gray-900 tracking-tight font-sans block" 
              style={{ fontWeight: 900 }}
            >
              বাজার দর
            </span>
            <p className="text-xs text-gray-400 font-medium">মঙ্গলবার, ৬ অক্টোবর, ২০২৬</p>
          </div>
        </Link>

        {/* Right: Auth / Profile */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-full cursor-pointer hover:bg-gray-100 transition">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-300 relative">
                {user.image ? (
                  <Image src={user.image} alt={user.name} fill className="object-cover" />
                ) : (
                  <span className="flex items-center justify-center h-full text-sm font-bold text-gray-700">
                    {user.name.charAt(0)}
                  </span>
                )}
              </div>
              <span className="text-sm font-semibold text-gray-800">{user.name}</span>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/signin"
                className="text-sm font-semibold text-gray-700 hover:text-emerald-600 px-4 py-2 transition"
              >
                সাইন ইন
              </Link>
              <Link
                href="/signup"
                className="text-sm font-semibold bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition shadow-sm"
              >
                সাইন আপ
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Middle Row: Category Navigation Links */}
      <div className="border-t border-gray-100 bg-white w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-start gap-6 sm:gap-8 py-3 overflow-x-auto scrollbar-none">
            {categories.map((cat) => {
              const isActive = pathname === `/category/${cat.slug}`;
              return (
                <Link
                  key={cat.id || cat.slug}
                  href={`/category/${cat.slug}`}
                  className={`flex items-center gap-2 px-3 py-1 rounded-full text-[12px] font-semibold transition whitespace-nowrap ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                      : 'text-gray-700 hover:text-emerald-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-sm">{cat.icon || '🛒'}</span>
                  <span>{cat.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Price Ticker Marquee Strip */}
      <div className="bg-gray-50/70 border-t border-b border-gray-100 py-2 overflow-hidden whitespace-nowrap">
        <div 
          className="inline-flex gap-8 items-center px-4"
          style={{
            display: 'inline-flex',
            animation: 'marquee 20s linear infinite',
            willChange: 'transform',
          }}
        >
          {tickerItems.concat(tickerItems).map((item, index) => (
            <div key={index} className="inline-flex items-center gap-2 text-xs font-medium text-gray-700 mx-4">
              <span>🛒</span>
              <span className="font-semibold text-gray-900">{item.name}</span>
              <span className="text-gray-500">
                {item.price} টাকা/{item.unit}
              </span>
              <span className={`flex items-center font-bold ${item.isUp ? 'text-red-600' : 'text-emerald-600'}`}>
                {item.isUp ? '▲' : '▼'} {item.change}
              </span>
              <span className="text-gray-200 ml-2">|</span>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}

export default function Navbar() {
  return (
    <Suspense fallback={<div className="h-20 bg-white"></div>}>
      <NavbarContent />
    </Suspense>
  );
}