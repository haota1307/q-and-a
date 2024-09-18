"use client";

import routes, { baseUrl } from "@/config/routes";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PropsWithClassName } from "@/lib/utils/ui-utils";
import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs";
import { usePathname } from "next/navigation";

const PublicAuthButtons = ({ className }: PropsWithClassName) => {
  const pathname = usePathname();

  return (
    <div className={cn("inline-flex items-center gap-x-3", className)}>
      <LoginLink className={cn(buttonVariants({ variant: "link" }))}>
        Đăng nhập
      </LoginLink>
      <RegisterLink className={cn(buttonVariants({ variant: "link" }))}>
        Đăng kí
      </RegisterLink>
    </div>
  );
};

export default PublicAuthButtons;
