"use client";

import { cn } from "@/lib/utils";
import {
  CallControls,
  CallParticipantsList,
  CallStatsButton,
  CallingState,
  PaginatedGridLayout,
  SpeakerLayout,
  useCall,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { CheckIcon, LayoutList, PhoneOffIcon, Users2Icon } from "lucide-react";
import { Button } from "../ui/button";
import { useSearchParams, useRouter } from "next/navigation";
import Loader from "./Loader";

type LayoutType = "grid" | "speaker-left" | "speaker-right";

const layoutOptions: { value: LayoutType; label: string }[] = [
  { value: "grid", label: "Grid" },
  { value: "speaker-left", label: "Speaker left" },
  { value: "speaker-right", label: "Speaker right" },
];

const controlClass =
  "flex-center size-10 cursor-pointer rounded-full bg-[#19232d] text-white transition-colors hover:bg-[#4c535b]";

const CallLayout = ({ layout }: { layout: LayoutType }) => {
  switch (layout) {
    case "grid":
      return <PaginatedGridLayout />;
    case "speaker-left":
      return <SpeakerLayout participantsBarPosition="right" />;
    default:
      return <SpeakerLayout participantsBarPosition="left" />;
  }
};

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
      className="h-10 rounded-full bg-red-600 px-4"
      title="End the call for everyone"
      onClick={async () => {
        await call?.endCall();
        onEnded();
      }}
    >
      <PhoneOffIcon className="size-4 sm:mr-2" />
      <span className="max-sm:hidden">End for everyone</span>
    </Button>
  );
};

const MeetingRoom = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isPersonalRoom = !!searchParams.get("personal");
  const [layout, setLayout] = useState<LayoutType>("speaker-left");
  const [showParticipants, setShowParticipants] = useState(false);
  const { useCallCallingState } = useCallStateHooks();

  const callingState = useCallCallingState();

  // Stream calls leave() for everyone when the host ends the call.
  if (callingState === CallingState.LEFT) {
    return (
      <section className="flex-center h-screen w-full flex-col gap-4 px-6 text-center text-white">
        <div className="flex-center size-16 rounded-full bg-dark-3">
          <PhoneOffIcon className="size-8 text-sky-1" />
        </div>
        <h1 className="text-2xl font-bold">This meeting has ended</h1>
        <Button className="mt-2 bg-blue-1" onClick={() => router.push("/")}>
          Back to home
        </Button>
      </section>
    );
  }

  if (callingState !== CallingState.JOINED) return <Loader fullScreen />;

  return (
    <section className="relative h-screen w-full overflow-hidden pt-4 text-white">
      <div className="relative flex-center size-full pb-20">
        <div className="flex size-full max-w-[1000px] items-center">
          <CallLayout layout={layout} />
        </div>
        {showParticipants && (
          <div className="ml-2 h-[calc(100vh-110px)] w-full max-w-[350px] animate-fade-in max-md:absolute max-md:inset-y-0 max-md:right-2 max-md:z-10">
            <CallParticipantsList onClose={() => setShowParticipants(false)} />
          </div>
        )}
      </div>

      <div className="fixed bottom-0 flex w-full flex-wrap items-center justify-center gap-3 bg-dark-2/80 px-2 py-3 backdrop-blur">
        <CallControls onLeave={() => router.push("/")} />

        <DropdownMenu>
          <DropdownMenuTrigger className={controlClass} title="Change layout">
            <LayoutList size={20} />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="border-dark-3 bg-dark-1 text-white">
            {layoutOptions.map(({ value, label }) => (
              <DropdownMenuItem
                key={value}
                onClick={() => setLayout(value)}
                className="cursor-pointer gap-2 focus:bg-dark-3 focus:text-white"
              >
                <CheckIcon
                  className={cn("size-4", layout !== value && "invisible")}
                />
                {label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <CallStatsButton />

        <button
          type="button"
          title="Participants"
          aria-pressed={showParticipants}
          onClick={() => setShowParticipants((prev) => !prev)}
          className={cn(controlClass, showParticipants && "bg-blue-1 hover:bg-blue-1")}
        >
          <Users2Icon size={20} />
        </button>

        {!isPersonalRoom && <EndCallButton onEnded={() => router.push("/")} />}
      </div>
    </section>
  );
};

export default MeetingRoom;
