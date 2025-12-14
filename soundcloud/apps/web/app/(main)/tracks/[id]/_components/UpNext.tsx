"use client";

import { List, Play } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { usePlayerStore } from "@/store/playerStore";
import { cn } from "@/lib/utils";

function formatDuration(seconds: number) {
  if (!seconds) return "--:--";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

const PlayingIndicator = () => (
  <div className="flex items-end gap-[2px] h-3 w-3 justify-center">
    <div className="w-[3px] bg-orange-500 animate-[bounce_1s_infinite] h-full" />
    <div className="w-[3px] bg-orange-500 animate-[bounce_1.2s_infinite] h-[60%]" />
    <div className="w-[3px] bg-orange-500 animate-[bounce_0.8s_infinite] h-[80%]" />
  </div>
);

export default function UpNext() {
  const { queue, currentTrack, play, autoplay, toggleAutoplay } =
    usePlayerStore();

  return (
    <div
      className="p-5 h-full overflow-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-white/10 rounded-xl border shadow-sm
      bg-white border-gray-200
      dark:bg-white/5 dark:border-white/5 dark:shadow-none dark:backdrop-blur-xl scrollbar-none"
    >
      <h3 className="text-lg font-bold flex items-center gap-2 mb-4 text-gray-900 dark:text-white">
        <List size={20} /> Up Next
      </h3>

      <div className="space-y-1">
        {queue.length === 0 ? (
          <div className="text-center py-10 text-gray-500 text-sm italic">
            Queue is empty.
          </div>
        ) : (
          queue.map((item, i) => {
            const isActive = currentTrack?.id === item.id;

            return (
              <div
                key={`${item.id}-${i}`}
                onClick={() => play(item)}
                className={cn(
                  "group flex items-center gap-3 p-2 rounded-lg transition-all cursor-pointer border border-transparent",
                  isActive
                    ? "bg-orange-50 border-orange-100 dark:bg-white/10 dark:border-white/5"
                    : "hover:bg-gray-100 dark:hover:bg-white/5 hover:border-gray-200 dark:hover:border-white/10"
                )}
              >
                {/* Cột Số/Play/Sóng nhạc */}
                <div className="w-6 flex justify-center items-center shrink-0">
                  {isActive ? (
                    <PlayingIndicator />
                  ) : (
                    <>
                      <span className="text-xs text-gray-400 group-hover:hidden font-medium tabular-nums">
                        {i + 1}
                      </span>
                      <Play className="w-3.5 h-3.5 text-gray-800 dark:text-gray-200 hidden group-hover:block fill-current" />
                    </>
                  )}
                </div>

                {/* Ảnh */}
                <div className="relative w-10 h-10 shrink-0 rounded overflow-hidden bg-gray-200 dark:bg-gray-700 shadow-sm">
                  <Image
                    src={item.imagePath || "/images/default-cover.jpg"}
                    alt={item.title}
                    fill
                    className={cn(
                      "object-cover transition-opacity",
                      isActive ? "opacity-100" : "group-hover:opacity-80"
                    )}
                  />
                </div>

                {/* Thông tin */}
                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      "text-sm font-medium truncate",
                      isActive
                        ? "text-orange-600 dark:text-orange-400"
                        : "text-gray-900 dark:text-gray-200"
                    )}
                  >
                    {item.title}
                  </p>
                  <p className="text-xs truncate text-gray-500 dark:text-gray-400">
                    {item.user?.name || "Unknown Artist"}
                  </p>
                </div>

                {/* Thời lượng */}
                <span className="text-xs text-gray-400 tabular-nums">
                  {formatDuration(item.duration || 0)}
                </span>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Controls */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200 dark:border-white/10">
        <div>
          <p className="font-medium text-sm text-gray-900 dark:text-white">
            Autoplay
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Play similar tracks
          </p>
        </div>
        <button
          onClick={toggleAutoplay}
          className={cn(
            "w-10 h-6 rounded-full transition-colors relative",
            autoplay ? "bg-orange-500" : "bg-gray-300 dark:bg-gray-600"
          )}
        >
          <span
            className={cn(
              "absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm",
              autoplay ? "right-1" : "left-1"
            )}
          />
        </button>
      </div>
    </div>
  );
}
