"use client";

import React from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Menu, Video } from "lucide-react";
import Link from "next/link";
import SidebarLinks from "./SidebarLinks";
import { appConfig } from "@/config/app.config";

const MobileNav = () => {
  return (
    <section className="w-fit sm:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <button type="button" aria-label="Open menu" className="flex-center">
            <Menu className="size-8 text-white" />
          </button>
        </SheetTrigger>
        <SheetContent className="border-none bg-dark-1 text-white" side="left">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SheetClose asChild>
            <Link href="/" className="flex items-center gap-3">
              <div className="flex-center size-10 rounded-xl bg-blue-1">
                <Video className="size-6" />
              </div>
              <p className="text-[26px] font-extrabold">{appConfig.title}</p>
            </Link>
          </SheetClose>
          <div className="pt-10">
            <SidebarLinks
              compact={false}
              wrap={(link) => <SheetClose asChild>{link}</SheetClose>}
            />
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
};

export default MobileNav;
