"use client";
import Link from "next/link";
import { Home, Grid2x2, Search, Package, User } from "lucide-react";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/shop", icon: Grid2x2, label: "Categories" },
  { href: "/search", icon: Search, label: "Search" },
  { href: "/account/orders", icon: Package, label: "Orders" },
  { href: "/account", icon: User, label: "Account" },
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-50">
      <div className="flex justify-around py-2">
        {items.map((it) => {
          const active = pathname === it.href;
          return (
            <Link key={it.href} href={it.href} className={`flex flex-col items-center text-xs ${active? "text-primary" : "text-gray-500"}`}>
              <it.icon className="w-5 h-5" />
              {it.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
