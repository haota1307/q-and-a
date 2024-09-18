"use client";

import { CreatePollForm } from "@/components/forms/create-poll-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Event } from "@prisma/client";
import { PropsWithChildren, useState } from "react";

type Props = PropsWithChildren<{
  eventId: Event["id"];
}>;

const NewPollDialog = ({ children, eventId }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent>
        <DialogTitle>Bỉnh chọn mới</DialogTitle>

        <CreatePollForm eventId={eventId} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default NewPollDialog;
