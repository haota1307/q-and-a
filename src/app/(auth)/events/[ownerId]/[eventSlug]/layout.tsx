import routes from "@/config/routes";
import BookmarkEventButton from "@/components/buttons/bookmark-event-button";
import { CopyEventLinkButton } from "@/components/buttons/copy-link-event-button";
import EventFloatingSidebar from "@/components/layout/event-floating-sidebar";
import EventTabsNavigation from "@/components/layout/event-tabs-navigation";
import { EventAdminMenu } from "@/components/menu/event-admin-menu";

import { ParticipantsTooltip } from "@/components/tooltips/participants-tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserAvatar } from "@/components/user-avatar";
import { getEventDetail } from "@/lib/server/get-event-detail";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PropsWithChildren } from "react";

export const dynamic = "force-dynamic";

type Props = PropsWithChildren<{
  params: {
    ownerId: string;
    eventSlug: string;
  };
}>;

const EventPageLayout = async ({
  children,
  params: { eventSlug, ownerId },
}: Props) => {
  const event = await getEventDetail({ ownerId, eventSlug });

  if (!event) {
    return notFound();
  }

  const { owner } = event;

  const showDescription =
    event.shortDescription && event.shortDescription.length > 0;

  return (
    <div className="flex flex-col items-start h-full pt-8 px-4 lg:px-8">
      <Link
        href={routes.dashboard}
        className="text-xs flex items-center justify-center"
      >
        <ChevronLeft className="size-4 mr-1" />
        <span className="text-sm">Về trang sự kiện</span>
      </Link>

      <div className="w-full flex flex-col mt-3 lg:flex-row lg:shrink-0 lg:justify-between">
        <div className="">
          <h2 className="font-bold text-2xl lg:text-3xl">
            {event.displayName}
          </h2>

          {showDescription && (
            <p className="line-clamp-1 text-sm text-muted-foreground mt-1.5">
              {event.shortDescription}
            </p>
          )}

          <div className="inline-flex items-center gap-x-2 mt-2">
            <span className="text-xs lg:text-sm">
              <span className="text-slate-600">Người tạo - </span>
              <span className="font-semibold text-violet-800">
                {owner.displayName}
              </span>
            </span>

            <UserAvatar
              className="size-8"
              displayName={owner.displayName}
              color={owner.color}
            />
          </div>
        </div>

        <div className="flex items-baseline justify-between lg:items-center lg:mr-8 lg:self-end">
          <ParticipantsTooltip
            className="mr-7"
            participantsCount={event._count.participants}
          />

          <div className="inline-flex items-center gap-x-2 mt-6 lg:mt-0">
            <CopyEventLinkButton
              eventSlug={event.slug}
              ownerId={event.ownerId}
            />

            <BookmarkEventButton event={event} />

            <EventAdminMenu event={event} />
          </div>
        </div>
      </div>

      <div className="w-full flex flex-1 flex-col lg:flex-row overflow-auto gap-x-4 pt-6">
        {/* Mobile tabs */}
        <EventTabsNavigation
          className="rounded-t-md lg:hidden"
          ownerId={ownerId}
          eventSlug={eventSlug}
        />

        {/* Desktop left floating sidebar */}
        <div className="hidden lg:pb-10 lg:block">
          <EventFloatingSidebar
            ownerId={ownerId}
            eventSlug={eventSlug}
            questionsCount={event._count.questions}
            pollsCount={event._count.polls}
          />
        </div>

        <div className="w-full h-full overflow-auto pb-4">
          <ScrollArea className="relative h-full bg-white px-2.5 py-4 rounded-b-lg lg:rounded-lg lg:p-6">
            {children}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default EventPageLayout;
