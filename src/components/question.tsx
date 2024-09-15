"use client";

import QuestionVoteButton from "@/components/buttons/question-vote-button";
import QuestionOptionsMenu from "@/components/menu/question-options-menu";
import { UserAvatar } from "@/components/user-avatar";
import { QuestionDetail } from "@/lib/prisma/validators/question-validators";
import { cn } from "@/lib/utils";
import { defaultDateFormatter } from "@/lib/utils/date-utils";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { CheckCircle, Pin } from "lucide-react";
import { useState } from "react";

type Props = {
  question: QuestionDetail;
};

const Question = ({ question }: Props) => {
  const { user } = useKindeBrowserClient();

  const [isEditing, setIsEditing] = useState(false);

  const { author, createdAt, isPinned, isResolved, body } = question;
  const isAuthor = author.id === user?.id;
  const isOwner = question.event.ownerId === user?.id;

  return (
    <div
      className={cn(
        "border rounded-xl drop-shadow-md bg-white p-4 lg:p-6",
        isResolved && "border-green-400 bg-green-50"
      )}
    >
      <div className="flex items-center gap-x-5">
        {/* Vote btn */}
        {!isEditing && (
          <QuestionVoteButton
            ownerId={question.event.ownerId}
            eventSlug={question.event.slug}
            upvotes={question.upvotes}
            questionId={question.id}
            totalVotes={question._count.upvotes}
            isResolved={isResolved}
          />
        )}

        <div className="flex-1 grow-1">
          {/* Header */}
          <div className="flex items-center gap-x-2">
            <span className="inline-flex items-center gap-x-2">
              <UserAvatar
                className="w-5 h-5"
                displayName={author.displayName}
                color={author.color}
              />
              <span className="text-sm text-slate-600">
                {author.displayName}
              </span>
            </span>

            <time className="text-slate-400  text-xs">
              {defaultDateFormatter.format(createdAt)}
            </time>

            {isPinned && (
              <Pin
                size={20}
                className="inline-block ml-2 stroke-yellow-500 -rotate-45"
              />
            )}

            {isResolved && (
              <CheckCircle className="stroke-green-500" size={20} />
            )}

            {!isResolved && (
              <QuestionOptionsMenu
                isAdmin={isOwner}
                isAuthor={isAuthor}
                isEditing={isEditing}
                isPinned={isPinned}
                isResolved={isResolved}
                questionId={question.id}
                onPinChange={() => {}}
                onResolveChange={() => {}}
                toggleEditingMode={() => setIsEditing(true)}
                className="text-slate-600 ml-auto"
              />
            )}
          </div>
          {/* Question body or editor */}
          {!isEditing && (
            <p className="mt-5 ml-3 whitespace-pre-wrap text-sm">{body}</p>
          )}

          {isEditing && <form></form>}
        </div>
      </div>
    </div>
  );
};

export default Question;
