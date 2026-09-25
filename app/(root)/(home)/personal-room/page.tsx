"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { getMeetingLink } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { CopyIcon, LoaderCircleIcon, VideoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const DataRow = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <div className="flex flex-col items-start gap-1 border-b border-dark-3 pb-4 last:border-none last:pb-0 xl:flex-row xl:gap-4">
      <h2 className="text-base font-medium text-sky-1 lg:text-lg xl:min-w-36">
        {title}
      </h2>
      <p className="w-full truncate text-sm font-semibold lg:text-lg">
        {description}
      </p>
    </div>
  );
};

const PersonalRoom = () => {
  const { user } = useUser();
  const { toast } = useToast();
  const client = useStreamVideoClient();
  const router = useRouter();
  const [meetingLink, setMeetingLink] = useState("");
  const [isStarting, setIsStarting] = useState(false);

  // Built after mount so the link uses the current origin without a
  // server/client hydration mismatch.
  useEffect(() => {
    if (user) setMeetingLink(getMeetingLink(user.id, true));
  }, [user]);

  const startRoom = async () => {
    if (!client || !user) return;

    setIsStarting(true);
    try {
      // Idempotent: creates the room the first time, reuses it afterwards.
      await client.call("default", user.id).getOrCreate({
        data: { starts_at: new Date().toISOString() },
      });
      router.push(`/meeting/${user.id}?personal=true`);
    } catch (error) {
      console.error("Failed to start personal room", error);
      toast({ title: "Couldn't start your room", variant: "destructive" });
      setIsStarting(false);
    }
  };

  const displayName = user?.firstName || user?.username || "Your";

  return (
    <section className="flex size-full flex-col gap-8 text-white">
      <div>
        <h1 className="text-3xl font-bold">Personal Room</h1>
        <p className="mt-1 text-muted-foreground">
          A permanent room you can share with anyone.
        </p>
      </div>

      <div className="flex w-full flex-col gap-4 rounded-[14px] bg-dark-1 p-6 ring-1 ring-white/5 xl:max-w-[900px]">
        <DataRow title="Topic" description={`${displayName}'s meeting room`} />
        <DataRow title="Meeting ID" description={user?.id ?? ""} />
        <DataRow title="Invite link" description={meetingLink} />
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          className="rounded-lg bg-blue-1 px-6"
          disabled={isStarting || !client || !user}
          onClick={startRoom}
        >
          {isStarting ? (
            <LoaderCircleIcon className="mr-2 size-4 animate-spin" />
          ) : (
            <VideoIcon className="mr-2 size-4" />
          )}
          Start meeting
        </Button>
        <Button
          className="rounded-lg bg-dark-3 px-6"
          disabled={!meetingLink}
          onClick={() => {
            navigator.clipboard.writeText(meetingLink);
            toast({ title: "Link copied" });
          }}
        >
          <CopyIcon className="mr-2 size-4" />
          Copy invitation link
        </Button>
      </div>
    </section>
  );
};

export default PersonalRoom;
