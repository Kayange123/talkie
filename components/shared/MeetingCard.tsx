"use client";

import Image from "next/image";

import { cn } from "@/lib/utils";
import { useToast } from "../ui/use-toast";
import { Button } from "../ui/button";
import { LucideIcon } from "lucide-react";

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

  const avatarImages: Array<string> = [
    "/images/avatar-1.jpeg",
    "/images/avatar-2.jpeg",
    "/images/avatar-3.png",
    "/images/avatar-4.png",
    "/images/avatar-5.png",
    "/images/hero-background.png",
  ];

  return (
    <section className="flex min-h-[258px] w-full flex-col justify-between rounded-[14px] bg-dark-1 px-5 py-8 xl:max-w-[568px]">
      <article className="flex flex-col gap-5">
        <Icon className="size-7" />
        <div className="flex justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-base font-normal">{date}</p>
          </div>
        </div>
      </article>
      <article className={cn("flex justify-center relative", {})}>
        <div className="relative flex w-full max-sm:hidden">
          {avatarImages.map((img: string, index: number) => (
            <Image
              key={index}
              src={img}
              alt="attendees"
              width={40}
              height={40}
              className={cn("rounded-full", { absolute: index > 0 })}
              style={{ top: 0, left: index * 28 }}
            />
          ))}
          <div className="flex-center absolute left-[136px] size-10 rounded-full border-[5px] border-dark-3 bg-dark-4">
            +5
          </div>
        </div>
        {!isPreviousMeeting && (
          <div className="flex gap-2">
            <Button onClick={handleClick} className="rounded bg-blue-1 px-6">
              {ButtonIcon && <ButtonIcon className="size-5" />}
              &nbsp; {buttonText}
            </Button>
            <Button
              onClick={() => {
                navigator.clipboard.writeText(link);
                toast({
                  title: "Link Copied",
                });
              }}
              className="bg-dark-4 px-6"
            >
              <Image
                src="/icons/copy.svg"
                alt="feature"
                width={20}
                height={20}
              />
              &nbsp; Copy Link
            </Button>
          </div>
        )}
      </article>
    </section>
  );
};

export default MeetingCard;
