import { createLivePollAction } from "@/lib/actions/create-live-poll-action";
import { poll } from "@/lib/validations/constants";
import {
  createLivePollSchema,
  CreateLivePollSchema,
} from "@/lib/validations/poll-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Event } from "@prisma/client";
import { Plus, Trash } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";

import { Button } from "../ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

import { toast } from "../ui/use-toast";
import TextAreaWithCounter from "@/components/text-area-with-counter";
import { Input } from "@/components/ui/input";

type Props = {
  eventId: Event["id"];
  onSuccess?: () => void;
};

export const CreatePollForm = ({
  eventId,
  onSuccess: handleSuccess,
}: Props) => {
  const form = useForm<CreateLivePollSchema>({
    resolver: zodResolver(createLivePollSchema),
    defaultValues: {
      body: "",
      options: ["lựa chọn 1", "lựa chọn 2"],
      eventId,
    },
    mode: "onSubmit",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    // @ts-ignore
    name: "options",
  });

  const { execute, isExecuting } = useAction(createLivePollAction, {
    onError: (err) => {
      console.error(err);

      toast({
        title: "Đã xảy ra lỗi",
        description: `Không thể tạo cuộc bình chọn. ${err.error.serverError}`,
        variant: "destructive",
      });
    },
    onSuccess: () => {
      handleSuccess?.();

      toast({
        title: "Cuộc bình chọn của bạn đã được tạo 🎉",
      });
    },
    onSettled: () => form.reset(),
  });

  const onSubmit = async (values: CreateLivePollSchema) => execute(values);

  const isFieldDisabled = form.formState.isSubmitting || isExecuting;

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          name="body"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Câu hỏi</FormLabel>

              <FormControl>
                <TextAreaWithCounter
                  disabled={isFieldDisabled}
                  placeholder="ví dụ: Màu sắc yêu thích của bạn là gì?"
                  maxLength={poll.body.maxLength}
                  {...field}
                />
              </FormControl>

              <FormMessage className="error-msg">
                {form.formState.errors.body?.message}
              </FormMessage>
            </FormItem>
          )}
        />

        <div role="list" className="mt-8 space-y-4">
          <FormLabel className="block">
            Lựa chọn (tối đa {poll.options.maxCount})
          </FormLabel>

          <FormMessage className="error-msg">
            {form.formState.errors.options?.root?.message}
          </FormMessage>

          {fields.map((field, index) => (
            <FormField
              key={field.id}
              name={`options.${index}`}
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex gap-x-2 items-center">
                      <span className="grow-0">{index + 1}.</span>

                      <Input
                        placeholder="ví dụ: Màu xanh"
                        maxLength={poll.options.maxLength}
                        {...field}
                      />

                      <Button
                        size={"sm"}
                        type="button"
                        variant={"outline"}
                        disabled={isFieldDisabled}
                        onClick={() => remove(index)}
                      >
                        <Trash size={12} />
                      </Button>
                    </div>
                  </FormControl>

                  <FormMessage className="error-msg">
                    {form.formState.errors.options?.[index]?.message}
                  </FormMessage>
                </FormItem>
              )}
            />
          ))}

          <Button
            type="button"
            variant={"outline"}
            size={"sm"}
            disabled={isFieldDisabled || fields.length >= poll.options.maxCount}
            className="mt-4"
            onClick={() => append(`lựa chọn ${fields.length + 1}`)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Thêm lựa chọn
          </Button>
        </div>

        <Button
          disabled={isFieldDisabled}
          type="submit"
          className="w-full mt-10"
        >
          {isExecuting ? "Đang tạo cuộc bình chọn..." : "Tạo cuộc bình chọn"}
        </Button>
      </form>
    </FormProvider>
  );
};
