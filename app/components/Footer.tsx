import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-gray-100 py-6 mt-16 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs sm:text-sm text-gray-500 gap-4">
        {/* Left Side */}
        <div>
          <span className="font-bold text-gray-800">বাজার দর</span> — প্রয়োজনীয় পণ্যের দাম এক নজরে।
        </div>

        {/* Right Side */}
        <div className="text-right sm:text-left">
          সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।
        </div>
      </div>
    </footer>
  );
}