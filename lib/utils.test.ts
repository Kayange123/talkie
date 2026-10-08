import { afterEach, describe, expect, it, vi } from "vitest";
import { cn, getBaseUrl, getMeetingLink, parseMeetingInput } from "./utils";

describe("parseMeetingInput", () => {
  it.each([
    ["https://talkie.app/meeting/abc-123", "/meeting/abc-123"],
    [
      "http://localhost:3000/meeting/user_2x?personal=true",
      "/meeting/user_2x?personal=true",
    ],
    ["/meeting/xyz#fragment", "/meeting/xyz"],
    ["  5f1c-uuid  ", "/meeting/5f1c-uuid"],
    ["user_2abcDEF", "/meeting/user_2abcDEF"],
  ])("turns %j into %j", (input, expected) => {
    expect(parseMeetingInput(input)).toBe(expected);
  });

  it.each(["", "   ", "https://evil.example/phish", "not a link", "a/b"])(
    "rejects %j",
    (input) => {
      expect(parseMeetingInput(input)).toBeNull();
    }
  );
});

describe("getBaseUrl", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("uses the current origin in the browser", () => {
    expect(getBaseUrl()).toBe(window.location.origin);
  });

  it("falls back to NEXT_PUBLIC_BASE_URL on the server, trimmed", () => {
    vi.stubGlobal("window", undefined);
    vi.stubEnv("NEXT_PUBLIC_BASE_URL", " https://talkie.app/ ");
    expect(getBaseUrl()).toBe("https://talkie.app");
  });

  it("returns an empty string on the server without the env var", () => {
    vi.stubGlobal("window", undefined);
    vi.stubEnv("NEXT_PUBLIC_BASE_URL", undefined);
    expect(getBaseUrl()).toBe("");
  });
});

describe("getMeetingLink", () => {
  it("builds a meeting link on the current origin", () => {
    expect(getMeetingLink("abc")).toBe(`${window.location.origin}/meeting/abc`);
  });

  it("marks personal rooms", () => {
    expect(getMeetingLink("user_1", true)).toBe(
      `${window.location.origin}/meeting/user_1?personal=true`
    );
  });

  it("round-trips through parseMeetingInput", () => {
    expect(parseMeetingInput(getMeetingLink("room-42", true))).toBe(
      "/meeting/room-42?personal=true"
    );
  });
});

describe("cn", () => {
  it("lets later Tailwind classes win", () => {
    expect(cn("bg-primary px-2", "bg-green-600")).toBe("px-2 bg-green-600");
  });
});
