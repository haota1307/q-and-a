import PublicAuthButtons from "@/components/buttons/public-auth-buttons";
import routes from "@/app/config/routes";
import { UserAvatar } from "@/components/user-avatar";
import { getUserInfo } from "@/lib/server/get-user-info";
import { cn } from "@/lib/utils";
import { PropsWithClassName } from "@/lib/utils/ui-utils";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { BellIcon } from "lucide-react";
import Link from "next/link";

const AuthButtons = async ({ className }: PropsWithClassName) => {
  const kindeUser = await getKindeServerSession().getUser();
  const user = kindeUser && (await getUserInfo(kindeUser.id));

  return user ? (
    <div className={cn("inline-flex gap-x-7 items-center", className)}>
      <BellIcon className="size-5" />
      <Link href={routes.dashboard} prefetch={false}>
        <UserAvatar
          className="ring-2 ring-white"
          displayName={user.displayName}
          color={user.color}
        />
      </Link>
    </div>
  ) : (
    <PublicAuthButtons className={className} />
  );
};

export default AuthButtons;
