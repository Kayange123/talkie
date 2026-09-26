import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import MeetingRoom from "./MeetingRoom";

const push = vi.fn();
let searchParams = new URLSearchParams();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
  useSearchParams: () => searchParams,
}));

const state = vi.hoisted(() => ({
  callingState: "joined",
  localUserId: "host",
  createdById: "host",
  endCall: vi.fn(),
}));

vi.mock("@stream-io/video-react-sdk", () => ({
  CallingState: { JOINED: "joined", LEFT: "left", JOINING: "joining" },
  useCallStateHooks: () => ({
    useCallCallingState: () => state.callingState,
    useLocalParticipant: () => ({ userId: state.localUserId }),
  }),
  useCall: () => ({
    state: { createdBy: { id: state.createdById } },
    endCall: state.endCall,
  }),
  // The SDK's UI components need a live call; stub them out.
  CallControls: () => <div data-testid="call-controls" />,
  CallParticipantsList: () => <div data-testid="participants" />,
  CallStatsButton: () => null,
  PaginatedGridLayout: () => <div data-testid="grid-layout" />,
  SpeakerLayout: () => <div data-testid="speaker-layout" />,
}));

const endButton = () =>
  screen.queryByRole("button", { name: /end for everyone/i });

describe("MeetingRoom", () => {
  beforeEach(() => {
    push.mockReset();
    state.endCall.mockReset().mockResolvedValue(undefined);
    searchParams = new URLSearchParams();
    Object.assign(state, {
      callingState: "joined",
      localUserId: "host",
      createdById: "host",
    });
  });

  it("shows a loader while joining", () => {
    state.callingState = "joining";
    render(<MeetingRoom />);
    expect(screen.getByRole("status", { name: /loading/i })).toBeInTheDocument();
  });

  it("shows the ended screen when the call is left, e.g. the host ended it", async () => {
    state.callingState = "left";
    render(<MeetingRoom />);

    expect(
      screen.getByRole("heading", { name: /this meeting has ended/i })
    ).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /back to home/i }));
    expect(push).toHaveBeenCalledWith("/");
  });

  it("lets the host end the call for everyone", async () => {
    render(<MeetingRoom />);

    await userEvent.click(endButton()!);

    expect(state.endCall).toHaveBeenCalledOnce();
    expect(push).toHaveBeenCalledWith("/");
  });

  it("hides the end button from guests without alerting them", () => {
    const alert = vi.spyOn(window, "alert").mockImplementation(() => {});
    state.localUserId = "guest";

    render(<MeetingRoom />);

    expect(endButton()).not.toBeInTheDocument();
    expect(alert).not.toHaveBeenCalled();
  });

  it("hides the end button in personal rooms", () => {
    searchParams = new URLSearchParams("personal=true");
    render(<MeetingRoom />);
    expect(endButton()).not.toBeInTheDocument();
  });

  it("toggles the participants panel", async () => {
    render(<MeetingRoom />);
    const toggle = screen.getByRole("button", { name: /participants/i });

    expect(screen.queryByTestId("participants")).not.toBeInTheDocument();
    await userEvent.click(toggle);
    expect(screen.getByTestId("participants")).toBeInTheDocument();
    expect(toggle).toHaveAttribute("aria-pressed", "true");
  });
});
