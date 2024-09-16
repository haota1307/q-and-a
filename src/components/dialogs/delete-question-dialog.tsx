import { Question } from "@prisma/client";
import { AlertDialogProps } from "@radix-ui/react-alert-dialog";
import { useAction } from "next-safe-action/hooks";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { buttonVariants } from "../ui/button";
import { toast } from "../ui/use-toast";
import { cn } from "@/lib/utils";
import { deleteQuestionAction } from "@/lib/actions/delete-question-action";

type Props = {
  questionId: Question["id"];
  onSuccess?: () => void;
} & AlertDialogProps;

const DeleteQuestionDialog = ({
  questionId,
  onSuccess: handleSuccess,
  ...dialogProps
}: Props) => {
  const { execute, isExecuting } = useAction(deleteQuestionAction, {
    onError: (err) => {
      console.error(err);

      toast({
        title: "Có lỗi xãy ra 😓😓😓",
        description: "Không thể xóa câu hỏi, vui lòng thử lại sau 😊😊😊",
        variant: "destructive",
      });
    },

    onSuccess: () => {
      handleSuccess && handleSuccess();

      toast({
        title: "Thông báo 🔊🔊🔊",
        description: "Câu hỏi của bạn đã được xóa ✅✅✅",
      });
    },
  });

  const handleDelete = async (evt: React.MouseEvent) => {
    evt.preventDefault();

    execute({ questionId });
  };

  const isFieldDisabled = isExecuting;

  return (
    <AlertDialog {...dialogProps}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Bạn có chắc chắn không?</AlertDialogTitle>
          <AlertDialogDescription>
            Hành động này không thể hoàn tác. Điều này sẽ xóa vĩnh viễn câu hỏi
            của bạn khỏi sự kiện.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={isFieldDisabled}
            className={cn(buttonVariants({ variant: "ghost" }))}
          >
            Hủy
          </AlertDialogCancel>

          <AlertDialogAction
            disabled={isFieldDisabled}
            onClick={handleDelete}
            className={cn(buttonVariants({ variant: "destructive" }))}
          >
            {isExecuting ? "Đang xóa..." : "Tiếp tục"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteQuestionDialog;
