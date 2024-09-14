import UserEventList from "@/components/event-list";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getUserEvents } from "@/lib/server/get-user-events";
import { Plus } from "lucide-react";

const MyEventsPage = async () => {
  const initialEvents = await getUserEvents();

  return (
    <ScrollArea className="w-full h-full px-4 py-2">
      <h2 className="text-2xl font-bold mb-2 mt-4 ml-4">Sự kiện</h2>

      <div className="h-full grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
        <button className="h-24 md:h-36 bg-white/50 border-[3px] border-spacing-4 border-dashed grid place-items-center group">
          <span className="inline-flex flex-col items-center gap-x-1 font-medium group-hover:text-violet-600 transition-colors duration-200">
            <Plus className="size-5" />
            <span>Thêm sự kiện</span>
          </span>
        </button>
        <UserEventList initialEvents={initialEvents} />
      </div>
    </ScrollArea>
  );
};

export default MyEventsPage;
