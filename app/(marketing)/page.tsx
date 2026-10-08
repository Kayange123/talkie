import Landing from "@/components/landing/Landing";
import { appConfig } from "@/config/app.config";
import { auth } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: `${appConfig.title}: video meetings for small teams`,
  description:
    "Start a meeting in one click, share one link, and get back to work. Talkie runs in the browser, with nothing to install.",
};

const LandingPage = async () => {
  // Signed-in people have no use for the pitch; send them to their meetings.
  const { userId } = await auth();
  if (userId) redirect("/dashboard");

  return <Landing />;
};

export default LandingPage;
