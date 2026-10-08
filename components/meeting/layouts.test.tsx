import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { call, resetStream, stream } from "@/test/stream-sdk-mock";
import TalkieGrid, { PAGE_SIZE } from "./TalkieGrid";
import SpeakerStage, { pickSpotlight } from "./SpeakerStage";

vi.mock("@stream-io/video-react-sdk", async () => (await import("@/test/stream-sdk-mock")).sdkMock);
vi.mock("@/components/ui/use-toast", () => ({ useToast: () => ({ toast: vi.fn() }) }));
// The tile overlay is covered by ParticipantTile tests.
vi.mock("./ParticipantTile", () => ({ ParticipantTileUI: () => null, TilePlaceholder: () => null }));

// jsdom has no ResizeObserver; report a fixed 1400x700 stage.
class FakeResizeObserver {
  constructor(private cb: ResizeObserverCallback) {}
  observe() {
    this.cb([{ contentRect: { width: 1400, height: 700 } } as ResizeObserverEntry], this as never);
  }
  disconnect() {}
  unobserve() {}
}

const person = (id: string, extra: Record<string, unknown> = {}) => ({
  userId: id,
  sessionId: `s-${id}`,
  name: id,
  ...extra,
});

const tiles = () => screen.queryAllByTestId("participant-view");

beforeEach(() => {
  resetStream();
  vi.stubGlobal("ResizeObserver", FakeResizeObserver);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("TalkieGrid", () => {
  it("shows everyone, sized to fit side by side", () => {
    stream.participants = [person("me", { isLocalParticipant: true }), person("amina")];
    render(<TalkieGrid />);

    expect(tiles().map((t) => t.textContent)).toEqual(["me", "amina"]);
    // Two people on a 1400x700 stage: one row, each tile ~692px wide.
    const wrapper = tiles()[0].parentElement!;
    expect(parseInt(wrapper.style.width)).toBeGreaterThan(600);
  });

  it("lays four people out 2x2, not 3+1", () => {
    stream.participants = ["a", "b", "c", "d"].map((id) => person(id));
    render(<TalkieGrid />);

    // 1400x700 stage: two 456px columns plus one 16px gap. Without the row
    // width, flex-wrap would squeeze three tiles into the first row.
    const row = tiles()[0].parentElement!.parentElement!;
    expect(row).toHaveStyle({ width: "928px" });
  });

  it("plays remote audio once, outside the muted tiles", () => {
    stream.participants = [person("me", { isLocalParticipant: true }), person("amina"), person("joel")];
    render(<TalkieGrid />);
    expect(screen.getByTestId("participants-audio")).toHaveAttribute("data-count", "2");
  });

  it("orders people like the SDK grid and restores the default on unmount", () => {
    const { unmount } = render(<TalkieGrid />);
    expect(call.setSortParticipantsBy).toHaveBeenLastCalledWith("paginated-sort");
    unmount();
    expect(call.setSortParticipantsBy).toHaveBeenLastCalledWith("default-sort");
  });

  it("tells the SDK which tiles are on screen", () => {
    render(<TalkieGrid />);
    expect(call.setViewport).toHaveBeenCalledWith(screen.getByTestId("talkie-grid"));
  });

  it("pages large calls", async () => {
    stream.participants = Array.from({ length: PAGE_SIZE + 2 }, (_, i) => person(`p${i}`));
    render(<TalkieGrid />);

    expect(tiles()).toHaveLength(PAGE_SIZE);
    expect(screen.getByText("1 of 2")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /previous page/i })).toBeDisabled();

    await userEvent.click(screen.getByRole("button", { name: /next page/i }));

    expect(tiles().map((t) => t.textContent)).toEqual([`p${PAGE_SIZE}`, `p${PAGE_SIZE + 1}`]);
    expect(screen.getByRole("button", { name: /next page/i })).toBeDisabled();
  });

  it("hides paging for small calls", () => {
    stream.participants = [person("me"), person("amina")];
    render(<TalkieGrid />);
    expect(screen.queryByRole("navigation", { name: /participant pages/i })).not.toBeInTheDocument();
  });

  it("falls back to the last page when people leave", async () => {
    stream.participants = Array.from({ length: PAGE_SIZE + 1 }, (_, i) => person(`p${i}`));
    const { rerender } = render(<TalkieGrid />);
    await userEvent.click(screen.getByRole("button", { name: /next page/i }));

    stream.participants = stream.participants.slice(0, 3);
    act(() => rerender(<TalkieGrid />));

    expect(tiles()).toHaveLength(3);
  });
});

describe("pickSpotlight", () => {
  const a = person("a");
  const b = person("b");
  const sharer = person("c", { sharing: true });

  it("spotlights the screen being shared, keeping the sharer in the strip", () => {
    expect(pickSpotlight([a, sharer, b] as never)).toEqual({
      spotlight: sharer,
      screen: true,
      strip: [a, sharer, b],
    });
  });

  it("otherwise spotlights the first person", () => {
    expect(pickSpotlight([a, b] as never)).toEqual({ spotlight: a, screen: false, strip: [b] });
  });
});

describe("SpeakerStage", () => {
  it("shows the shared screen large and everyone in the strip", () => {
    stream.participants = [person("me"), person("amina", { sharing: true })];
    render(<SpeakerStage />);

    const spotlight = screen.getByTestId("spotlight");
    expect(spotlight).toHaveTextContent("amina");
    expect(spotlight.querySelector("[data-track]")).toHaveAttribute("data-track", "screenShareTrack");
    expect(screen.getByTestId("speaker-strip")).toHaveTextContent("meamina");
  });

  it("fits a shared screen at 16:9 inside the space", () => {
    stream.participants = [person("amina", { sharing: true })];
    render(<SpeakerStage />);

    const box = screen.getByTestId("spotlight").firstElementChild as HTMLElement;
    const width = parseInt(box.style.width);
    const height = parseInt(box.style.height);
    expect(width / height).toBeCloseTo(16 / 9, 1);
    expect(height).toBeLessThanOrEqual(700);
  });

  it("uses the speaker ordering and plays remote audio", () => {
    stream.participants = [person("me", { isLocalParticipant: true }), person("amina")];
    render(<SpeakerStage />);
    expect(call.setSortParticipantsBy).toHaveBeenLastCalledWith("speaker-sort");
    expect(screen.getByTestId("participants-audio")).toHaveAttribute("data-count", "1");
  });

  it("renders nothing before anyone has joined", () => {
    const { container } = render(<SpeakerStage />);
    expect(container).toBeEmptyDOMElement();
  });
});
