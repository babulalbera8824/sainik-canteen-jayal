import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto w-full px-4 py-4 pb-20 md:pb-4">
        {/* Banner */}
        <div className="bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-6 text-white">
          <h1 className="text-2xl font-bold">Groceries in 10 Minutes</h1>
          <p className="opacity-90 mt-1">Fresh fruits, dairy & more at your doorstep</p>
          <Link href="/shop" className="inline-block mt-4 bg-white text-black px-5 py-2 rounded-lg font-semibold">Shop Now</Link>
        </div>

        {/* Categories */}
        <div className="mt-6">
          <h2 className="font-bold text-lg mb-3">Shop by Category</h2>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
            {["Fruits","Dairy","Atta","Oil","Snacks","Drinks","Care","Cleaning"].map((c) => (
              <Link key={c} href={`/category/${c.toLowerCase()}`} className="bg-white rounded-xl p-3 text-center border hover:shadow-sm">
                <div className="w-12 h-12 bg-gray-100 rounded-full mx-auto mb-2"></div>
                <span className="text-xs font-medium">{c}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Popular */}
        <div className="mt-6">
          <h2 className="font-bold text-lg mb-3">Popular Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[1,2,3,4].map((i) => (
              <div key={i} className="bg-white rounded-xl p-3 border">
                <div className="w-full h-24 bg-gray-100 rounded-lg"></div>
                <p className="mt-2 text-sm font-medium">Amul Milk 500ml</p>
                <p className="text-xs text-gray-500">500 ml</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-bold">₹28</span>
                  <button className="bg-white border border-primary text-primary px-3 py-1 rounded-lg text-xs font-bold">ADD</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-xs">
          <b>DEV Status:</b> Base UI Live hai. Agle step me Supabase DB connect karke real products ayenge.
        </div>
      </main>
      <Footer />
      <BottomNav />
    </>
  );
}
