"use client";

import { useElementSize } from "@/hooks/use-element-size";
import { useLayoutWiring } from "@/hooks/use-layout-wiring";
import { fitGrid } from "@/lib/grid-fit";
import {
  ParticipantView,
  ParticipantsAudio,
  StreamVideoParticipant,
  hasScreenShare,
  speakerLayoutSortPreset,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { useState } from "react";
import { ParticipantTileUI, TilePlaceholder } from "./ParticipantTile";

/**
 * Who goes in the spotlight: whoever is sharing their screen (showing the
 * screen), otherwise the first participant in speaker order. While a screen
 * is shown, its sharer's camera stays in the strip too.
 */
export const pickSpotlight = (participants: StreamVideoParticipant[]) => {
  const sharer = participants.find(hasScreenShare);
  if (sharer) return { spotlight: sharer, screen: true, strip: participants };
  const [spotlight, ...strip] = participants;
  return { spotlight, screen: false, strip };
};

/** The big tile, fitted at 16:9 for a screen or 4:3 for a camera. */
const Spotlight = ({ participant, screen }: { participant: StreamVideoParticipant; screen: boolean }) => {
  const [area, setArea] = useState<HTMLDivElement | null>(null);
  const size = useElementSize(area);
  const fit = size ? fitGrid({ count: 1, ...size, aspect: screen ? 16 / 9 : 4 / 3 }) : null;

  return (
    <div ref={setArea} data-testid="spotlight" className="flex-center relative min-h-0 min-w-0 flex-1">
      {fit && (
        <div className="talkie-tile" style={{ width: fit.tileWidth, height: fit.tileHeight }}>
          <ParticipantView
            participant={participant}
            trackType={screen ? "screenShareTrack" : "videoTrack"}
            muteAudio
            ParticipantViewUI={ParticipantTileUI}
            VideoPlaceholder={TilePlaceholder}
          />
        </div>
      )}
    </div>
  );
};

/** Everyone else: a column on the right, a swipeable row on phones. */
const Strip = ({ participants }: { participants: StreamVideoParticipant[] }) => (
  <div
    data-testid="speaker-strip"
    className="flex shrink-0 gap-3 overflow-auto max-md:h-[120px] md:w-[248px] md:flex-col"
  >
    {participants.map((participant) => (
      <div key={participant.sessionId} className="talkie-tile aspect-[4/3] shrink-0 max-md:h-full md:w-full">
        <ParticipantView
          participant={participant}
          muteAudio
          ParticipantViewUI={ParticipantTileUI}
          VideoPlaceholder={TilePlaceholder}
        />
      </div>
    ))}
  </div>
);

/**
 * Spotlight plus strip. Replaces the SDK's SpeakerLayout, which sized the
 * spotlight by width and overflowed short screens.
 */
const SpeakerStage = () => {
  const { useParticipants, useRemoteParticipants } = useCallStateHooks();
  const participants = useParticipants();
  const remoteParticipants = useRemoteParticipants();
  const [root, setRoot] = useState<HTMLDivElement | null>(null);
  // Screen sharers, then the dominant speaker, come first.
  useLayoutWiring(speakerLayoutSortPreset, root);

  if (participants.length === 0) return null;
  const { spotlight, screen, strip } = pickSpotlight(participants);

  return (
    <div ref={setRoot} className="flex size-full gap-4 max-md:flex-col">
      <ParticipantsAudio participants={remoteParticipants} />
      <Spotlight participant={spotlight} screen={screen} />
      {strip.length > 0 && <Strip participants={strip} />}
    </div>
  );
};

export default SpeakerStage;
