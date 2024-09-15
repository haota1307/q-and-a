import { toast } from "@/components/ui/use-toast";
import { updateQuestionAction } from "@/lib/actions/update-question-action";
import { voteQuestionAction } from "@/lib/actions/vote-question-action";
import { QuestionDetail } from "@/lib/prisma/validators/question-validators";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { Question } from "@prisma/client";
import debounce from "lodash.debounce";
import { useAction } from "next-safe-action/hooks";
import { useCallback, useEffect, useRef, useState } from "react";

export const useTogglePin = ({
  questionId,
  isPinned: initialIsPinned,
}: {
  questionId: Question["id"];
  isPinned: boolean;
}) => {
  const [isPinned, setIsPinned] = useState(initialIsPinned);

  const { execute, isExecuting } = useAction(updateQuestionAction, {
    onSuccess: () => console.log("Ghim thành công!"),
    onError: (error) => {
      console.error(error);

      toast({
        title: "Đã có lỗi xảy ra",
        description: "Không ghim được câu hỏi!",
        variant: "destructive",
      });

      // revert the optimistic update
      setIsPinned((prevIsPinned) => !prevIsPinned);
    },
  });

  const togglePin = () => {
    setIsPinned((prev) => !prev);

    execute({ questionId, isPinned: !isPinned });
  };

  return { isPinned, togglePin, isExecuting };
};

export const useToggleResolved = ({
  questionId,
  isResolved: initialIsResolved,
}: {
  questionId: Question["id"];
  isResolved: boolean;
}) => {
  const [isResolved, setIsResolved] = useState(initialIsResolved);

  const { execute, isExecuting } = useAction(updateQuestionAction, {
    onSuccess: () => console.log("success resolve!"),
    onError: (error) => {
      console.error(error);

      toast({
        title: "Đã có lỗi xảy ra",
        description: "Không giải quyết được câu hỏi!",
        variant: "destructive",
      });

      setIsResolved((prevIsResolved) => !prevIsResolved);
    },
  });

  const toggleResolved = () => {
    setIsResolved((prev) => !prev);

    execute({ questionId, isResolved: !isResolved });
  };

  return { isResolved, toggleResolved };
};

export const useVote = ({
  questionId,
  upvotes,
  totalVotes: initialTotalVotes,
}: {
  questionId: Question["id"];
  upvotes: QuestionDetail["upvotes"];
  totalVotes: number;
}) => {
  const { user } = useKindeBrowserClient();

  const [{ isUpvoted, totalVotes }, setClientState] = useState({
    isUpvoted: upvotes.some((upvote) => upvote.authorId === user?.id),
    totalVotes: initialTotalVotes,
  });

  const { execute } = useAction(voteQuestionAction, {
    onError: (error) => {
      console.error(error);

      toggleClientVote();
    },
    onSuccess: () => console.log("Bỏ phiếu thành công!"),
  });

  useEffect(() => {
    setClientState((prev) => ({
      ...prev,
      isUpvoted: upvotes.some((upvote) => upvote.authorId === user?.id),
    }));
  }, [user, upvotes]);

  const toggleClientVote = () => {
    setClientState((prev) => ({
      isUpvoted: !prev.isUpvoted,
      totalVotes: prev.isUpvoted ? prev.totalVotes - 1 : prev.totalVotes + 1,
    }));
  };

  const handleVote = () => {
    toggleClientVote();

    performVote();
  };

  const performVote = useCallback(
    debounce(
      () => {
        execute({ questionId });
      },
      1000,
      { leading: false, trailing: true }
    ),
    [questionId]
  );

  return { isUpvoted, totalVotes, handleVote };
};

export const useUpdateQuestionBody = ({
  questionId,
  body: initialBody,
}: {
  questionId: Question["id"];
  body: Question["body"];
}) => {
  const lastValidBody = useRef(initialBody);
  const [body, setBody] = useState(initialBody);

  const { execute, isExecuting } = useAction(updateQuestionAction, {
    onSuccess: ({ input }) => {
      console.log("Cập nhật nội dung thành công!");

      lastValidBody.current = input.body!;
    },
    onError: (error) => {
      console.error(error);

      toast({
        title: "Có lỗi xảy ra",
        description: "Không cập nhật được nội dung câu hỏi!",
        variant: "destructive",
      });

      setBody(lastValidBody.current);
    },
  });

  const updateBody = (newBody: string) => {
    setBody(newBody);

    execute({ questionId, body: newBody });
  };

  return { body, updateBody, isExecuting };
};
