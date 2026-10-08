import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import React from "react";

export type ControlTone = "default" | "active" | "off" | "hand";

const tones: Record<ControlTone, string> = {
  default: "bg-dark-3 text-fg",
  active: "bg-blue-1 text-white",
  off: "bg-[#F2D6D6] text-[#B42323]",
  hand: "bg-yellow-1 text-[#161925]",
};

interface ControlButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  icon: LucideIcon;
  tone?: ControlTone;
}

/** An icon button with its label underneath; the label is screen-reader only on phones. */
const ControlButton = React.forwardRef<HTMLButtonElement, ControlButtonProps>(
  ({ label, icon: Icon, tone = "default", className, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      className={cn(
        "group flex shrink-0 flex-col items-center gap-1.5 text-xs font-semibold text-sky-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <span
        className={cn(
          "flex-center h-12 w-[52px] rounded-[14px] transition group-hover:brightness-110 group-focus-visible:ring-2 group-focus-visible:ring-ring group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-dark-1",
          tones[tone]
        )}
      >
        <Icon className="size-[22px]" aria-hidden />
      </span>
      <span className="max-sm:sr-only">{label}</span>
    </button>
  )
);
ControlButton.displayName = "ControlButton";

export default ControlButton;
