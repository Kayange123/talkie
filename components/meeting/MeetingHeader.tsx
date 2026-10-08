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

const chip = "flex shrink-0 items-center rounded-full bg-dark-3 px-3 py-1.5 text-sm";

export const meetingTitle = (description: unknown, isPersonalRoom: boolean) => {
  const trimmed = typeof description === "string" ? description.trim() : "";
  if (trimmed) return trimmed;
  return isPersonalRoom ? "Personal room" : "Meeting";
};

const ElapsedTime = () => {
  const { useCallStartedAt } = useCallStateHooks();
  const startedAt = useCallStartedAt();
  const now = useTicker(1000);
  if (!startedAt || !now) return null;

  const elapsed = formatElapsed(now.getTime() - startedAt.getTime());
  return (
    <span aria-label={`Meeting time ${elapsed}`} className={cn(chip, "gap-2 font-semibold tabular-nums")}>
      <span className="size-2 rounded-full bg-[#3DDC97]" aria-hidden />
      {elapsed}
    </span>
  );
};

const ParticipantCount = () => {
  const { useParticipantCount } = useCallStateHooks();
  return (
    <span className={cn(chip, "gap-1.5 font-semibold text-sky-1 max-md:hidden")}>
      <UsersIcon className="size-4" aria-hidden />
      {useParticipantCount()} in call
    </span>
  );
};

const RecordingBadge = () => {
  const { useIsCallRecordingInProgress } = useCallStateHooks();
  const isRecording = useIsCallRecordingInProgress();

  return (
    <span aria-live="polite" className="contents">
      {isRecording && (
        <span className={cn(chip, "gap-2 bg-[#E53E3E]/15 font-bold text-danger-text")}>
          <span
            className="size-2 animate-pulse rounded-full bg-[#F25555] motion-reduce:animate-none"
            aria-hidden
          />
          <span className="max-sm:sr-only">Recording</span>
        </span>
      )}
    </span>
  );
};

const InviteButton = ({ isPersonalRoom }: { isPersonalRoom: boolean }) => {
  const call = useCall();
  const { toast } = useToast();

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
    <button
      type="button"
      onClick={copyInvite}
      className="flex h-11 items-center gap-2 rounded-xl bg-dark-3 px-3 text-[15px] font-semibold text-fg transition hover:bg-dark-4 sm:px-4"
    >
      <Link2Icon className="size-[18px]" aria-hidden />
      <span className="max-sm:sr-only">Invite</span>
    </button>
  );
};

const PeopleButton = ({ panelOpen, onTogglePanel }: Omit<MeetingHeaderProps, "isPersonalRoom">) => {
  const { hands } = useRaisedHands();
  const label = hands.length ? `People, ${hands.length} raised hands` : "People";

  return (
    <button
      type="button"
      aria-label={label}
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
  );
};

const MeetingHeader = ({ isPersonalRoom, panelOpen, onTogglePanel }: MeetingHeaderProps) => {
  const { useCallCustomData } = useCallStateHooks();
  const title = meetingTitle(useCallCustomData()?.description, isPersonalRoom);

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-fg/[0.07] px-4 sm:h-[72px] sm:px-6">
      <div className="flex min-w-0 items-center gap-2 sm:gap-4">
        <h1 className="truncate text-base font-extrabold tracking-[-0.01em] sm:text-xl">{title}</h1>
        <ElapsedTime />
        <ParticipantCount />
        <RecordingBadge />
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <ThemeToggle className="size-11" />
        <InviteButton isPersonalRoom={isPersonalRoom} />
        <PeopleButton panelOpen={panelOpen} onTogglePanel={onTogglePanel} />
      </div>
    </header>
  );
};

export default MeetingHeader;
