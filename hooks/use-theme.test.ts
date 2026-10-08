import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { THEME_STORAGE_KEY, resolveTheme, themeInitScript } from "@/lib/theme";
import { useTheme } from "./use-theme";

// jsdom has no matchMedia; fake the OS preference and let tests flip it.
let systemDark = true;
const mediaListeners = new Set<() => void>();
const fakeMatchMedia = (query: string) => ({
  get matches() {
    return query.includes("dark") && systemDark;
  },
  media: query,
  addEventListener: (_: string, fn: () => void) => mediaListeners.add(fn),
  removeEventListener: (_: string, fn: () => void) => mediaListeners.delete(fn),
});
const setSystemDark = (dark: boolean) => {
  systemDark = dark;
  mediaListeners.forEach((fn) => fn());
};

const root = () => document.documentElement;

beforeEach(() => {
  systemDark = true;
  mediaListeners.clear();
  vi.stubGlobal("matchMedia", fakeMatchMedia);
  localStorage.clear();
  delete root().dataset.theme;
  root().style.colorScheme = "";
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("resolveTheme", () => {
  it("uses an explicit choice as is", () => {
    expect(resolveTheme("light", true)).toBe("light");
    expect(resolveTheme("dark", false)).toBe("dark");
  });

  it("follows the system for 'system'", () => {
    expect(resolveTheme("system", true)).toBe("dark");
    expect(resolveTheme("system", false)).toBe("light");
  });
});

describe("themeInitScript", () => {
  const run = () => new Function(themeInitScript)();

  it("applies the saved theme before paint", () => {
    localStorage.setItem(THEME_STORAGE_KEY, "light");
    run();
    expect(root().dataset.theme).toBe("light");
    expect(root().style.colorScheme).toBe("light");
  });

  it("falls back to the system preference when nothing is saved", () => {
    systemDark = false;
    run();
    expect(root().dataset.theme).toBe("light");
  });

  it("ignores junk in storage", () => {
    localStorage.setItem(THEME_STORAGE_KEY, "purple");
    run();
    expect(root().dataset.theme).toBe("dark");
  });
});

describe("useTheme", () => {
  it("defaults to following the system", () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.preference).toBe("system");
  });

  it("applies and remembers an explicit choice", () => {
    const { result } = renderHook(() => useTheme());

    act(() => result.current.setPreference("light"));

    expect(root().dataset.theme).toBe("light");
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("light");
    expect(result.current.preference).toBe("light");
    expect(result.current.resolved).toBe("light");
  });

  it("forgets the choice when switching back to system", () => {
    const { result } = renderHook(() => useTheme());
    act(() => result.current.setPreference("light"));
    act(() => result.current.setPreference("system"));

    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBeNull();
    expect(root().dataset.theme).toBe("dark");
  });

  it("follows OS changes while on system", () => {
    const { result } = renderHook(() => useTheme());
    act(() => result.current.setPreference("system"));

    act(() => setSystemDark(false));

    expect(root().dataset.theme).toBe("light");
    expect(result.current.resolved).toBe("light");
  });

  it("ignores OS changes after an explicit choice", () => {
    const { result } = renderHook(() => useTheme());
    act(() => result.current.setPreference("dark"));

    act(() => setSystemDark(false));

    expect(root().dataset.theme).toBe("dark");
  });

  it("still applies the theme when storage is blocked", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("SecurityError");
    });
    const { result } = renderHook(() => useTheme());

    act(() => result.current.setPreference("light"));

    expect(root().dataset.theme).toBe("light");
  });

  it("stops listening on unmount", () => {
    const { unmount } = renderHook(() => useTheme());
    expect(mediaListeners.size).toBeGreaterThan(0);
    unmount();
    expect(mediaListeners.size).toBe(0);
  });
});
