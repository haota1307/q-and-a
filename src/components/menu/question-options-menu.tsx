"use client";

import { QuestionDetail } from "@/lib/prisma/validators/question-validators";
import { PropsWithClassName } from "@/lib/utils/ui-utils";
import {
  CircleCheckBig,
  Edit,
  EllipsisVertical,
  Pin,
  Trash,
} from "lucide-react";
import { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useIsParticipantView } from "@/hooks/use-is-participant-view";
import DeleteQuestionDialog from "@/components/dialogs/delete-question-dialog";

type Props = PropsWithClassName<{
  questionId: QuestionDetail["id"];
  isPinned: boolean;
  isResolved: boolean;
  isAuthor: boolean;
  isAdmin: boolean;
  isEditing: boolean;
  toggleEditingMode: () => void;
  onPinChange: (isPinned: boolean) => void;
  onResolveChange: (isResolved: boolean) => void;
}>;

const iconClasses = "size-4 mr-2";

const QuestionOptionsMenu = ({
  className,
  questionId,
  isPinned,
  isResolved,
  toggleEditingMode,
  isAdmin,
  isAuthor,
  isEditing,
  onPinChange: handlePinChange,
  onResolveChange: handleResolveChange,
}: Props) => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const isParticipantView = useIsParticipantView();

  const canEdit = isAuthor && !isEditing;
  const canPin = isAdmin;
  const canDelete = isAdmin || isAuthor;
  const canResolve = isAdmin;

  const permissions = [canEdit, canPin, canDelete, canResolve];

  if (isParticipantView || permissions.every((perm) => !perm)) {
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
          {canResolve && (
            <DropdownMenuItem
              className="text-sm"
              onSelect={() => handleResolveChange(!isResolved)}
            >
              <CircleCheckBig className={iconClasses} />
              <span>
                Đánh dấu là: {isResolved ? "Chưa giải quyết" : "Đã giải quyết"}
              </span>
            </DropdownMenuItem>
          )}

          {canPin && (
            <DropdownMenuItem
              className="text-sm"
              onSelect={() => handlePinChange(!isPinned)}
            >
              <Pin className={iconClasses} />
              <span>{isPinned ? "Bỏ ghim" : "Ghim"} câu hỏi</span>
            </DropdownMenuItem>
          )}

          {canEdit && (
            <DropdownMenuItem className="text-sm" onSelect={toggleEditingMode}>
              <Edit className={iconClasses} />
              <span>Chỉnh sửa câu hỏi</span>
            </DropdownMenuItem>
          )}

          {canDelete && (
            <DropdownMenuItem
              className="text-sm text-destructive"
              onSelect={() => setOpenDeleteDialog(true)}
            >
              <Trash className={iconClasses} />
              <span>Xóa câu hỏi</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteQuestionDialog
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
        questionId={questionId}
      />
    </>
  );
};

export default QuestionOptionsMenu;
