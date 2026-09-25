"use client";

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import React from "react";

interface HomeCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className: string;
  handleClick: () => void;
}

const HomeCard = ({
  icon: Icon,
  title,
  className,
  description,
  handleClick,
}: HomeCardProps) => {
  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "group flex min-h-[220px] w-full flex-col justify-between rounded-[14px] px-5 py-6 text-left text-white shadow-lg transition duration-200 hover:-translate-y-1 hover:shadow-xl hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-dark-2",
        className
      )}
    >
      <div className="flex-center glassmorphism size-12 rounded-[10px] transition-transform group-hover:scale-110">
        <Icon />
      </div>
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-lg font-normal text-white/85">{description}</p>
      </div>
    </button>
  );
};

export default HomeCard;
