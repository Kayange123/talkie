import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex-center min-h-screen w-full bg-gradient-to-br from-dark-2 via-dark-1 to-dark-4 px-4 py-10">
      {children}
    </div>
  );
};

export default AuthLayout;
