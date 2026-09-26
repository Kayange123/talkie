"use client";

import Loader from "@/components/shared/Loader";
import MeetingSetup from "@/components/shared/MeetingSetup";
import MeetingRoom from "@/components/shared/MeetingRoom";
import { Button } from "@/components/ui/button";
import { useGetCallById } from "@/hooks/use-getcall-byid";
import { StreamCall, StreamTheme } from "@stream-io/video-react-sdk";
import { VideoOffIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

const MeetingPage = () => {
  const { id } = useParams<{ id: string }>();
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const { call, isCallLoading } = useGetCallById(id);

  if (isCallLoading) return <Loader fullScreen />;

  if (!call) {
    return (
      <main className="flex-center h-screen w-full flex-col gap-4 px-6 text-center text-white">
        <div className="flex-center size-16 rounded-full bg-dark-3">
          <VideoOffIcon className="size-8 text-sky-1" />
        </div>
        <h1 className="text-2xl font-bold">Meeting not found</h1>
        <p className="max-w-sm text-muted-foreground">
          This link may be wrong, or the meeting was never created. Check the
          link with whoever invited you.
        </p>
        <Button asChild className="mt-2 bg-blue-1">
          <Link href="/">Back to home</Link>
        </Button>
      </main>
    );
  }

  return (
    <main className="h-screen w-full">
      <StreamCall call={call}>
        <StreamTheme>
          {!isSetupComplete ? (
            <MeetingSetup onSetupComplete={() => setIsSetupComplete(true)} />
          ) : (
            <MeetingRoom />
          )}
        </StreamTheme>
      </StreamCall>
    </main>
  );
};

export default MeetingPage;
