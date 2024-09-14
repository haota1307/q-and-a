import { event } from "@/lib/validations/constants";
import { z } from "zod";

// Xác thực ID sự kiện với định dạng CUID
export const eventIdSchema = z.string().cuid();

// Xác thực slug sự kiện
export const eventSlugSchema = z
  .string()
  .min(event.slug.minLength, {
    message: `Slug sự kiện phải có ít nhất ${event.slug.minLength} ký tự.`,
  })
  .max(event.slug.maxLength, {
    message: `Slug sự kiện không được vượt quá ${event.slug.maxLength} ký tự.`,
  });

// Xác thực mô tả ngắn của sự kiện
export const shortDescriptionSchema = z
  .string()
  .min(event.shortDescription.minLength, {
    message: `Mô tả ngắn của sự kiện phải có ít nhất ${event.shortDescription.minLength} ký tự.`,
  })
  .max(event.shortDescription.maxLength, {
    message: `Mô tả ngắn của sự kiện không được vượt quá ${event.shortDescription.maxLength} ký tự.`,
  });

// Xác thực dữ liệu tạo sự kiện
export const createEventSchema = z.object({
  title: z
    .string()
    .min(event.displayName.minLength, {
      message: `Tiêu đề sự kiện phải có ít nhất ${event.displayName.minLength} ký tự.`,
    })
    .max(event.displayName.maxLength, {
      message: `Tiêu đề sự kiện không được vượt quá ${event.displayName.maxLength} ký tự.`,
    }),
  shortDescription: shortDescriptionSchema,
});

// Xác thực dữ liệu cập nhật sự kiện
export const updateEventSchema = z.object({
  eventId: eventIdSchema,
  shortDescription: shortDescriptionSchema,
});

// Xác thực dữ liệu xóa sự kiện
export const deleteEventSchema = z.object({
  eventId: eventIdSchema,
});

// Xác thực ID công khai của sự kiện
export const eventPublicIdSchema = z.object({
  ownerId: z.string().min(35), // chiều dài ID người dùng
  eventSlug: eventSlugSchema,
});

// Các kiểu dữ liệu dựa trên các schema
export type CreateEventSchema = z.infer<typeof createEventSchema>;
export type UpdateEventSchema = z.infer<typeof updateEventSchema>;
export type DeleteEventSchema = z.infer<typeof deleteEventSchema>;
