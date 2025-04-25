import React from "react";
import Image from "next/image";
import Link from "next/link";
export default function Header() {
  const links = ["Canada", "USA", "International", "Polling", "News"];
  return (
    <div className="flex flex-row justify-between items-center bg-white px-2 pb-4">
      <div className="flex flex-row items-center">
        <Image
          src="/logo.png"
          width={100}
          height={50}
          alt={"Apollo greek figure"}
        ></Image>
        {/* Logo as background image */}
        <div className="text-zinc-500 text-2xl font-bold ml-4">
          Apollo
          <br />
          Analytic
          <br />
          Systems
        </div>
      </div>
      {/* Navigation Buttons */}
      {links.map((text, index) => (
        <Link key={index} className="text-black px-4 hover:shadow-xl" href="#">
          {text}
        </Link>
      ))}
      <Link className="text-black px-4 hover:shadow-xl" href="#about-section">
        About
      </Link>
      <a className="nav-button contact-button" href="#contact-section">
        Contact
      </a>
    </div>
  );
}
