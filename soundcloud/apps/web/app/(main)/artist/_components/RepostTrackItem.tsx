"use client";

import { Repeat } from "lucide-react";
import { Prisma } from "@repo/database";
import { formatDistanceToNow } from "date-fns";
import { TrackListItemInteractive } from "./TrackListItemInteractive";

// --- TYPES ---
// Định nghĩa Type khớp với những gì TrackListItemInteractive yêu cầu
type RepostWithRelations = Prisma.RepostGetPayload<{
  include: {
    track: {
      include: {
        user: true;
        likes: true;
        reposts: true;
        comments: { include: { user: true } }; // Khớp với server
        _count: {
          select: {
            likes: true;
            reposts: true;
            comments: true;
          };
        };
      };
    };
  };
}>;

interface RepostTrackItemProps {
  repost: RepostWithRelations;
}

/**
 * Component hiển thị một Repost.
 * Tái sử dụng hoàn toàn logic và giao diện của TrackListItemInteractive.
 */
export default function RepostTrackItem({ repost }: RepostTrackItemProps) {
  // Lấy data track từ repost
  const track = repost.track;

  // Nếu track bị null (đã xóa) thì không hiển thị hoặc hiện placeholder
  if (!track) return null;

  return (
    <div className="flex flex-col">
      {/* HEADER: Repost Label */}
      <div className="flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400 mb-1 ml-4 sm:ml-4">
        <Repeat className="w-3 h-3 text-gray-400" />
        <span>
          Reposted{" "}
          {formatDistanceToNow(new Date(repost.createdAt), { addSuffix: true })}
        </span>
      </div>

      {/* CORE CONTENT: Tái sử dụng component TrackItem */}
      {/* Chúng ta ép kiểu 'as any' nếu type Prisma phức tạp gây lỗi cú pháp, 
          nhưng về mặt logic data thì cấu trúc ở trên đã khớp. */}
      <TrackListItemInteractive track={track} />
    </div>
  );
}
