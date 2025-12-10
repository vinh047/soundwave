"use client";

import Image from "next/image";
import {
  Play,
  Pause,
  Heart,
  Share2,
  Repeat,
  MoreHorizontal,
} from "lucide-react";
import { Prisma } from "@repo/database";
import { usePlayerStore } from "@/store/playerStore";
import Link from "next/link";
import React from "react";

// Định nghĩa lại các types cần thiết (hoặc import từ file RepostsPage.tsx)
type RepostWithRelations = Prisma.RepostGetPayload<{
  include: {
    track: {
      include: {
        user: true;
        likes: true;
        comments: true;
      };
    };
  };
}>;

// Định nghĩa type cho Track được sử dụng trong component
type TrackWithUserAndStats = RepostWithRelations["track"];

interface RepostTrackItemProps {
  repost: RepostWithRelations;
  track: TrackWithUserAndStats;
}

/**
 * Client Component hiển thị một mục Repost và xử lý tương tác Play/Pause.
 */
export default function RepostTrackItem({
  repost,
  track,
}: RepostTrackItemProps) {
  const { currentTrack, isPlaying, toggle, play } = usePlayerStore();

  const isCurrentTrack = currentTrack?.id === track.id;
  const isCurrentPlaying = isCurrentTrack && isPlaying;

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCurrentTrack) {
      toggle();
    } else {
      // Đảm bảo dữ liệu track đủ để phát nhạc
      play(track);
    }
  };

  return (
    <div key={repost.id} className="relative group">
      {/* Repost Indicator Label */}
      <div className="text-[11px] text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1.5 ml-1">
        <Repeat size={12} className="text-gray-400" />
        <span>
          Reposted on{" "}
          {new Date(repost.createdAt).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      </div>

      {/* Track Card */}
      <div
        className={`flex gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
          isCurrentPlaying
            ? "bg-white dark:bg-[#1f1f1f] border-[#ff5500] shadow-md"
            : "bg-white dark:bg-[#181818] border-gray-100 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/20 hover:shadow-lg hover:-translate-y-0.5"
        }`}
        onClick={handlePlay}
      >
        {/* Track Image */}
        <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-200 shrink-0 relative rounded-lg overflow-hidden shadow-inner">
          <Image
            src={track.imagePath || "/images/default-track.png"}
            alt={track.title}
            fill
            className="object-cover"
          />
          <div
            className={`absolute inset-0 bg-black/30 flex items-center justify-center transition-opacity ${
              isCurrentPlaying
                ? "opacity-100"
                : "opacity-0 group-hover:opacity-100"
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-[#ff5500] text-white flex items-center justify-center shadow-lg">
              {isCurrentPlaying ? (
                <Pause size={20} fill="currentColor" />
              ) : (
                <Play size={20} fill="currentColor" className="ml-1" />
              )}
            </div>
          </div>
        </div>

        {/* Track Info */}
        <div className="flex-1 flex flex-col justify-between min-w-0 py-1">
          <div>
            <div className="flex justify-between items-start">
              <div className="min-w-0">
                <Link
                  href={`/artist/${track.user?.id}`}
                  className="text-xs text-gray-500 hover:text-[#ff5500] transition-colors mb-1 truncate block"
                  onClick={(e) => e.stopPropagation()} // Ngăn chặn phát nhạc khi click vào link nghệ sĩ
                >
                  {track.user?.name || "Unknown Artist"}
                </Link>
                <h4
                  className={`text-base md:text-lg font-bold truncate ${
                    isCurrentPlaying
                      ? "text-[#ff5500]"
                      : "text-gray-900 dark:text-white"
                  }`}
                >
                  {track.title}
                </h4>
              </div>
            </div>
          </div>

          {/* Stats & Actions */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-4 text-xs text-gray-500 font-medium">
              <span className="flex items-center gap-1.5 bg-gray-100 dark:bg-white/10 px-2 py-1 rounded-full">
                <Play size={10} className="fill-current" />
                {track.playCount.toLocaleString()}
              </span>
              <span className="flex items-center gap-1.5 hover:text-[#ff5500] transition-colors">
                <Heart size={14} />
                {track.likes?.length || 0}
              </span>
              <span className="flex items-center gap-1.5 hover:text-blue-500 transition-colors">
                <Share2 size={14} />
              </span>
            </div>
            <button
              className="text-gray-400 hover:text-black dark:hover:text-white transition"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}