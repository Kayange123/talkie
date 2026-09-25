import Link from "next/link";
import React from "react";
import MobileNav from "./MobileNav";
import { Video } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { appConfig } from "@/config/app.config";

const Navbar = () => {
  return (
    <nav className="flex-between sticky left-0 top-0 z-50 w-full border-b border-white/5 bg-dark-1/95 px-6 py-4 backdrop-blur lg:px-10">
      <Link href="/" className="flex items-center gap-2 md:gap-3">
        <div className="flex-center size-10 rounded-xl bg-blue-1">
          <Video className="size-6 text-white" />
        </div>
        <p className="text-[26px] font-extrabold text-white max-sm:hidden">
          {appConfig.title}
        </p>
      </Link>
      <div className="flex-between gap-5">
        <UserButton afterSignOutUrl="/sign-in" />
        <MobileNav />
      </div>
    </nav>
  );
};

export default Navbar;
