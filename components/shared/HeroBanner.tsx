"use client";

import { useNow } from "@/hooks/use-browser-values";
import { useGetCalls } from "@/hooks/use-get-calls";
import { CalendarClockIcon } from "lucide-react";
import Link from "next/link";

const HeroBanner = () => {
  const now = useNow();
  const { upcomingCalls, isLoading } = useGetCalls();

  const nextCall = upcomingCalls[0];
  const nextStartsAt = nextCall?.state.startsAt;

  return (
    <div className="h-[260px] w-full overflow-hidden rounded-[20px] bg-hero bg-cover bg-center lg:h-[300px]">
      <div className="flex h-full flex-col justify-between bg-gradient-to-r from-dark-2/70 to-transparent px-5 py-7 lg:p-10">
        {!isLoading && (
          <Link
            href={nextCall ? `/meeting/${nextCall.id}` : "/upcoming"}
            className="glassmorphism flex w-fit max-w-full animate-fade-in items-center gap-2 rounded-lg px-3 py-2 text-sm font-normal transition hover:bg-white/30 sm:text-base"
          >
            <CalendarClockIcon className="size-4 shrink-0" />
            <span className="truncate">
              {nextStartsAt
                ? `Next meeting: ${new Date(nextStartsAt).toLocaleString(
                    undefined,
                    { weekday: "short", hour: "2-digit", minute: "2-digit" }
                  )}`
                : "No upcoming meetings"}
            </span>
          </Link>
        )}
        <div className="flex min-h-[88px] flex-col gap-2 lg:min-h-[120px]">
          {now && (
            <>
              <h1 className="animate-fade-in text-5xl font-extrabold lg:text-7xl">
                {now.toLocaleTimeString(undefined, {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </h1>
              <p className="animate-fade-in text-lg font-medium text-sky-1 lg:text-2xl">
                {new Intl.DateTimeFormat(undefined, {
                  dateStyle: "full",
                }).format(now)}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
