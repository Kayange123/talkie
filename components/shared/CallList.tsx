"use client";

import { useGetCalls } from "@/hooks/use-get-calls";
import { Call, CallRecording } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";
import React, { FC, useEffect, useState } from "react";
import MeetingCard from "./MeetingCard";
import {
  BookmarkCheckIcon,
  BookUpIcon,
  Mic2Icon,
  PlaySquareIcon,
} from "lucide-react";
import Loader from "./Loader";
import { useToast } from "../ui/use-toast";

interface CallListProps {
  type: "ended" | "upcoming" | "recordings";
}

const CallList: FC<CallListProps> = ({ type }) => {
  const router = useRouter();
  const { toast } = useToast();
  const { isLoading, endedCalls, upcomingCalls, callRecordings } =
    useGetCalls();
  const [recordings, setRecordings] = useState<CallRecording[]>([]);

  const baseUrl = `${process.env.NEXT_PUBLIC_BASE_URL}`;

  useEffect(() => {
    const fetchCallData = async () => {
      try {
        const callData = await Promise.all(
          callRecordings.map((call) => call.queryRecordings())
        );
        const calls = callData
          .filter((call) => call.recordings.length > 0)
          .flatMap((record) => record.recordings);

        setRecordings(calls);
      } catch (error) {
        toast({
          title: "Try Again Later",
        });
      }
    };

    if (type === "recordings") fetchCallData();
  }, [callRecordings, type, toast]);

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

  const getNoCallsMessage = (): string => {
    switch (type) {
      case "ended":
        return "No calls were Available";
      case "upcoming":
        return "No upcoming calls were Available";
      case "recordings":
        return "No recordings were Available";
      default:
        return "";
    }
  };

  const calls = getCalls();
  const noCallsMessage = getNoCallsMessage();

  if (isLoading) return <Loader />;

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      {calls && calls.length > 0 ? (
        calls.map((call: Call | CallRecording, i) => (
          <MeetingCard
            key={i}
            icon={
              type === "ended"
                ? BookmarkCheckIcon
                : type === "upcoming"
                ? BookUpIcon
                : Mic2Icon
            }
            date={
              (call as Call).state?.startsAt?.toLocaleString() ||
              (call as CallRecording).start_time
            }
            buttonIcon1={type === "recordings" ? PlaySquareIcon : undefined}
            title={
              (call as Call).state?.custom?.description ||
              (call as CallRecording)?.filename?.substring(0, 25) ||
              "Personal Meeting"
            }
            isPreviousMeeting={type === "ended"}
            handleClick={
              type === "recordings"
                ? () => router.push((call as CallRecording)?.url)
                : () => router.push(`${baseUrl}/meeting/${(call as Call).id}`)
            }
            buttonText={type === "recordings" ? "Play" : "Start"}
            link={
              type === "recordings"
                ? (call as CallRecording).url
                : `${baseUrl}/meeting/${(call as Call).id}`
            }
          />
        ))
      ) : (
        <h1>{noCallsMessage}</h1>
      )}
    </div>
  );
};

export default CallList;
