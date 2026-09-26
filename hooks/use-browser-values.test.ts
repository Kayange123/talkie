import { act, renderHook } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { createElement } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useNow, useOrigin } from "./use-browser-values";

describe("useOrigin", () => {
  it("returns the window origin on the client", () => {
    const { result } = renderHook(() => useOrigin());
    expect(result.current).toBe(window.location.origin);
  });

  it("renders an empty string on the server", () => {
    const Probe = () => createElement("span", null, `[${useOrigin()}]`);
    expect(renderToString(createElement(Probe))).toContain("[]");
  });
});

describe("useNow", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders nothing on the server so the clock can't mismatch", () => {
    const Probe = () =>
      createElement("span", null, useNow() ? "time" : "no-time");
    expect(renderToString(createElement(Probe))).toContain("no-time");
  });

  it("returns the current time and refreshes every 15 seconds", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-26T10:00:00Z"));

    const { result } = renderHook(() => useNow());
    expect(result.current?.toISOString()).toBe("2026-09-26T10:00:00.000Z");

    act(() => {
      vi.advanceTimersByTime(15_000);
    });
    expect(result.current?.toISOString()).toBe("2026-09-26T10:00:15.000Z");
  });
});
