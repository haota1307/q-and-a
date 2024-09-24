"use client";

import CreateQuestionForm from "@/components/forms/create-question-form";
import { NoContent } from "@/components/illustrations";
import { InfiniteScrollList } from "@/components/infinite-scroll-list";
import Question from "@/components/question";
import { getEventOpenQuestionsAction } from "@/lib/actions/get-event-open-question-action";
import { QuestionDetail } from "@/lib/prisma/validators/question-validators";
import { cn } from "@/lib/utils";
import { QuestionsOrderBy } from "@/lib/utils/question-utils";
import { PropsWithClassName } from "@/lib/utils/ui-utils";
import { Event, User } from "@prisma/client";
import { useAction } from "next-safe-action/hooks";
import { useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

type Props = PropsWithClassName<{
  initialQuestions: QuestionDetail[];
  ownerId: User["id"];
  eventSlug: Event["slug"];
  orderBy: QuestionsOrderBy;
  questionId?: QuestionDetail["id"];
}>;

export const OpenQuestionsList = ({
  initialQuestions,
  ownerId,
  eventSlug,
  orderBy,
  className,
  questionId,
}: Props) => {
  const [questions, setQuestions] = useState(initialQuestions);

  const searchParams = useSearchParams();

  const { executeAsync } = useAction(getEventOpenQuestionsAction);

  const fetchMoreOpenQuestion = useCallback(
    async ({ cursor }: { cursor?: QuestionDetail["id"] }) => {
      const newQuestion = await executeAsync({
        cursor,
        eventSlug,
        ownerId,
        orderBy,
        questionId,
      });

      if (!newQuestion?.data || newQuestion.data.length === 0) {
        return [];
      }

      return newQuestion.data;
    },
    [executeAsync, eventSlug, ownerId, orderBy, questionId]
  );

  const hasFilters = !!questionId;

  return (
    <div className={cn("space-y-8 py-10")}>
      {!hasFilters && (
        <CreateQuestionForm
          key={Date.now()}
          ownerId={ownerId}
          eventSlug={eventSlug}
          onSuccess={(newQuestion) => setQuestions([newQuestion, ...questions])}
        />
      )}

      {questions.length === 0 ? (
        <NoContent height={180} width={180}>
          <span className="tracking-tight font-light mt-3">
            Hiện tại chưa có câu hỏi nào.
          </span>
        </NoContent>
      ) : (
        <InfiniteScrollList<QuestionDetail>
          key={`open-${searchParams.toString()}`}
          items={questions}
          setItems={setQuestions}
          fetchMore={fetchMoreOpenQuestion}
          renderItem={(question) => (
            <Question key={question.id} question={question} />
          )}
        />
      )}
    </div>
  );
};

export const ResolvedQuestionsList = ({
  initialQuestions,
  ownerId,
  eventSlug,
  orderBy,
  className,
  questionId,
}: Props) => {
  return (
    <div className={cn("space-y-8 py-10")}>
      {initialQuestions.length === 0 ? (
        <NoContent height={180} width={180}>
          <span className="tracking-tight font-light mt-3">
            Hiện tại chưa có câu hỏi nào được giải quyết.
          </span>
        </NoContent>
      ) : (
        initialQuestions.map((question) => (
          <Question key={question.id} question={question} />
        ))
      )}
    </div>
  );
};
