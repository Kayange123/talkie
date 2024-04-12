"use client";

import { sidebarLinks } from "@/constants/sidebar.links";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SidebarLinks = () => {
  const pathname = usePathname();
  return (
    <div className="flex flex-col gap-4">
      {sidebarLinks.map(({ label, iconUrl: Icon, href }) => {
        const isActive = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            href={href}
            key={label}
            className={cn(
              "flex gap-4 items-center p-3 rounded-lg justify-start",
              {
                "bg-blue-1": isActive,
              }
            )}
          >
            <Icon />
            <p className="text-base font-semibold max-lg:hidden">{label}</p>
          </Link>
        );
      })}
    </div>
  );
};

export default SidebarLinks;
