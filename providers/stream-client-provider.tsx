"use client";

import { ReactNode, useEffect, useState } from "react";
import { StreamVideo, StreamVideoClient } from "@stream-io/video-react-sdk";
import { tokenProvider } from "@/actions/stream.actions";
import Loader from "@/components/shared/Loader";
import { useUser } from "@clerk/nextjs";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;

export const StreamVideoProvider = ({ children }: { children: ReactNode }) => {
  const [videoClient, setVideoClient] = useState<StreamVideoClient>();

  const { user, isLoaded } = useUser();

  // Depend on primitives: Clerk may hand back a new `user` object on session
  // refresh, and reconnecting on every refresh would drop people from calls.
  const userId = user?.id;
  const userName = user?.fullName || user?.username || user?.id;
  const userImage = user?.imageUrl;

  useEffect(() => {
    // Route protection is handled by middleware; just wait for Clerk.
    if (!isLoaded || !userId) return;
    if (!apiKey) throw new Error("Stream API key missing");

    const client = new StreamVideoClient({
      apiKey,
      user: { id: userId, name: userName, image: userImage },
      tokenProvider,
    });

    setVideoClient(client);

    return () => {
      client.disconnectUser();
      setVideoClient(undefined);
    };
  }, [isLoaded, userId, userName, userImage]);

  if (!videoClient) return <Loader fullScreen />;
  return <StreamVideo client={videoClient}>{children}</StreamVideo>;
};

export default StreamVideoProvider;
