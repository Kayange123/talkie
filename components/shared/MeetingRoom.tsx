"use client";

import {
  CallingState,
  PaginatedGridLayout,
  SpeakerLayout,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { useState } from "react";
import { PhoneOffIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useSearchParams, useRouter } from "next/navigation";
import Loader from "./Loader";
import { RaisedHandsProvider } from "@/hooks/use-raised-hands";
import MeetingHeader from "../meeting/MeetingHeader";
import ControlBar, { LayoutMode } from "../meeting/ControlBar";
import SidePanel from "../meeting/SidePanel";
import { ParticipantTileUI, TilePlaceholder } from "../meeting/ParticipantTile";

/** "Auto" shows the grid, switching to speaker view while someone shares. */
export const useEffectiveLayout = (layout: LayoutMode): "grid" | "speaker" => {
  const { useHasOngoingScreenShare } = useCallStateHooks();
  const someoneSharing = useHasOngoingScreenShare();
  if (layout === "auto") return someoneSharing ? "speaker" : "grid";
  return layout;
};

const MeetingStage = ({ layout }: { layout: LayoutMode }) => {
  const effective = useEffectiveLayout(layout);

  return effective === "grid" ? (
    <PaginatedGridLayout
      ParticipantViewUI={ParticipantTileUI}
      VideoPlaceholder={TilePlaceholder}
    />
  ) : (
    <SpeakerLayout
      participantsBarPosition="right"
      ParticipantViewUISpotlight={ParticipantTileUI}
      ParticipantViewUIBar={ParticipantTileUI}
      VideoPlaceholder={TilePlaceholder}
    />
  );
};

const MeetingRoom = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isPersonalRoom = !!searchParams.get("personal");
  const [layout, setLayout] = useState<LayoutMode>("auto");
  const [panelOpen, setPanelOpen] = useState(false);
  const { useCallCallingState } = useCallStateHooks();

  const callingState = useCallCallingState();
  const goToDashboard = () => router.push("/dashboard");

  // Stream calls leave() for everyone when the host ends the call.
  if (callingState === CallingState.LEFT) {
    return (
      <section className="flex-center h-screen w-full flex-col gap-4 px-6 text-center text-fg">
        <div className="flex-center size-16 rounded-full bg-dark-3">
          <PhoneOffIcon className="size-8 text-sky-1" />
        </div>
        <h1 className="text-2xl font-bold">This meeting has ended</h1>
        <Button className="mt-2 bg-blue-1" onClick={goToDashboard}>
          Back to dashboard
        </Button>
      </section>
    );
  }

  if (callingState !== CallingState.JOINED) return <Loader fullScreen />;

  return (
    <RaisedHandsProvider>
      <section className="flex h-dvh w-full flex-col overflow-hidden bg-dark-2 text-fg">
        <MeetingHeader
          isPersonalRoom={isPersonalRoom}
          panelOpen={panelOpen}
          onTogglePanel={() => setPanelOpen((open) => !open)}
        />

        <div className="relative flex min-h-0 flex-1 gap-4 p-3 sm:p-5">
          <main aria-label="Participants' video" className="talkie-stage min-w-0 flex-1">
            <MeetingStage layout={layout} />
          </main>
          {panelOpen && <SidePanel onClose={() => setPanelOpen(false)} />}
        </div>

        <ControlBar
          layout={layout}
          onLayoutChange={setLayout}
          isPersonalRoom={isPersonalRoom}
          onLeave={goToDashboard}
        />
      </section>
    </RaisedHandsProvider>
  );
};

export default MeetingRoom;
