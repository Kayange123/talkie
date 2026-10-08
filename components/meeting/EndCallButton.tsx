"use client";

import { useCall, useCallStateHooks } from "@stream-io/video-react-sdk";
import { PhoneOffIcon } from "lucide-react";
import { Button } from "../ui/button";

/** Ends the call for everyone. Only the meeting's creator sees it. */
const EndCallButton = ({ onEnded }: { onEnded: () => void }) => {
  const call = useCall();
  const { useLocalParticipant } = useCallStateHooks();
  const participant = useLocalParticipant();

  const isMeetingOwner =
    !!participant &&
    !!call?.state.createdBy &&
    participant.userId === call.state.createdBy.id;

  if (!isMeetingOwner) return null;

  return (
    <Button
      className="h-12 rounded-[14px] bg-[#D93636] px-4 text-[15px] font-bold text-white"
      title="End the call for everyone"
      onClick={async () => {
        await call?.endCall();
        onEnded();
      }}
    >
      <PhoneOffIcon className="size-[18px] sm:mr-2" aria-hidden />
      <span className="max-sm:sr-only">End for everyone</span>
    </Button>
  );
};

export default EndCallButton;
