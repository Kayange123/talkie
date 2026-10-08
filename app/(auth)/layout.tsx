import ThemeToggle from "@/components/shared/ThemeToggle";
import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex-center relative min-h-screen w-full bg-gradient-to-br from-dark-2 via-dark-1 to-dark-4 px-4 py-10">
      <ThemeToggle className="absolute right-4 top-4" />
      {children}
    </div>
  );
};

export default AuthLayout;
