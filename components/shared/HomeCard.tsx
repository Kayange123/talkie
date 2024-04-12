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
    <div
      onClick={handleClick}
      className={cn(
        "px-4 py-6 flex flex-col justify-between w-full xl:max-w-[270px] min-h-[260px] rounded-[14px] cursor-pointer",
        className
      )}
    >
      <div className="flex flex-center glassmorphism size-12 rounded-[10px]">
        <Icon />
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-lg">{description}</p>
      </div>
    </div>
  );
};

export default HomeCard;
