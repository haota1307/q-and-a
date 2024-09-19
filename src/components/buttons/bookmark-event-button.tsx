"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "@/components/ui/use-toast";
import { EventDetail } from "@/lib/prisma/validators/event-validators";
import { LoginLink, useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import debounce from "lodash.debounce";
import { useAction } from "next-safe-action/hooks";
import { bookmarkEventAction } from "@/lib/actions/bookmark-event-action";

type Props = {
  event: EventDetail;
};

const BookmarkEventButton = ({ event }: Props) => {
  const { user } = useKindeBrowserClient();

  const [isBookmarked, setIsBookmarked] = useState(false);

  const isParticipantView = false;

  const { execute } = useAction(bookmarkEventAction, {
    onError: (err) => {
      console.error(err);

      // revert the optimistic update
      toggleClientBookmark();
    },
    onSuccess: () => console.log("Success bookmark!"),
  });

  useEffect(() => {
    setIsBookmarked(
      event.bookmarkedBy.some((bookmarkUser) => bookmarkUser.id === user?.id)
    );
  }, [event.bookmarkedBy, user?.id]);

  const toggleClientBookmark = () => {
    const wasBookmarked = isBookmarked;

    setIsBookmarked((prev) => !prev);

    toast({
      title: "Thông báo 🔊🔊🔊",
      description: wasBookmarked
        ? "🗑️🗑️🗑️ Đã xóa khỏi danh sách đánh dấu"
        : "✅✅✅ Đã thêm vào danh sách đánh dấu",
    });
  };

  const performBookmark = useCallback(
    debounce(
      () => {
        execute({ eventId: event.id });
      },
      1000,
      { leading: false, trailing: true }
    ),
    [event.id]
  );

  const handleBookmark = () => {
    toggleClientBookmark();

    performBookmark();
  };

  if (isParticipantView) {
    return null;
  }

  if (!user) {
    return (
      <LoginLink>
        <Button variant={"outline"} className="rounded-full">
          <Bookmark className="size-4" />
        </Button>
      </LoginLink>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={handleBookmark}
            variant={"outline"}
            className="rounded-full"
          >
            {isBookmarked ? (
              <BookmarkCheck className="size-4" />
            ) : (
              <Bookmark className="size-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent className="bg-black text-white text-sm">
          {isBookmarked ? "Hủy đánh dấu" : "Đánh dấu"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default BookmarkEventButton;
