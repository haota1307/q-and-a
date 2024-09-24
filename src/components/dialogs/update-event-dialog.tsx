"use client";

import { EventDetail } from "@/lib/prisma/validators/event-validators";
import { DialogProps } from "@radix-ui/react-dialog";

import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { UpdateEventForm } from "@/components/forms/update-event-form";

type Props = { event: EventDetail; onSuccess?: () => void } & DialogProps;

export const UpdateEventDialog = ({
  event,
  onSuccess: handleSuccess,
  ...props
}: Props) => {
  return (
    <Dialog {...props}>
      <DialogContent>
        <DialogTitle>Cập nhật sự kiện</DialogTitle>

        <UpdateEventForm onSuccess={handleSuccess} event={event} />
      </DialogContent>
    </Dialog>
  );
};
