import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { THEME_STORAGE_KEY } from "@/lib/theme";
import ThemeToggle from "./ThemeToggle";

beforeEach(() => {
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: query.includes("dark"),
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  }));
  localStorage.clear();
  document.documentElement.dataset.theme = "dark";
});

afterEach(() => {
  vi.unstubAllGlobals();
});

const openMenu = () =>
  userEvent.click(screen.getByRole("button", { name: /change theme/i }));

describe("ThemeToggle", () => {
  it("offers light, dark and system, with system selected by default", async () => {
    render(<ThemeToggle />);
    await openMenu();

    const items = screen.getAllByRole("menuitemradio");
    expect(items.map((item) => item.textContent)).toEqual([
      "Light",
      "Dark",
      "Match system",
    ]);
    expect(screen.getByRole("menuitemradio", { name: /match system/i })).toHaveAttribute(
      "aria-checked",
      "true"
    );
  });

  it("switches the whole page to the chosen theme", async () => {
    render(<ThemeToggle />);
    await openMenu();

    await userEvent.click(screen.getByRole("menuitemradio", { name: "Light" }));

    expect(document.documentElement.dataset.theme).toBe("light");
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("light");
  });
});
