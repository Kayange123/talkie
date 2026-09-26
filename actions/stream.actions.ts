"use server";

import { currentUser } from "@clerk/nextjs/server";
import { StreamClient } from "@stream-io/node-sdk";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY as string;
const apiSecret = process.env.STREAM_SECRET_KEY as string;

export const tokenProvider = async () => {
  const user = await currentUser();

  if (!user) throw new Error("User is not authenticated");
  if (!apiKey) throw new Error("No API key provided");
  if (!apiSecret) throw new Error("No API secret provided");

  const streamClient = new StreamClient(apiKey, apiSecret);
  const now = Math.floor(Date.now() / 1000);

  return streamClient.generateUserToken({
    user_id: user.id,
    exp: now + 60 * 60,
    // Backdate slightly to tolerate clock skew between servers.
    iat: now - 60,
  });
};
