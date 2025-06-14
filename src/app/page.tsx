"use client";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/Apollo%20Hero%20Homepage%201.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="text-center text-[var(--apollo-primary)] px-4 relative z-10">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">Coming Soon</h1>
        <p className="text-xl md:text-2xl mb-8 ">
          Check out our Canadian election Page
        </p>
        <Link
          href="/canada"
          className="bg-white text-[var(--apollo-primary)] px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-50 transition-colors inline-block"
        >
          View Canadian Election Results
        </Link>
      </div>
    </main>
  );
}
