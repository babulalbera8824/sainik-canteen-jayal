import { ShoppingCart, MapPin, Search, User } from "lucide-react";
import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">QK</div>
          <span className="font-bold text-xl hidden sm:block">QuickKart</span>
        </Link>

        <div className="flex items-center gap-2 text-sm">
          <MapPin className="w-4 h-4 text-primary" />
          <span className="hidden sm:block">Deliver to</span>
          <span className="font-semibold">Select Location</span>
        </div>

        <div className="flex-1 max-w-md hidden md:flex">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input placeholder="Search atta, milk, chips..." className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/login" className="p-2"><User className="w-5 h-5" /></Link>
          <Link href="/cart" className="relative p-2 bg-primary text-white rounded-lg">
            <ShoppingCart className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-black text-white text-[10px] rounded-full flex items-center justify-center">0</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
