import { z } from "zod";
import { question } from "./constants";
import { eventPublicIdSchema } from "./event-schemas";

export const questionIdSchema = z.string().cuid();

export const questionBodySchema = z
  .string()
  .min(question.minLength, {
    message: `Nội dung câu hỏi phải có ít nhất ${question.minLength} ký tự.`,
  })
  .max(question.maxLength, {
    message: `Nội dung câu hỏi không được vượt quá ${question.maxLength} ký tự.`,
  });

export const questionOrderBySchema = z.enum([
  "newest",
  "oldest",
  "most-popular",
]);

export const createQuestionSchema = z
  .object({
    body: questionBodySchema,
  })
  .merge(eventPublicIdSchema);

export const updateQuestionSchema = z.object({
  questionId: questionIdSchema,
  body: questionBodySchema.optional(),
  isResolved: z.boolean().optional(),
  isPinned: z.boolean().optional(),
});

export const getQuestionSchema = z.object({
  questionId: questionIdSchema,
});

export type CreateQuestionSchema = z.infer<typeof createQuestionSchema>;
export type UpdateQuestionSchema = z.infer<typeof updateQuestionSchema>;
export type GetQuestionSchema = z.infer<typeof getQuestionSchema>;
