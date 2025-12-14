"use client";

import { Heart } from "lucide-react";
import { Prisma } from "@repo/database";
import { formatDistanceToNow } from "date-fns";
import { TrackListItemInteractive } from "./TrackListItemInteractive";

// --- TYPES ---
// Định nghĩa lại Type cho khớp với API đã sửa ở trên
type LikeWithRelations = Prisma.LikeGetPayload<{
  include: {
    track: {
      include: {
        user: true;
        likes: true;
        reposts: true;
        comments: { include: { user: true } };
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

interface LikeTrackItemProps {
  like: LikeWithRelations;
}

/**
 * Component hiển thị một bài hát đã Like.
 * Tái sử dụng logic của TrackListItemInteractive.
 */
export default function LikeTrackItem({ like }: LikeTrackItemProps) {
  const track = like.track;

  // Nếu track gốc đã bị xóa
  if (!track) return null;

  return (
    <div className="flex flex-col">
      {/* HEADER: Liked Label */}
      <div className="flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400 mb-1 ml-4 sm:ml-4">
        {/* Icon trái tim nhỏ màu đỏ hoặc xám tùy ý */}
        <Heart className="w-3 h-3 text-[#ff5500] fill-[#ff5500]" />
        <span>
          Liked{" "}
          {formatDistanceToNow(new Date(like.createdAt), { addSuffix: true })}
        </span>
      </div>

      {/* CORE CONTENT: Tái sử dụng component Track gốc */}
      <TrackListItemInteractive track={track} />
    </div>
  );
}
