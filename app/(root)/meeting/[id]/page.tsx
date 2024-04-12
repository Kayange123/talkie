"use client";

import Loader from "@/components/shared/Loader";
import MeetingSetup from "@/components/shared/MeetingSetup";
import MeetingRoom from "@/components/shared/WaitingRoom";
import { useGetCallById } from "@/hooks/use-getcall-byid";
import { useUser } from "@clerk/nextjs";
import { StreamCall, StreamTheme } from "@stream-io/video-react-sdk";
import { useState } from "react";
interface MeetingRoomProps {
  params: {
    id: string;
  };
}

const MeetingPage = ({ params }: MeetingRoomProps) => {
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const { user, isLoaded } = useUser();
  const { call, isCallLoading } = useGetCallById(params.id);

  if (isCallLoading || !isLoaded) return <Loader />;
  return (
    <main className="h-screen w-full">
      <StreamCall call={call}>
        <StreamTheme>
          {!isSetupComplete ? (
            <MeetingSetup setIsSetupComplete={setIsSetupComplete} />
          ) : (
            <MeetingRoom />
          )}
        </StreamTheme>
      </StreamCall>
    </main>
  );
};

export default MeetingPage;
