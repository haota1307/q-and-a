import "server-only"; // Đảm bảo rằng hàm chỉ được gọi trên server

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { cache } from "react";
import { prisma } from "@/lib/prisma/client";
import { eventDetail } from "@/lib/prisma/validators/event-validators";
import { Event } from "@prisma/client";

type Params = {
  cursor?: Event["id"];
};

/**
 * Lấy ra các event của người dùng
 */
export const getUserEvents = cache(async ({ cursor }: Params = {}) => {
  const user = await getKindeServerSession().getUser();

  console.log(user);

  if (!user || !user.id) {
    throw new Error("Not authenticated");
  }

  return await prisma.event.findMany({
    where: {
      ownerId: user.id,
    },
    ...eventDetail,
    take: 20,
    skip: cursor ? 1 : 0,
    ...(cursor ? { cursor: { id: cursor } } : {}),
    orderBy: {
      createdAt: "desc",
    },
  });
});
