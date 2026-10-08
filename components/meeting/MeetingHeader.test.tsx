import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { call, resetStream, stream } from "@/test/stream-sdk-mock";
import { HAND_EVENT, RaisedHandsProvider } from "@/hooks/use-raised-hands";
import MeetingHeader from "./MeetingHeader";

vi.mock("@stream-io/video-react-sdk", async () => (await import("@/test/stream-sdk-mock")).sdkMock);
const toast = vi.fn();
vi.mock("@/components/ui/use-toast", () => ({ useToast: () => ({ toast }) }));
vi.mock("../shared/ThemeToggle", () => ({ default: () => null }));

const renderHeader = (props: Partial<React.ComponentProps<typeof MeetingHeader>> = {}) => {
  const onTogglePanel = vi.fn();
  render(
    <RaisedHandsProvider>
      <MeetingHeader isPersonalRoom={false} panelOpen={false} onTogglePanel={onTogglePanel} {...props} />
    </RaisedHandsProvider>
  );
  return { onTogglePanel };
};

describe("MeetingHeader", () => {
  beforeEach(() => {
    resetStream();
    toast.mockReset();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("shows the meeting's description as its title", () => {
    renderHeader();
    expect(screen.getByRole("heading", { name: "Weekly sync" })).toBeInTheDocument();
  });

  it.each([
    [false, "Meeting"],
    [true, "Personal room"],
  ])("falls back to a generic title (personal room: %s)", (isPersonalRoom, title) => {
    stream.description = "   ";
    renderHeader({ isPersonalRoom });
    expect(screen.getByRole("heading", { name: title })).toBeInTheDocument();
  });

  it("shows how long the meeting has been running, ticking every second", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-08T10:12:04Z"));
    stream.startedAt = new Date("2026-10-08T10:00:00Z");

    renderHeader();
    expect(screen.getByText("12:04")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByText("12:05")).toBeInTheDocument();
  });

  it("hides the timer before the call has started", () => {
    renderHeader();
    expect(screen.queryByLabelText(/meeting time/i)).not.toBeInTheDocument();
  });

  it("shows a recording badge only while recording", () => {
    renderHeader();
    expect(screen.queryByText("Recording")).not.toBeInTheDocument();

    stream.recording = true;
    renderHeader();
    expect(screen.getByText("Recording")).toBeInTheDocument();
  });

  it.each([
    [false, `${window.location.origin}/meeting/call-1`],
    [true, `${window.location.origin}/meeting/call-1?personal=true`],
  ])("copies the invite link (personal room: %s)", async (isPersonalRoom, link) => {
    const user = userEvent.setup();
    const writeText = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue();
    renderHeader({ isPersonalRoom });

    await user.click(screen.getByRole("button", { name: /invite/i }));

    expect(writeText).toHaveBeenCalledWith(link);
    expect(toast).toHaveBeenCalledWith({ title: "Invite link copied" });
  });

  it("counts raised hands on the people button", () => {
    const { onTogglePanel } = renderHeader();
    act(() =>
      call.emit("custom", { user: { id: "joel", name: "Joel" }, custom: { type: HAND_EVENT, raised: true } })
    );

    const people = screen.getByRole("button", { name: /people, 1 raised hands/i });
    people.click();
    expect(onTogglePanel).toHaveBeenCalledOnce();
  });
});
