"use client";

import { useElementSize } from "@/hooks/use-element-size";
import { fitGrid } from "@/lib/grid-fit";
import {
  ParticipantView,
  ParticipantsAudio,
  StreamVideoParticipant,
  defaultSortPreset,
  hasScreenShare,
  speakerLayoutSortPreset,
  useCall,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";
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

/**
 * A spotlight that always fits its space (16:9 for screens, 4:3 for cameras)
 * plus a scrolling strip of everyone else. Replaces the SDK's SpeakerLayout,
 * which sized the spotlight by width and overflowed short screens.
 */
const SpeakerStage = () => {
  const call = useCall();
  const { useParticipants, useRemoteParticipants } = useCallStateHooks();
  const participants = useParticipants();
  const remoteParticipants = useRemoteParticipants();
  const [spotlightArea, setSpotlightArea] = useState<HTMLDivElement | null>(null);
  const [root, setRoot] = useState<HTMLDivElement | null>(null);
  const size = useElementSize(spotlightArea);

  // Screen sharers, then the dominant speaker, come first.
  useEffect(() => {
    if (!call) return;
    call.setSortParticipantsBy(speakerLayoutSortPreset);
    return () => call.setSortParticipantsBy(defaultSortPreset);
  }, [call]);

  // Lets the SDK pause video for tiles scrolled out of the strip.
  useEffect(() => {
    if (!call || !root) return;
    const cleanup = call.setViewport(root);
    return () => cleanup?.();
  }, [call, root]);

  if (participants.length === 0) return null;
  const { spotlight, screen, strip } = pickSpotlight(participants);
  const fit = size ? fitGrid(1, size.width, size.height, 0, screen ? 16 / 9 : 4 / 3) : null;

  return (
    <div ref={setRoot} className="flex size-full gap-4 max-md:flex-col">
      <ParticipantsAudio participants={remoteParticipants} />

      <div ref={setSpotlightArea} data-testid="spotlight" className="flex-center relative min-h-0 min-w-0 flex-1">
        {fit && (
          <div className="talkie-tile" style={{ width: fit.tileWidth, height: fit.tileHeight }}>
            <ParticipantView
              participant={spotlight}
              trackType={screen ? "screenShareTrack" : "videoTrack"}
              muteAudio
              ParticipantViewUI={ParticipantTileUI}
              VideoPlaceholder={TilePlaceholder}
            />
          </div>
        )}
      </div>

      {strip.length > 0 && (
        <div
          data-testid="speaker-strip"
          className="flex shrink-0 gap-3 overflow-auto max-md:h-[120px] md:w-[248px] md:flex-col"
        >
          {strip.map((participant) => (
            <div
              key={participant.sessionId}
              className="talkie-tile aspect-[4/3] shrink-0 max-md:h-full md:w-full"
            >
              <ParticipantView
                participant={participant}
                muteAudio
                ParticipantViewUI={ParticipantTileUI}
                VideoPlaceholder={TilePlaceholder}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SpeakerStage;
