import { cn } from "@/lib/utils";
import {
  CopyIcon,
  MicIcon,
  MicOffIcon,
  PhoneOffIcon,
  ScreenShareIcon,
  VideoIcon,
} from "lucide-react";

// Placeholder teammates; tile colors reuse the app's home-card palette.
const participants = [
  { name: "Amina", initials: "AO", color: "bg-orange-1", speaking: true },
  { name: "Joel", initials: "JK", color: "bg-purple-1", muted: true },
  { name: "Priya", initials: "PS", color: "bg-yellow-1 text-dark-2" },
  { name: "You", initials: "ME", color: "bg-blue-1" },
];

const controls = [
  { icon: MicIcon, label: "Microphone" },
  { icon: VideoIcon, label: "Camera" },
  { icon: ScreenShareIcon, label: "Share screen" },
];

/**
 * A static mock of a Talkie call. Tiles "join" one after another on load;
 * the motion is skipped for people who prefer reduced motion.
 */
const CallPreview = () => {
  return (
    <figure aria-labelledby="call-preview-caption" className="w-full">
      <figcaption id="call-preview-caption" className="sr-only">
        Preview of a Talkie call with four teammates
      </figcaption>

      <div
        aria-hidden
        className="rounded-[28px] bg-dark-1 p-3 shadow-[0_40px_80px_-20px_rgba(5,8,20,0.8)] ring-1 ring-white/[0.06] sm:p-4"
      >
        <div className="mb-3 flex items-center justify-between gap-3 px-1 sm:mb-4">
          <p className="truncate text-sm font-semibold text-white sm:text-base">
            Weekly sync
          </p>
          <span className="flex min-w-0 items-center gap-2 rounded-full bg-dark-3 px-3 py-1.5 text-xs text-sky-1 sm:text-sm">
            <span className="truncate">/meeting/weekly-sync</span>
            <CopyIcon className="size-3.5 shrink-0" />
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          {participants.map(({ name, initials, color, speaking, muted }, i) => (
            <div
              key={name}
              style={{ animationDelay: `${250 + i * 220}ms` }}
              className={cn(
                "relative flex aspect-[4/3] items-center justify-center rounded-2xl bg-dark-3 motion-safe:animate-join",
                speaking && "ring-2 ring-blue-1 ring-offset-2 ring-offset-dark-1"
              )}
            >
              <span
                className={cn(
                  "flex-center size-12 rounded-full text-base font-bold text-white sm:size-16 sm:text-xl",
                  color
                )}
              >
                {initials}
              </span>
              <span className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-md bg-dark-2/80 px-2 py-1 text-xs font-medium text-white">
                {muted && <MicOffIcon className="size-3 text-sky-1" />}
                {name}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-3 flex items-center justify-center gap-2 sm:mt-4">
          {controls.map(({ icon: Icon, label }) => (
            <span
              key={label}
              title={label}
              className="flex-center size-10 rounded-full bg-[#19232d] text-white"
            >
              <Icon className="size-4" />
            </span>
          ))}
          <span className="flex-center h-10 w-14 rounded-full bg-red-600 text-white">
            <PhoneOffIcon className="size-4" />
          </span>
        </div>
      </div>
    </figure>
  );
};

export default CallPreview;
