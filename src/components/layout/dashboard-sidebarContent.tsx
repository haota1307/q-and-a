import { Bookmark, LogOut, Quote, User2 } from "lucide-react";
import routes from "@/app/config/routes";
import { usePathname, useRouter } from "next/navigation";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import SidebarItem from "@/components/layout/sidebar-item";

const sidebarItems = [
  {
    name: "Thảo luận",
    route: routes.dashboard,
    Icon: Quote,
  },
  {
    name: "Đánh dấu",
    route: routes.bookmarked,
    Icon: Bookmark,
  },
  {
    name: "Tài khoản",
    route: routes.account,
    Icon: User2,
  },
] as const;

const DashboardSidebarContent = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full py-8 px-3">
      <nav className="flex flex-col gap-y-2">
        {sidebarItems.map((item) => {
          const isActive = item.route === pathname;
          return (
            <button key={item.name} onClick={() => router.replace(item.route)}>
              <SidebarItem
                icon={item.Icon}
                text={item.name}
                isActive={isActive}
              />
            </button>
          );
        })}
      </nav>
      <div className="mt-auto w-full">
        <LogoutLink
          className={cn(buttonVariants({ variant: "outline" }), "w-full")}
        >
          <LogOut className="size-4" />
          <span className="ml-2">Đăng xuất</span>
        </LogoutLink>
      </div>
    </div>
  );
};

export default DashboardSidebarContent;
