"use client";

import {
  CallStats,
  OwnCapability,
  Restricted,
  useToggleCallRecording,
} from "@stream-io/video-react-sdk";
import { ActivityIcon, CircleDotIcon, EllipsisIcon } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import ControlButton from "./ControlButton";

export type LayoutMode = "auto" | "grid" | "speaker";

export const layoutModes: { value: LayoutMode; label: string; hint?: string }[] = [
  { value: "auto", label: "Auto", hint: "Speaker view when sharing" },
  { value: "grid", label: "Grid" },
  { value: "speaker", label: "Speaker" },
];

const itemClass =
  "cursor-pointer gap-2.5 rounded-lg py-2.5 text-[15px] font-semibold focus:bg-dark-3 focus:text-fg";

const RecordingItem = () => {
  const { toggleCallRecording, isAwaitingResponse, isCallRecordingInProgress } =
    useToggleCallRecording();

  return (
    <Restricted requiredGrants={[OwnCapability.START_RECORD_CALL, OwnCapability.STOP_RECORD_CALL]}>
      <DropdownMenuItem
        disabled={isAwaitingResponse}
        onSelect={() => toggleCallRecording()}
        className={itemClass}
      >
        <CircleDotIcon className="size-4 text-[#F25555]" aria-hidden />
        {isCallRecordingInProgress ? "Stop recording" : "Start recording"}
      </DropdownMenuItem>
    </Restricted>
  );
};

export interface MoreMenuProps {
  layout: LayoutMode;
  onLayoutChange: (layout: LayoutMode) => void;
}

const MoreMenu = ({ layout, onLayoutChange }: MoreMenuProps) => {
  const [open, setOpen] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);

  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <ControlButton label="More" icon={EllipsisIcon} tone={open ? "active" : "default"} />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="top"
          sideOffset={12}
          className="w-64 rounded-2xl border-border bg-dark-1 p-2 text-fg"
        >
          <DropdownMenuLabel className="text-sky-1">Layout</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={layout}
            onValueChange={(value) => onLayoutChange(value as LayoutMode)}
          >
            {layoutModes.map(({ value, label, hint }) => (
              <DropdownMenuRadioItem
                key={value}
                value={value}
                className="cursor-pointer gap-2 rounded-lg py-2.5 text-[15px] focus:bg-dark-3 focus:text-fg"
              >
                <span className="flex-1 font-semibold">{label}</span>
                {hint && <span className="text-xs text-sky-1">{hint}</span>}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
          <DropdownMenuSeparator className="bg-fg/10" />
          <RecordingItem />
          <DropdownMenuItem
            onSelect={() => setStatsOpen(true)}
            className={itemClass}
          >
            <ActivityIcon className="size-4 text-sky-1" aria-hidden />
            Call stats
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={statsOpen} onOpenChange={setStatsOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto border-none bg-dark-1 text-fg sm:max-w-[560px]">
          <DialogTitle>Call stats</DialogTitle>
          {statsOpen && <CallStats />}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MoreMenu;
