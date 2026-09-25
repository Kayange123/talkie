"use client";

import {
  DeviceSettings,
  VideoPreview,
  useCall,
} from "@stream-io/video-react-sdk";
import { LoaderCircleIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";

interface MeetingSetupProps {
  onSetupComplete: () => void;
}

const MeetingSetup = ({ onSetupComplete }: MeetingSetupProps) => {
  const [joinMuted, setJoinMuted] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const call = useCall();
  const { toast } = useToast();

  useEffect(() => {
    if (!call) return;
    if (joinMuted) {
      call.camera.disable();
      call.microphone.disable();
    } else {
      call.camera.enable();
      call.microphone.enable();
    }
  }, [joinMuted, call]);

  if (!call) {
    throw new Error("MeetingSetup must be rendered inside <StreamCall>");
  }

  const joinMeeting = async () => {
    setIsJoining(true);
    try {
      await call.join();
      onSetupComplete();
    } catch (error) {
      console.error("Failed to join call", error);
      toast({
        title: "Couldn't join the meeting",
        description: "Check your connection and try again.",
        variant: "destructive",
      });
      setIsJoining(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-6 px-4 py-10 text-white">
      <div className="text-center">
        <h1 className="text-2xl font-bold sm:text-3xl">Ready to join?</h1>
        <p className="mt-1 text-muted-foreground">
          Check your camera and microphone before going in.
        </p>
      </div>

      <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-dark-1 shadow-2xl ring-1 ring-white/5">
        <VideoPreview />
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <label className="flex cursor-pointer select-none items-center gap-3 rounded-lg bg-dark-1 px-4 py-2.5 font-medium">
          <input
            type="checkbox"
            checked={joinMuted}
            onChange={(e) => setJoinMuted(e.target.checked)}
            className="size-4 accent-blue-1"
          />
          Join with mic and camera off
        </label>
        <DeviceSettings />
      </div>

      <Button
        size="lg"
        className="min-w-44 rounded-lg bg-green-600 text-base font-semibold"
        disabled={isJoining}
        onClick={joinMeeting}
      >
        {isJoining && <LoaderCircleIcon className="mr-2 size-4 animate-spin" />}
        {isJoining ? "Joining…" : "Join meeting"}
      </Button>
    </div>
  );
};

export default MeetingSetup;
