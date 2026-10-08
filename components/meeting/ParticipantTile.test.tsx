import { act, render, screen } from "@testing-library/react";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { call, resetStream, stream } from "@/test/stream-sdk-mock";
import { HAND_EVENT, RaisedHandsProvider } from "@/hooks/use-raised-hands";
import { ParticipantTileUI, TilePlaceholder } from "./ParticipantTile";

vi.mock("@stream-io/video-react-sdk", async () => (await import("@/test/stream-sdk-mock")).sdkMock);
vi.mock("@/components/ui/use-toast", () => ({ useToast: () => ({ toast: vi.fn() }) }));

const participant = (overrides: Record<string, unknown> = {}) => ({
  userId: "amina",
  sessionId: "session-amina",
  name: "Amina Okafor",
  isSpeaking: false,
  isLocalParticipant: false,
  connectionQuality: 2,
  muted: false,
  ...overrides,
});

const renderTile = () =>
  render(
    <RaisedHandsProvider>
      <div data-testid="tile">
        <ParticipantTileUI />
      </div>
    </RaisedHandsProvider>
  );

describe("ParticipantTileUI", () => {
  beforeEach(() => {
    resetStream();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("names the participant, and calls the local one You", () => {
    stream.viewParticipant = participant();
    renderTile();
    expect(screen.getByText("Amina Okafor")).toBeInTheDocument();

    stream.viewParticipant = participant({ isLocalParticipant: true });
    renderTile();
    expect(screen.getByText("You")).toBeInTheDocument();
  });

  it("shows a muted icon only when the mic is off", () => {
    stream.viewParticipant = participant();
    const { unmount } = renderTile();
    expect(screen.queryByLabelText("Muted")).not.toBeInTheDocument();
    unmount();

    stream.viewParticipant = participant({ muted: true });
    renderTile();
    expect(screen.getByLabelText("Muted")).toBeInTheDocument();
  });

  it("warns about a poor connection", () => {
    stream.viewParticipant = participant({ connectionQuality: 1 });
    renderTile();
    expect(screen.getByRole("img", { name: "Poor connection" })).toBeInTheDocument();
  });

  it("shows a raised hand badge", () => {
    stream.viewParticipant = participant();
    renderTile();
    expect(screen.queryByText("Hand raised")).not.toBeInTheDocument();

    act(() =>
      call.emit("custom", { user: { id: "amina", name: "Amina" }, custom: { type: HAND_EVENT, raised: true } })
    );
    expect(screen.getByText("Hand raised")).toBeInTheDocument();
  });

  it("floats a reaction, then clears it so it can be sent again", () => {
    vi.useFakeTimers();
    stream.viewParticipant = participant({ reaction: { type: "reaction", emoji_code: ":heart:" } });
    renderTile();

    expect(screen.getByText("❤️")).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(2600);
    });
    expect(call.resetReaction).toHaveBeenCalledWith("session-amina");
  });

  it("ignores unknown reaction codes", () => {
    stream.viewParticipant = participant({ reaction: { type: "reaction", emoji_code: ":nope:" } });
    renderTile();
    expect(screen.getByTestId("tile")).not.toHaveTextContent(":nope:");
  });
});

describe("TilePlaceholder", () => {
  it("shows initials when there's no photo", () => {
    render(<TilePlaceholder participant={participant() as never} />);
    expect(screen.getByText("AO")).toBeInTheDocument();
  });

  it("shows the profile photo when there is one", () => {
    const { container } = render(
      <TilePlaceholder participant={participant({ image: "https://img.example/a.png" }) as never} />
    );
    expect(container.querySelector("img")).toHaveAttribute("src", "https://img.example/a.png");
  });
});
