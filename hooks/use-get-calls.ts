import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";

export const useGetCalls = () => {
  const [calls, setCalls] = useState<Call[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const client = useStreamVideoClient();
  const { user } = useUser();
  const userId = user?.id;

  useEffect(() => {
    if (!client || !userId) return;

    let cancelled = false;

    const getCalls = async () => {
      setIsLoading(true);

      try {
        const { calls } = await client.queryCalls({
          sort: [{ field: "starts_at", direction: -1 }],
          filter_conditions: {
            starts_at: { $exists: true },
            $or: [
              { created_by_user_id: userId },
              { members: { $in: [userId] } },
            ],
          },
        });

        if (!cancelled) setCalls(calls);
      } catch (error) {
        console.error("Failed to load calls", error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    getCalls();

    return () => {
      cancelled = true;
    };
  }, [client, userId]);

  const now = new Date();

  const endedCalls = calls.filter(
    ({ state: { startsAt, endedAt } }) =>
      (startsAt && new Date(startsAt) < now) || !!endedAt
  );
  const upcomingCalls = calls
    .filter(({ state: { startsAt } }) => startsAt && new Date(startsAt) > now)
    // Query is newest-first; show the soonest upcoming meeting first.
    .reverse();

  return { callRecordings: calls, endedCalls, upcomingCalls, isLoading };
};
