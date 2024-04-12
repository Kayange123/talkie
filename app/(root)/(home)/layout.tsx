import Footer from "@/components/shared/Footer";
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
        <section className="flex min-h-screen w-full flex-col p-3">
          <div className="w-full">{children}</div>
        </section>
      </div>
      <Footer />
    </main>
  );
};

export default HomeLayout;
