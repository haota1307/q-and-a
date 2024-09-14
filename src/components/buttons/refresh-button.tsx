"use client";

import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";

const RefreshButton = () => {
  const router = useRouter();

  return (
    <Button onClick={() => router.refresh()} variant={"ghost"}>
      <RefreshCcw className="size-4" />
      <span className="hidden lg:inline-block lg:ml-2">Tải lại</span>
    </Button>
  );
};

export default RefreshButton;
