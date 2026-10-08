import { act, renderHook } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { call, resetStream, stream } from "@/test/stream-sdk-mock";
import { HAND_EVENT, RaisedHandsProvider, useRaisedHands } from "./use-raised-hands";

vi.mock("@stream-io/video-react-sdk", async () => (await import("@/test/stream-sdk-mock")).sdkMock);
const toast = vi.fn();
vi.mock("@/components/ui/use-toast", () => ({ useToast: () => ({ toast }) }));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <RaisedHandsProvider>{children}</RaisedHandsProvider>
);
const setup = () => renderHook(() => useRaisedHands(), { wrapper });

const handEvent = (userId: string, name: string, raised: boolean, target?: string) => ({
  type: "custom",
  user: { id: userId, name },
  custom: { type: HAND_EVENT, raised, ...(target && { target }) },
});

describe("useRaisedHands", () => {
  beforeEach(() => {
    resetStream();
    stream.localUserId = "me";
    toast.mockReset();
  });

  it("raising your hand shows it locally and tells everyone", async () => {
    const { result } = setup();

    await act(() => result.current.raise());

    expect(result.current.isMyHandRaised).toBe(true);
    expect(call.sendCustomEvent).toHaveBeenCalledWith({ type: HAND_EVENT, raised: true });
  });

  it("lowering your hand tells everyone", async () => {
    const { result } = setup();
    await act(() => result.current.raise());

    await act(() => result.current.lower());

    expect(result.current.isMyHandRaised).toBe(false);
    expect(call.sendCustomEvent).toHaveBeenLastCalledWith({ type: HAND_EVENT, raised: false });
  });

  it("tracks other people's hands in the order they were raised", () => {
    const { result } = setup();

    act(() => call.emit("custom", handEvent("joel", "Joel", true)));
    act(() => call.emit("custom", handEvent("priya", "Priya", true)));

    expect(result.current.hands.map((h) => h.userId)).toEqual(["joel", "priya"]);
    expect(toast).toHaveBeenCalledWith({ title: "Joel raised their hand" });
  });

  it("ignores duplicate raises and unrelated custom events", () => {
    const { result } = setup();

    act(() => call.emit("custom", handEvent("joel", "Joel", true)));
    act(() => call.emit("custom", handEvent("joel", "Joel", true)));
    act(() => call.emit("custom", { user: { id: "x" }, custom: { type: "something-else" } }));

    expect(result.current.hands).toHaveLength(1);
  });

  it("removes a hand when its owner lowers it", () => {
    const { result } = setup();
    act(() => call.emit("custom", handEvent("joel", "Joel", true)));

    act(() => call.emit("custom", handEvent("joel", "Joel", false)));

    expect(result.current.hands).toEqual([]);
  });

  it("lets the host lower someone else's hand for everyone", async () => {
    const { result } = setup();
    act(() => call.emit("custom", handEvent("joel", "Joel", true)));

    await act(() => result.current.lower("joel"));

    expect(result.current.isRaised("joel")).toBe(false);
    expect(call.sendCustomEvent).toHaveBeenCalledWith({
      type: HAND_EVENT,
      raised: false,
      target: "joel",
    });
  });

  it("applies a host lowering your hand from another device", async () => {
    const { result } = setup();
    await act(() => result.current.raise());

    act(() => call.emit("custom", handEvent("host", "Host", false, "me")));

    expect(result.current.isMyHandRaised).toBe(false);
  });

  it("ignores a participant lowering someone else's hand", () => {
    const { result } = setup();
    act(() => call.emit("custom", handEvent("joel", "Joel", true)));

    act(() => call.emit("custom", handEvent("priya", "Priya", false, "joel")));

    expect(result.current.isRaised("joel")).toBe(true);
  });

  it("ignores anyone raising a hand on someone else's behalf", () => {
    const { result } = setup();

    act(() => call.emit("custom", handEvent("host", "Host", true, "joel")));

    expect(result.current.isRaised("joel")).toBe(false);
  });

  it("re-announces your raised hand when someone joins late", async () => {
    const { result } = setup();
    await act(() => result.current.raise());
    call.sendCustomEvent.mockClear();

    act(() => call.emit("call.session_participant_joined", { participant: { user: { id: "new" } } }));

    expect(call.sendCustomEvent).toHaveBeenCalledWith({ type: HAND_EVENT, raised: true });
  });

  it("stays quiet on joins when your hand is down", () => {
    setup();
    act(() => call.emit("call.session_participant_joined", { participant: { user: { id: "new" } } }));
    expect(call.sendCustomEvent).not.toHaveBeenCalled();
  });

  it("drops a hand when that person leaves", () => {
    const { result } = setup();
    act(() => call.emit("custom", handEvent("joel", "Joel", true)));

    act(() => call.emit("call.session_participant_left", { participant: { user: { id: "joel" } } }));

    expect(result.current.hands).toEqual([]);
  });

  it("does not toast for your own hand", async () => {
    const { result } = setup();
    await act(() => result.current.raise());
    act(() => call.emit("custom", handEvent("me", "Me", true)));
    expect(toast).not.toHaveBeenCalled();
  });

  it("unsubscribes from call events on unmount", () => {
    const { unmount } = setup();
    expect(call.listenerCount("custom")).toBe(1);
    unmount();
    expect(call.listenerCount("custom")).toBe(0);
    expect(call.listenerCount("call.session_participant_joined")).toBe(0);
    expect(call.listenerCount("call.session_participant_left")).toBe(0);
  });
});
