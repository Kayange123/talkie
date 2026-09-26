import { render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import LandingPage from "./page";

const auth = vi.hoisted(() => vi.fn());
vi.mock("@clerk/nextjs/server", () => ({ auth }));

// Like Next's redirect(), stop rendering by throwing.
const redirect = vi.hoisted(() =>
  vi.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`);
  })
);
vi.mock("next/navigation", () => ({ redirect }));

describe("LandingPage", () => {
  beforeEach(() => {
    auth.mockReset();
    redirect.mockClear();
  });

  it("sends signed-in visitors to the dashboard", async () => {
    auth.mockResolvedValue({ userId: "user_1" });

    await expect(LandingPage()).rejects.toThrow("NEXT_REDIRECT:/dashboard");
    expect(redirect).toHaveBeenCalledWith("/dashboard");
  });

  describe("for signed-out visitors", () => {
    beforeEach(async () => {
      auth.mockResolvedValue({ userId: null });
      render(await LandingPage());
    });

    it("does not redirect", () => {
      expect(redirect).not.toHaveBeenCalled();
    });

    it("leads with the headline", () => {
      expect(
        screen.getByRole("heading", { level: 1, name: /on a call in one click/i })
      ).toBeInTheDocument();
    });

    it("points every call to action at sign-up or sign-in", () => {
      const hrefs = screen
        .getAllByRole("link", { name: /start a meeting|create an account|sign in/i })
        .map((link) => link.getAttribute("href"));

      expect(hrefs.length).toBeGreaterThan(0);
      expect(new Set(hrefs)).toEqual(new Set(["/sign-up", "/sign-in"]));
    });

    it("walks through the meeting as five ordered steps", () => {
      const steps = within(screen.getByRole("list")).getAllByRole("listitem");
      expect(steps).toHaveLength(5);
      expect(steps[0]).toHaveTextContent(/start now, or schedule it/i);
      expect(steps[4]).toHaveTextContent(/catch up later/i);
    });

    it("describes the decorative call preview for screen readers", () => {
      expect(
        screen.getByRole("figure", { name: /preview of a talkie call/i })
      ).toBeInTheDocument();
    });
  });
});
