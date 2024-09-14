import { Event } from "@prisma/client";
import { AlertDialogProps } from "@radix-ui/react-alert-dialog";

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
import { buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";

type Props = {
  eventId: Event["id"];
  onSuccess?: () => void;
} & AlertDialogProps;

export const DeleteEventDialog = ({
  eventId,
  onSuccess: handleSuccess,
  ...dialogProps
}: Props) => {
  const handleDelete = (evt: React.MouseEvent) => {
    evt.preventDefault();
  };

  return (
    <AlertDialog {...dialogProps}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Bạn có chắc muốn xóa?</AlertDialogTitle>
          <AlertDialogDescription>
            Không thể hoàn tác hành động này. Thao tác này sẽ xóa vĩnh viễn tất
            cả các câu hỏi, cuộc thăm dò ý kiến ​​và dữ liệu liên quan của sự
            kiện của bạn.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel
            className={cn(buttonVariants({ variant: "ghost" }))}
          >
            Thoát
          </AlertDialogCancel>

          <AlertDialogAction
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
