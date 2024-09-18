import { z } from "zod";
import { poll } from "./constants";
import { eventIdSchema } from "./event-schemas";

export const pollIdSchema = z.string().cuid();

export const votePollOptionSchema = z.object({
  pollId: pollIdSchema,
  optionIndex: z
    .number()
    .min(0)
    .max(poll.options.maxCount - 1),
});

export const getPollSchema = z.object({ pollId: pollIdSchema });

export const createLivePollSchema = z.object({
  eventId: eventIdSchema,
  body: z
    .string()
    .min(poll.body.minLength, {
      message: `Nội dung cuộc bình chọn phải có ít nhất ${poll.body.minLength} ký tự`,
    })
    .max(poll.body.maxLength, {
      message: `Nội dung cuộc bình chọn không vượt quá ${poll.body.minLength} ký tự`,
    }),
  options: z.array(
    z
      .string()
      .min(poll.options.minLength, {
        message: `Tùy chọn cuộc bình chọn phải có ít nhất ${poll.options.minLength} ký tự`,
      })
      .max(poll.options.maxLength, {
        message: `Tùy chọn cuộc bình chọn không vượt quá ${poll.options.minLength} ký tự`,
      })
  ),
});

export type VotePollSchema = z.infer<typeof votePollOptionSchema>;
export type CreateLivePollSchema = z.infer<typeof createLivePollSchema>;
export type GetPollSchema = z.infer<typeof getPollSchema>;
