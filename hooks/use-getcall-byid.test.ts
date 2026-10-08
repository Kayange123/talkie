import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fakeCall } from "@/test/fakes";
import { useGetCallById } from "./use-getcall-byid";

const queryCalls = vi.fn();
// The real client is a single stable instance; a fresh object per render
// would re-run the hook's effect on every render.
const client = { queryCalls };

vi.mock("@stream-io/video-react-sdk", () => ({
  useStreamVideoClient: () => client,
}));

describe("useGetCallById", () => {
  beforeEach(() => {
    queryCalls.mockReset();
  });

  it("does not query without an id", () => {
    // An undefined id would serialize to an empty filter and match any call.
    const { result } = renderHook(() => useGetCallById(undefined));
    expect(queryCalls).not.toHaveBeenCalled();
    expect(result.current.call).toBeUndefined();
  });

  it("returns the matching call", async () => {
    const call = fakeCall({ id: "abc" });
    queryCalls.mockResolvedValue({ calls: [call] });

    const { result } = renderHook(() => useGetCallById("abc"));
    await waitFor(() => expect(result.current.isCallLoading).toBe(false));

    expect(queryCalls).toHaveBeenCalledWith({ filter_conditions: { id: "abc" } });
    expect(result.current.call).toBe(call);
  });

  it("returns no call when the id doesn't exist", async () => {
    queryCalls.mockResolvedValue({ calls: [] });

    const { result } = renderHook(() => useGetCallById("missing"));
    await waitFor(() => expect(result.current.isCallLoading).toBe(false));

    expect(result.current.call).toBeUndefined();
  });

  it("stops loading when the query fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    queryCalls.mockRejectedValue(new Error("network down"));

    const { result } = renderHook(() => useGetCallById("abc"));
    await waitFor(() => expect(result.current.isCallLoading).toBe(false));

    expect(result.current.call).toBeUndefined();
  });

  it("drops the previous call while loading a new id", async () => {
    queryCalls
      .mockResolvedValueOnce({ calls: [fakeCall({ id: "first" })] })
      .mockReturnValueOnce(new Promise(() => {}));

    const { result, rerender } = renderHook(({ id }) => useGetCallById(id), {
      initialProps: { id: "first" },
    });
    await waitFor(() => expect(result.current.call?.id).toBe("first"));

    rerender({ id: "second" });

    expect(result.current.isCallLoading).toBe(true);
    expect(result.current.call).toBeUndefined();
  });

  it("ignores a stale response that arrives after the id changed", async () => {
    let resolveFirst: (value: unknown) => void = () => {};
    queryCalls
      .mockReturnValueOnce(new Promise((resolve) => (resolveFirst = resolve)))
      .mockResolvedValueOnce({ calls: [fakeCall({ id: "second" })] });

    const { result, rerender } = renderHook(({ id }) => useGetCallById(id), {
      initialProps: { id: "first" },
    });
    rerender({ id: "second" });
    await waitFor(() => expect(result.current.call?.id).toBe("second"));

    await act(async () => {
      resolveFirst({ calls: [fakeCall({ id: "first" })] });
    });

    expect(result.current.call?.id).toBe("second");
  });
});
