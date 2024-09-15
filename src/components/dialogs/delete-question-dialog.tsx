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

type Props = {
  questionId: Question["id"];
  onSuccess?: () => void;
} & AlertDialogProps;

const DeleteQuestionDialog = ({
  questionId,
  onSuccess: handleSuccess,
  ...dialogProps
}: Props) => {
  const isExecuting = false;

  const handleDelete = async (evt: React.MouseEvent) => {
    evt.preventDefault();
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
