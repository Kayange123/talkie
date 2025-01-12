import CallList from "@/components/shared/CallList";
import React from "react";

const RecordingsPage = () => {
  return (
    <section className="size-full flex flex-col gap-10 text-white">
      <h1 className="text-3xl font-bold">Recording</h1>

      <CallList type="recordings" />
    </section>
  );
};

export default RecordingsPage;
