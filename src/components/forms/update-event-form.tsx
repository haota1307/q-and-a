"use client";

import { updateEventAction } from "@/lib/actions/update-event-action";
import { EventDetail } from "@/lib/prisma/validators/event-validators";
import { event as eventValidation } from "@/lib/validations/constants";
import {
  updateEventSchema,
  UpdateEventSchema,
} from "@/lib/validations/event-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { FormProvider, useForm } from "react-hook-form";

import { Button } from "../ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { toast } from "../ui/use-toast";
import TextAreaWithCounter from "@/components/text-area-with-counter";

type Props = {
  event: EventDetail;
  onSuccess?: () => void;
};

export const UpdateEventForm = ({ event, onSuccess: handleSuccess }: Props) => {
  const form = useForm<UpdateEventSchema>({
    resolver: zodResolver(updateEventSchema),
    defaultValues: {
      eventId: event.id,
      shortDescription: event.shortDescription ?? undefined,
    },
    mode: "onSubmit",
  });

  const { execute, isExecuting } = useAction(updateEventAction, {
    onError: () => {
      toast({
        title: "Có lỗi xảy ra",
        description: "Không thể cập nhật sự kiện!",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      handleSuccess?.();

      toast({ title: "Sự kiện của bạn đã được cập nhật 🎉" });
    },
    onSettled: () => form.reset(),
  });

  const isFieldDisabled = form.formState.isSubmitting || isExecuting;

  const onSubmit = async (values: UpdateEventSchema) => execute(values);

  return (
    <FormProvider {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <FormItem>
          <FormLabel>Tên sự kiện</FormLabel>

          <Input type="text" value={event.displayName} disabled />
        </FormItem>

        <FormField
          name="shortDescription"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mô tả sự kiện</FormLabel>

              <FormControl>
                <TextAreaWithCounter
                  disabled={isFieldDisabled}
                  placeholder="Sự kiện của bạn là gì?"
                  maxLength={eventValidation.shortDescription.maxLength}
                  defaultValue={event.shortDescription ?? ""}
                  {...field}
                />
              </FormControl>

              <FormMessage className="error-msg">
                {form.formState.errors.shortDescription?.message}
              </FormMessage>
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full mt-10"
          disabled={isFieldDisabled}
        >
          {isExecuting ? "Đang cập nhật sự kiện..." : "Cập nhật sự kiện"}
        </Button>
      </form>
    </FormProvider>
  );
};
