import ClearSearchParamsButton from "@/components/buttons/clear-search-params-button";
import RefreshButton from "@/components/buttons/refresh-button";
import QuestionsTabsNavigation from "@/components/layout/questions-tabs-navigation";
import { Loader } from "@/components/loader";
import {
  OpenQuestionsList,
  ResolvedQuestionsList,
} from "@/components/questions-list";
import QuestionsSortBySelect from "@/components/selects/questions-sort-by-select";
import { getEventOpenQuestions } from "@/lib/server/get-event-open-questions";
import { getEventResolvedQuestions } from "@/lib/server/get-event-resolved-questions";
import { QuestionsOrderBy } from "@/lib/utils/question-utils";
import { Suspense } from "react";

type PathPrams = {
  ownerId: string;
  eventSlug: string;
};

type SearchParams = {
  sortBy: string;
  questionId: string;
  resolved: string;
};

type QuestionsType = {
  showResolved: boolean;
  ownerId: string;
  eventSlug: string;
  questionId?: string;
  orderBy?: QuestionsOrderBy;
};

const EventQuestionsPage = async ({
  params: { eventSlug, ownerId },
  searchParams,
}: {
  params: PathPrams;
  searchParams?: SearchParams;
}) => {
  const orderBy: QuestionsOrderBy | any = searchParams?.sortBy ?? "newest";
  const showResolved = searchParams?.resolved === "true";
  const questionId = searchParams?.questionId;

  const hasFilters = !!questionId;

  return (
    <>
      <div className="flex justify-between">
        <QuestionsTabsNavigation ownerId={ownerId} eventSlug={eventSlug} />

        <div className="inline-flex items-center lg:gap-x-5">
          <RefreshButton />

          <div className="inline-flex items-center p-0.5 lg:gap-x-2">
            <span className="hidden lg:inline-block items-center text-nowrap text-sm text-gray-500">
              Sắp xếp theo:{" "}
            </span>
            <QuestionsSortBySelect sortBy={orderBy} />
          </div>
        </div>
      </div>

      {/* Clear filters options */}
      {hasFilters && (
        <div className="flex mt-4 items-center gap-x-2">
          <p>Có bộ lọc đang hoạt động</p>
          <ClearSearchParamsButton />
        </div>
      )}

      {/* List of questions */}
      <Suspense key={Date.now()} fallback={<Loader />}>
        <Questions
          ownerId={ownerId}
          eventSlug={eventSlug}
          showResolved={showResolved}
          orderBy={orderBy}
          questionId={questionId}
        />
      </Suspense>
    </>
  );
};

export const Questions = async ({
  eventSlug,
  ownerId,
  showResolved,
  orderBy = "newest",
  questionId,
}: QuestionsType) => {
  const fetchQuestions = showResolved
    ? getEventResolvedQuestions
    : getEventOpenQuestions;

  const questions = await fetchQuestions({
    ownerId,
    eventSlug,
    orderBy,
    ...(questionId ? { filters: { questionId } } : {}),
  });

  return showResolved ? (
    <ResolvedQuestionsList
      initialQuestions={questions}
      ownerId={ownerId}
      eventSlug={eventSlug}
      questionId={questionId}
      orderBy={orderBy}
      className="mt-5"
    />
  ) : (
    <OpenQuestionsList
      initialQuestions={questions}
      ownerId={ownerId}
      eventSlug={eventSlug}
      questionId={questionId}
      orderBy={orderBy}
      className="mt-5"
    />
  );
};

export default EventQuestionsPage;
