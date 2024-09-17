"use client";

import NavTabButton from "@/components/buttons/nav-tab-button";
import { pollsPageQueryParams } from "@/config/queryParams";
import routes from "@/config/routes";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type PollsTab = "live" | "closed";

type Props = {
  ownerId: string;
  eventSlug: string;
};

const PollsTabNavigation = ({ eventSlug, ownerId }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const showClosed = searchParams.get(pollsPageQueryParams.closed) === "true";

  const eventPollsUrl = routes.eventPolls({
    eventSlug,
    ownerId,
  });

  const activeTab: PollsTab =
    pathname === eventPollsUrl && !showClosed ? "live" : "closed";

  const handleTabChange = (tab: PollsTab) => {
    const newParams = new URLSearchParams();

    if (tab === "closed") {
      newParams.set(pollsPageQueryParams.closed, "true");
    }

    router.replace(`${eventPollsUrl}?${newParams.toString()}`);
  };

  return (
    <nav className="inline-flex">
      <NavTabButton
        isActive={activeTab === "live"}
        onClick={() => handleTabChange("live")}
      >
        Mở
      </NavTabButton>
      <NavTabButton
        isActive={activeTab === "closed"}
        onClick={() => handleTabChange("closed")}
      >
        Đóng
      </NavTabButton>
    </nav>
  );
};

export default PollsTabNavigation;
