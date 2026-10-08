"use client";

import {
  StreamVideoParticipant,
  defaultEmojiReactionMap,
  useCall,
} from "@stream-io/video-react-sdk";
import { useEffect } from "react";

const VISIBLE_MS = 2600;

/**
 * Floats a participant's latest reaction up off their tile, then clears it
 * so the same emoji can be sent again. Raise hand has its own badge.
 */
const FloatingReaction = ({ participant }: { participant: StreamVideoParticipant }) => {
  const call = useCall();
  const reaction = participant.reaction;
  const emoji = reaction?.emoji_code
    ? defaultEmojiReactionMap[reaction.emoji_code] ?? null
    : null;

  useEffect(() => {
    if (!reaction) return;
    const timer = setTimeout(
      () => call?.resetReaction(participant.sessionId),
      VISIBLE_MS
    );
    return () => clearTimeout(timer);
  }, [call, reaction, participant.sessionId]);

  if (!emoji || reaction?.type === "raised-hand") return null;

  return (
    <span
      aria-hidden
      className="pointer-events-none absolute bottom-14 right-[18%] text-[44px] leading-none motion-safe:animate-float-up motion-reduce:animate-fade-hold"
    >
      {emoji}
    </span>
  );
};

export default FloatingReaction;
