import { PropsWithClassName } from "@/lib/utils/ui-utils";
import { Avatar, AvatarFallback } from "./ui/avatar";

type Props = PropsWithClassName<{
  displayName: string;
  color: string;
}>;

const getFullNameInitials = (name: string): string => {
  // Chia tên thành các từ, bao gồm cả từ có dấu
  const words = name.split(/\s+/);

  // Lấy chữ cái đầu tiên của mỗi từ và chuyển thành chữ hoa
  const initials = words.map((word) => word.charAt(0).toUpperCase());

  return initials.join("");
};

export const UserAvatar = ({ displayName, color, className }: Props) => {
  return (
    <Avatar className={className}>
      <AvatarFallback
        style={{ backgroundColor: color }}
        className="text-white text-xs"
      >
        {getFullNameInitials(displayName)}
      </AvatarFallback>
    </Avatar>
  );
};
