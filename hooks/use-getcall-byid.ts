import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";

export const useGetCallById = (id?: string | string[]) => {
  const [call, setCall] = useState<Call>();
  const [isCallLoading, setIsCallLoading] = useState(true);

  const client = useStreamVideoClient();

  useEffect(() => {
    // An empty id would serialize to an empty filter and match any call.
    if (!client || !id) return;

    let cancelled = false;

    const loadCall = async () => {
      setIsCallLoading(true);
      setCall(undefined);
      try {
        const { calls } = await client.queryCalls({
          filter_conditions: { id },
        });
        if (!cancelled) setCall(calls[0]);
      } catch (error) {
        console.error("Failed to load call", error);
      } finally {
        if (!cancelled) setIsCallLoading(false);
      }
    };

    loadCall();

    return () => {
      cancelled = true;
    };
  }, [client, id]);

  return { call, isCallLoading };
};
