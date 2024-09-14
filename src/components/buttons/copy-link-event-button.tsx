"use client";

import { Event } from "@prisma/client";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import copy from "copy-to-clipboard";
import { Link } from "lucide-react";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipProvider } from "../ui/tooltip";

import { getEventLink } from "@/lib/utils/event-utils";
import { toast } from "@/components/ui/use-toast";

type Props = {
  ownerId: Event["ownerId"];
  eventSlug: Event["slug"];
};

export const CopyEventLinkButton = ({ ownerId, eventSlug }: Props) => {
  const handleCopy = () => {
    copy(getEventLink({ ownerId, eventSlug }));

    toast({
      title: "🔊🔊🔊 Thông báo 🔊🔊🔊",
      description: "✅✅✅Liên kết đã được sao chép vào bảng tạm!✅✅✅",
      variant: "default",
    });
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={handleCopy}
            variant={"outline"}
            className="rounded-full"
          >
            <Link className="w-4 h-4" />
          </Button>
        </TooltipTrigger>

        <TooltipContent className="bg-black text-white text-sm">
          Sao chép liên kết
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
