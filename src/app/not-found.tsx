import routes from "@/config/routes";
import { NotFound } from "@/components/illustrations";
import { Button } from "@/components/ui/button";
import Link from "next/link";
const NotFoundPage = () => {
  return (
    <div className="grid place-items-center">
      <NotFound>
        <span className="text-2xl text-muted-foreground">
          Trang bạn tìm không tồn tại
        </span>
        <Link href={routes.home}>
          <Button className="mt-4">Quay về trang chủ</Button>
        </Link>
      </NotFound>
    </div>
  );
};

export default NotFoundPage;
