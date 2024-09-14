"use client";

import DashboardSidebarContent from "@/components/layout/dashboard-sidebarContent";
import { buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { PropsWithClassName } from "@/lib/utils/ui-utils";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export const DesktopDashboardSidebar = ({ className }: PropsWithClassName) => {
  return (
    <aside
      className={cn(
        "border-r-violet-500/30 h-full shrink-0 grow-0 border-r hidden lg:block lg:basis-[250px]",
        className
      )}
    >
      <DashboardSidebarContent />
    </aside>
  );
};

export const MobileDashboardSidebar = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="pl-4 pt-4 lg:hidden">
        <div className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
          <Menu className="size-5 mr-1" />
          <span>Menu</span>
        </div>
      </SheetTrigger>

      <SheetContent className="w-[250px] p-0 pt-2" side={"left"}>
        <DashboardSidebarContent />
      </SheetContent>
    </Sheet>
  );
};
