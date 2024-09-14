"use client";

import routes from "@/config/routes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PropsWithClassName } from "@/lib/utils/ui-utils";
import { usePathname, useRouter } from "next/navigation";

type Props = PropsWithClassName<{
  ownerId: string;
  eventSlug: string;
}>;

const EventTabsNavigation = ({ eventSlug, ownerId, className }: Props) => {
  const pathname = usePathname();
  const router = useRouter();

  const isQAndATab = pathname === routes.event({ ownerId, eventSlug });
  const isPollsTab = pathname === routes.eventPolls({ ownerId, eventSlug });

  return (
    <div className={cn("flex", className)}>
      {["Q&A", "Polls"].map((tab) => (
        <Button
          key={tab}
          variant={"outline"}
          className={cn("basis-1/2 bg-gray-100 rounded-t-lg rounded-b-none", {
            "bg-white": tab === "Q&A" ? isQAndATab : isPollsTab,
          })}
          onClick={() =>
            router.replace(
              tab === "Q&A"
                ? routes.event({ ownerId, eventSlug })
                : routes.eventPolls({ ownerId, eventSlug })
            )
          }
        >
          {tab}
        </Button>
      ))}
    </div>
  );
};

export default EventTabsNavigation;
