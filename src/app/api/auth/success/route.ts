import { prisma } from "@/lib/prisma/client";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { faker } from "@faker-js/faker";
import colors from "tailwindcss/colors";
import { NextResponse } from "next/server";
import routes, { baseUrl } from "@/app/config/routes";

// Will run every time a user sign up or sign in
export async function GET() {
  const { getUser } = getKindeServerSession();

  const user = await getUser();

  if (!user || !user.id) {
    throw new Error(`Có lỗi xảy ra với xác thực người dùng: ${user}`);
  }

  let dbUser = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
  });

  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: {
        id: user.id,
        displayName:
          user.username ?? user.given_name ?? faker.internet.userName(),
        email: user.email!,
        color: faker.helpers.arrayElement([
          colors.emerald["500"],
          colors.yellow["500"],
          colors.green["500"],
          colors.pink["500"],
          colors.purple["500"],
          colors.red["500"],
          colors.amber["500"],
        ]),
      },
    });
  }

  return NextResponse.redirect(`${baseUrl}${routes.dashboard}`);
}
