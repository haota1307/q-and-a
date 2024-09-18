import routes, { baseUrl } from "@/config/routes";
import { votePollOptionAction } from "@/lib/actions/vote-poll-option-action";
import { PollDetail } from "@/lib/prisma/validators/poll-validators";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { Poll, PollOption, User } from "@prisma/client";
import debounce from "lodash.debounce";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

type VoteEvent = {
  pollId: Poll["id"];
  authorId: User["id"];
  pollOptionId: PollOption["id"];
};

export const useLivePoll = ({ poll: initialPoll }: { poll: PollDetail }) => {
  const { user } = useKindeBrowserClient();

  const router = useRouter();

  const [poll, setPoll] = useState<PollDetail>(initialPoll);
  const [votedOptionIndex, setVotedOptionIndex] = useState<
    number | undefined
  >();

  const { execute: executeVote } = useAction(votePollOptionAction, {
    onSuccess: () => console.log("Bình chọn thành công"),
    onError: (error) => {
      console.log("votePollOptionAction: ", error);
    },
  });

  const voteOption = (newVoteOptionIndex: number) => {
    if (!user) {
      return router.replace(
        `${
          routes.register
        }?post_login_redirect_url=${baseUrl}${routes.eventPolls({
          eventSlug: poll.event.slug,
          ownerId: poll.event.ownerId,
        })}`
      );
    }

    const hasVoted = votedOptionIndex !== null;
    const oldVotedOptionIndex = votedOptionIndex;

    if (newVoteOptionIndex === oldVotedOptionIndex) {
      return;
    }

    const updatedPoll: PollDetail = {
      ...poll,
      _count: {
        votes: hasVoted ? poll._count.votes : poll._count.votes + 1,
      },
      options: poll.options.map((option) => {
        if (option.index === newVoteOptionIndex) {
          return {
            ...option,
            _count: {
              votes: option._count.votes + 1,
            },
          };
        }

        if (option.index === oldVotedOptionIndex) {
          return {
            ...option,
            _count: {
              votes: option._count.votes - 1,
            },
          };
        }

        return option;
      }),
    };
    setPoll(updatedPoll);
    setVotedOptionIndex(newVoteOptionIndex);

    performVote(newVoteOptionIndex);
  };

  useEffect(() => {
    const votedOptionIndex = initialPoll.options.find((option) =>
      option.votes.some((vote) => vote.authorId === user?.id)
    )?.index;

    setVotedOptionIndex(votedOptionIndex);
  }, [initialPoll.options, user?.id]);

  const performVote = useCallback(
    debounce(
      (newVoteOptionIndex: number) => {
        executeVote({ pollId: poll.id, optionIndex: newVoteOptionIndex });
      },
      300,
      { leading: false, trailing: true }
    ),
    [poll.id]
  );

  return {
    poll,
    votedOptionIndex,
    voteOption,
  };
};
