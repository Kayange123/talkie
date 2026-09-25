"use client";

import { useToast } from "../ui/use-toast";
import { Button } from "../ui/button";
import { CopyIcon, LucideIcon } from "lucide-react";

interface MeetingCardProps {
  title: string;
  date: string;
  icon: LucideIcon;
  isPreviousMeeting?: boolean;
  buttonIcon1?: LucideIcon;
  buttonText?: string;
  handleClick: () => void;
  link: string;
}

const MeetingCard = ({
  icon: Icon,
  title,
  date,
  isPreviousMeeting,
  buttonIcon1: ButtonIcon,
  handleClick,
  link,
  buttonText,
}: MeetingCardProps) => {
  const { toast } = useToast();

  return (
    <section className="flex min-h-[220px] w-full animate-fade-in flex-col justify-between gap-6 rounded-[14px] bg-dark-1 px-5 py-7 ring-1 ring-white/5 transition hover:ring-white/10">
      <article className="flex flex-col gap-5">
        <div className="flex-center size-11 rounded-lg bg-dark-3">
          <Icon className="size-6 text-sky-1" />
        </div>
        <div className="flex flex-col gap-1.5">
          <h2 className="line-clamp-2 break-words text-xl font-bold sm:text-2xl">
            {title}
          </h2>
          <p className="text-base font-normal text-muted-foreground">{date}</p>
        </div>
      </article>
      {!isPreviousMeeting && (
        <article className="flex flex-wrap gap-2 sm:justify-end">
          <Button onClick={handleClick} className="rounded-lg bg-blue-1 px-6">
            {ButtonIcon && <ButtonIcon className="mr-2 size-4" />}
            {buttonText}
          </Button>
          <Button
            onClick={() => {
              navigator.clipboard.writeText(link);
              toast({ title: "Link copied" });
            }}
            className="rounded-lg bg-dark-3 px-6"
          >
            <CopyIcon className="mr-2 size-4" />
            Copy link
          </Button>
        </article>
      )}
    </section>
  );
};

export default MeetingCard;
