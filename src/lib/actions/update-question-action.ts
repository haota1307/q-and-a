"use server";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "../prisma/client";
import { actionClient } from "@/lib/actions/safe-action";
import { updateQuestionSchema } from "@/lib/validations/question-schemas";

export const updateQuestionAction = actionClient
  .schema(updateQuestionSchema)
  .action(async ({ parsedInput: { questionId, ...fields } }) => {
    const user = await getKindeServerSession().getUser();

    if (!user) {
      throw new Error("Người dùng chưa đăng nhập!!");
    }

    // find the question
    const question = await prisma.question.findUnique({
      where: {
        id: questionId,
      },
      select: {
        event: {
          select: {
            id: true,
            ownerId: true,
            slug: true,
          },
        },
        authorId: true,
      },
    });

    if (!question) {
      throw new Error("Không tìm thấy câu hỏi!");
    }

    // check the user permission (either the event owner or the author)
    if (question.event.ownerId !== user.id && question.authorId !== user.id) {
      throw new Error("Bạn không có quyền cập nhật câu hỏi này.");
    }

    // update the question, create notification for the question author
    await prisma.$transaction([
      // update the question
      prisma.question.update({
        where: {
          id: questionId,
        },
        data: fields,
      }),
      // send a notifications to the questions author
      ...[
        fields.isResolved === true && question.authorId !== user.id
          ? prisma.notification.create({
              data: {
                type: "QUESTION_RESOLVED",
                questionId,
                userId: question.authorId,
                eventId: question.event.id,
              },
            })
          : [],
        fields.isPinned === true && question.authorId !== user.id
          ? prisma.notification.create({
              data: {
                type: "QUESTION_PINNED",
                questionId,
                userId: question.authorId,
                eventId: question.event.id,
              },
            })
          : [],
      ].flatMap((tr) => tr),
    ]);

    return {
      questionId,
      ...fields,
    };
  });
