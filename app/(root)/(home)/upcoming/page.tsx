import CallList from "@/components/shared/CallList";
import React from "react";

const UpcomingPage = () => {
  return (
    <section className="size-full flex flex-col gap-10 text-white">
      <h1 className="text-3xl font-bold">Upcoming</h1>
      <CallList type="upcoming" />
    </section>
  );
};

export default UpcomingPage;
