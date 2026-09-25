import Navbar from "@/components/shared/Navbar";
import Sidebar from "@/components/shared/Sidebar";
import React from "react";

interface HomeLayoutProps {
  children: React.ReactNode;
}

const HomeLayout = ({ children }: HomeLayoutProps) => {
  return (
    <main className="relative">
      <Navbar />
      <div className="flex w-full">
        <Sidebar />
        <section className="flex min-h-[calc(100vh-73px)] w-full flex-col px-4 pb-10 pt-6 sm:px-8 lg:px-10">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </section>
      </div>
    </main>
  );
};

export default HomeLayout;
