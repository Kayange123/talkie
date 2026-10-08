"use client";

import { useElementSize } from "@/hooks/use-element-size";
import { fitGrid } from "@/lib/grid-fit";
import {
  ParticipantView,
  ParticipantsAudio,
  defaultSortPreset,
  paginatedLayoutSortPreset,
  useCall,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ParticipantTileUI, TilePlaceholder } from "./ParticipantTile";

export const PAGE_SIZE = 12;
const GAP = 16;

const chunk = <T,>(items: T[], size: number) =>
  Array.from({ length: Math.ceil(items.length / size) }, (_, i) =>
    items.slice(i * size, i * size + size)
  );

/**
 * A grid that always fits the stage: picks the column count that gives the
 * largest 4:3 tiles for the people on the current page, centring the last row.
 * Replaces the SDK's PaginatedGridLayout, whose fixed breakpoints left tiles
 * stacked or overflowing with few people.
 */
const TalkieGrid = () => {
  const call = useCall();
  const { useParticipants, useRemoteParticipants } = useCallStateHooks();
  const participants = useParticipants();
  const remoteParticipants = useRemoteParticipants();
  const [element, setElement] = useState<HTMLDivElement | null>(null);
  const size = useElementSize(element);
  const [page, setPage] = useState(0);

  // Same ordering the SDK's grid uses: screen share, speaking, video first.
  useEffect(() => {
    if (!call) return;
    call.setSortParticipantsBy(paginatedLayoutSortPreset);
    return () => call.setSortParticipantsBy(defaultSortPreset);
  }, [call]);

  // Lets the SDK pause video for tiles that aren't visible.
  useEffect(() => {
    if (!call || !element) return;
    const cleanup = call.setViewport(element);
    return () => cleanup?.();
  }, [call, element]);

  const pages = useMemo(() => chunk(participants, PAGE_SIZE), [participants]);
  const pageCount = pages.length;
  // Clamp if people left and the page we were on no longer exists.
  const current = Math.min(page, Math.max(0, pageCount - 1));
  const group = pages[current] ?? [];
  const fit = size ? fitGrid(group.length, size.width, size.height, GAP) : null;

  return (
    <div className="relative size-full">
      {/* Tiles are muted; remote audio plays here so it continues across pages. */}
      <ParticipantsAudio participants={remoteParticipants} />

      <div
        ref={setElement}
        data-testid="talkie-grid"
        className="flex-center size-full"
      >
        {fit && (
          // Width fixed to the chosen column count, so flex-wrap can't
          // squeeze an extra tile into a row; the last row stays centred.
          <div
            className="flex flex-wrap justify-center"
            style={{ gap: GAP, width: fit.cols * fit.tileWidth + (fit.cols - 1) * GAP }}
          >
            {group.map((participant) => (
              <div
                key={participant.sessionId}
                className="talkie-tile"
                style={{ width: fit.tileWidth, height: fit.tileHeight }}
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

      {pageCount > 1 && (
        <nav
          aria-label="Participant pages"
          className="absolute inset-x-0 bottom-2 flex items-center justify-center gap-3"
        >
          <button
            type="button"
            aria-label="Previous page"
            disabled={current === 0}
            onClick={() => setPage(current - 1)}
            className="flex-center size-9 rounded-full bg-dark-1/90 text-fg shadow disabled:opacity-40"
          >
            <ChevronLeftIcon className="size-5" aria-hidden />
          </button>
          <span className="rounded-full bg-dark-1/90 px-3 py-1 text-sm font-semibold">
            {current + 1} of {pageCount}
          </span>
          <button
            type="button"
            aria-label="Next page"
            disabled={current === pageCount - 1}
            onClick={() => setPage(current + 1)}
            className="flex-center size-9 rounded-full bg-dark-1/90 text-fg shadow disabled:opacity-40"
          >
            <ChevronRightIcon className="size-5" aria-hidden />
          </button>
        </nav>
      )}
    </div>
  );
};

export default TalkieGrid;
