import "server-only"; // chỉ thị chỉ nên tồn tại và chạy trên phía server

import { prisma } from "@/lib/prisma/client";
import { User } from "@prisma/client";

export const getUserInfo = async (userId: User["id"]) => {
  const user = prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      _count: {
        select: {
          events: true,
          questions: true,
          participations: true,
          bookmarks: true,
        },
      },
    },
  });
  return user;
};
