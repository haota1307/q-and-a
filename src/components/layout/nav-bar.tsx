import AuthButtons from "@/components/buttons/auth-buttons";
import routes from "@/config/routes";
import Logo from "@/components/layout/logo";
import Link from "next/link";
import { Suspense } from "react";
import { AuthLoader } from "@/components/loader";

const NavBar = () => {
  return (
    <header className="bg-primary text-primary-foreground h-16 flex items-center px-4 lh:px-8 shrink-0 grow-0">
      <Link
        href={routes.dashboard}
        className="inline-flex items-center gap-x-2 "
      >
        <Logo />
        <span className="text-base tracking-wide font-bold">Q&A</span>
      </Link>

      <Suspense fallback={<AuthLoader className="ml-auto" />}>
        <AuthButtons className="ml-auto" />
      </Suspense>
    </header>
  );
};

export default NavBar;
