import BookmarkedEventsList from "@/components/bookmarked-event-list";
import { NoContent } from "@/components/illustrations";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getUserBookmarkedEvents } from "@/lib/server/get-user-bookmarked-events";
import { cn } from "@/lib/utils";

const MyBookmarksPage = async () => {
  const initialBookmarkedEvents = await getUserBookmarkedEvents();
  return (
    <ScrollArea className="w-full h-full px-4 py-2">
      <h2 className="text-2xl font-bold mb-2 mt-4 ml-4">Sự kiện đã đánh dấu</h2>

      <div
        className={cn(
          "relative h-full grid grid-cols-1 gap-2",
          initialBookmarkedEvents.length !== 0
            ? "md:grid-cols-2 lg:grid-cols-3"
            : ""
        )}
      >
        {initialBookmarkedEvents.length === 0 ? (
          <NoContent>Bạn chưa đánh dấu sự kiện nào.</NoContent>
        ) : (
          <BookmarkedEventsList
            initialBookmarkedEvents={initialBookmarkedEvents}
          />
        )}
      </div>
    </ScrollArea>
  );
};

export default MyBookmarksPage;
