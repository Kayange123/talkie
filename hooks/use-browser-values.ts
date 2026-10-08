import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

/** window.location.origin on the client, "" during SSR and hydration. */
export const useOrigin = () =>
  useSyncExternalStore(
    noopSubscribe,
    () => window.location.origin,
    () => ""
  );

const subscribersFor = (intervalMs: number) => (onTick: () => void) => {
  const timer = setInterval(onTick, intervalMs);
  return () => clearInterval(timer);
};

const tickSubscribers = new Map<number, (onTick: () => void) => () => void>();
const subscribeEvery = (intervalMs: number) => {
  // useSyncExternalStore resubscribes when subscribe changes identity.
  let subscribe = tickSubscribers.get(intervalMs);
  if (!subscribe) {
    subscribe = subscribersFor(intervalMs);
    tickSubscribers.set(intervalMs, subscribe);
  }
  return subscribe;
};

/**
 * Current time, refreshed every `intervalMs`. Undefined during SSR and
 * hydration so times render in the viewer's timezone without a mismatch.
 */
export const useTicker = (intervalMs: number) => {
  // Snapshots must be stable between reads, so quantize to the tick.
  const tick = useSyncExternalStore(
    subscribeEvery(intervalMs),
    () => Math.floor(Date.now() / intervalMs),
    () => null
  );
  return tick === null ? undefined : new Date();
};

/** Current time, refreshed every 15s, for clocks shown to the minute. */
export const useNow = () => useTicker(15_000);
