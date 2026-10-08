import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { call, resetStream, stream } from "@/test/stream-sdk-mock";
import MeetingRoom from "./MeetingRoom";

const push = vi.fn();
let searchParams = new URLSearchParams();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
  useSearchParams: () => searchParams,
}));
vi.mock("@stream-io/video-react-sdk", async () => (await import("@/test/stream-sdk-mock")).sdkMock);
vi.mock("@/components/ui/use-toast", () => ({ useToast: () => ({ toast: vi.fn() }) }));
// The theme picker and the layouts are covered by their own tests.
vi.mock("./ThemeToggle", () => ({ default: () => null }));
vi.mock("../meeting/TalkieGrid", () => ({ default: () => <div data-testid="grid-layout" /> }));
vi.mock("../meeting/SpeakerStage", () => ({ default: () => <div data-testid="speaker-layout" /> }));

const endButton = () => screen.queryByRole("button", { name: /end for everyone/i });

describe("MeetingRoom", () => {
  beforeEach(() => {
    resetStream();
    push.mockReset();
    searchParams = new URLSearchParams();
  });

  it("shows a loader while joining", () => {
    stream.callingState = "joining";
    render(<MeetingRoom />);
    expect(screen.getByRole("status", { name: /loading/i })).toBeInTheDocument();
  });

  it("shows the ended screen when the call is left, e.g. the host ended it", async () => {
    stream.callingState = "left";
    render(<MeetingRoom />);

    expect(
      screen.getByRole("heading", { name: /this meeting has ended/i })
    ).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /back to dashboard/i }));
    expect(push).toHaveBeenCalledWith("/dashboard");
  });

  it("lets the host end the call for everyone", async () => {
    render(<MeetingRoom />);

    await userEvent.click(endButton()!);

    expect(call.endCall).toHaveBeenCalledOnce();
    expect(push).toHaveBeenCalledWith("/dashboard");
  });

  it("hides the end button from guests without alerting them", () => {
    const alert = vi.spyOn(window, "alert").mockImplementation(() => {});
    stream.localUserId = "guest";

    render(<MeetingRoom />);

    expect(endButton()).not.toBeInTheDocument();
    expect(alert).not.toHaveBeenCalled();
  });

  it("hides the end button in personal rooms", () => {
    searchParams = new URLSearchParams("personal=true");
    render(<MeetingRoom />);
    expect(endButton()).not.toBeInTheDocument();
  });

  it("leaves the call and returns to the dashboard", async () => {
    render(<MeetingRoom />);

    await userEvent.click(screen.getByRole("button", { name: /^leave$/i }));

    expect(call.leave).toHaveBeenCalledOnce();
    expect(push).toHaveBeenCalledWith("/dashboard");
  });

  it("toggles the people panel", async () => {
    render(<MeetingRoom />);
    const toggle = screen.getByRole("button", { name: /^people/i });

    expect(screen.queryByTestId("participants")).not.toBeInTheDocument();
    await userEvent.click(toggle);
    expect(screen.getByTestId("participants")).toBeInTheDocument();
    expect(toggle).toHaveAttribute("aria-pressed", "true");
  });

  describe("layout", () => {
    it("uses the grid by default", () => {
      render(<MeetingRoom />);
      expect(screen.getByTestId("grid-layout")).toBeInTheDocument();
    });

    it("switches to speaker view while someone shares their screen", () => {
      stream.someoneSharing = true;
      render(<MeetingRoom />);
      expect(screen.getByTestId("speaker-layout")).toBeInTheDocument();
    });

    it("keeps the grid during a screen share when grid is chosen", async () => {
      stream.someoneSharing = true;
      render(<MeetingRoom />);

      await userEvent.click(screen.getByRole("button", { name: /more/i }));
      await userEvent.click(screen.getByRole("menuitemradio", { name: /grid/i }));

      expect(screen.getByTestId("grid-layout")).toBeInTheDocument();
    });
  });
});
