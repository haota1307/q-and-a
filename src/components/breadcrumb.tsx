// components/Breadcrumb.tsx
"use client"; // Ensure this component is a Client Component

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React, { useEffect, useState } from "react";

interface BreadcrumbItemType {
  href: string;
  label: string;
}

const BreadcrumbComponent: React.FC = () => {
  const pathname = usePathname();

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  // Tách URL thành các phần và bỏ phần trống
  const pathSegments = pathname.split("/").filter((segment) => segment);

  // Tạo các phần breadcrumb từ URL
  const breadcrumbItems: BreadcrumbItemType[] = pathSegments.map(
    (segment, index) => {
      const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
      return {
        href,
        label: decodeURIComponent(segment.replace(/-/g, " ")),
      };
    }
  );

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink>
            <Link href="/">Home</Link>
          </BreadcrumbLink>
          <BreadcrumbSeparator />
        </BreadcrumbItem>
        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem>
              <BreadcrumbLink>
                <Link href={item.href}>{item.label}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadcrumbComponent;
