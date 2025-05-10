import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Header() {
  const inactiveLinks = ["Canada", "USA", "International", "Polling", "News"];
  const activeLinks = ["About", "Contact"];
  return (
    <div className="flex flex-row justify-between items-center px-8 pb-4">
      <Link href="/">
        <div className="flex flex-row items-center">
          <Image
            src="/logo.png"
            width={100}
            height={50}
            alt={"Apollo greek figure"}
          ></Image>
          {/* Logo as background image */}
          <div className="text-zinc-500 text-2xl ml-4">
            Apollo
            <br />
            Analytic
            <br />
            Systems
          </div>
        </div>
      </Link>
      {/* Navigation Buttons */}
      {inactiveLinks.map((text, index) => (
        // <Link key={index} className="text-black px-4 hover:shadow-xl" href="#">
        //   {text}
        // </Link>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>{text}</TooltipTrigger>
            <TooltipContent>
              <p>Coming Soon</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
      <Link className="text-black px-4 hover:shadow-xl" href="/about">
        About
      </Link>
      <Link className="nav-button contact-button" href="/contact">
        Contact
      </Link>
    </div>
  );
}
