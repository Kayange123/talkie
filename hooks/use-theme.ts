import {
  ResolvedTheme,
  THEME_CHANGE_EVENT,
  THEME_STORAGE_KEY,
  ThemePreference,
  isThemePreference,
  resolveTheme,
} from "@/lib/theme";
import { useCallback, useSyncExternalStore } from "react";

const DARK_QUERY = "(prefers-color-scheme: dark)";

const readPreference = (): ThemePreference => {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return isThemePreference(stored) ? stored : "system";
  } catch {
    // Storage can be blocked (private mode, site settings).
    return "system";
  }
};

const systemPrefersDark = () =>
  typeof window.matchMedia === "function" && window.matchMedia(DARK_QUERY).matches;

const applyTheme = (preference: ThemePreference) => {
  const resolved = resolveTheme(preference, systemPrefersDark());
  const root = document.documentElement;
  root.dataset.theme = resolved;
  root.style.colorScheme = resolved;
};

const subscribe = (onChange: () => void) => {
  const media =
    typeof window.matchMedia === "function" ? window.matchMedia(DARK_QUERY) : null;

  const onSystemChange = () => {
    if (readPreference() === "system") applyTheme("system");
    onChange();
  };
  const onStorage = (event: StorageEvent) => {
    if (event.key !== THEME_STORAGE_KEY) return;
    applyTheme(readPreference());
    onChange();
  };

  media?.addEventListener("change", onSystemChange);
  window.addEventListener("storage", onStorage);
  window.addEventListener(THEME_CHANGE_EVENT, onChange);
  return () => {
    media?.removeEventListener("change", onSystemChange);
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(THEME_CHANGE_EVENT, onChange);
  };
};

/** The resolved theme as currently applied to <html>. */
const readResolved = (): ResolvedTheme =>
  document.documentElement.dataset.theme === "light" ? "light" : "dark";

export const useTheme = () => {
  const preference = useSyncExternalStore(subscribe, readPreference, () => "system" as const);
  // The server can't know the visitor's theme; dark matches the app's
  // historical default and is corrected before paint by themeInitScript.
  const resolved = useSyncExternalStore(subscribe, readResolved, () => "dark" as const);

  const setPreference = useCallback((next: ThemePreference) => {
    try {
      if (next === "system") localStorage.removeItem(THEME_STORAGE_KEY);
      else localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Still apply for this page view even if it can't be remembered.
    }
    applyTheme(next);
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  }, []);

  return { preference, resolved, setPreference };
};
