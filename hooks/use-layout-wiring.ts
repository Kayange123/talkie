import { Comparator, StreamVideoParticipant, defaultSortPreset, useCall } from "@stream-io/video-react-sdk";
import { useEffect } from "react";

/**
 * What every video layout needs from the call: an ordering for participants
 * (restored on unmount) and the visible area, so the SDK can pause video for
 * tiles that are off screen.
 */
export const useLayoutWiring = (
  sortPreset: Comparator<StreamVideoParticipant>,
  viewport: HTMLElement | null
) => {
  const call = useCall();

  useEffect(() => {
    if (!call) return;
    call.setSortParticipantsBy(sortPreset);
    return () => call.setSortParticipantsBy(defaultSortPreset);
  }, [call, sortPreset]);

  useEffect(() => {
    if (!call || !viewport) return;
    const cleanup = call.setViewport(viewport);
    return () => cleanup?.();
  }, [call, viewport]);
};
