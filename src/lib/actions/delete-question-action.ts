"use server";

import routes from "@/config/routes";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { revalidatePath } from "next/cache";
import { prisma } from "../prisma/client";
import { getQuestionSchema } from "../validations/question-schemas";
import { actionClient } from "./safe-action";

export const deleteQuestionAction = actionClient
  .schema(getQuestionSchema)
  .action(async ({ parsedInput: { questionId } }) => {
    const user = await getKindeServerSession().getUser();

    if (!user) {
      throw new Error("Người dùng chưa đăng nhập!");
    }

    const question = await prisma.question.findUnique({
      where: {
        id: questionId,
      },
      select: {
        event: {
          select: {
            ownerId: true,
            slug: true,
          },
        },
        authorId: true,
      },
    });

    if (!question) {
      throw new Error("Câu hỏi không tồn tại");
    }

    // check for the user permission (event owner or author)
    if (question.event.ownerId !== user.id && question.authorId !== user.id) {
      throw new Error("Bạn không có quyền cập nhật câu hỏi này.");
    }

    // delete question
    await prisma.question.delete({
      where: {
        id: questionId,
      },
    });

    // to refresh the UI
    revalidatePath(
      routes.event({
        eventSlug: question.event.slug,
        ownerId: question.event.ownerId,
      })
    );
  });
