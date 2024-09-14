"use client";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const ClearSearchParamsButton = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleClear = () => {
    router.replace(`${pathname}`);
  };

  return (
    <Button variant={"outline"} size={"sm"} onClick={handleClear}>
      <X className="size-4 mr-2" />
      <span className="">Xóa</span>
    </Button>
  );
};

export default ClearSearchParamsButton;
