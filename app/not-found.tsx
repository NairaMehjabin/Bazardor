import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="h-screen w-screen bg-[#f2f6f3] flex flex-col items-center justify-start pt-16 sm:pt-24 px-4 overflow-hidden relative">
      {/* Subtle background ambient glow effect */}
      <div className="absolute w-80 h-80 bg-emerald-200/40 rounded-full blur-3xl top-10 left-10 pointer-events-none"></div>
      <div className="absolute w-80 h-80 bg-teal-100/40 rounded-full blur-3xl bottom-10 right-10 pointer-events-none"></div>

      {/* Main Glassmorphic Card Container */}
      <div className="relative z-10 bg-white/85 backdrop-blur-xl border border-white rounded-[32px] p-8 sm:p-10 shadow-xl shadow-emerald-950/5 max-w-lg w-full text-center space-y-5">
        
        {/* Floating Icon Badge */}
        <div className="inline-flex items-center justify-center w-18 h-18 sm:w-20 sm:h-20 bg-emerald-50 text-emerald-600 rounded-3xl text-3xl sm:text-4xl shadow-inner mx-auto transform hover:scale-110 transition-transform duration-300">
          🛒
        </div>

        {/* Text Details */}
        <div className="space-y-2.5">
          <span className="inline-block px-3.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full tracking-wide">
            ত্রুটি ৪0৪ • 404 Error
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            পৃষ্ঠাটি খুঁজে পাওয়া যায়নি
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-medium leading-relaxed max-w-sm mx-auto">
            আপনি যে পৃষ্ঠাটিতে প্রবেশ করার চেষ্টা করছেন তা সরানো হয়েছে, মুছে ফেলা হয়েছে অথবা ঠিকানাটি ভুল রয়েছে।
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#009b4c] hover:bg-[#00813f] text-white font-semibold py-3 px-8 rounded-2xl shadow-lg shadow-emerald-600/20 transition-all duration-200 text-sm tracking-wide cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>←</span>
            <span>হোম পেজে ফিরে যান</span>
          </Link>
        </div>
      </div>
    </div>
  );
}