import routes from "@/config/routes";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { EventDetail } from "@/lib/prisma/validators/event-validators";
import { cn } from "@/lib/utils";
import { PropsWithClassName } from "@/lib/utils/ui-utils";
import { User2, Users } from "lucide-react";
import Link from "next/link";

type Props = PropsWithClassName<{
  event: EventDetail;
}>;

const EventCard = ({ event, className }: Props) => {
  return (
    <Link
      href={routes.event({
        eventSlug: event.slug,
        ownerId: event.ownerId,
      })}
      prefetch={false}
    >
      <Card
        className={cn(
          "rounded-none border-l-[4px] border-b-0 border-t-0 border-r-0 border-violet-400/80",
          className
        )}
      >
        <CardHeader>
          <div className="flex justify-between">
            <h4 className="text-base font-semibold line-clamp-2">
              {event.displayName}
            </h4>
          </div>

          <div className="flex justify-between text-[12px] text-violet-300 font-medium">
            <span>
              <span>Câu hỏi: {event._count.questions}</span>
              <span className="mx-2">&bull;</span>
              <span>Cuộc bình chọn: {event._count.polls}</span>
            </span>
            <span className="inline-flex gap-x-1 items-center font-bold">
              <Users className="size-4" />
              <span>{event._count.participants} Người</span>
            </span>
          </div>
        </CardHeader>

        <CardContent>
          <p className="text-gray-400 text-xs line-clamp-2">
            {event.shortDescription}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default EventCard;
