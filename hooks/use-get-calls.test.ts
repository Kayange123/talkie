import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fakeCall, minutesFromNow } from "@/test/fakes";
import { useGetCalls } from "./use-get-calls";

const queryCalls = vi.fn();
// The real client is a single stable instance; a fresh object per render
// would re-run the hook's effect on every render.
const client = { queryCalls };

vi.mock("@clerk/nextjs", () => ({
  useUser: () => ({ user: { id: "user_1" } }),
}));

vi.mock("@stream-io/video-react-sdk", () => ({
  useStreamVideoClient: () => client,
}));

describe("useGetCalls", () => {
  beforeEach(() => {
    queryCalls.mockReset();
  });

  it("reports loading from the very first render", () => {
    // Otherwise "No calls" flashes before the first query starts.
    queryCalls.mockReturnValue(new Promise(() => {}));
    const renders: boolean[] = [];
    renderHook(() => {
      const value = useGetCalls();
      renders.push(value.isLoading);
      return value;
    });
    expect(renders[0]).toBe(true);
  });

  it("only queries calls the user created or was invited to", async () => {
    queryCalls.mockResolvedValue({ calls: [] });
    const { result } = renderHook(() => useGetCalls());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(queryCalls).toHaveBeenCalledWith(
      expect.objectContaining({
        filter_conditions: expect.objectContaining({
          $or: [
            { created_by_user_id: "user_1" },
            { members: { $in: ["user_1"] } },
          ],
        }),
      })
    );
  });

  it("splits calls into upcoming (soonest first) and ended", async () => {
    // queryCalls sorts by starts_at descending, like the real API.
    queryCalls.mockResolvedValue({
      calls: [
        fakeCall({ id: "later", startsAt: minutesFromNow(120) }),
        fakeCall({ id: "soon", startsAt: minutesFromNow(30) }),
        fakeCall({ id: "past", startsAt: minutesFromNow(-60) }),
        fakeCall({
          id: "ended-early",
          startsAt: minutesFromNow(90),
          endedAt: new Date(),
        }),
      ],
    });

    const { result } = renderHook(() => useGetCalls());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // A call ended before its scheduled start is not upcoming anymore.
    expect(result.current.upcomingCalls.map((c) => c.id)).toEqual([
      "soon",
      "later",
    ]);
    expect(result.current.endedCalls.map((c) => c.id)).toEqual([
      "past",
      "ended-early",
    ]);
    expect(result.current.callRecordings).toHaveLength(4);
  });

  it("stops loading and returns no calls when the query fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    queryCalls.mockRejectedValue(new Error("network down"));

    const { result } = renderHook(() => useGetCalls());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.upcomingCalls).toEqual([]);
    expect(result.current.endedCalls).toEqual([]);
  });
});
