"use client";

import Image from "next/image";
import Link from "next/link";
import { Play, Heart, Repeat2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui2/Button";
import { usePlayerStore } from "@/store/playerStore";
// 1. Import useRouter
import { useRouter } from "next/navigation";

export interface TrackCardData {
  id: string;
  title: string;
  audioPath: string;
  user: {
    id: string;
    name: string;
  };
  imagePath: string;
  stats: {
    playCount: number;
    likeCount: number;
    repostCount: number;
    commentCount: number;
  };
}

interface HorizontalTrackCardProps {
  track: TrackCardData;
}

const formatNumber = (num: number) => num.toLocaleString("en-US");

export function HorizontalTrackCard({ track }: HorizontalTrackCardProps) {
  const { play } = usePlayerStore();
  // 2. Khởi tạo router
  const router = useRouter();
  const iconSize = 14;

  const handleCardClick = () => {
    router.push(`/tracks/${track.id}`);
  };

  return (
    // 3. Đổi từ Link thành div
    <div
      onClick={handleCardClick}
      className="group flex w-full flex-row items-center gap-3 rounded-md p-2 transition-colors hover:bg-gray-100 dark:hover:bg-[#1a1a1a] cursor-pointer"
    >
      {/* --- Phần 1: Ảnh bìa --- */}
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded">
        <Image
          src={track.imagePath || "/placeholder.png"}
          alt={track.title}
          fill
          className="object-cover"
          sizes="64px"
        />

        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center bg-black/20 dark:bg-black/40 z-10">
          <Button
            size="sm"
            className="h-10 w-10 rounded-full p-0 cursor-pointer bg-orange-500 hover:bg-orange-600 text-white border-none shadow-md"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation(); // Ngăn sự kiện nổi lên div cha
              play(track as any);
            }}
          >
            <Play className="h-4 w-4 ml-0.5 fill-current" />
          </Button>
        </div>
      </div>

      {/* --- Phần 2: Thông tin chi tiết --- */}
      <div className="flex flex-1 flex-col justify-center min-w-0">
        {/* Link Artist nằm bên trong div cha -> Hợp lệ */}
        <Link
          href={`/profile/${track.user.id}`}
          className="truncate text-xs text-gray-500 dark:text-neutral-400 hover:text-orange-500 hover:underline mb-0.5 w-fit"
          onClick={(e) => e.stopPropagation()} // Quan trọng: Ngăn click vào artist mà lại nhảy sang trang bài hát
        >
          {track.user.name}
        </Link>

        <h3 className="truncate text-sm font-bold text-gray-900 dark:text-white">
          {track.title}
        </h3>

        {/* Stats Row */}
        <div className="mt-1 flex flex-row items-center gap-3 text-xs text-gray-500 dark:text-neutral-400 font-medium">
          <div className="flex items-center gap-1">
            <Play size={iconSize} className="fill-gray-400" />
            <span>{formatNumber(track.stats.playCount)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Heart size={iconSize} />
            <span>{formatNumber(track.stats.likeCount)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Repeat2 size={iconSize} />
            <span>{formatNumber(track.stats.repostCount)}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare size={iconSize} />
            <span>{formatNumber(track.stats.commentCount)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
