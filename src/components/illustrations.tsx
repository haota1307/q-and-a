"use client";

import { cn } from "@/lib/utils";
import { PropsWithClassName } from "@/lib/utils/ui-utils";
import Image from "next/image";

type Props = PropsWithClassName<{
  width?: number;
  height?: number;
  children?: React.ReactNode;
}>;

export const NotFound = ({
  width = 360,
  height = 360,
  children,
  className,
}: Props) => (
  <div className={cn("flex flex-col items-center", className)}>
    <Image
      src="/page-not-found.svg"
      alt="empty"
      height={height}
      width={width}
    />
    {children}
  </div>
);

export const NoContent = ({
  width = 180,
  height = 180,
  children,
  className,
}: Props) => (
  <div className={cn("flex flex-col items-center", className)}>
    <Image src="/create.svg" alt="empty" height={height} width={width} />
    {children}
  </div>
);
