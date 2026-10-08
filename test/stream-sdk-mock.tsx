/**
 * A configurable stand-in for @stream-io/video-react-sdk. Use it with:
 *
 *   vi.mock("@stream-io/video-react-sdk", async () =>
 *     (await import("@/test/stream-sdk-mock")).sdkMock);
 *
 * then set `stream.*` before rendering and call `resetStream()` in beforeEach.
 */
import React from "react";
import { vi } from "vitest";

// Events are loosely shaped test fixtures.
type Listener = (event: never) => void;

export const stream = {
  callingState: "joined",
  localUserId: "host",
  createdById: "host",
  description: "Weekly sync" as string | undefined,
  startedAt: undefined as Date | undefined,
  participantCount: 3,
  recording: false,
  someoneSharing: false,
  iAmSharing: false,
  micMuted: false,
  camOff: false,
  capabilities: new Set<string>([
    "screenshare",
    "create-reaction",
    "start-record-call",
    "stop-record-call",
  ]),
  filters: {
    isSupported: true,
    isReady: true,
    backgroundFilter: undefined as "blur" | "image" | undefined,
  },
  viewParticipant: undefined as Record<string, unknown> | undefined,
};

const listeners = new Map<string, Set<Listener>>();

export const call = {
  id: "call-1",
  state: {
    get createdBy() {
      return { id: stream.createdById };
    },
  },
  endCall: vi.fn(),
  leave: vi.fn(),
  sendCustomEvent: vi.fn(),
  sendReaction: vi.fn(),
  resetReaction: vi.fn(),
  on: vi.fn((name: string, fn: Listener) => {
    if (!listeners.has(name)) listeners.set(name, new Set());
    listeners.get(name)!.add(fn);
    return () => listeners.get(name)?.delete(fn);
  }),
  /** Test helper: deliver an event to subscribers. */
  emit(name: string, event: unknown) {
    listeners.get(name)?.forEach((fn) => fn(event as never));
  },
  listenerCount(name: string) {
    return listeners.get(name)?.size ?? 0;
  },
};

export const devices = {
  microphone: { toggle: vi.fn() },
  camera: { toggle: vi.fn() },
  screenShare: { toggle: vi.fn() },
  toggleCallRecording: vi.fn(),
  applyBackgroundBlurFilter: vi.fn(),
  disableBackgroundFilter: vi.fn(),
};

export const resetStream = () => {
  Object.assign(stream, {
    callingState: "joined",
    localUserId: "host",
    createdById: "host",
    description: "Weekly sync",
    startedAt: undefined,
    participantCount: 3,
    recording: false,
    someoneSharing: false,
    iAmSharing: false,
    micMuted: false,
    camOff: false,
    capabilities: new Set(["screenshare", "create-reaction", "start-record-call", "stop-record-call"]),
    filters: { isSupported: true, isReady: true, backgroundFilter: undefined },
    viewParticipant: undefined,
  });
  listeners.clear();
  for (const fn of [call.endCall, call.leave, call.sendCustomEvent, call.sendReaction, call.resetReaction]) {
    fn.mockReset().mockResolvedValue(undefined);
  }
  for (const fn of [
    devices.microphone.toggle,
    devices.camera.toggle,
    devices.screenShare.toggle,
    devices.toggleCallRecording,
  ]) {
    fn.mockReset().mockResolvedValue(undefined);
  }
  devices.applyBackgroundBlurFilter.mockReset();
  devices.disableBackgroundFilter.mockReset();
};

export const sdkMock = {
  CallingState: { JOINED: "joined", LEFT: "left", JOINING: "joining" },
  OwnCapability: {
    SCREENSHARE: "screenshare",
    CREATE_REACTION: "create-reaction",
    START_RECORD_CALL: "start-record-call",
    STOP_RECORD_CALL: "stop-record-call",
  },
  SfuModels: { ConnectionQuality: { UNSPECIFIED: 0, POOR: 1, GOOD: 2, EXCELLENT: 3 } },
  defaultEmojiReactionMap: {
    ":like:": "👍",
    ":raise-hand:": "✋",
    ":fireworks:": "🎉",
    ":dislike:": "👎",
    ":heart:": "❤️",
    ":smile:": "😀",
  },
  hasAudio: (p: { muted?: boolean }) => !p.muted,
  useCall: () => call,
  useCallStateHooks: () => ({
    useCallCallingState: () => stream.callingState,
    useLocalParticipant: () => ({ userId: stream.localUserId }),
    useCallCustomData: () => ({ description: stream.description }),
    useCallStartedAt: () => stream.startedAt,
    useParticipantCount: () => stream.participantCount,
    useIsCallRecordingInProgress: () => stream.recording,
    useHasOngoingScreenShare: () => stream.someoneSharing,
    useMicrophoneState: () => ({
      microphone: devices.microphone,
      optionsAwareIsMute: stream.micMuted,
    }),
    useCameraState: () => ({ camera: devices.camera, optionsAwareIsMute: stream.camOff }),
    useScreenShareState: () => ({
      screenShare: devices.screenShare,
      isMute: !stream.iAmSharing,
    }),
  }),
  useToggleCallRecording: () => ({
    toggleCallRecording: devices.toggleCallRecording,
    isAwaitingResponse: false,
    isCallRecordingInProgress: stream.recording,
  }),
  useBackgroundFilters: () => ({
    ...stream.filters,
    applyBackgroundBlurFilter: devices.applyBackgroundBlurFilter,
    disableBackgroundFilter: devices.disableBackgroundFilter,
  }),
  useParticipantViewContext: () => ({ participant: stream.viewParticipant }),
  Restricted: ({ requiredGrants, children }: { requiredGrants: string[]; children: React.ReactNode }) =>
    requiredGrants.some((g) => stream.capabilities.has(g)) ? <>{children}</> : null,
  SpeakingWhileMutedNotification: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  // The SDK's own UI needs a live call; stub it out.
  DeviceSettings: () => null,
  CallStats: () => <div data-testid="call-stats" />,
  CallParticipantsList: () => <div data-testid="participants" />,
  PaginatedGridLayout: () => <div data-testid="grid-layout" />,
  SpeakerLayout: () => <div data-testid="speaker-layout" />,
};
