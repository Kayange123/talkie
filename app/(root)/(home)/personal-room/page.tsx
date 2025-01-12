"use client"

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useGetCallById } from "@/hooks/use-getcall-byid";
import { useUser } from "@clerk/nextjs";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";
import React from "react";

const PersonalRoom = () => {
  const { user } = useUser();
  const { toast } = useToast();
  const { call } = useGetCallById(user?.id!);
  const client = useStreamVideoClient();
  const router = useRouter();

  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${user?.id}?personal=true`;

  const DataRow = ({
    title,
    description,
  }: {
    title: string;
    description: string;
  }) => {
    return (
      <div className="flex xl:flex-row flex-col gap-2 items-start">
        <h1 className="text-base font-medium text-sky-1 lg:text-xl xl:min-w-32">
          {title}:
        </h1>
        <h1 className="truncate text-sm font-bold max-sm:max-w-[320px] lg:text-xl">
          {description}
        </h1>
      </div>
    );
  };

  const startRoom = async () => {
    if (!client || !user) return;

    if (!call) {
      const newCall = client.call("default", user?.id);

      await newCall.getOrCreate({
        data: { starts_at: new Date().toISOString() },
      });
    }

    router.push(`/meeting/${user?.id}?personal=true`);
  };

  return (
    <section className="size-full flex flex-col gap-10 text-white">
      <h1 className="text-3xl font-bold">Personal Room</h1>

      <div className="flex w-full flex-col gap-8 xl:max-w-[900px]">
        <DataRow
          title="Topic"
          description={`${user?.username}'s meeting room`}
        />
        <DataRow title="Meeting ID" description={user?.id!} />
        <DataRow title="Invite Link" description={meetingLink} />
      </div>
      <div className="flex gap-5">
        <Button className="bg-blue-1" onClick={startRoom}>
          Start Meeting
        </Button>
        <Button
          className="bg-dark-3"
          onClick={() => {
            navigator.clipboard.writeText(meetingLink);
            toast({
              title: "Link copied successfully",
            });
          }}
        >
          Copy Invitation Link
        </Button>
      </div>
    </section>
  );
};

export default PersonalRoom;
