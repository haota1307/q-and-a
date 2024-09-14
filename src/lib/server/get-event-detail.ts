import "server-only"; // Đảm bảo rằng hàm chỉ được gọi trên server

import { prisma } from "@/lib/prisma/client";
import { eventDetail } from "@/lib/prisma/validators/event-validators";
import { Event, User } from "@prisma/client";
import { cache } from "react";

type Params = {
  ownerId: User["id"];
  eventSlug: Event["slug"];
};

export const getEventDetail = cache(async ({ eventSlug, ownerId }: Params) => {
  return await prisma.event.findUnique({
    where: {
      slug_ownerId: {
        ownerId,
        slug: eventSlug,
      },
    },
    ...eventDetail,
  });
});
