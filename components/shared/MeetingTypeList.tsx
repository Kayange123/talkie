"use client";

import {
  Calendar,
  Copy,
  PlusIcon,
  UserPlus2Icon,
  VideoIcon,
} from "lucide-react";
import React from "react";
import HomeCard from "./HomeCard";
import MeetingModal from "./MeetingModal";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useStreamVideoClient, Call } from "@stream-io/video-react-sdk";
import { useToast } from "@/components/ui/use-toast";
import { getMeetingLink, parseMeetingInput } from "@/lib/utils";

type MeetingType = "isJoiningMeeting" | "isScheduleMeeting" | "isInstantMeeting";

// `datetime-local` wants "YYYY-MM-DDTHH:mm" in local time, not ISO/UTC.
const toLocalInputValue = (date: Date) => {
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
};

const inOneHour = () => {
  const date = new Date(Date.now() + 60 * 60_000);
  date.setMinutes(Math.ceil(date.getMinutes() / 15) * 15, 0, 0);
  return toLocalInputValue(date);
};

const MeetingTypeList = () => {
  const router = useRouter();
  const { user } = useUser();
  const client = useStreamVideoClient();
  const { toast } = useToast();

  const [description, setDescription] = React.useState("");
  const [scheduledAt, setScheduledAt] = React.useState(inOneHour);
  const [link, setLink] = React.useState("");
  const [isCreating, setIsCreating] = React.useState(false);

  const [callDetails, setCallDetails] = React.useState<Call>();
  const [meetingType, setMeetingType] = React.useState<MeetingType>();

  const closeModal = () => {
    setMeetingType(undefined);
    setCallDetails(undefined);
    setDescription("");
    setScheduledAt(inOneHour());
    setLink("");
  };

  const createMeeting = async (type: "instant" | "scheduled") => {
    if (!user || !client)
      return toast({ title: "Still connecting, try again in a moment" });

    let startsAt = new Date();
    if (type === "scheduled") {
      startsAt = new Date(scheduledAt);
      if (Number.isNaN(startsAt.getTime()))
        return toast({ title: "Pick a date and time", variant: "destructive" });
      if (startsAt <= new Date())
        return toast({
          title: "Pick a time in the future",
          variant: "destructive",
        });
    }

    setIsCreating(true);
    try {
      const call = client.call("default", crypto.randomUUID());

      await call.getOrCreate({
        data: {
          starts_at: startsAt.toISOString(),
          custom: {
            description:
              description.trim() ||
              (type === "instant" ? "Instant meeting" : "Scheduled meeting"),
          },
        },
      });

      if (type === "instant") {
        router.push(`/meeting/${call.id}`);
        return;
      }

      setCallDetails(call);
      toast({ title: "Meeting scheduled" });
    } catch (err) {
      console.error("Failed to create meeting", err);
      toast({ title: "Failed to create meeting", variant: "destructive" });
    } finally {
      setIsCreating(false);
    }
  };

  const joinMeeting = () => {
    const path = parseMeetingInput(link);
    if (!path)
      return toast({
        title: "That doesn't look like a meeting link",
        variant: "destructive",
      });
    router.push(path);
  };

  return (
    <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      <HomeCard
        title="New Meeting"
        description="Start an instant meeting"
        icon={PlusIcon}
        handleClick={() => setMeetingType("isInstantMeeting")}
        className="bg-orange-1"
      />
      <HomeCard
        title="Join Meeting"
        description="Via invitation link"
        icon={UserPlus2Icon}
        className="bg-blue-1"
        handleClick={() => setMeetingType("isJoiningMeeting")}
      />
      <HomeCard
        title="Schedule Meeting"
        description="Plan your meeting"
        icon={Calendar}
        className="bg-purple-1"
        handleClick={() => setMeetingType("isScheduleMeeting")}
      />
      <HomeCard
        title="View Recordings"
        description="Review your recordings"
        icon={VideoIcon}
        className="bg-yellow-1"
        handleClick={() => router.push("/recordings")}
      />

      {!callDetails ? (
        <MeetingModal
          isOpen={meetingType === "isScheduleMeeting"}
          onClose={closeModal}
          title="Schedule a meeting"
          isLoading={isCreating}
          handleClick={() => createMeeting("scheduled")}
        >
          <div className="flex flex-col gap-2.5">
            <label
              htmlFor="meeting-description"
              className="text-base font-normal leading-[22px] text-sky-2"
            >
              Description
            </label>
            <textarea
              id="meeting-description"
              rows={3}
              value={description}
              placeholder="What's this meeting about?"
              onChange={(e) => setDescription(e.target.value)}
              className="input-field resize-none"
            />
          </div>
          <div className="flex w-full flex-col gap-2.5">
            <label
              htmlFor="meeting-date"
              className="text-base font-normal leading-[22px] text-sky-2"
            >
              Date and time
            </label>
            <input
              id="meeting-date"
              type="datetime-local"
              value={scheduledAt}
              min={toLocalInputValue(new Date())}
              onChange={(e) => setScheduledAt(e.target.value)}
              className="input-field [color-scheme:dark]"
            />
          </div>
        </MeetingModal>
      ) : (
        <MeetingModal
          isOpen={meetingType === "isScheduleMeeting"}
          onClose={closeModal}
          title="Meeting scheduled"
          className="text-center"
          buttonText="Copy meeting link"
          handleClick={() => {
            navigator.clipboard.writeText(getMeetingLink(callDetails.id));
            toast({ title: "Link copied" });
          }}
          buttonIcon={Copy}
        >
          <p className="text-center text-muted-foreground">
            {new Date(scheduledAt).toLocaleString(undefined, {
              dateStyle: "full",
              timeStyle: "short",
            })}
          </p>
        </MeetingModal>
      )}

      <MeetingModal
        isOpen={meetingType === "isInstantMeeting"}
        onClose={closeModal}
        title="Start an instant meeting"
        className="text-center"
        buttonText="Start meeting"
        isLoading={isCreating}
        handleClick={() => createMeeting("instant")}
      />

      <MeetingModal
        isOpen={meetingType === "isJoiningMeeting"}
        onClose={closeModal}
        title="Join a meeting"
        className="text-center"
        buttonText="Join meeting"
        handleClick={joinMeeting}
      >
        <input
          autoFocus
          value={link}
          placeholder="Paste the meeting link or ID"
          className="input-field"
          onChange={(e) => setLink(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && joinMeeting()}
        />
      </MeetingModal>
    </section>
  );
};

export default MeetingTypeList;
