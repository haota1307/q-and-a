import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    transactionOptions: {
      maxWait: 5000, // 5s
      timeout: 10000, // 10s
    },
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
