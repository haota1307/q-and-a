import routes, { baseUrl } from "@/config/routes";
import { votePollOptionAction } from "@/lib/actions/vote-poll-option-action";
import { PollDetail } from "@/lib/prisma/validators/poll-validators";
import { supabaseClient } from "@/lib/supabase/client";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { Poll, PollOption, User } from "@prisma/client";
import debounce from "lodash.debounce";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { match } from "ts-pattern";

type RealtimeVoteEvent = {
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
    const channel = supabaseClient
      .channel("live-votes")
      .on<RealtimeVoteEvent>(
        "postgres_changes",
        { event: "*", schema: "public", table: "PollVote" },
        ({ old: oldVote, eventType, new: newVote }) => {
          match(eventType)
            .with("INSERT", () => {
              const { authorId, pollId, pollOptionId } =
                newVote as RealtimeVoteEvent;

              console.log(`new vote for option: ${pollOptionId}`);

              // optimistic update will take care of updating the ui
              if (authorId === user?.id) {
                return;
              }

              setPoll((prevPoll) => ({
                ...prevPoll,
                _count: {
                  votes: prevPoll._count.votes + 1,
                },
                options: prevPoll.options.map((option) => {
                  if (option.id === pollOptionId) {
                    return {
                      ...option,
                      // add a new vote
                      votes: [
                        ...option.votes,
                        {
                          authorId,
                          pollId,
                          pollOptionId,
                        },
                      ],
                      // increment the votes count
                      _count: {
                        votes: option._count.votes + 1,
                      },
                    };
                  }

                  return option;
                }),
              }));
            })
            .with("DELETE", () => {
              const { authorId } = oldVote as RealtimeVoteEvent;

              console.log(`vote removed from user: ${authorId}`);

              // we received an update from ourselves
              if (authorId === user?.id) {
                return;
              }

              setPoll((prevPoll) => ({
                ...prevPoll,
                _count: {
                  votes: prevPoll._count.votes - 1,
                },
                options: prevPoll.options.map((option) => {
                  const wasVotedByUser = option.votes.some(
                    (vote) => vote.authorId === authorId
                  );

                  if (wasVotedByUser) {
                    return {
                      ...option,
                      // remove the votes
                      votes: option.votes.filter(
                        (vote) => vote.authorId !== authorId
                      ),
                      // decrement the votes count
                      _count: {
                        votes: option._count.votes - 1,
                      },
                    };
                  }

                  return option;
                }),
              }));
            });
        }
      )
      .subscribe((status, error) => {
        console.log(`${status}: ${error}`);
      });

    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, [user?.id]);

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
