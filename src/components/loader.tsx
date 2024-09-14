"use client";

import { PropsWithClassName } from "@/lib/utils/ui-utils";
import { violet } from "tailwindcss/colors";
import { Skeleton } from "./ui/skeleton";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const Loader = () => {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <Loader2 color={violet[600]} size={30} className="animate-spin" />
    </div>
  );
};

export const AuthLoader = ({ className }: PropsWithClassName) => {
  return <Skeleton className={cn("bg-gray-100/50 w-32 h-10", className)} />;
};
