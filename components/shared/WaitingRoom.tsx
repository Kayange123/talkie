"use client";

import { cn } from "@/lib/utils";
import {
  CallControls,
  CallParticipantsList,
  CallStatsButton,
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { LayoutList, Users2Icon } from "lucide-react";
import { Button } from "../ui/button";
import { useSearchParams, useRouter } from "next/navigation";

type LayoutType = "grid" | "speaker-left" | "speaker-right";

const MeetingRoom = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isPersonalRoom = !!searchParams.get("personal");
  const [layout, setLayout] = useState<LayoutType>("speaker-left");
  const [showParticipants, setShowParticipants] = useState(false);

  const EndCall = () => {
    const call = useCall();
    const { useLocalParticipant } = useCallStateHooks();
    const participant = useLocalParticipant();

    const isMeetingOwner =
      participant &&
      call?.state.createdBy &&
      participant.userId === call.state.createdBy.id;

    if (!isMeetingOwner) alert("Only hosts can end calls");

    return (
      <Button
        onClick={async () => {
          await call?.endCall();
          router.push("/");
        }}
      ></Button>
    );
  };
  const CallLayout = () => {
    switch (layout) {
      case "grid":
        return <PaginatedGridLayout />;
      case "speaker-left":
        return <SpeakerLayout participantsBarPosition="right" />;
      default:
        return <SpeakerLayout participantsBarPosition="left" />;
    }
  };
  return (
    <section className="relative h-screen w-full overflow-hidden pt-4 text-white">
      <div className="relative size-full flex-center">
        <div className="flex size-full items-center max-w-[1000px]">
          <CallLayout />
        </div>
        <div
          className={cn("h-[calc(100vh-86px)] hidden ml-2", {
            "show-block": showParticipants,
          })}
        >
          <CallParticipantsList onClose={() => setShowParticipants(false)} />
        </div>
      </div>
      <div className="fixed bottom-0 flex-center w-full gap-4">
        <CallControls />
        <DropdownMenu>
          <div className="">
            <DropdownMenuTrigger className="cursor-pointer rounded-2xl bg-[#19232d] p-2 hover:bg-[#4c535b] ">
              <LayoutList size={20} className="text-white" />
            </DropdownMenuTrigger>
          </div>
          <DropdownMenuContent className="border-dark-1 bg-dark-1 text-white">
            {["Grid", "Speaker-left", "Speaker-right"].map((layout, i) => (
              <div className="" key={i}>
                <DropdownMenuItem
                  onClick={() => setLayout(layout.toLowerCase() as LayoutType)}
                  className="cursor-pointer"
                >
                  {layout}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="border-dark-1" />
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <CallStatsButton />
        <Button onClick={() => setShowParticipants((prev) => !prev)}>
          <div className="rounded-2xl bg-[#19232d] p-2 hover:bg-[#4c535b] cursor-pointer">
            <Users2Icon size={20} />
          </div>
        </Button>
        {!isPersonalRoom && <EndCall />}
      </div>
    </section>
  );
};

export default MeetingRoom;
