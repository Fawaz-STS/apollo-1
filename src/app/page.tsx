"use client";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-r bg-[#808080]">
      <div className="text-center text-white px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">Coming Soon</h1>
        <p className="text-xl md:text-2xl mb-8">
          Check out our Canadian election Page
        </p>
        <Link
          href="/canada"
          className="bg-white text-[#808080] px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-50 transition-colors inline-block"
        >
          View Canadian Election Results
        </Link>
      </div>
    </main>
  );
}
