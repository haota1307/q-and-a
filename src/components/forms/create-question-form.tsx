import { QuestionDetail } from "@/lib/prisma/validators/question-validators";
import {
  createQuestionSchema,
  CreateQuestionSchema,
} from "@/lib/validations/question-schemas";
import { Event, User } from "@prisma/client";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import TextAreaWithCounter from "@/components/text-area-with-counter";
import { question } from "@/lib/validations/constants";
import { LoginLink, useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { Button, buttonVariants } from "@/components/ui/button";
import { ChatBubbleIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import routes, { baseUrl } from "@/config/routes";
import { useAction } from "next-safe-action/hooks";
import { createQuestionAction } from "@/lib/actions/create-question-action";
import { toast } from "@/components/ui/use-toast";

type Props = {
  ownerId: User["id"];
  eventSlug: Event["slug"];
  onSuccess: (data: QuestionDetail) => void;
};

const CreateQuestionForm = ({
  eventSlug,
  onSuccess: handleSuccess,
  ownerId,
}: Props) => {
  const { isAuthenticated } = useKindeBrowserClient();

  const form = useForm<CreateQuestionSchema>({
    resolver: zodResolver(createQuestionSchema),
    defaultValues: {
      body: "",
      eventSlug,
      ownerId,
    },
    mode: "onSubmit",
  });

  const { execute, isExecuting } = useAction(createQuestionAction, {
    onSuccess: ({ data }) => {
      if (data) {
        handleSuccess(data);
      }
      toast({
        title: "Thông báo 🔊🔊🔊",
        description: "Câu hỏi của bạn đã được đăng tải! 🎉🎉🎉",
      });
    },
    onError: () => {
      toast({
        title: "Có lỗi xảy ra 😓😓😓",
        description:
          "Câu hỏi của bạn không thể đăng tải, vui lòng thử lại 😊😊😊",
      });
    },
    onSettled: () => form.reset(),
  });

  const isFieldDisabled = form.formState.isSubmitting || isExecuting;

  const onSubmit = async (values: CreateQuestionSchema) => execute(values);

  return (
    <FormProvider {...form}>
      <form
        className="py-2 px-3 border border-dashed border-primary/60 rounded-lg"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          name="body"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Câu hỏi của bạn</FormLabel>
              <FormControl>
                <TextAreaWithCounter
                  disabled={isFieldDisabled}
                  placeholder="Bạn muốn hỏi về điều gì?"
                  maxLength={question.maxLength}
                  {...field}
                />
              </FormControl>
              <FormMessage className="error-msg">
                {form.formState.errors.body?.message}
              </FormMessage>
            </FormItem>
          )}
        />

        <div className="flex justify-end -mt-3">
          <div className="flex justify-end">
            {isAuthenticated ? (
              <Button type="submit" size={"lg"} disabled={isFieldDisabled}>
                <ChatBubbleIcon className="size-4 mr-2" />
                <span className="text-xs lg:text-sm">
                  {isExecuting ? "Đang tạo..." : "Hỏi"}
                </span>
              </Button>
            ) : (
              <LoginLink
                className={cn(
                  buttonVariants({ variant: "default", size: "lg" })
                )}
              >
                <Button>
                  <ChatBubbleIcon className="size-4 mr-2" />
                  <span className="text-xs lg:text-sm">Hỏi</span>
                </Button>
              </LoginLink>
            )}
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default CreateQuestionForm;
