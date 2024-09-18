"use server";

import routes from "@/config/routes";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { revalidatePath } from "next/cache";
import { prisma } from "../prisma/client";
import { createLivePollSchema } from "../validations/poll-schemas";
import { actionClient, CustomError } from "./safe-action";

export const createLivePollAction = actionClient
  .schema(createLivePollSchema)
  .action(async ({ parsedInput: { body, eventId, options } }) => {
    const user = await getKindeServerSession().getUser();

    if (!user) {
      throw new Error("Not authenticated");
    }

    // find the event
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: {
        ownerId: true,
        slug: true,
        _count: {
          select: {
            polls: {
              where: { isLive: true },
            },
          },
        },
      },
    });

    if (!event) {
      throw new CustomError("Không tìm thấy sự kiện!");
    }

    // only the event owner can create a new poll
    if (event.ownerId !== user.id) {
      throw new CustomError(
        "Bạn không có quyền tạo cuộc thăm dò cho sự kiện này."
      );
    }

    // only one live poll is allowed per event
    if (event._count.polls > 0) {
      throw new CustomError(
        "Đã có một cuộc thăm dò trực tiếp đang hoạt động cho sự kiện này."
      );
    }

    // create the poll
    await prisma.poll.create({
      data: {
        body,
        isLive: true,
        event: {
          connect: {
            id: eventId,
          },
        },
        options: {
          createMany: {
            data: options.map((option, index) => ({
              body: option,
              index,
            })),
          },
        },
      },
    });

    revalidatePath(
      routes.eventPolls({
        eventSlug: event.slug,
        ownerId: event.ownerId,
      })
    );
  });
