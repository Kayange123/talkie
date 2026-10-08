"use client";

import { useToast } from "@/components/ui/use-toast";
import { useRaisedHands } from "@/hooks/use-raised-hands";
import {
  CallStats,
  DeviceSettings,
  OwnCapability,
  Restricted,
  SpeakingWhileMutedNotification,
  useCall,
  useCallStateHooks,
  useToggleCallRecording,
} from "@stream-io/video-react-sdk";
import {
  ActivityIcon,
  CircleDotIcon,
  EllipsisIcon,
  HandIcon,
  MicIcon,
  MicOffIcon,
  PhoneOffIcon,
  ScreenShareIcon,
  VideoIcon,
  VideoOffIcon,
} from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import BlurToggle from "./BlurToggle";
import ControlButton from "./ControlButton";
import ReactionPicker from "./ReactionPicker";

export type LayoutMode = "auto" | "grid" | "speaker";

export const layoutModes: { value: LayoutMode; label: string; hint?: string }[] = [
  { value: "auto", label: "Auto", hint: "Speaker view when sharing" },
  { value: "grid", label: "Grid" },
  { value: "speaker", label: "Speaker" },
];

const useDeviceErrorToast = () => {
  const { toast } = useToast();
  return (what: string) => () =>
    toast({
      title: `Couldn't turn on your ${what}`,
      description: "Check that your browser has permission to use it.",
      variant: "destructive",
    });
};

const MicButton = () => {
  const { useMicrophoneState } = useCallStateHooks();
  const { microphone, optionsAwareIsMute: muted } = useMicrophoneState({
    optimisticUpdates: true,
  });
  const onError = useDeviceErrorToast();

  return (
    <SpeakingWhileMutedNotification>
      <ControlButton
        label={muted ? "Unmute" : "Mute"}
        icon={muted ? MicOffIcon : MicIcon}
        tone={muted ? "off" : "default"}
        aria-pressed={muted}
        onClick={() => microphone.toggle().catch(onError("microphone"))}
      />
    </SpeakingWhileMutedNotification>
  );
};

const CameraButton = () => {
  const { useCameraState } = useCallStateHooks();
  const { camera, optionsAwareIsMute: off } = useCameraState({ optimisticUpdates: true });
  const onError = useDeviceErrorToast();

  return (
    <ControlButton
      label={off ? "Start video" : "Stop video"}
      icon={off ? VideoOffIcon : VideoIcon}
      tone={off ? "off" : "default"}
      aria-pressed={off}
      onClick={() => camera.toggle().catch(onError("camera"))}
    />
  );
};

const ShareButton = () => {
  const { useScreenShareState, useHasOngoingScreenShare } = useCallStateHooks();
  const { screenShare, isMute } = useScreenShareState();
  const someoneSharing = useHasOngoingScreenShare();
  const sharing = !isMute;
  const { toast } = useToast();

  return (
    <ControlButton
      label={sharing ? "Stop sharing" : "Share"}
      icon={ScreenShareIcon}
      tone={sharing ? "active" : "default"}
      aria-pressed={sharing}
      disabled={someoneSharing && !sharing}
      title={someoneSharing && !sharing ? "Someone else is sharing" : undefined}
      onClick={() =>
        screenShare.toggle().catch(() =>
          toast({ title: "Screen sharing didn't start", variant: "destructive" })
        )
      }
    />
  );
};

const RaiseHandButton = () => {
  const { isMyHandRaised, raise, lower } = useRaisedHands();
  const { toast } = useToast();

  return (
    <ControlButton
      label={isMyHandRaised ? "Lower hand" : "Raise hand"}
      icon={HandIcon}
      tone={isMyHandRaised ? "hand" : "default"}
      aria-pressed={isMyHandRaised}
      onClick={() =>
        (isMyHandRaised ? lower() : raise()).catch(() =>
          toast({ title: "Couldn't update your hand", variant: "destructive" })
        )
      }
    />
  );
};

interface MoreMenuProps {
  layout: LayoutMode;
  onLayoutChange: (layout: LayoutMode) => void;
}

