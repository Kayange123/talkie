"use client";

import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";
import { isThemePreference, ThemePreference } from "@/lib/theme";
import { LaptopIcon, MoonIcon, SunIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const options: { value: ThemePreference; label: string; icon: typeof SunIcon }[] = [
  { value: "light", label: "Light", icon: SunIcon },
  { value: "dark", label: "Dark", icon: MoonIcon },
  { value: "system", label: "Match system", icon: LaptopIcon },
];

const ThemeToggle = ({ className }: { className?: string }) => {
  const { preference, resolved, setPreference } = useTheme();
  const Icon = resolved === "dark" ? MoonIcon : SunIcon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Change theme"
        title="Change theme"
        className={cn(
          "flex-center size-10 shrink-0 rounded-xl bg-dark-3 text-fg transition-colors hover:bg-dark-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          className
        )}
      >
        <Icon className="size-5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-44 border-border bg-dark-1 text-fg">
        <DropdownMenuLabel className="text-sky-1">Theme</DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={preference}
          onValueChange={(value) => {
            if (isThemePreference(value)) setPreference(value);
          }}
        >
          {options.map(({ value, label, icon: OptionIcon }) => (
            <DropdownMenuRadioItem
              key={value}
              value={value}
              className="cursor-pointer gap-2 focus:bg-dark-3 focus:text-fg"
            >
              <OptionIcon className="size-4" />
              {label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeToggle;
