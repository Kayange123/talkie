import { cn } from "@/lib/utils";
import { LoaderCircleIcon } from "lucide-react";
import React from "react";

interface LoaderProps {
  fullScreen?: boolean;
  className?: string;
}

const Loader = ({ fullScreen = false, className }: LoaderProps) => {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        "flex-center w-full",
        fullScreen ? "h-screen" : "min-h-[240px]",
        className
      )}
    >
      <LoaderCircleIcon className="size-10 animate-spin text-blue-1" />
    </div>
  );
};

export default Loader;
