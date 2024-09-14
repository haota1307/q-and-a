"use client";

import NavTabButton from "@/components/buttons/nav-tab-button";
import { questionsPageQueryParams } from "@/config/queryParams";
import routes from "@/config/routes";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type QuestionsTabs = "open" | "resolved";

type Props = {
  ownerId: string;
  eventSlug: string;
};

const QuestionsTabsNavigation = ({ eventSlug, ownerId }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const showResolved =
    searchParams.get(questionsPageQueryParams.resolved) === "true";

  const EventQuestionsRoute = routes.event({
    eventSlug,
    ownerId,
  });

  const activeTab: QuestionsTabs =
    pathname === EventQuestionsRoute && !showResolved ? "open" : "resolved";

  const handleTabChange = (tab: QuestionsTabs) => {
    const newParams = new URLSearchParams();

    if (tab === "resolved") {
      newParams.set(questionsPageQueryParams.resolved, "true");
    }

    router.replace(`${EventQuestionsRoute}?${newParams.toString()}`);
  };

  return (
    <nav className="inline-flex">
      <NavTabButton
        isActive={activeTab === "open"}
        onClick={() => handleTabChange("open")}
      >
        Mở
      </NavTabButton>
      <NavTabButton
        isActive={activeTab === "resolved"}
        onClick={() => handleTabChange("resolved")}
      >
        Kết thúc
      </NavTabButton>
    </nav>
  );
};

export default QuestionsTabsNavigation;
