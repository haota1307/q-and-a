"use client";

import EventCard from "@/components/event-card";
import { InfiniteScrollList } from "@/components/infinite-scroll-list";
import { getUserBookmarkedEventsAction } from "@/lib/actions/get-user-bookmarked-events-action";
import { EventDetail } from "@/lib/prisma/validators/event-validators";
import { Event } from "@prisma/client";
import { useAction } from "next-safe-action/hooks";
import { useCallback, useState } from "react";

type Props = {
  initialBookmarkedEvents: EventDetail[];
};

const BookmarkedEventsList = ({ initialBookmarkedEvents }: Props) => {
  const [events, setEvents] = useState(initialBookmarkedEvents);

  const { executeAsync } = useAction(getUserBookmarkedEventsAction);

  const fetchMoreEvents = useCallback(
    async ({ cursor }: { cursor?: Event["id"] }) => {
      const newEvents = await executeAsync({ cursor });

      if (!newEvents?.data || newEvents.data.length === 0) {
        return [];
      }

      return newEvents.data;
    },
    []
  );

  return (
    <InfiniteScrollList<EventDetail>
      items={events}
      setItems={setEvents}
      fetchMore={fetchMoreEvents}
      renderItem={(event) => (
        <EventCard key={event.id} event={event} className="h-36" />
      )}
    />
  );
};

export default BookmarkedEventsList;
