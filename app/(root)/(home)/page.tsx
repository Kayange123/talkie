import MeetingTypeList from "@/components/shared/MeetingTypeList";
import React from "react";

const HomePage = () => {
  const now = new Date();
  const date = Intl.DateTimeFormat("en-US", { dateStyle: "full" }).format(now);
  const time = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return (
    <section className="size-full flex flex-col gap-10 text-white">
      <div className="h-[300px] w-full rounded-[20px] bg-hero bg-cover">
        <div className="flex h-full flex-col justify-between max-md:px-5 max-md:py-8 lg:p-10">
          <h2 className="glassmorphism rounded max-w-[270px] p-2 text-center text-base font-normal">
            Upcoming Meeting at: 12:30PM
          </h2>
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-extrabold lg:text-7xl">{time}</h1>
            <p className="text-lg font-medium text-sky-1 lg:text-2xl">{date}</p>
          </div>
        </div>
      </div>
      <div className="">
        <MeetingTypeList />
      </div>
    </section>
  );
};

export default HomePage;
