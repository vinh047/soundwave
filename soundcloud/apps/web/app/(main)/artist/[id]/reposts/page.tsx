// fileName: RepostsPage.tsx
import { Repeat } from "lucide-react";
import userApi from "@/lib/api/usersApi";
import EmptyDisplay from "../../_components/EmptyDisplay"; // Đảm bảo đường dẫn đúng
import { TrackListItemInteractive } from "../../_components/TrackListItemInteractive";

/**
 * Trang hiển thị các bài hát đã repost của một user.
 * Đây là một Server Component.
 */
export default async function RepostsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const userId = id;

  // 1. Fetch dữ liệu trực tiếp trên Server
  let reposts;
  try {
    const res = await userApi.getAllRepostsByUserId(userId);
    reposts = res.data.data ?? [];
  } catch (error) {
    console.error("Failed to fetch user reposts:", error);
    return (
      <div className="py-10 text-red-500 text-center">
        Failed to load reposts.
      </div>
    );
  }

  // 2. Kiểm tra dữ liệu rỗng
  if (reposts.length === 0) {
    return (
      <EmptyDisplay
        icon={Repeat}
        message="This user hasn't reposted any tracks yet."
      />
    );
  }

  // 3. Hiển thị danh sách, sử dụng Client Component con cho tương tác
  return (
    <div className="flex flex-col gap-6">
      {reposts.map((repost) =>
        repost.track ? (
          <TrackListItemInteractive key={repost.id} track={repost.track} />
        ) : null
      )}
    </div>
  );
}
