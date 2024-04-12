import {
  Home,
  BookUpIcon,
  BookmarkCheckIcon,
  Mic2Icon,
  Plus,
} from "lucide-react";

export const sidebarLinks = [
  { iconUrl: Home, label: "Home", href: "/" },
  {
    iconUrl: BookUpIcon,
    label: "Upcoming",
    href: "/upcoming",
  },
  {
    iconUrl: BookmarkCheckIcon,
    label: "Previous",
    href: "/previous",
  },
  {
    iconUrl: Mic2Icon,
    label: "Recordings",
    href: "/recordings",
  },
  {
    iconUrl: Plus,
    label: "Personal Room",
    href: "/personal-room",
  },
];