const MoreMenu = ({ layout, onLayoutChange }: MoreMenuProps) => {
  const [open, setOpen] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);
  const { toggleCallRecording, isAwaitingResponse, isCallRecordingInProgress } =
    useToggleCallRecording();

  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <ControlButton label="More" icon={EllipsisIcon} tone={open ? "active" : "default"} />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="top"
          sideOffset={12}
          className="w-64 rounded-2xl border-border bg-dark-1 p-2 text-fg"
        >
          <DropdownMenuLabel className="text-sky-1">Layout</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={layout}
            onValueChange={(value) => onLayoutChange(value as LayoutMode)}
          >
            {layoutModes.map(({ value, label, hint }) => (
              <DropdownMenuRadioItem
                key={value}
                value={value}
                className="cursor-pointer gap-2 rounded-lg py-2.5 text-[15px] focus:bg-dark-3 focus:text-fg"
              >
                <span className="flex-1 font-semibold">{label}</span>
                {hint && <span className="text-xs text-sky-1">{hint}</span>}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
          <DropdownMenuSeparator className="bg-fg/10" />
          <Restricted
            requiredGrants={[OwnCapability.START_RECORD_CALL, OwnCapability.STOP_RECORD_CALL]}
          >
            <DropdownMenuItem
              disabled={isAwaitingResponse}
              onSelect={() => toggleCallRecording()}
              className="cursor-pointer gap-2.5 rounded-lg py-2.5 text-[15px] font-semibold focus:bg-dark-3 focus:text-fg"
            >
              <CircleDotIcon className="size-4 text-[#F25555]" aria-hidden />
              {isCallRecordingInProgress ? "Stop recording" : "Start recording"}
            </DropdownMenuItem>
          </Restricted>
          <DropdownMenuItem
            onSelect={() => setStatsOpen(true)}
            className="cursor-pointer gap-2.5 rounded-lg py-2.5 text-[15px] font-semibold focus:bg-dark-3 focus:text-fg"
          >
            <ActivityIcon className="size-4 text-sky-1" aria-hidden />
            Call stats
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={statsOpen} onOpenChange={setStatsOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto border-none bg-dark-1 text-fg sm:max-w-[560px]">
          <DialogTitle>Call stats</DialogTitle>
          {statsOpen && <CallStats />}
        </DialogContent>
      </Dialog>
    </>
  );
};

const EndCallButton = ({ onEnded }: { onEnded: () => void }) => {
  const call = useCall();
  const { useLocalParticipant } = useCallStateHooks();
  const participant = useLocalParticipant();

  const isMeetingOwner =
    !!participant &&
    !!call?.state.createdBy &&
    participant.userId === call.state.createdBy.id;

  if (!isMeetingOwner) return null;

  return (
    <Button
      className="h-12 rounded-[14px] bg-[#D93636] px-4 text-[15px] font-bold text-white"
      title="End the call for everyone"
      onClick={async () => {
        await call?.endCall();
        onEnded();
      }}
    >
      <PhoneOffIcon className="size-[18px] sm:mr-2" aria-hidden />
      <span className="max-sm:sr-only">End for everyone</span>
    </Button>
  );
};

interface ControlBarProps extends MoreMenuProps {
  isPersonalRoom: boolean;
  onLeave: () => void;
}

const Divider = () => <span aria-hidden className="h-12 w-px shrink-0 bg-fg/10 max-sm:hidden" />;

const ControlBar = ({ layout, onLayoutChange, isPersonalRoom, onLeave }: ControlBarProps) => {
  const call = useCall();

  return (
    <footer className="grid shrink-0 items-center gap-3 border-t border-fg/[0.07] bg-dark-1 px-3 py-3 sm:min-h-24 sm:grid-cols-[1fr_auto_1fr] sm:px-6">
      <div className="max-sm:hidden" title="Audio and video devices">
        <DeviceSettings />
      </div>

      <div
        role="toolbar"
        aria-label="Meeting controls"
        className="flex items-start gap-2 overflow-x-auto max-sm:justify-between sm:gap-3 lg:gap-7"
      >
        <div className="flex gap-2 sm:gap-3">
          <MicButton />
          <CameraButton />
          <Restricted requiredGrants={[OwnCapability.SCREENSHARE]}>
            <span className="max-sm:hidden">
              <ShareButton />
            </span>
          </Restricted>
        </div>
        <Divider />
        <div className="flex gap-2 sm:gap-3">
          <Restricted requiredGrants={[OwnCapability.CREATE_REACTION]}>
            <ReactionPicker />
          </Restricted>
          <RaiseHandButton />
          <span className="max-sm:hidden">
            <BlurToggle />
          </span>
        </div>
        <Divider />
        <MoreMenu layout={layout} onLayoutChange={onLayoutChange} />
      </div>

      <div className="flex justify-end gap-2.5 max-sm:col-span-full max-sm:justify-stretch">
        <Button
          className="h-12 rounded-[14px] bg-dark-3 px-5 text-[15px] font-bold text-fg max-sm:flex-1"
          onClick={async () => {
            await call?.leave().catch(() => {});
            onLeave();
          }}
        >
          Leave
        </Button>
        {!isPersonalRoom && <EndCallButton onEnded={onLeave} />}
      </div>
    </footer>
  );
};

export default ControlBar;
