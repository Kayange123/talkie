import HeroBanner from "@/components/shared/HeroBanner";
import MeetingTypeList from "@/components/shared/MeetingTypeList";
import React from "react";

const HomePage = () => {
  return (
    <section className="flex size-full flex-col gap-10 text-fg">
      <HeroBanner />
      <MeetingTypeList />
    </section>
  );
};

export default HomePage;
