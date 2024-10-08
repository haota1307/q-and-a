"use server";

import routes from "@/config/routes";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { revalidatePath } from "next/cache";
import { prisma } from "../prisma/client";
import { getPollSchema } from "../validations/poll-schemas";
import { actionClient } from "./safe-action";

export const closePollAction = actionClient
  .schema(getPollSchema)
  .action(async ({ parsedInput: { pollId } }) => {
    const user = await getKindeServerSession().getUser();

    if (!user) {
      throw new Error("Người dùng chưa đăng nhập");
    }

    const poll = await prisma.poll.findUnique({
      where: { id: pollId },
      select: {
        event: {
          select: {
            id: true,
            slug: true,
            ownerId: true,
          },
        },
        // retrieve all the voters of the poll
        votes: {
          select: {
            authorId: true,
          },
        },
      },
    });

    if (!poll) {
      throw new Error("Không tìm thấy cuộc bình chọn!");
    }

    // check the permission
    if (poll.event.ownerId !== user.id) {
      throw new Error("Bạn không có quyền đóng cuộc bình chọn này.");
    }

    await prisma.poll.update({
      where: {
        id: pollId,
      },
      data: {
        isLive: false,
        notifications: {
          createMany: {
            data: poll.votes
              .filter(({ authorId }) => authorId !== user.id)
              .map(({ authorId }) => ({
                type: "POLL_CLOSED",
                userId: authorId,
                eventId: poll.event.id,
              })),
          },
        },
      },
    });

    revalidatePath(
      routes.eventPolls({
        eventSlug: poll.event.slug,
        ownerId: poll.event.ownerId,
      })
    );
  });
