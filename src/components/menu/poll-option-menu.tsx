"usc client";

import ClosePollDialog from "@/components/dialogs/close-poll-dialog";
import DeletePollDialog from "@/components/dialogs/delete-poll-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsParticipantView } from "@/hooks/useIsParticipantView";
import { PollDetail } from "@/lib/prisma/validators/poll-validators";
import { PropsWithClassName } from "@/lib/utils/ui-utils";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { EllipsisVertical, Trash } from "lucide-react";
import { useState } from "react";

type Props = PropsWithClassName<{
  poll: PollDetail;
}>;

const PollOptionsMenu = ({ poll, className }: Props) => {
  const { user } = useKindeBrowserClient();

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const isAdmin = poll.event.ownerId === user?.id;
  const isParticipantView = useIsParticipantView();

  if (isParticipantView || !isAdmin) {
    return null;
  }

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <button className={className}>
            <EllipsisVertical size={20} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="p-2 space-y-1">
          <DropdownMenuItem
            onSelect={() => setOpenDeleteDialog(true)}
            className="text-sm text-destructive"
          >
            <Trash className="mr-2 size-4" />
            <span>Xóa</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeletePollDialog
        pollId={poll.id}
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
        onSuccess={() => setOpenDeleteDialog(false)}
      />
    </>
  );
};

export default PollOptionsMenu;
