'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from '@/lib/auth-client';
import toast from 'react-hot-toast';

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
  { id: '3', name: 'তেল', slug: 'tel', icon: '🛙' },
  { id: '4', name: 'সবজি', slug: 'sobji', icon: '🥬' },
  { id: '5', name: 'মাছ', slug: 'mach', icon: '🐟' },
  { id: '6', name: 'মাংস', slug: 'mangsho', icon: '🍗' },
  { id: '7', name: 'ডিম-দুধ', slug: 'dim-dui', icon: '🥛' },
  { id: '8', name: 'মসলা', slug: 'mosla', icon: '🌶️' },
];

function NavbarContent() {
  const pathname = usePathname();
  const { data: session, isPending } = useSession();
  const [categories, setCategories] = useState<Category[]>(fallbackCategories);
  const [tickerItems, setTickerItems] = useState<TickerItem[]>([]);
  const [currentDateStr, setCurrentDateStr] = useState<string>('মঙ্গলবার, ৬ অক্টোবর, ২০২৬');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'Asia/Dhaka',
    };

    try {
      const bnDate = new Intl.DateTimeFormat('bn-BD', options).format(new Date());
      setCurrentDateStr(bnDate);
    } catch (e) {
      setCurrentDateStr('মঙ্গলবার, ৬ অক্টোবর, ২০২৬');
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    fetch('https://openapi.programming-hero.com/api/bazardor/categories')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.data && Array.isArray(data.data) && data.data.length > 0) {
          setCategories(data.data);
        }
      })
      .catch((err) => console.error('Error fetching categories:', err));

    setTickerItems([
      { name: 'স্বর্ণমাছি চাল', price: '১৪৮', unit: 'কেজি', change: '২.১%', isUp: true },
      { name: 'মিনিকেট চাল', price: '৯৯', unit: 'কেজি', change: '২.৯%', isUp: false },
      { name: 'বাটাম সাইজ চাল', price: '৬৬', unit: 'কেজি', change: '৩.১%', isUp: true },
      { name: 'মসুর ডাল', price: '১৪২', unit: 'কেজি', change: '২.৯%', isUp: true },
      { name: 'ছোলা', price: '১২০', unit: 'কেজি', change: '২.৪%', isUp: false },
    ]);
  }, []);

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success('সফলভাবে সাইন আউট করা হয়েছে');
          window.location.href = '/';
        },
        onError: () => {
          toast.error('সাইন আউট করতে সমস্যা হয়েছে');
        }
      },
    });
  };

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
            <p className="text-xs text-gray-400 font-medium">{currentDateStr}</p>
          </div>
        </Link>

        {/* Right: Auth / Profile Dropdown */}
        <div className="flex items-center gap-4 relative" ref={dropdownRef}>
          {isPending ? (
            <div className="text-xs text-gray-400">লোড হচ্ছে...</div>
          ) : session?.user ? (
            <div>
              {/* Profile Trigger Button */}
              <div 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 bg-gray-50 border border-gray-100 px-3.5 py-1.5 rounded-full cursor-pointer hover:bg-gray-100 transition shadow-sm select-none"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-300 relative">
                  {session.user.image ? (
                    <Image src={session.user.image} alt={session.user.name || 'User'} fill className="object-cover" />
                  ) : (
                    <span className="flex items-center justify-center h-full text-sm font-bold text-gray-700">
                      {session.user.name ? session.user.name.charAt(0) : 'U'}
                    </span>
                  )}
                </div>
                <span className="text-sm font-semibold text-gray-800">{session.user.name}</span>
                <svg className={`w-4 h-4 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {/* Dropdown Menu Box */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 py-3 px-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="pb-3 border-b border-gray-100">
                    <p className="text-sm font-bold text-gray-900">{session.user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{session.user.email}</p>
                  </div>

                  <div className="py-2 space-y-1">
                    <Link
                      href="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition"
                    >
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      আমার প্রোফাইল
                    </Link>
                  </div>

                  <div className="pt-2 border-t border-gray-100">
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        handleSignOut();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition cursor-pointer"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      সাইন আউট
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                href="/signin"
                className="text-sm font-bold text-gray-800 hover:text-emerald-600 transition"
              >
                সাইন ইন
              </Link>
              <Link
                href="/signup"
                className="text-sm font-bold bg-[#009b4c] text-white px-5 py-2.5 rounded-xl hover:bg-[#00813f] transition shadow-md"
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