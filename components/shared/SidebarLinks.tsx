"use client";

import { sidebarLinks } from "@/constants/sidebar.links";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarLinksProps {
  // Wraps each link, e.g. so the mobile sheet closes on navigation.
  wrap?: (link: React.ReactElement, href: string) => React.ReactNode;
  compact?: boolean;
}

const SidebarLinks = ({ wrap = (link) => link, compact = true }: SidebarLinksProps) => {
  const pathname = usePathname();
  return (
    <div className="flex flex-col gap-2">
      {sidebarLinks.map(({ label, iconUrl: Icon, href }) => {
        const isActive = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <div key={href}>
            {wrap(
              <Link
                href={href}
                title={label}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex items-center justify-start gap-4 rounded-lg p-3 text-sky-2 transition-colors hover:bg-dark-3 hover:text-white",
                  { "bg-blue-1 text-white hover:bg-blue-1": isActive }
                )}
              >
                <Icon className="size-5 shrink-0" />
                <p
                  className={cn("text-base font-semibold", {
                    "max-lg:hidden": compact,
                  })}
                >
                  {label}
                </p>
              </Link>,
              href
            )}
          </div>
        );
      })}
    </div>
  );
};

export default SidebarLinks;
