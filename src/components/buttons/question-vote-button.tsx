"use client";

import { useVote } from "@/hooks/useQuestion";
import { QuestionDetail } from "@/lib/prisma/validators/question-validators";
import { cn } from "@/lib/utils";
import { PropsWithClassName } from "@/lib/utils/ui-utils";
import { LoginLink, useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { Event, Question } from "@prisma/client";
import { ThumbsUp } from "lucide-react";

type Props = PropsWithClassName<{
  questionId: Question["id"];
  eventSlug: Event["slug"];
  ownerId: Event["ownerId"];
  upvotes: QuestionDetail["upvotes"];
  totalVotes: number;
  isResolved: boolean;
}>;

const QuestionVoteButton = ({
  ownerId,
  eventSlug,
  isResolved,
  questionId,
  totalVotes: initialTotalVotes,
  upvotes,
  className,
}: Props) => {
  const { user } = useKindeBrowserClient();

  const { handleVote, isUpvoted, totalVotes } = useVote({
    questionId,
    upvotes,
    totalVotes: initialTotalVotes,
  });

  if (!user) {
    return (
      <LoginLink>
        <button className={cn("flex flex-col items-center", className)}>
          <ThumbsUp size={24} />
          <span className="px-2 pt-1 text-sm">{totalVotes}</span>
        </button>
      </LoginLink>
    );
  }

  return (
    <button
      className={cn(
        "flex flex-col items-center disabled:cursor-not-allowed disabled:opacity-80",
        className
      )}
      disabled={isResolved}
      onClick={handleVote}
    >
      <ThumbsUp className={cn(isUpvoted && "stroke-violet-500")} />
      <span className={cn("px-2 pt-1 text-sm", isUpvoted && "text-violet-500")}>
        {totalVotes}
      </span>
    </button>
  );
};

export default QuestionVoteButton;
