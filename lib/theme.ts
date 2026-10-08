export type ThemePreference = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

export const THEME_STORAGE_KEY = "talkie-theme";
export const THEME_CHANGE_EVENT = "talkie-theme-change";

export const isThemePreference = (value: unknown): value is ThemePreference =>
  value === "light" || value === "dark" || value === "system";

export const resolveTheme = (
  preference: ThemePreference,
  systemPrefersDark: boolean
): ResolvedTheme =>
  preference === "system" ? (systemPrefersDark ? "dark" : "light") : preference;

/**
 * Runs in <head> before the page paints, so the saved theme is applied
 * without a flash. Keep it dependency-free; it is inlined as a string.
 */
export const themeInitScript = `(function () {
  try {
    var stored = localStorage.getItem("${THEME_STORAGE_KEY}");
    var pref = stored === "light" || stored === "dark" ? stored : "system";
    var dark = pref === "dark" || (pref === "system" && matchMedia("(prefers-color-scheme: dark)").matches);
    var root = document.documentElement;
    root.dataset.theme = dark ? "dark" : "light";
    root.style.colorScheme = dark ? "dark" : "light";
  } catch (e) {}
})();`;
