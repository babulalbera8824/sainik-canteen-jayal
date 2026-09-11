import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "QuickKart - 10 Minute Grocery Delivery",
  description: "India ka apna quick-commerce store. Fresh groceries in 10 minutes.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
