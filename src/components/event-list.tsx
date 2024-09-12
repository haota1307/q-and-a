import EventCard from "@/components/event-card";
import { EventDetail } from "@/lib/prisma/validators/event-validators";

type Props = {
  initialEvents: EventDetail[];
};

const UserEventList = ({ initialEvents }: Props) => {
  return initialEvents.map((event) => (
    <EventCard key={event.id} event={event} className={"h-36"} />
  ));
};

export default UserEventList;
