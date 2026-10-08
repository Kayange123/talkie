import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import MeetingSetup from "./MeetingSetup";

const toast = vi.fn();
vi.mock("@/components/ui/use-toast", () => ({ useToast: () => ({ toast }) }));

const call = vi.hoisted(() => ({
  join: vi.fn(),
  camera: { enable: vi.fn(), disable: vi.fn() },
  microphone: { enable: vi.fn(), disable: vi.fn() },
}));

vi.mock("@stream-io/video-react-sdk", () => ({
  useCall: () => call,
  VideoPreview: () => <div data-testid="preview" />,
  DeviceSettings: () => null,
}));

const joinButton = () => screen.getByRole("button", { name: /join/i });

describe("MeetingSetup", () => {
  beforeEach(() => {
    toast.mockReset();
    call.join.mockReset();
    for (const device of [call.camera, call.microphone]) {
      device.enable.mockReset();
      device.disable.mockReset();
    }
  });

  it("turns camera and mic on by default, off when asked", async () => {
    render(<MeetingSetup onSetupComplete={vi.fn()} />);
    expect(call.camera.enable).toHaveBeenCalled();
    expect(call.microphone.enable).toHaveBeenCalled();

    await userEvent.click(
      screen.getByRole("checkbox", { name: /mic and camera off/i })
    );
    expect(call.camera.disable).toHaveBeenCalled();
    expect(call.microphone.disable).toHaveBeenCalled();
  });

  it("completes setup only after the join succeeds", async () => {
    let finishJoin: () => void = () => {};
    call.join.mockReturnValue(new Promise<void>((r) => (finishJoin = r)));
    const onSetupComplete = vi.fn();
    render(<MeetingSetup onSetupComplete={onSetupComplete} />);

    await userEvent.click(joinButton());
    expect(joinButton()).toBeDisabled();
    expect(onSetupComplete).not.toHaveBeenCalled();

    finishJoin();
    await waitFor(() => expect(onSetupComplete).toHaveBeenCalledOnce());
  });

  it("shows an error and lets the user retry when joining fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    call.join.mockRejectedValue(new Error("SFU unavailable"));
    const onSetupComplete = vi.fn();
    render(<MeetingSetup onSetupComplete={onSetupComplete} />);

    await userEvent.click(joinButton());

    await waitFor(() =>
      expect(toast).toHaveBeenCalledWith(
        expect.objectContaining({ variant: "destructive" })
      )
    );
    expect(onSetupComplete).not.toHaveBeenCalled();
    expect(joinButton()).toBeEnabled();
  });
});
