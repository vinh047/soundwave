import { Music } from "lucide-react";
import { Prisma } from "@repo/database";
import userApi from "@/lib/api/usersApi";
import EmptyDisplay from "../../_components/EmptyDisplay";
import TrackListItemInteractive from "../../_components/TrackListItemInteractive";

type TrackWithRelations = Prisma.TrackGetPayload<{
  include: { likes: true; reposts: true; user: true };
}>;

/**
 * Trang hiển thị danh sách các bài hát đã tải lên của user.
 * Đây là một Server Component.
 */
export default async function TracksPage({
  params,
}: {
  params: { id: string };
}) {
  const userId = params.id;

  let tracks: TrackWithRelations[] = [];
  try {
    const res = await userApi.getAllTracksByUserId(userId);
    tracks = res.data.data ?? [];
  } catch (error) {
    console.error("Failed to load tracks:", error);
    return (
      <div className="py-10 text-red-500 text-center">
        Failed to load tracks. Please try again.
      </div>
    );
  }

  if (tracks.length === 0) {
    return <EmptyDisplay icon={Music} message="No tracks uploaded yet." />;
  }

  return (
    <div className="flex flex-col gap-3">
      {tracks.map((track) => (
        <TrackListItemInteractive
          key={track.id}
          track={track}
          artistName={track.user?.name || "Unknown Artist"}
        />
      ))}
    </div>
  );
}
