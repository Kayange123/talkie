"use client";

import { useRaisedHands } from "@/hooks/use-raised-hands";
import { avatarColor, cn, initialsOf } from "@/lib/utils";
import { CallParticipantsList, useCall, useCallStateHooks } from "@stream-io/video-react-sdk";

const RaisedHandsList = () => {
  const call = useCall();
  const { hands, lower } = useRaisedHands();
  const { useLocalParticipant } = useCallStateHooks();
  const me = useLocalParticipant()?.userId;
  const isHost = !!me && call?.state.createdBy?.id === me;

  if (hands.length === 0) return null;

  return (
    <section aria-labelledby="raised-hands-heading" className="flex flex-col gap-2.5">
      <h3 id="raised-hands-heading" className="text-sm font-bold text-warn-text">
        Raised hands, in order
      </h3>
      <ol className="flex flex-col gap-2">
        {hands.map((hand, i) => {
          const isMe = hand.userId === me;
          return (
            <li
              key={hand.userId}
              className="flex items-center gap-3 rounded-[14px] bg-yellow-1/10 px-3 py-2.5"
            >
              <span className="w-5 text-sm font-extrabold text-warn-text">{i + 1}</span>
              <span
                aria-hidden
                className={cn(
                  "flex-center size-9 shrink-0 rounded-full text-[13px] font-extrabold",
                  avatarColor(hand.userId)
                )}
              >
                {initialsOf(hand.name)}
              </span>
              <span className="flex-1 truncate font-semibold">{isMe ? "You" : hand.name}</span>
              {(isMe || isHost) && (
                <button
                  type="button"
                  onClick={() => lower(hand.userId).catch(() => {})}
                  className="h-8 rounded-lg bg-dark-3 px-3 text-[13px] font-semibold text-fg transition hover:bg-dark-4"
                >
                  Lower
                  <span className="sr-only"> {isMe ? "your hand" : `${hand.name}'s hand`}</span>
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
};

const SidePanel = ({ onClose }: { onClose: () => void }) => (
  <aside
    aria-label="People"
    className="flex w-full flex-col gap-6 overflow-y-auto rounded-[20px] bg-dark-1 p-5 animate-fade-in max-md:absolute max-md:inset-3 max-md:z-20 md:w-[340px] md:shrink-0"
  >
    <RaisedHandsList />
    <div className="min-h-0 flex-1">
      <CallParticipantsList onClose={onClose} />
    </div>
  </aside>
);

export default SidePanel;
