"use client";

import { useToast } from "@/components/ui/use-toast";
import { useTicker } from "@/hooks/use-browser-values";
import { useRaisedHands } from "@/hooks/use-raised-hands";
import { cn, formatElapsed, getMeetingLink } from "@/lib/utils";
import { useCall, useCallStateHooks } from "@stream-io/video-react-sdk";
import { Link2Icon, UsersIcon } from "lucide-react";
import ThemeToggle from "../shared/ThemeToggle";

interface MeetingHeaderProps {
  isPersonalRoom: boolean;
  panelOpen: boolean;
  onTogglePanel: () => void;
}

const MeetingHeader = ({ isPersonalRoom, panelOpen, onTogglePanel }: MeetingHeaderProps) => {
  const call = useCall();
  const { toast } = useToast();
  const { hands } = useRaisedHands();
  const {
    useCallCustomData,
    useCallStartedAt,
    useParticipantCount,
    useIsCallRecordingInProgress,
  } = useCallStateHooks();

  const description = useCallCustomData()?.description;
  const startedAt = useCallStartedAt();
  const participantCount = useParticipantCount();
  const isRecording = useIsCallRecordingInProgress();
  const now = useTicker(1000);

  const title =
    (typeof description === "string" && description.trim()) ||
    (isPersonalRoom ? "Personal room" : "Meeting");
  const elapsed = startedAt && now ? formatElapsed(now.getTime() - startedAt.getTime()) : null;

  const copyInvite = async () => {
    if (!call) return;
    try {
      await navigator.clipboard.writeText(getMeetingLink(call.id, isPersonalRoom));
      toast({ title: "Invite link copied" });
    } catch {
      toast({ title: "Couldn't copy the link", variant: "destructive" });
    }
  };

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-fg/[0.07] px-4 sm:h-[72px] sm:px-6">
      <div className="flex min-w-0 items-center gap-2 sm:gap-4">
        <h1 className="truncate text-base font-extrabold tracking-[-0.01em] sm:text-xl">
          {title}
        </h1>
        {elapsed && (
          <span
            aria-label={`Meeting time ${elapsed}`}
            className="flex shrink-0 items-center gap-2 rounded-full bg-dark-3 px-3 py-1.5 text-sm font-semibold tabular-nums"
          >
            <span className="size-2 rounded-full bg-[#3DDC97]" aria-hidden />
            {elapsed}
          </span>
        )}
        <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-dark-3 px-3 py-1.5 text-sm font-semibold text-sky-1 max-md:hidden">
          <UsersIcon className="size-4" aria-hidden />
          {participantCount} in call
        </span>
        <span aria-live="polite" className="contents">
          {isRecording && (
            <span className="flex shrink-0 items-center gap-2 rounded-full bg-[#E53E3E]/15 px-3 py-1.5 text-sm font-bold text-danger-text">
              <span className="size-2 animate-pulse rounded-full bg-[#F25555] motion-reduce:animate-none" aria-hidden />
              <span className="max-sm:sr-only">Recording</span>
            </span>
          )}
        </span>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <ThemeToggle className="size-11" />
        <button
          type="button"
          onClick={copyInvite}
          className="flex h-11 items-center gap-2 rounded-xl bg-dark-3 px-3 text-[15px] font-semibold text-fg transition hover:bg-dark-4 sm:px-4"
        >
          <Link2Icon className="size-[18px]" aria-hidden />
          <span className="max-sm:sr-only">Invite</span>
        </button>
        <button
          type="button"
          aria-label={hands.length ? `People, ${hands.length} raised hands` : "People"}
          aria-pressed={panelOpen}
          onClick={onTogglePanel}
          className={cn(
            "flex-center relative size-11 rounded-xl transition",
            panelOpen ? "bg-blue-1 text-white" : "bg-dark-3 text-fg hover:bg-dark-4"
          )}
        >
          <UsersIcon className="size-5" aria-hidden />
          {hands.length > 0 && (
            <span className="flex-center absolute -right-1 -top-1 h-5 min-w-5 rounded-full bg-yellow-1 px-1 text-xs font-extrabold text-[#161925]">
              {hands.length}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};

export default MeetingHeader;
