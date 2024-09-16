"use client";

import routes from "@/config/routes";
import SidebarItem from "@/components/layout/sidebar-item";
import { EventViewModeSelect } from "@/components/selects/event-view-mode-select";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { BarChart, MessageCircleMore } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useIsParticipantView } from "@/hooks/useIsParticipantView";

type Props = {
  eventSlug: string;
  ownerId: string;
  questionsCount: number;
  pollsCount: number;
};

const EventFloatingSidebar = ({
  eventSlug,
  ownerId,
  pollsCount,
  questionsCount,
}: Props) => {
  const { user } = useKindeBrowserClient();

  const pathname = usePathname();
  const router = useRouter();

  const questionsRoute = routes.event({ ownerId, eventSlug });
  const pollsRoute = routes.eventPolls({ ownerId, eventSlug });

  const isParticipantView = useIsParticipantView();
  const isOwner = ownerId === user?.id;

  return (
    <div className="w-[220px] drop-shadow-md h-full border rounded-xl bg-white">
      <div className="flex flex-col h-full pt-8 px-3 pb-3">
        <nav className="flex flex-col gap-3 h-full">
          <button onClick={() => router.replace(questionsRoute)}>
            <SidebarItem
              isActive={pathname === questionsRoute}
              text="Câu hỏi"
              icon={MessageCircleMore}
            >
              <span>{questionsCount}</span>
            </SidebarItem>
          </button>
          <button onClick={() => router.replace(pollsRoute)}>
            <SidebarItem
              isActive={pathname === pollsRoute}
              text="Thăm dò ý kiến"
              icon={BarChart}
            >
              <span>{pollsCount}</span>
            </SidebarItem>
          </button>
        </nav>
        {isOwner && (
          <div className="mt-auto space-y-4 w-full">
            <EventViewModeSelect key={String(isParticipantView)} />
          </div>
        )}
      </div>
    </div>
  );
};

export default EventFloatingSidebar;
