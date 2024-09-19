"use server";

import routes from "@/config/routes";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { revalidatePath } from "next/cache";
import { prisma } from "../prisma/client";
import { getPollSchema } from "../validations/poll-schemas";
import { actionClient } from "./safe-action";

export const deletePollAction = actionClient
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
            ownerId: true,
            slug: true,
          },
        },
      },
    });

    if (!poll) {
      throw new Error("Không tìm thấy cuộc bình chọn!");
    }

    // check the permission
    if (poll.event.ownerId !== user.id) {
      throw new Error("Bạn không có quyền xóa cuộc bình chọn này");
    }

    // delete the poll
    await prisma.poll.delete({
      where: {
        id: pollId,
      },
    });

    revalidatePath(
      routes.eventPolls({
        eventSlug: poll.event.slug,
        ownerId: poll.event.ownerId,
      })
    );
  });
