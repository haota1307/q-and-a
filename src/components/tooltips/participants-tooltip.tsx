import { PropsWithClassName } from "@/lib/utils/ui-utils";
import { Users } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { cn } from "@/lib/utils";

type Props = PropsWithClassName<{ participantsCount: number }>;

export const ParticipantsTooltip = ({
  participantsCount,
  className,
}: Props) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div
            className={cn(
              "inline-flex gap-x-2 p-2 rounded-lg items-center text-xs cursor-pointer hover:bg-slate-200 lg:text-sm",
              className
            )}
          >
            <Users className="w-5 h-5 lg:w-6 lg:h-6" />

            <span className="lining-nums">{participantsCount}</span>
          </div>
        </TooltipTrigger>

        <TooltipContent className="bg-black rounded-lg text-white text-sm">
          <p>{participantsCount} người đã tham gia bình chọn.</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
