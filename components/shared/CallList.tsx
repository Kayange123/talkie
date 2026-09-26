"use client";

import { useGetCalls } from "@/hooks/use-get-calls";
import { Call, CallRecording } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";
import React, { FC, useEffect, useState } from "react";
import MeetingCard from "./MeetingCard";
import {
  BookmarkCheckIcon,
  BookUpIcon,
  LucideIcon,
  Mic2Icon,
  PlaySquareIcon,
} from "lucide-react";
import Loader from "./Loader";
import { useToast } from "../ui/use-toast";
import { getMeetingLink } from "@/lib/utils";

interface CallListProps {
  type: "ended" | "upcoming" | "recordings";
}

const emptyStates: Record<
  CallListProps["type"],
  { icon: LucideIcon; title: string; description: string }
> = {
  ended: {
    icon: BookmarkCheckIcon,
    title: "No previous meetings",
    description: "Meetings you've held will show up here.",
  },
  upcoming: {
    icon: BookUpIcon,
    title: "Nothing scheduled",
    description: "Schedule a meeting from the home page and it'll appear here.",
  },
  recordings: {
    icon: Mic2Icon,
    title: "No recordings yet",
    description: "Record a meeting and you can play it back here.",
  },
};

const formatDate = (date?: Date | string) =>
  date
    ? new Date(date).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "";

const CallList: FC<CallListProps> = ({ type }) => {
  const router = useRouter();
  const { toast } = useToast();
  const { isLoading, endedCalls, upcomingCalls, callRecordings } =
    useGetCalls();
  const [recordings, setRecordings] = useState<CallRecording[]>([]);
  const [isLoadingRecordings, setIsLoadingRecordings] = useState(
    type === "recordings"
  );

  useEffect(() => {
    if (type !== "recordings" || isLoading) return;

    const fetchCallData = async () => {
      setIsLoadingRecordings(true);
      try {
        const callData = await Promise.all(
          callRecordings.map((call) => call.queryRecordings())
        );
        setRecordings(callData.flatMap((record) => record.recordings));
      } catch {
        toast({ title: "Couldn't load recordings, try again later" });
      } finally {
        setIsLoadingRecordings(false);
      }
    };

    fetchCallData();
  }, [callRecordings, type, isLoading, toast]);

  const getCalls = () => {
    switch (type) {
      case "ended":
        return endedCalls;
      case "upcoming":
        return upcomingCalls;
      case "recordings":
        return recordings;
      default:
        return [];
    }
  };

  const calls = getCalls();

  if (isLoading || isLoadingRecordings) return <Loader />;

  if (calls.length === 0) {
    const { icon: EmptyIcon, title, description } = emptyStates[type];
    return (
      <div className="flex-center min-h-[280px] animate-fade-in flex-col gap-3 rounded-[14px] border border-dashed border-dark-3 px-6 text-center">
        <div className="flex-center size-14 rounded-full bg-dark-3">
          <EmptyIcon className="size-7 text-sky-1" />
        </div>
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="max-w-sm text-muted-foreground">{description}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      {calls.map((call: Call | CallRecording) =>
        type === "recordings" ? (
          <MeetingCard
            key={(call as CallRecording).url}
            icon={Mic2Icon}
            title={
              (call as CallRecording).filename?.substring(0, 25) || "Recording"
            }
            date={formatDate((call as CallRecording).start_time)}
            buttonIcon1={PlaySquareIcon}
            buttonText="Play"
            handleClick={() =>
              window.open((call as CallRecording).url, "_blank", "noopener")
            }
            link={(call as CallRecording).url}
          />
        ) : (
          <MeetingCard
            key={(call as Call).id}
            icon={type === "ended" ? BookmarkCheckIcon : BookUpIcon}
            title={
              (call as Call).state?.custom?.description || "Personal Meeting"
            }
            date={formatDate((call as Call).state?.startsAt)}
            isPreviousMeeting={type === "ended"}
            buttonText="Start"
            handleClick={() => router.push(`/meeting/${(call as Call).id}`)}
            link={getMeetingLink((call as Call).id)}
          />
        )
      )}
    </div>
  );
};

export default CallList;
