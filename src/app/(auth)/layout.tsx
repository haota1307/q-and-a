import NavBar from "@/components/layout/nav-bar";
import { PropsWithChildren } from "react";

const AuthLayout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <NavBar />
      <main className="h-[calc(100vh-68px)]">{children}</main>
    </>
  );
};

export default AuthLayout;
