import React from "react";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-10 px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
        {/* Logo and description */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 flex-1">
          {/* Logo */}
          <div className="flex-shrink-0">
            {/* Replace with your actual logo image or SVG */}
            <img src="/logo-sts.png" alt="STS Logo" className="h-24" />
          </div>
          {/* Description */}
          <p className="max-w-lg text-center md:text-left text-lg font-light leading-relaxed">
            Semantic Technology Services is an innovation firm pioneering
            intelligent systems and future-ready solutions. Through strategic
            experimentation, systems thinking, and cross-disciplinary insight,
            we design ventures at the frontier of AI, data, and technology to
            redefine what's possible and shape tomorrow's frameworks.
          </p>
        </div>
        {/* Navigation and contact */}
        <nav className="flex flex-col items-center md:items-end gap-2 text-lg">
          <a href="#" className="hover:underline">
            Home
          </a>
          <a href="#" className="hover:underline">
            About Us
          </a>
          <a href="#" className="hover:underline">
            Our Philosophy
          </a>
          <a href="#" className="hover:underline">
            Disciplines
          </a>
        </nav>
        <div className="flex flex-col items-center md:items-end gap-2 text-lg">
          <button className="border border-white px-8 py-2 text-lg rounded hover:bg-white hover:text-black transition">
            Contact Us
          </button>
          <div className="flex gap-6 mt-2">
            <a href="#" aria-label="Facebook">
              <span className="text-2xl">&#xf09a;</span>
            </a>
            <a href="#" aria-label="X">
              <span className="text-2xl">&#120143;</span>
            </a>
            <a href="#" aria-label="LinkedIn">
              <span className="text-2xl">&#xf0e1;</span>
            </a>
            <a href="#" aria-label="Instagram">
              <span className="text-2xl">&#xf16d;</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
