"use client";

import { useRaisedHands } from "@/hooks/use-raised-hands";
import { avatarColor, cn, initialsOf } from "@/lib/utils";
import {
  SfuModels,
  VideoPlaceholderProps,
  hasAudio,
  useParticipantViewContext,
} from "@stream-io/video-react-sdk";
import { HandIcon, MicOffIcon } from "lucide-react";
import React from "react";
import FloatingReaction from "./FloatingReaction";

const displayName = (name: string | undefined, userId: string, isLocal: boolean) =>
  isLocal ? "You" : name || userId;

/** Shown in place of video: the person's photo, or their coloured initials. */
export const TilePlaceholder = React.forwardRef<HTMLDivElement, VideoPlaceholderProps>(
  ({ participant, style }, ref) => {
    const name = participant.name || participant.userId;
    return (
      <div ref={ref} style={style} className="flex-center absolute inset-0 bg-dark-3">
        {participant.image ? (
          // eslint-disable-next-line @next/next/no-img-element -- remote avatar from Clerk/Stream
          <img
            src={participant.image}
            alt=""
            className="aspect-square h-[38cqh] max-h-28 min-h-9 rounded-full object-cover"
          />
        ) : (
          <span
            className={cn(
              "flex-center aspect-square h-[38cqh] max-h-28 min-h-9 rounded-full font-extrabold",
              avatarColor(participant.userId)
            )}
          >
            <span className="text-[clamp(12px,14cqh,40px)]">{initialsOf(name)}</span>
          </span>
        )}
      </div>
    );
  }
);
TilePlaceholder.displayName = "TilePlaceholder";

/** Overlay for every tile: speaking glow, raised hand, connection, reactions, name. */
export const ParticipantTileUI = () => {
  const { participant } = useParticipantViewContext();
  const { isRaised } = useRaisedHands();

  const muted = !hasAudio(participant);
  const poorConnection =
    participant.connectionQuality === SfuModels.ConnectionQuality.POOR;
  const name = displayName(
    participant.name,
    participant.userId,
    !!participant.isLocalParticipant
  );

  return (
    <>
      {participant.isSpeaking && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] shadow-[inset_0_0_0_3px_#0E78F9] motion-safe:animate-speaking-glow"
        />
      )}

      {isRaised(participant.userId) && (
        <span className="tile-corner absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-yellow-1 px-2.5 py-1.5 text-[13px] font-extrabold text-[#161925]">
          <HandIcon className="size-4" aria-hidden />
          <span className="max-sm:sr-only">Hand raised</span>
        </span>
      )}

      {poorConnection && (
        <span
          role="img"
          aria-label="Poor connection"
          title="Poor connection"
          className="tile-corner absolute right-3 top-3 flex items-end gap-[3px] rounded-[10px] bg-dark-2/80 px-[9px] py-2"
        >
          <span className="h-1.5 w-1 rounded-sm bg-[#F25555]" />
          <span className="h-2.5 w-1 rounded-sm bg-fg/25" />
          <span className="h-3.5 w-1 rounded-sm bg-fg/25" />
        </span>
      )}

      <FloatingReaction participant={participant} />

      <span className="tile-name absolute bottom-3 left-3 flex max-w-[calc(100%-24px)] items-center gap-1.5 rounded-[10px] bg-dark-2/85 px-2.5 py-1.5 text-sm font-semibold text-fg">
        {muted && <MicOffIcon className="size-3.5 shrink-0 text-danger-text" aria-label="Muted" />}
        <span className="truncate">{name}</span>
      </span>
    </>
  );
};
