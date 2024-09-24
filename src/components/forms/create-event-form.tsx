"use client";

import { createEventAction } from "@/lib/actions/create-event-action";
import { event as eventValidation } from "@/lib/validations/constants";
import {
  createEventSchema,
  CreateEventSchema,
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
  onSuccess?: () => void;
};

export const CreateEventForm = ({ onSuccess: handleSuccess }: Props) => {
  const form = useForm<CreateEventSchema>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      title: "",
    },
    mode: "onSubmit",
  });

  const { execute, isExecuting } = useAction(createEventAction, {
    onError: () => {
      toast({
        title: "Có lỗi xảy ra",
        description: "Tạo sự kiện thất bại!",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      handleSuccess?.();

      toast({ title: "Sự kiện của bạn đã được tạo 🎉" });
    },
    onSettled: () => form.reset(),
  });

  const isFieldDisabled = form.formState.isSubmitting || isExecuting;

  const onSubmit = async (values: CreateEventSchema) => execute(values);

  return (
    <FormProvider {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          name="title"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên sự kiện</FormLabel>

              <FormControl>
                <Input
                  type="text"
                  disabled={isFieldDisabled}
                  placeholder="ví dụ: Chuyến du lịch mùa hè"
                  maxLength={eventValidation.displayName.maxLength}
                  {...field}
                />
              </FormControl>

              <FormMessage className="error-msg">
                {form.formState.errors.title?.message}
              </FormMessage>
            </FormItem>
          )}
        />

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
          {isExecuting ? "Đang tạo sự kiện..." : "Tạo sự kiện"}
        </Button>
      </form>
    </FormProvider>
  );
};
