"use client";
import {
  pollsPageQueryParams,
  questionsPageQueryParams,
} from "@/config/queryParams";
import routes from "@/config/routes";
import { NotificationDetail } from "@/lib/prisma/validators/notification-validators";
import { defaultDateFormatter } from "@/lib/utils/date-utils";
import { PropsWithClassName } from "@/lib/utils/ui-utils";
import { Bell } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { match } from "ts-pattern";
import { buttonVariants } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useNotifications } from "@/hooks/useNotifications";

type Props = PropsWithClassName<{
  initialNotifications: NotificationDetail[];
}>;

export const NotificationsMenu = ({
  className,
  initialNotifications,
}: Props) => {
  const [isOpen, setOpen] = useState(false);

  const {
    notifications,
    showDot,
    setShowDot,
    hasMoreNotifications,
    loadMoreNotifications,
    markNotificationAsRead,
  } = useNotifications({
    initialNotifications,
  });

  const handleOpenNotification = () => setOpen(false);
  const handleMenuOpen = (open: boolean) => {
    if (open) {
      setShowDot(false);
    }
    setOpen(open);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={handleMenuOpen}>
      <DropdownMenuTrigger className="relative focus:outline-none">
        <Bell className={className} />
        {showDot && (
          <div className="absolute right-0 top-0 rounded-full bg-red-500 w-[8px] h-[8px]" />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="py-4 px-2 space-y-1 w-[300px] h-[300px] overflow-auto">
        <DropdownMenuLabel className="inline-flex items-center gap-x-1">
          <span>Thông báo</span>
          <Bell className="w-4 h-4" />
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {/* List of notifications */}
        <NotificationsList
          notifications={notifications}
          hasMoreNotifications={hasMoreNotifications}
          onOpenNotification={handleOpenNotification}
          onReadNotification={markNotificationAsRead}
          loadMoreNotifications={loadMoreNotifications}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const NotificationsList = ({
  notifications,
  hasMoreNotifications,
  loadMoreNotifications,
  onOpenNotification,
  onReadNotification,
}: {
  notifications: NotificationDetail[];
  hasMoreNotifications: boolean;
  loadMoreNotifications: () => void;
  onReadNotification: (notification: NotificationDetail) => void;
  onOpenNotification: (notification: NotificationDetail) => void;
}) => {
  const handleOpenNotification = (notification: NotificationDetail) => {
    onReadNotification(notification);
    onOpenNotification(notification);
  };

  return (
    <div className="space-y-1">
      {/* Empty notifications */}
      {notifications.length === 0 && (
        <p className="text-sm">Không có thông báo để hiển thị!</p>
      )}
      {notifications.map((notification) => (
        <React.Fragment key={notification.id}>
          <NotificationItem
            notification={notification}
            onOpen={() => handleOpenNotification(notification)}
          />
        </React.Fragment>
      ))}

      {hasMoreNotifications && (
        <div className="flex items-center">
          <button
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "text-xs text-violet-500 mx-auto"
            )}
            onClick={loadMoreNotifications}
          >
            Tải thêm
          </button>
        </div>
      )}
    </div>
  );
};

const NotificationItem = ({
  notification,
  onOpen: handleOpen,
}: {
  notification: NotificationDetail;
  onOpen: () => void;
}) => {
  const label = match(notification.type)
    .with("NEW_QUESTION", () => "Bạn có một câu hỏi mới 🗣️")
    .with("QUESTION_RESOLVED", () => "Câu hỏi của bạn đã được giải quyết ✅")
    .with(
      "QUESTION_PINNED",
      () => "Câu hỏi của bạn đã được ghim bởi chủ sở hữu 📌"
    )
    .with("QUESTION_UPVOTE", () => "Câu hỏi của bạn đã được upvote 👍🏻")
    .with(
      "POLL_CLOSED",
      () => "Một cuộc thăm dò bạn đã bỏ phiếu đã được đánh dấu là đã kết thúc."
    )
    .exhaustive();
  const linkHref = match(notification.type)
    .with(
      "NEW_QUESTION",
      "QUESTION_PINNED",
      "QUESTION_UPVOTE",
      () => `
        ${routes.event({
          eventSlug: notification.event.slug,
          ownerId: notification.event.ownerId,
        })}?${questionsPageQueryParams.questionId}=${notification.questionId}
        `
    )
    .with(
      "QUESTION_RESOLVED",
      () => `
  ${routes.event({
    eventSlug: notification.event.slug,
    ownerId: notification.event.ownerId,
  })}?${questionsPageQueryParams.questionId}=${notification.questionId}&${
        questionsPageQueryParams.resolved
      }=true
  `
    )
    .with(
      "POLL_CLOSED",
      () => `
    ${routes.eventPolls({
      eventSlug: notification.event.slug,
      ownerId: notification.event.ownerId,
    })}?${pollsPageQueryParams.pollId}=${notification.pollId}&${
        pollsPageQueryParams.closed
      }=true
        `
    )
    .exhaustive();

  return (
    <DropdownMenuItem>
      <Link
        href={linkHref}
        prefetch={false}
        onClick={handleOpen}
        className={cn(
          "w-full flex flex-col items-start h-[48px] px-2 gap-y-1",
          {
            "border-l border-l-violet-500": !notification.read,
          }
        )}
      >
        <div className="inline-flex items-center">
          <p
            className={cn("text-xs", {
              "font-semibold": !notification.read,
            })}
          >
            {label}
          </p>
        </div>
        <time className="text-[8px] font-light">
          {defaultDateFormatter.format(notification.createdAt)}
        </time>
      </Link>
    </DropdownMenuItem>
  );
};
