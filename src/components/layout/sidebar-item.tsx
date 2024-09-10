import { cn } from "@/lib/utils";
import { PropsWithClassName } from "@/lib/utils/ui-utils";
import { ComponentType, PropsWithChildren } from "react";

type Props = PropsWithChildren<{
  isActive: boolean;
  text: string;
  icon: ComponentType<PropsWithClassName>;
}>;

const SidebarItem = ({ isActive, icon: Icon, text, children }: Props) => {
  return (
    <div
      className={cn(
        "p-4 rounded-lg text-sm gap-x-2 flex justify-start items-center text-gray-500 transition-colors duration-200 select-none",
        isActive
          ? "bg-primary/10 text-primary font-semibold"
          : "hover:bg-primary/10"
      )}
    >
      {Icon && <Icon className="size-5" />}
      <span>{text}</span>
      {children}
    </div>
  );
};

export default SidebarItem;
