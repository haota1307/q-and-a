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

type Props = {
  ownerId: User["id"];
  eventSlug: Event["slug"];
  onSuccess: (data: QuestionDetail) => void;
};

const CreateQuestionForm = ({ eventSlug, onSuccess, ownerId }: Props) => {
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

  const isExecuting = false; // TODO
  const isFieldDisabled = form.formState.isSubmitting || isExecuting;

  const onSubmit = async (values: CreateQuestionSchema) => console.log(values); // TODO

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
              <Button>
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
                postLoginRedirectURL={`${baseUrl}${routes.event({
                  ownerId,
                  eventSlug,
                })}`}
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
