import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";

export const useGetCalls = () => {
  const [calls, setCalls] = useState<Call[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const client = useStreamVideoClient();
  const { user } = useUser();

  useEffect(() => {
    const getCalls = async () => {
      if (!client || !user) return;
      setIsLoading(true);

      try {
        const { calls } = await client.queryCalls({
          sort: [{ field: "starts_at", direction: -1 }],
          filter_conditions: {
            starts_at: { $exists: true },
            $or: [
              { created_by_user_id: user.id },
              { members: { $in: [user.id] } },
            ],
          },
        });

        setCalls(calls);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    getCalls();
  }, [client, user]);

  const now = new Date();

  const endedCalls = calls.filter(
    ({ state: { startsAt, endedAt } }) =>
      (startsAt && new Date(startsAt) < now) || !!endedAt
  );
  const upcomingCalls = calls.filter(
    ({ state: { startsAt } }) => startsAt && new Date(startsAt) > now
  );

  return { callRecordings: calls, endedCalls, upcomingCalls, isLoading };
};
