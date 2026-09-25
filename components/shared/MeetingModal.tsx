import React from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { LoaderCircleIcon, LucideIcon } from "lucide-react";

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
  isLoading?: boolean;
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
  isLoading = false,
}: MeetingModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="flex w-[calc(100%-2rem)] flex-col gap-6 rounded-2xl border-none bg-dark-1 px-6 py-9 text-white sm:max-w-[520px]">
        <div className="flex flex-col gap-6">
          {image && (
            <div className="flex justify-center">
              <Image src={image} alt="" width={72} height={72} />
            </div>
          )}
          <DialogTitle
            className={cn("text-2xl font-bold leading-tight sm:text-3xl", className)}
          >
            {title}
          </DialogTitle>
          {children}
          <Button
            className="h-11 bg-blue-1 text-base focus-visible:ring-0 focus-visible:ring-offset-0"
            disabled={isLoading}
            onClick={handleClick}
          >
            {isLoading ? (
              <LoaderCircleIcon className="mr-2 size-4 animate-spin" />
            ) : (
              ButtonIcon && <ButtonIcon className="mr-2 size-4" />
            )}
            {buttonText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MeetingModal;
