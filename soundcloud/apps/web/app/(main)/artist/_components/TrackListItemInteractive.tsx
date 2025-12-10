"use client";

import Image from "next/image";
import { Play, Pause, Heart, Share2, MoreHorizontal } from "lucide-react";
import { Prisma } from "@repo/database";
import { usePlayerStore } from "@/store/playerStore";
import React from "react";
// Giả định utility này được định nghĩa ở đâu đó và có thể import được
import { formatDuration } from "@/app/(main)/tracks/[id]/_components/utils";
import StaticWaveform from "./utils/StaticWaveform";
import Link from "next/link";

// Định nghĩa type cần thiết
type TrackWithRelations = Prisma.TrackGetPayload<{
  include: { likes: true; reposts: true; user: true };
}>;

interface TrackListItemInteractiveProps {
  track: TrackWithRelations;
  artistName: string | null;
}

/**
 * Client Component hiển thị một mục Track và xử lý tương tác Play/Pause.
 */
export default function TrackListItemInteractive({
  track,
  artistName,
}: TrackListItemInteractiveProps) {
  const { currentTrack, isPlaying, toggle, play } = usePlayerStore();

  const isCurrentTrack = currentTrack?.id === track.id;
  const isCurrentPlaying = isCurrentTrack && isPlaying;

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCurrentTrack) {
      toggle();
    } else {
      // Đảm bảo dữ liệu track đủ để phát
      play(track);
    }
  };

  return (
    <Link href={`/tracks/${track.id}`}>
      <div
        key={track.id}
        className={`flex gap-4 p-3 rounded-lg border transition group cursor-pointer ${
          isCurrentPlaying
            ? "bg-orange-50/50 border-orange-200 dark:bg-orange-500/10 dark:border-orange-500/20"
            : "bg-white dark:bg-[#181818] border-gray-100 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/20 hover:shadow-sm"
        }`}
      >
        {/* Track Image */}
        <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-200 shrink-0 relative rounded overflow-hidden">
          <Image
            src={track.imagePath || "/images/default-track.png"}
            alt={track.title}
            fill
            className="object-cover transition duration-500 group-hover:scale-110"
          />

          {/* Overlay Play Button */}
          <div
            className={`absolute inset-0 bg-black/20 flex items-center justify-center transition-opacity ${
              isCurrentPlaying
                ? "opacity-100"
                : "opacity-0 group-hover:opacity-100"
            }`}
          >
            <div
              className="w-8 h-8 rounded-full bg-[#ff5500] text-white flex items-center justify-center shadow-lg transform active:scale-95 transition"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handlePlay(e);
              }}
            >
              {isCurrentPlaying ? (
                <Pause size={16} fill="currentColor" />
              ) : (
                <Play size={16} fill="currentColor" className="ml-0.5" />
              )}
            </div>
          </div>
        </div>

        {/* Track Info */}
        <div className="flex-1 flex flex-col justify-center min-w-0">
          <div className="flex justify-between items-start">
            <div className="min-w-0">
              <p className="text-xs text-gray-500 mb-0.5 hover:text-black dark:hover:text-white transition-colors">
                {artistName}
              </p>
              <h4
                className={`text-sm md:text-base font-bold truncate ${
                  isCurrentPlaying
                    ? "text-[#ff5500]"
                    : "text-gray-900 dark:text-white"
                }`}
              >
                {track.title}
              </h4>
            </div>
            <span className="text-xs text-gray-400 tabular-nums">
              {track.duration ? formatDuration(track.duration) : "0:00"}
            </span>
          </div>

          <StaticWaveform />

          {/* Action Bar */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1.5" title="Plays">
                <Play size={12} className="fill-gray-400" />{" "}
                {track.playCount.toLocaleString()}
              </span>
              <span
                className="flex items-center gap-1.5 hover:text-red-500 transition-colors"
                title="Likes"
              >
                <Heart size={12} /> {track.likes?.length || 0}
              </span>
              <span
                className="flex items-center gap-1.5 hover:text-blue-500 transition-colors opacity-0 group-hover:opacity-100"
                title="Share"
              >
                <Share2 size={12} /> Share
              </span>
            </div>

            <button
              className="p-1.5 text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-full opacity-0 group-hover:opacity-100 transition"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal size={16} />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
