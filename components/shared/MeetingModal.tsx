import React from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface MeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  title: string;
  children?: React.ReactNode;
  handleClick?: () => void;
  buttonText?: string;
  image?: string;
  buttonIcon?: LucideIcon;
}

const MeetingModal = ({
  isOpen,
  onClose,
  className,
  title,
  handleClick,
  children,
  buttonIcon: ButtonIcon,
  buttonText = "Schedule Meeting",
  image,
}: MeetingModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md flex w-full md:max-w-[520px] flex-col gap-6 border-none bg-dark-1 px-6 py-9 text-white">
        <div className="flex flex-col gap-6">
          {image && (
            <div className="flex justify-center">
              <Image src={image} alt="image" width={72} height={72} />
            </div>
          )}
          <h1 className={cn("text-3xl font-bold leading-[42px]", className)}>
            {title}
          </h1>
          {children}
          <Button
            className="bg-blue-1 focus-visible:ring-0 focus-visible:ring-offset-0"
            onClick={handleClick}
          >
            {ButtonIcon && <ButtonIcon className="size-3 pr-1" />}
            {buttonText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MeetingModal;
