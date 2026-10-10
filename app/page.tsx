import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f2f6f3]">
      {/* Navbar Component */}
      <Navbar />

      {/* Hero / Banner Component */}
      <HeroBanner />

      {/* Products Section Anchor Target */}
      <section id="সব-পণ্য" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">সব পণ্য</h2>
        {/* Your product listing grid will go here */}
      </section>
    </main>
  );
}