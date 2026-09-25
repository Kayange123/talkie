import CallList from "@/components/shared/CallList";
import React from "react";

const PreviousPage = () => {
  return (
    <section className="size-full flex flex-col gap-10 text-white">
      <h1 className="text-3xl font-bold">Previous meetings</h1>
      <CallList type="ended" />
    </section>
  );
};

export default PreviousPage;
