"use client";

import { NoContent } from "@/components/illustrations";
import { InfiniteScrollList } from "@/components/infinite-scroll-list";
import { ClosedPoll } from "@/components/poll";
import { getEventClosedPollsAction } from "@/lib/actions/get-event-closed-action";
import { PollDetail } from "@/lib/prisma/validators/poll-validators";
import { cn } from "@/lib/utils";
import { PropsWithClassName } from "@/lib/utils/ui-utils";
import { Event, Poll, User } from "@prisma/client";
import { useAction } from "next-safe-action/hooks";
import { useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

type Props = PropsWithClassName<{
  initialPolls: PollDetail[];
  ownerId: User["id"];
  eventSlug: Event["slug"];
  pollId?: Poll["id"];
}>;

const ClosedPollsList = ({
  eventSlug,
  ownerId,
  initialPolls,
  className,
  pollId,
}: Props) => {
  const [closedPolls, setClosedPolls] = useState(initialPolls);

  const { executeAsync } = useAction(getEventClosedPollsAction);

  const searchParams = useSearchParams();

  const fetchMoreClosedPolls = useCallback(
    async ({ cursor }: { cursor?: Poll["id"] }) => {
      const newQuestions = await executeAsync({
        cursor,
        eventSlug,
        ownerId,
        pollId,
      });

      if (!newQuestions?.data || newQuestions.data.length === 0) {
        return [];
      }

      return newQuestions.data;
    },
    [executeAsync, eventSlug, ownerId, pollId]
  );

  return (
    <div className={cn("space-y-8 pb-10", className)}>
      {closedPolls.length === 0 ? (
        <NoContent>
          <span className="tracking-tight font-light mt-3">
            Không có cuộc bình chọn nào được hoàn thành
          </span>
        </NoContent>
      ) : (
        <InfiniteScrollList<PollDetail>
          key={`closed-polls-${searchParams.toString()}`}
          items={closedPolls}
          setItems={setClosedPolls}
          renderItem={(poll) => <ClosedPoll key={poll.id} poll={poll} />}
          fetchMore={fetchMoreClosedPolls}
        />
      )}
    </div>
  );
};

export default ClosedPollsList;
