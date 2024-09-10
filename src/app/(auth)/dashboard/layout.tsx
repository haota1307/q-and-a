import routes from "@/app/config/routes";
import {
  DesktopDashboardSidebar,
  MobileDashboardSidebar,
} from "@/components/layout/dashboard-sidebar";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { PropsWithChildren } from "react";

/** export const dynamic = "force-dynamic"
 * Luôn tạo trang động mỗi khi có yêu cầu thay vì lưu trữ kết quả (caching) từ lần trước.
 * Điều này hữu ích khi dữ liệu trang thay đổi thường xuyên và cần được cập nhật ngay lập tức mà không phải đợi quá trình build lại.
 */
export const dynamic = "force-dynamic";

const DashboardLayout = async ({ children }: PropsWithChildren) => {
  const isAuthenticated = await getKindeServerSession().isAuthenticated();

  if (!isAuthenticated) {
    redirect(routes.login);
  }

  return (
    <div className="flex flex-row h-full">
      <DesktopDashboardSidebar />
      <div className="flex flex-col overflow-hidden w-auto items-start">
        <MobileDashboardSidebar />

        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
