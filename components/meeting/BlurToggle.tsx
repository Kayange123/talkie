"use client";

import { useBackgroundFilters } from "@stream-io/video-react-sdk";
import { UserRoundIcon } from "lucide-react";
import ControlButton from "./ControlButton";

/** Blurs your background. Hidden on devices that can't run the filter. */
const BlurToggle = () => {
  const {
    isSupported,
    isReady,
    backgroundFilter,
    applyBackgroundBlurFilter,
    disableBackgroundFilter,
  } = useBackgroundFilters();

  if (!isSupported) return null;

  const isOn = backgroundFilter === "blur";

  return (
    <ControlButton
      label="Blur"
      icon={UserRoundIcon}
      tone={isOn ? "active" : "default"}
      aria-pressed={isOn}
      disabled={!isReady}
      title={isReady ? undefined : "Preparing background blur"}
      onClick={() => (isOn ? disableBackgroundFilter() : applyBackgroundBlurFilter("medium"))}
    />
  );
};

export default BlurToggle;
