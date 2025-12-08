"use client";

import Image from "next/image";
import { Play, Pause } from "lucide-react"; // 1. Import thêm icon Pause
import { Button } from "../ui2/Button";
import { formatPlayCount, timeAgo } from "@/lib/format";
import { usePlayerStore } from "@/store/playerStore";
import { Prisma } from "@repo/database";
import Link from "next/link";
import { cn } from "@/lib/utils"; // Giả sử bạn có hàm cn, nếu không dùng template string cũng được

interface TrackCardProps {
  track: Prisma.TrackGetPayload<{ include: { user: true } }>;
}

export function TrackCard({ track }: TrackCardProps) {
  // 2. Lấy thêm state để kiểm tra
  const { play, toggle, currentTrack, isPlaying } = usePlayerStore();

  // 3. Logic kiểm tra trạng thái active
  const isCurrentTrack = currentTrack?.id === track.id;
  const isActive = isCurrentTrack && isPlaying;

  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isCurrentTrack) {
      toggle(); // Nếu đang là bài này thì toggle (Pause/Resume)
    } else {
      play(track); // Nếu là bài khác thì phát mới
    }
  };

  return (
    <Link
      href={`/tracks/${track.id}`}
      className={`
        group cursor-pointer rounded-lg p-4 transition-all block
        bg-white hover:bg-gray-100 text-gray-900 
        border border-gray-200 shadow-sm
        dark:bg-gray-900 dark:hover:bg-gray-800 dark:text-white 
        dark:border-gray-700
      `}
    >
      <div className="relative">
        <Image
          src={track.imagePath || "/placeholder.png"}
          alt=""
          width={400}
          height={400}
          className="w-full aspect-square object-cover rounded"
        />

        {/* overlay play button */}
        <div
          className={cn(
            "absolute inset-0 transition-opacity flex items-center justify-center bg-black/20 dark:bg-black/40",
            // 4. Logic hiển thị:
            // - Nếu đang active (đang phát bài này): Luôn hiện (opacity-100)
            // - Nếu không: Ẩn (opacity-0), chỉ hiện khi hover (group-hover:opacity-100)
            isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          )}
        >
          <Button
            size="lg"
            className="h-14 w-14 rounded-full p-0 cursor-pointer transition-transform hover:scale-105"
            onClick={handlePlayClick}
          >
            {/* 5. Đổi Icon dựa trên trạng thái */}
            {isActive ? (
              <Pause className="h-6 w-6 fill-current text-white" />
            ) : (
              <Play className="h-6 w-6 ml-1 fill-current text-white" />
            )}
          </Button>
        </div>
      </div>

      <h3 className="font-semibold mt-3 truncate text-gray-900 dark:text-white">
        {track.title}
      </h3>

      <p className="text-sm text-gray-600 dark:text-gray-400">
        {track.user.name}
      </p>

      <div className="flex gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
        <span>{formatPlayCount(track.playCount)}</span>
        <span>•</span>
        <span>{timeAgo(track.createdAt)}</span>
      </div>
    </Link>
  );
}
