"use client";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

const btnClasses = cn(
  buttonVariants(),
  "p-4 text-sm rounded-lg lg:p-6 lg:text-xl"
);

const GetStartedButton = () => {
  return (
    <Link href={"/"} className={btnClasses}>
      Bắt đầu 💕
    </Link>
  );
};

export default GetStartedButton;
