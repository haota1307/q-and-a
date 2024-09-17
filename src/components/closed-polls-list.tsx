"use client";

import { NoContent } from "@/components/illustrations";
import { ClosedPoll } from "@/components/poll";
import { PollDetail } from "@/lib/prisma/validators/poll-validators";
import { cn } from "@/lib/utils";
import { PropsWithClassName } from "@/lib/utils/ui-utils";
import { Event, Poll, User } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

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

  const searchParams = useSearchParams();
  return (
    <div className={cn("space-y-8 pb-10", className)}>
      {closedPolls.length === 0 ? (
        <NoContent>
          <span className="tracking-tight font-light mt-3">
            Không có cuộc bình chọn nào được hoàn thành
          </span>
        </NoContent>
      ) : (
        closedPolls.map((poll) => <ClosedPoll key={pollId} poll={poll} />)
      )}
    </div>
  );
};

export default ClosedPollsList;
