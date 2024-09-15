import { createSafeActionClient } from "next-safe-action";

export class CustomError extends Error {}

export const actionClient = createSafeActionClient({
  handleServerError: (error) => {
    if (error instanceof CustomError) {
      return error.message;
    }

    return "Có lỗi xảy ra khi thực hiện thao tác.";
  },
});
