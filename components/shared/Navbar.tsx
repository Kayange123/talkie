import Image from "next/image";
import Link from "next/link";
import React from "react";
import MobileNav from "./MobileNav";
import { Video } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="flex-between sticky top-0 left-0 z-50 w-full bg-dark-1 px-6 py-4 lg:px-10">
      <Link href="/" className="flex items-center gap-2 md:gap-4">
        <Video className="size-10 text-white" />
        <p className="text-[26px] font-extrabold text-white max-sm:hidden">
          Meet Me
        </p>
      </Link>
      <div className="flex-between gap-5">
        <MobileNav />
      </div>
    </nav>
  );
};

export default Navbar;
