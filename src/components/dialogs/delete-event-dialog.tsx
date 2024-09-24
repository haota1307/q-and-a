import { deleteEventAction } from "@/lib/actions/delete-event-action";
import { cn } from "@/lib/utils";
import { Event } from "@prisma/client";
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

type Props = {
  eventId: Event["id"];
  onSuccess?: () => void;
} & AlertDialogProps;

export const DeleteEventDialog = ({
  eventId,
  onSuccess: handleSuccess,
  ...dialogProps
}: Props) => {
  const { execute, isExecuting } = useAction(deleteEventAction, {
    onError: (e) => {
      console.error(e);

      toast({
        title: "Có lỗi xảy ra.",
        description: "Không thể xóa sự kiện.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      handleSuccess?.();

      toast({
        title: "Sự kiện của bạn đã được xóa!",
        duration: 3000,
      });
    },
  });

  const handleDelete = (evt: React.MouseEvent) => {
    evt.preventDefault();

    execute({ eventId });
  };

  const isFieldDisabled = isExecuting;

  return (
    <AlertDialog {...dialogProps}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Bạn có chắc chắn không?</AlertDialogTitle>
          <AlertDialogDescription>
            Hành động này không thể hoàn tác. Điều này sẽ xóa vĩnh viễn tất cả
            các câu hỏi và thăm dò của sự kiện và dữ liệu liên quan.
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
            {isExecuting ? "Đang xóa..." : "Xóa"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
