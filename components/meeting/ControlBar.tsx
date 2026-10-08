"use client";

import { OwnCapability, Restricted, useCall, DeviceSettings } from "@stream-io/video-react-sdk";
import { Button } from "../ui/button";
import BlurToggle from "./BlurToggle";
import EndCallButton from "./EndCallButton";
import { CameraButton, MicButton, RaiseHandButton, ShareButton } from "./MediaButtons";
import MoreMenu, { LayoutMode } from "./MoreMenu";
import ReactionPicker from "./ReactionPicker";

export type { LayoutMode } from "./MoreMenu";
export { layoutModes } from "./MoreMenu";

interface ControlBarProps {
  layout: LayoutMode;
  onLayoutChange: (layout: LayoutMode) => void;
  isPersonalRoom: boolean;
  onLeave: () => void;
}

const Divider = () => <span aria-hidden className="h-12 w-px shrink-0 bg-fg/10 max-sm:hidden" />;

const ControlBar = ({ layout, onLayoutChange, isPersonalRoom, onLeave }: ControlBarProps) => {
  const call = useCall();

  return (
    <footer className="grid shrink-0 items-center gap-3 border-t border-fg/[0.07] bg-dark-1 px-3 py-3 sm:min-h-24 sm:grid-cols-[1fr_auto_1fr] sm:px-6">
      <div className="max-sm:hidden" title="Audio and video devices">
        <DeviceSettings />
      </div>

      <div
        role="toolbar"
        aria-label="Meeting controls"
        className="flex items-start gap-2 overflow-x-auto max-sm:justify-between sm:gap-3 lg:gap-7"
      >
        <div className="flex gap-2 sm:gap-3">
          <MicButton />
          <CameraButton />
          <Restricted requiredGrants={[OwnCapability.SCREENSHARE]}>
            <span className="max-sm:hidden">
              <ShareButton />
            </span>
          </Restricted>
        </div>
        <Divider />
        <div className="flex gap-2 sm:gap-3">
          <Restricted requiredGrants={[OwnCapability.CREATE_REACTION]}>
            <ReactionPicker />
          </Restricted>
          <RaiseHandButton />
          <span className="max-sm:hidden">
            <BlurToggle />
          </span>
        </div>
        <Divider />
        <MoreMenu layout={layout} onLayoutChange={onLayoutChange} />
      </div>

      <div className="flex justify-end gap-2.5 max-sm:col-span-full max-sm:justify-stretch">
        <Button
          className="h-12 rounded-[14px] bg-dark-3 px-5 text-[15px] font-bold text-fg max-sm:flex-1"
          onClick={async () => {
            await call?.leave().catch(() => {});
            onLeave();
          }}
        >
          Leave
        </Button>
        {!isPersonalRoom && <EndCallButton onEnded={onLeave} />}
      </div>
    </footer>
  );
};

export default ControlBar;
