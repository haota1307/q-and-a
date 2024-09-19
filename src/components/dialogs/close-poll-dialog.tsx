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
import { closePollAction } from "@/lib/actions/close-poll-action";
import { cn } from "@/lib/utils";
import { Poll } from "@prisma/client";
import { AlertDialogProps } from "@radix-ui/react-alert-dialog";
import { useAction } from "next-safe-action/hooks";

type Props = {
  pollId: Poll["id"];
  onSuccess?: () => void;
} & AlertDialogProps;

const ClosePollDialog = ({
  pollId,
  onSuccess: handleSuccess,
  ...dialogProps
}: Props) => {
  const { execute, isExecuting } = useAction(closePollAction, {
    onError: (err) => {
      console.error(err);

      toast({
        title: "Đã xảy ra lỗi",
        description: "Đóng cuộc bình chọn thất bại. Vui lòng thử lại.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      handleSuccess?.();

      toast({ title: "Cuộc bình chọn của bạn đã được đóng!" });
    },
  });

  const handleClose = (evt: React.MouseEvent) => {
    evt.preventDefault();

    execute({ pollId });
  };

  const isFieldDisabled = isExecuting;

  return (
    <AlertDialog {...dialogProps}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Bạn có chắc muốn đóng cuộc bình chọn
          </AlertDialogTitle>
          <AlertDialogDescription>
            Không thể hoàn tác hành động này. Thao tác này sẽ đóng vĩnh viễn
            cuộc bình chọn của bạn và tất cả mọi người sẽ không thể tiếp tục
            tham gia bình chọn.
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
            onClick={handleClose}
            className={cn(buttonVariants({ variant: "destructive" }))}
          >
            {isExecuting ? "Đang đóng..." : "Đóng"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ClosePollDialog;
