"use client";

import { useToast } from "@/components/ui/use-toast";
import { useRaisedHands } from "@/hooks/use-raised-hands";
import { SpeakingWhileMutedNotification, useCallStateHooks } from "@stream-io/video-react-sdk";
import {
  HandIcon,
  LucideIcon,
  MicIcon,
  MicOffIcon,
  ScreenShareIcon,
  VideoIcon,
  VideoOffIcon,
} from "lucide-react";
import ControlButton, { ControlTone } from "./ControlButton";

type Look = { label: string; icon: LucideIcon; tone: ControlTone };

// What each button shows, keyed by whether its toggle is "on".
const looks = {
  mic: {
    on: { label: "Mute", icon: MicIcon, tone: "default" },
    off: { label: "Unmute", icon: MicOffIcon, tone: "off" },
  },
  camera: {
    on: { label: "Stop video", icon: VideoIcon, tone: "default" },
    off: { label: "Start video", icon: VideoOffIcon, tone: "off" },
  },
  share: {
    on: { label: "Stop sharing", icon: ScreenShareIcon, tone: "active" },
    off: { label: "Share", icon: ScreenShareIcon, tone: "default" },
  },
  hand: {
    on: { label: "Lower hand", icon: HandIcon, tone: "hand" },
    off: { label: "Raise hand", icon: HandIcon, tone: "default" },
  },
} satisfies Record<string, { on: Look; off: Look }>;

const useFailureToast = () => {
  const { toast } = useToast();
  return (title: string, description?: string) => () =>
    toast({ title, description, variant: "destructive" });
};

const permissionHint = "Check that your browser has permission to use it.";

export const MicButton = () => {
  const { useMicrophoneState } = useCallStateHooks();
  const { microphone, optionsAwareIsMute: muted } = useMicrophoneState({ optimisticUpdates: true });
  const fail = useFailureToast();

  return (
    <SpeakingWhileMutedNotification>
      <ControlButton
        {...looks.mic[muted ? "off" : "on"]}
        aria-pressed={muted}
        onClick={() =>
          microphone.toggle().catch(fail("Couldn't turn on your microphone", permissionHint))
        }
      />
    </SpeakingWhileMutedNotification>
  );
};

export const CameraButton = () => {
  const { useCameraState } = useCallStateHooks();
  const { camera, optionsAwareIsMute: off } = useCameraState({ optimisticUpdates: true });
  const fail = useFailureToast();

  return (
    <ControlButton
      {...looks.camera[off ? "off" : "on"]}
      aria-pressed={off}
      onClick={() => camera.toggle().catch(fail("Couldn't turn on your camera", permissionHint))}
    />
  );
};

export const ShareButton = () => {
  const { useScreenShareState, useHasOngoingScreenShare } = useCallStateHooks();
  const { screenShare, isMute } = useScreenShareState();
  const someoneSharing = useHasOngoingScreenShare();
  const fail = useFailureToast();
  const sharing = !isMute;
  // Stream allows one screen share at a time.
  const blocked = someoneSharing && !sharing;

  return (
    <ControlButton
      {...looks.share[sharing ? "on" : "off"]}
      aria-pressed={sharing}
      disabled={blocked}
      title={blocked ? "Someone else is sharing" : undefined}
      onClick={() => screenShare.toggle().catch(fail("Screen sharing didn't start"))}
    />
  );
};

export const RaiseHandButton = () => {
  const { isMyHandRaised, raise, lower } = useRaisedHands();
  const fail = useFailureToast();

  return (
    <ControlButton
      {...looks.hand[isMyHandRaised ? "on" : "off"]}
      aria-pressed={isMyHandRaised}
      onClick={() => (isMyHandRaised ? lower() : raise()).catch(fail("Couldn't update your hand"))}
    />
  );
};
