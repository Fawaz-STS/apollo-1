import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { text } from "stream/consumers";

export default function Header() {
  const links = [
    { text: "Home", link: "/" },
    { text: "Canada", link: "/canada" },
    { text: "USA" },
    { text: "International" },
    { text: "Polling" },
    { text: "News" },
    { text: "About", link: "/about" },
    { text: "Contact", link: "/contact" },
  ];
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
      {links.map((obj, index) =>
        obj.link ? (
          <Link
            className="text-black px-4 hover:shadow-xl"
            href={obj.link}
            key={index}
          >
            {obj.text}
          </Link>
        ) : (
          <TooltipProvider key={index}>
            <Tooltip>
              <TooltipTrigger>{obj.text}</TooltipTrigger>
              <TooltipContent>
                <p>Coming Soon</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      )}
    </div>
  );
}
