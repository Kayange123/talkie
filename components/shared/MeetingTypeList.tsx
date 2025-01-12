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

const MeetingTypeList = () => {
  const router = useRouter();
  const { user } = useUser();
  const client = useStreamVideoClient();
  const { toast } = useToast();

  const [values, setValues] = React.useState({
    dateTime: new Date(),
    description: "",
    link: "",
  });

  const [callDetails, setCallDetails] = React.useState<Call>();
  const [meetingType, setMeetingType] = React.useState<
    "isJoiningMeeting" | "isScheduleMeeting" | "isInstantMeeting" | undefined
  >(undefined);

  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`;

  const createMeeting = async () => {
    if (!user || !client)
      return toast({ title: "User or Client not available" });

    try {
      const callId = crypto.randomUUID();
      const call = client.call("default", callId);

      if (!call) throw new Error("Failed to create a call");

      const startsAt =
        values.dateTime.toISOString() || new Date(Date.now()).toISOString();
      const description = values.description || "Instant meeting";

      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: {
            description,
          },
        },
      });

      setCallDetails(call);

      if (!values.description) {
        router.push(`/meeting/${call.id}`);
      }
      toast({
        title: "Meeting created successfull",
      });
    } catch (err) {
      toast({
        title: "Failed to create Meeting",
      });
    }
  };

  return (
    <section className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <HomeCard
        title="New Meeting"
        description="Start an instant meeting"
        icon={PlusIcon}
        handleClick={() => setMeetingType("isInstantMeeting")}
        className="bg-orange-1"
      />
      <HomeCard
        title="Schedule Meeeting"
        description="Plan your meeting"
        icon={Calendar}
        className="bg-blue-1"
        handleClick={() => setMeetingType("isScheduleMeeting")}
      />
      <HomeCard
        title="View Recordings"
        description="Reviews your recordings"
        icon={VideoIcon}
        className="bg-purple-1"
        handleClick={() => router.push("/recordings")}
      />
      <HomeCard
        title="Join Meeting"
        description="Via invitation link"
        icon={UserPlus2Icon}
        className="bg-yellow-1"
        handleClick={() => setMeetingType("isJoiningMeeting")}
      />
      {!callDetails ? (
        <MeetingModal
          isOpen={meetingType === "isScheduleMeeting"}
          onClose={() => setMeetingType(undefined)}
          title="Create Meeting"
          handleClick={createMeeting}
        >
          <div className="flex flex-col gap-2.5">
            <label className="text-base leading-[22px] font-normal text-sky-2">
              Add Description
            </label>
            <textarea
              onChange={(e) =>
                setValues({ ...values, description: e.target.value })
              }
              className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          <div className="flex w-full flex-col gap-2.5">
            <label className="text-base leading-[22px] font-normal text-sky-2">
              Select Date and Time
            </label>
            {/* <ReactDatePicker
              selected = {values.dateTime}
              onChange = {(date)=> setValues({...values, dateTime: date!})}

            /> */}
          </div>
        </MeetingModal>
      ) : (
        <MeetingModal
          isOpen={meetingType === "isScheduleMeeting"}
          onClose={() => setMeetingType(undefined)}
          title="Meeting Created"
          className="text-center"
          buttonText="Copy Meeting Link"
          handleClick={() => {
            navigator.clipboard.writeText(meetingLink);
            toast({
              title: "Link copied successfully",
            });
          }}
          buttonIcon={Copy}
        />
      )}
      <MeetingModal
        isOpen={meetingType === "isInstantMeeting"}
        onClose={() => setMeetingType(undefined)}
        title="Start instant meeting"
        className="text-center"
        buttonText="Start Meeting"
        handleClick={createMeeting}
      />
      <MeetingModal
        isOpen={meetingType === "isJoiningMeeting"}
        onClose={() => setMeetingType(undefined)}
        title="Paste/Type the link here"
        className="text-center"
        buttonText="Join Meeting"
        handleClick={() => router.push(values.link)}
      >
        {/* ///TODO: use shadcn Input component here! */}
        <input
          placeholder="Meeting link"
          className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
          onChange={(e) => setValues({ ...values, link: e.target.value })}
        />
      </MeetingModal>
    </section>
  );
};

export default MeetingTypeList;
