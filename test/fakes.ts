import type { Call } from "@stream-io/video-react-sdk";

interface FakeCallOptions {
  id: string;
  startsAt?: Date;
  endedAt?: Date;
  description?: string;
}

/** Minimal stand-in for a Stream `Call`, covering the fields the app reads. */
export const fakeCall = ({ id, startsAt, endedAt, description }: FakeCallOptions) =>
  ({
    id,
    state: { startsAt, endedAt, custom: { description } },
  }) as unknown as Call;

export const minutesFromNow = (minutes: number) =>
  new Date(Date.now() + minutes * 60_000);
