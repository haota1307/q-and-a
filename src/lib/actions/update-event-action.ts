"use server";

import routes from "@/config/routes";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { revalidatePath } from "next/cache";
import { prisma } from "../prisma/client";
import { updateEventSchema } from "../validations/event-schemas";
import { actionClient } from "./safe-action";

export const updateEventAction = actionClient
  .schema(updateEventSchema)
  .action(async ({ parsedInput: { eventId, shortDescription } }) => {
    const user = await getKindeServerSession().getUser();

    if (!user) {
      throw new Error("Người dùng chưa đăng nhập");
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: {
        ownerId: true,
        slug: true,
      },
    });

    if (!event) {
      throw new Error("Không tìm thấy sự kiện!");
    }

    // check the permission
    if (event.ownerId !== user.id) {
      throw new Error("Người dùng không có quyền!");
    }

    // proceed to update the event
    await prisma.event.update({
      where: {
        id: eventId,
      },
      data: {
        shortDescription,
      },
    });

    revalidatePath(
      routes.event({
        ownerId: event.ownerId,
        eventSlug: event.slug,
      })
    );
  });
