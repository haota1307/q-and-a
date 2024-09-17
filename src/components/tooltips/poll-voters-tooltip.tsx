import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { UserAvatar } from "@/components/user-avatar";
import { PropsWithClassName } from "@/lib/utils/ui-utils";
import { User } from "@prisma/client";

type Props = PropsWithClassName<{
  voters: Pick<User, "displayName" | "color">[];
  pollTotalVotes: number;
}>;

const PollVotersTooltip = ({ pollTotalVotes, voters, className }: Props) => {
  const votersToDisplay = voters.slice(0, 5);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className={className}>
          <div className="flex -space-x-4">
            {votersToDisplay.map((voter, index) => (
              <UserAvatar
                key={index}
                displayName={voter.displayName}
                color={voter.color}
                className="size-8 ring-2 ring-white"
              />
            ))}

            {voters.length > 5 && (
              <Avatar className="size-8 ring-2 ring-white">
                <AvatarFallback className="text-black text-sm bg-gray-200">
                  +{voters.length - 5}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        </TooltipTrigger>

        <TooltipContent className="bg-black text-white text-sm">
          {pollTotalVotes} người tham gia bình chọn
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default PollVotersTooltip;
