import { Prisma } from "@repo/database";
import EmptyDisplay from "../../_components/EmptyDisplay";
import userApi from "@/lib/api/usersApi";
import { Heart } from "lucide-react";
import TrackListItem from "../../_components/TrackListItem";

type LikeData = Prisma.LikeGetPayload<{
  include: { track: { include: { user: true; likes: true } } };
}>;

/**
 * Trang hiển thị các bài hát đã thích (Likes) của một người dùng cụ thể.
 * Đây là một Server Component.
 */
export default async function LikesPage({
  params,
}: {
  params: { id: string };
}) {
  const userId = params.id;

  let likedItems: LikeData[] = [];
  try {
    const res = await userApi.getLikesByUserId(userId);
    likedItems = res.data.data ?? [];
  } catch (error) {
    console.error("Failed to fetch user likes:", error);
  }

  if (likedItems.length === 0) {
    return (
      <EmptyDisplay
        message="This user hasn't liked any tracks yet."
        icon={Heart}
      />
    );
  }

  return (
    <div className="space-y-2">
      {likedItems.map((like) =>
        like.track ? (
          <div key={like.id}>
            {/* Truyền dữ liệu bài hát và thông tin người dùng */}
            <TrackListItem track={like.track} user={like.track.user} />
          </div>
        ) : null
      )}
    </div>
  );
}
