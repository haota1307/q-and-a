"use client";

import routes from "@/config/routes";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  RegisterLink,
  useKindeBrowserClient,
} from "@kinde-oss/kinde-auth-nextjs";
import Link from "next/link";

const btnClasses = cn(
  buttonVariants(),
  "p-4 text-sm rounded-lg lg:p-6 lg:text-xl"
);

const GetStartedButton = () => {
  const { isAuthenticated } = useKindeBrowserClient();

  if (!isAuthenticated) {
    return <RegisterLink className={btnClasses}>Bắt đầu 💕</RegisterLink>;
  }

  return (
    <Link href={routes.dashboard} className={btnClasses}>
      Bắt đầu 💕
    </Link>
  );
};

export default GetStartedButton;
