"use server";

import { z } from "zod";
import { actionClient } from "./safe-action";
import { getUserNotifications } from "@/lib/server/get-user-notifications";
import { notificationIdSchema } from "@/lib/validations/notification-schemas";

export const getUserNotificationsAction = actionClient
  .schema(
    z.object({
      cursor: notificationIdSchema.optional(),
    })
  )
  .action(async ({ parsedInput: { cursor } }) =>
    getUserNotifications({ cursor })
  );
