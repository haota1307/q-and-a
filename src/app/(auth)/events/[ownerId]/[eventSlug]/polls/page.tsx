import ClearSearchParamsButton from "@/components/buttons/clear-search-params-button";
import RefreshButton from "@/components/buttons/refresh-button";
import ClosedPollsList from "@/components/closed-polls-list";
import { NoContent } from "@/components/illustrations";
import PollsTabNavigation from "@/components/layout/polls-tab-navigation";
import { Loader } from "@/components/loader";
import { LivePoll } from "@/components/poll";
import { Button } from "@/components/ui/button";
import { getEventClosedPolls } from "@/lib/server/get-event-closed-polls";
import { getEventDetail } from "@/lib/server/get-event-detail";
import { getEventLivePolls } from "@/lib/server/get-event-live-polls";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Plus } from "lucide-react";
import { notFound } from "next/navigation";
import { Suspense } from "react";

type PathParams = {
  ownerId: string;
  eventSlug: string;
};

type SearchParams = {
  closed: string;
  asParticipant: string;
  pollId: string;
};

type Polls = {
  ownerId: string;
  eventSlug: string;
  showClosed?: boolean;
  pollId?: string;
};

const PollsPage = async ({
  params: { eventSlug, ownerId },
  searchParams,
}: {
  params: PathParams;
  searchParams: SearchParams;
}) => {
  const showClosed = searchParams.closed === "true";
  const isParticipantView = searchParams.asParticipant === "true";
  const pollId = searchParams.pollId;

  const event = await getEventDetail({ ownerId, eventSlug });

  if (!event) {
    return notFound();
  }

  const user = await getKindeServerSession().getUser();
  const isAdmin = event.ownerId === user?.id;

  const showNewPollButton = isAdmin && !isParticipantView && !showClosed;

  const hasFilters = !!pollId;

  return (
    <>
      <div className="flex justify-between">
        <PollsTabNavigation eventSlug={eventSlug} ownerId={ownerId} />

        <div className="inline-flex items-baseline gap-x-3">
          <RefreshButton />

          {showNewPollButton && (
            // TODO: add new poll dialog
            <Button
              variant={"ghost"}
              className="bg-violet-100 text-primary hover:bg-violet-200 hover:text-primary"
            >
              <Plus className="size-4 mr-2" />
              <span>Tạo mới</span>
              <span className="hidden lg:inline"></span>
            </Button>
          )}
        </div>
      </div>

      {hasFilters && (
        <div className="flex mt-4 items-center gap-x-2">
          <p className="text-muted-foreground text-sm">
            Có bộ lọc đang hoạt động
          </p>
          <ClearSearchParamsButton />
        </div>
      )}

      {/* List of polls */}
      <Suspense key={Date.now()} fallback={<Loader />}>
        <Polls
          eventSlug={eventSlug}
          showClosed={showClosed}
          ownerId={ownerId}
          pollId={pollId}
        />
      </Suspense>
    </>
  );
};

const Polls = async ({
  eventSlug,
  ownerId,
  pollId,
  showClosed = false,
}: Polls) => {
  const fetchPolls = showClosed ? getEventClosedPolls : getEventLivePolls;

  const polls = await fetchPolls({
    eventSlug,
    ownerId,
    ...(pollId ? { filters: { pollId } } : {}),
  });

  if (showClosed) {
    return (
      <ClosedPollsList
        eventSlug={eventSlug}
        initialPolls={polls}
        ownerId={ownerId}
        pollId={pollId}
        className="mt-8"
      />
    );
  }

  if (polls.length === 0) {
    return (
      <NoContent className="mt-10">
        <span className="tracking-tight font-light mt-3">
          Không có cuộc bình chọn nào đang diễn ra
        </span>
      </NoContent>
    );
  }

  return (
    <div className="mt-8 space-y-10">
      {polls.map((poll) => (
        <LivePoll poll={poll} key={poll.id} />
      ))}
    </div>
  );
};

export default PollsPage;
