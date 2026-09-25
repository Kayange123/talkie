import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

/** window.location.origin on the client, "" during SSR and hydration. */
export const useOrigin = () =>
  useSyncExternalStore(
    noopSubscribe,
    () => window.location.origin,
    () => ""
  );

const TICK_MS = 15_000;

const subscribeToTicks = (onTick: () => void) => {
  const timer = setInterval(onTick, TICK_MS);
  return () => clearInterval(timer);
};

/**
 * Current time, refreshed every 15s. Undefined during SSR and hydration so
 * the clock renders in the viewer's timezone without a mismatch.
 */
export const useNow = () => {
  // Snapshots must be stable between reads, so quantize to the tick.
  const tick = useSyncExternalStore(
    subscribeToTicks,
    () => Math.floor(Date.now() / TICK_MS),
    () => null
  );
  return tick === null ? undefined : new Date();
};
