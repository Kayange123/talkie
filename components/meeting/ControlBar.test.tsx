import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { call, devices, resetStream, stream } from "@/test/stream-sdk-mock";
import { RaisedHandsProvider } from "@/hooks/use-raised-hands";
import ControlBar, { LayoutMode } from "./ControlBar";

vi.mock("@stream-io/video-react-sdk", async () => (await import("@/test/stream-sdk-mock")).sdkMock);
const toast = vi.fn();
vi.mock("@/components/ui/use-toast", () => ({ useToast: () => ({ toast }) }));

const renderBar = (props: Partial<React.ComponentProps<typeof ControlBar>> = {}) => {
  const onLayoutChange = vi.fn<(layout: LayoutMode) => void>();
  const onLeave = vi.fn();
  render(
    <RaisedHandsProvider>
      <ControlBar
        layout="auto"
        onLayoutChange={onLayoutChange}
        isPersonalRoom={false}
        onLeave={onLeave}
        {...props}
      />
    </RaisedHandsProvider>
  );
  return { onLayoutChange, onLeave };
};

const button = (name: RegExp) => screen.getByRole("button", { name });

describe("ControlBar", () => {
  beforeEach(() => {
    resetStream();
    toast.mockReset();
  });

  describe("microphone and camera", () => {
    it("shows the current state and toggles it", async () => {
      renderBar();
      expect(button(/^mute$/i)).toHaveAttribute("aria-pressed", "false");

      await userEvent.click(button(/^mute$/i));
      await userEvent.click(button(/stop video/i));

      expect(devices.microphone.toggle).toHaveBeenCalledOnce();
      expect(devices.camera.toggle).toHaveBeenCalledOnce();
    });

    it("labels muted devices so they can be turned back on", () => {
      stream.micMuted = true;
      stream.camOff = true;
      renderBar();
      expect(button(/unmute/i)).toHaveAttribute("aria-pressed", "true");
      expect(button(/start video/i)).toBeInTheDocument();
    });

    it("explains when a device can't be turned on", async () => {
      devices.camera.toggle.mockRejectedValue(new Error("NotAllowedError"));
      renderBar();

      await userEvent.click(button(/stop video/i));

      await waitFor(() =>
        expect(toast).toHaveBeenCalledWith(
          expect.objectContaining({ title: "Couldn't turn on your camera", variant: "destructive" })
        )
      );
    });
  });

  describe("screen sharing", () => {
    it("is disabled while someone else is sharing", () => {
      stream.someoneSharing = true;
      renderBar();
      expect(button(/^share$/i)).toBeDisabled();
    });

    it("can be stopped by the person sharing", async () => {
      stream.someoneSharing = true;
      stream.iAmSharing = true;
      renderBar();

      await userEvent.click(button(/stop sharing/i));

      expect(devices.screenShare.toggle).toHaveBeenCalledOnce();
    });

    it("is hidden without the screenshare permission", () => {
      stream.capabilities.delete("screenshare");
      renderBar();
      expect(screen.queryByRole("button", { name: /^share$/i })).not.toBeInTheDocument();
    });
  });

  describe("reactions", () => {
    it("sends the picked reaction", async () => {
      renderBar();
      await userEvent.click(button(/^react$/i));
      await userEvent.click(screen.getByRole("menuitem", { name: /react with heart/i }));

      expect(call.sendReaction).toHaveBeenCalledWith({ type: "reaction", emoji_code: ":heart:" });
    });

    it("is hidden without the reaction permission", () => {
      stream.capabilities.delete("create-reaction");
      renderBar();
      expect(screen.queryByRole("button", { name: /^react$/i })).not.toBeInTheDocument();
    });
  });

  it("raises and lowers your hand", async () => {
    renderBar();

    await userEvent.click(button(/raise hand/i));
    expect(button(/lower hand/i)).toHaveAttribute("aria-pressed", "true");

    await userEvent.click(button(/lower hand/i));
    expect(button(/raise hand/i)).toHaveAttribute("aria-pressed", "false");
  });

  describe("background blur", () => {
    it("turns blur on and off", async () => {
      renderBar();
      await userEvent.click(button(/^blur$/i));
      expect(devices.applyBackgroundBlurFilter).toHaveBeenCalledWith("medium");
    });

    it("shows blur as on and turns it off", async () => {
      stream.filters.backgroundFilter = "blur";
      renderBar();

      expect(button(/^blur$/i)).toHaveAttribute("aria-pressed", "true");
      await userEvent.click(button(/^blur$/i));
      expect(devices.disableBackgroundFilter).toHaveBeenCalledOnce();
    });

    it("is hidden on devices that can't blur", () => {
      stream.filters.isSupported = false;
      renderBar();
      expect(screen.queryByRole("button", { name: /^blur$/i })).not.toBeInTheDocument();
    });

    it("waits until the blur model has loaded", () => {
      stream.filters.isReady = false;
      renderBar();
      expect(button(/^blur$/i)).toBeDisabled();
    });
  });

  describe("more menu", () => {
    it("changes the layout", async () => {
      const { onLayoutChange } = renderBar();
      await userEvent.click(button(/^more$/i));
      await userEvent.click(screen.getByRole("menuitemradio", { name: /^speaker$/i }));
      expect(onLayoutChange).toHaveBeenCalledWith("speaker");
    });

    it("starts and stops recording for people allowed to", async () => {
      renderBar();
      await userEvent.click(button(/^more$/i));
      await userEvent.click(screen.getByRole("menuitem", { name: /start recording/i }));
      expect(devices.toggleCallRecording).toHaveBeenCalledOnce();
    });

    it("hides recording from people who can't record", async () => {
      stream.capabilities.delete("start-record-call");
      stream.capabilities.delete("stop-record-call");
      renderBar();
      await userEvent.click(button(/^more$/i));
      expect(screen.queryByRole("menuitem", { name: /recording/i })).not.toBeInTheDocument();
    });

    it("opens call stats", async () => {
      renderBar();
      await userEvent.click(button(/^more$/i));
      await userEvent.click(screen.getByRole("menuitem", { name: /call stats/i }));
      expect(screen.getByTestId("call-stats")).toBeInTheDocument();
    });
  });
});
