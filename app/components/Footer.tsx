import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full bg-[#ffffff] py-6 mt-auto mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500">
        <div>
          <span className="font-bold text-gray-800">বাজার দর</span> — প্রয়োজনীয় পণ্যের দাম এক নজরে।
        </div>
        <div className="mt-2 sm:mt-0 text-center sm:text-right">
          সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।
        </div>
      </div>
    </footer>
  );
}