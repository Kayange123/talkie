"use client";

import { defaultEmojiReactionMap, useCall } from "@stream-io/video-react-sdk";
import { SmileIcon } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import ControlButton from "./ControlButton";

// Raise hand has its own button, so it's left out here.
export const REACTIONS = [
  { code: ":like:", label: "Thumbs up" },
  { code: ":heart:", label: "Heart" },
  { code: ":smile:", label: "Smile" },
  { code: ":fireworks:", label: "Celebrate" },
  { code: ":dislike:", label: "Thumbs down" },
] as const;

const ReactionPicker = () => {
  const call = useCall();
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <ControlButton label="React" icon={SmileIcon} tone={open ? "active" : "default"} />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="top"
        sideOffset={12}
        aria-label="Send a reaction"
        className="flex gap-1 rounded-2xl border-border bg-dark-1 p-2"
      >
        {REACTIONS.map(({ code, label }) => (
          <DropdownMenuItem
            key={code}
            aria-label={`React with ${label.toLowerCase()}`}
            onSelect={() => {
              call?.sendReaction({ type: "reaction", emoji_code: code }).catch(() => {});
            }}
            className="flex-center size-12 cursor-pointer rounded-xl p-0 text-[26px] focus:bg-dark-3"
          >
            {defaultEmojiReactionMap[code]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ReactionPicker;
