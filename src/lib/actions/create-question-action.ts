"use server";

import { actionClient } from "@/lib/actions/safe-action";
import { prisma } from "@/lib/prisma/client";
import { questionDetail } from "@/lib/prisma/validators/question-validators";
import { createQuestionSchema } from "@/lib/validations/question-schemas";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export const createQuestionAction = actionClient
  .schema(createQuestionSchema)
  .action(async ({ parsedInput: { body, ownerId, eventSlug } }) => {
    const user = await getKindeServerSession().getUser();

    if (!user) {
      throw new Error("Người dùng chưa đăng nhập");
    }

    const event = await prisma.event.findUnique({
      where: {
        slug_ownerId: {
          ownerId,
          slug: eventSlug,
        },
      },
    });

    if (!event) {
      throw new Error("Sự kiện không tồn tại!");
    }

    const [newQuestion] = await prisma.$transaction([
      prisma.question.create({
        data: {
          body,
          authorId: user.id,
          eventId: event.id,
          ...(event.ownerId !== user.id
            ? {
                notifications: {
                  create: {
                    type: "NEW_QUESTION",
                    userId: event.ownerId,
                    eventId: event.id,
                  },
                },
              }
            : {}),
        },
        ...questionDetail,
      }),

      // Nếu người dùng chưa tồn tại thì tạo, nếu có thì cập nhật
      prisma.eventParticipant.upsert({
        where: {
          eventId_userId: {
            eventId: event.id,
            userId: user.id,
          },
        },
        create: {
          eventId: event.id,
          userId: user.id,
        },
        update: {},
      }),
    ]);

    return newQuestion;
  });

//6:08:44
