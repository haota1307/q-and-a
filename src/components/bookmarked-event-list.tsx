import EventCard from "@/components/event-card";
import { EventDetail } from "@/lib/prisma/validators/event-validators";

type Props = {
  initialBookmarkedEvents: EventDetail[];
};

const BookmarkedEventsList = ({ initialBookmarkedEvents }: Props) => {
  return initialBookmarkedEvents.map((event) => (
    <EventCard key={event.id} event={event} className={"h-36"} />
  ));
};

export default BookmarkedEventsList;
