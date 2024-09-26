import { UserAvatar } from "@/components/user-avatar";
import { getUserInfo } from "@/lib/server/get-user-info";
import { onlyDateFormatter } from "@/lib/utils/date-utils";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

const MyAccountPage = async () => {
  const kindeUser = await getKindeServerSession().getUser();
  const user = kindeUser && (await getUserInfo(kindeUser.id));

  if (!user) {
    throw new Error("Người dùng không hợp lệ");
  }

  return (
    <div className="w-full h-full flex flex-col items-center mt-32">
      <UserAvatar
        className="size-14 ring ring-white"
        displayName={user.displayName}
        color={user.color}
      />
      <h1 className="text-2xl font-bold mt-3">{user.displayName}</h1>
      <time className="text-xs text-gray-500" suppressHydrationWarning>
        Gia nhập: {onlyDateFormatter.format(user.createdAt)}
      </time>
      <ul className="text-sm text-muted-foreground mt-6 space-y-1">
        <li>Sự kiện: {user._count.events}</li>
        <li>Câu hỏi: {user._count.questions}</li>
        <li>Tham gia: {user._count.participations}</li>
        <li>Đánh dấu: {user._count.bookmarks}</li>
      </ul>
    </div>
  );
};

export default MyAccountPage;
