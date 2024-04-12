"use client";

import React from "react";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "../ui/sheet";
import { Menu, Video } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { sidebarLinks } from "@/constants/sidebar.links";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const MobileNav = () => {
  const pathname = usePathname();
  return (
    <section className="w-full max-w-[264px] md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Menu className="size-8 text-white cursor-pointer" />
        </SheetTrigger>
        <SheetContent className="border-none bg-dark-1" side="left">
          <Link href="/" className="flex items-center gap-1">
            <Video className="size-16" />
            <p className="text-[26px] font-extrabold text-white max-sm:hidden">
              Meet Me
            </p>
          </Link>
          <div className="flex h-[calc(100vh-72px)] flex-col justify-between overflow-y-auto">
            <SheetClose asChild>
              <section className="flex h-full flex-col gap-6 pt-16 text-white max-w-60">
                {sidebarLinks.map(({ label, iconUrl: Icon, href }) => {
                  const isActive =
                    pathname === href || pathname.startsWith(`${href}/`);
                  return (
                    <SheetClose asChild key={href}>
                      <Link
                        href={href}
                        key={label}
                        className={cn(
                          "flex gap-4 items-center p-4 rounded-lg justify-start",
                          {
                            "bg-blue-1": isActive,
                          }
                        )}
                      >
                        <Icon />
                        <p className="font-semibold">{label}</p>
                      </Link>
                    </SheetClose>
                  );
                })}
              </section>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
};

export default MobileNav;
