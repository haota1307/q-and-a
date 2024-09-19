import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { deletePollAction } from "@/lib/actions/delete-poll-action";
import { cn } from "@/lib/utils";
import { Poll } from "@prisma/client";
import { AlertDialogProps } from "@radix-ui/react-alert-dialog";
import { useAction } from "next-safe-action/hooks";

type Props = {
  pollId: Poll["id"];
  onSuccess?: () => void;
} & AlertDialogProps;

const DeletePollDialog = ({
  pollId,
  onSuccess: handleSuccess,
  ...dialogProps
}: Props) => {
  const { execute, isExecuting } = useAction(deletePollAction, {
    onError: (err) => {
      console.error(err);

      toast({
        title: "Đã xảy ra lỗi",
        description: "Xóa cuộc bình chọn thất bại.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      handleSuccess?.();

      toast({
        title: "Cuộc bình chọn của bạn đã được xóa!",
      });
    },
  });

  const handleDelete = (evt: React.MouseEvent) => {
    evt.preventDefault();

    execute({ pollId });
  };

  const isFieldDisabled = isExecuting;

  return (
    <AlertDialog {...dialogProps}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Bạn có chắc muốn xóa cuộc bình chọn
          </AlertDialogTitle>
          <AlertDialogDescription>
            Không thể hoàn tác hành động này. Thao tác này sẽ xóa vĩnh viễn cuộc
            bình chọn của bạn và tất cả các phiếu bầu của bạn khỏi sự kiện.
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
            Xóa
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeletePollDialog;
