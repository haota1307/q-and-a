"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useState } from "react";
import { CreateEventForm } from "@/components/forms/create-event-form";

type Props = { children: React.ReactNode };

export const NewEventDialog = ({ children }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent>
        <DialogTitle>Tạo</DialogTitle>

        <CreateEventForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};
