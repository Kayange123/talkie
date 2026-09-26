import SiteHeader from "@/components/landing/SiteHeader";
import React from "react";

// Shared chrome for the public pages.
const MarketingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col bg-dark-2 text-white">
      <SiteHeader />
      <div className="flex-1">{children}</div>
    </div>
  );
};

export default MarketingLayout;
