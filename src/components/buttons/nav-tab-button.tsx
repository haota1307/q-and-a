import { cn } from "@/lib/utils";
import { PropsWithChildren } from "react";

type Props = PropsWithChildren<{
  isActive: boolean;
  onClick: () => void;
}>;

const NavTabButton = ({ isActive, onClick, children }: Props) => {
  return (
    <button
      className={cn(
        "px-4 py-2 rounded-full transition-colors duration-200 text-sm lg:text-base",
        {
          "bg-primary text-white": isActive,
          "text-gray-500 hover:text-gray-400": !isActive,
        }
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default NavTabButton;
