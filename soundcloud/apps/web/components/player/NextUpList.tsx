"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { usePlayerStore } from "@/store/playerStore";
import { cn } from "@/lib/utils";

interface NextUpListProps {
  onClose: () => void;
}

function formatDuration(seconds: number) {
  if (!seconds) return "00:00";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
}

export function NextUpList({ onClose }: NextUpListProps) {
  // Lấy thêm autoplay và toggleAutoplay từ store
  const { queue, currentTrack, play, setQueue, removeFromQueue, autoplay, toggleAutoplay } = usePlayerStore();

  const handleClear = () => {
    if (currentTrack) {
      setQueue([currentTrack]);
    } else {
      setQueue([]);
    }
  };

  return (
    <div className="fixed bottom-20 right-4 w-[400px] max-w-[calc(100vw-32px)] h-[calc(100vh-150px)] max-h-[600px] bg-white dark:bg-[#121212] border border-gray-200 dark:border-[#333] rounded-lg shadow-2xl z-50 flex flex-col animate-in slide-in-from-bottom-5 fade-in duration-200">
      
      {/* --- HEADER --- */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-[#2a2a2a]">
        <h3 className="text-base font-bold text-gray-900 dark:text-white">
          Next up
        </h3>
        
        <div className="flex items-center gap-4">
          {queue.length > 1 && (
            <button 
              onClick={handleClear}
              className="text-xs font-semibold text-gray-500 hover:text-orange-500 transition-colors uppercase tracking-wide"
            >
              Clear
            </button>
          )}
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* --- SCROLLABLE LIST --- */}
      <div className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
        {queue.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-500 text-sm gap-2">
            <span>Queue is empty.</span>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {queue.map((track, index) => {
              const isActive = currentTrack?.id === track.id;
              
              return (
                <div 
                  key={`${track.id}-${index}`}
                  onClick={() => play(track)}
                  className={cn(
                    "flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors group",
                    isActive 
                      ? "bg-orange-50 dark:bg-[#1a1a1a]" 
                      : "hover:bg-gray-100 dark:hover:bg-[#1a1a1a]"
                  )}
                >
                  {/* Ảnh nhỏ */}
                  <div className="relative w-10 h-10 shrink-0">
                    <Image 
                      src={track.imagePath || "/images/default-cover.jpg"} 
                      alt={track.title}
                      fill
                      className="object-cover rounded-[3px]"
                    />
                    <div className={cn(
                        "absolute inset-0 bg-black/40 items-center justify-center rounded-[3px]",
                        isActive ? "flex" : "hidden group-hover:flex"
                    )}>
                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                    </div>
                  </div>

                  {/* Thông tin */}
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <h4 className={cn(
                        "text-sm font-medium truncate leading-tight",
                        isActive ? "text-orange-600 dark:text-orange-500" : "text-gray-800 dark:text-gray-200"
                    )}>
                        {track.title}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                        {track.user?.name || "Unknown Artist"}
                    </p>
                  </div>

                  {/* Thời lượng */}
                  <span className="text-xs text-gray-400 font-medium tabular-nums px-2">
                    {formatDuration(track.duration || 0)}
                  </span>
                  
                  {/* Nút xóa */}
                  <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        removeFromQueue(index);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-500"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 👇 FOOTER: AUTOPLAY TOGGLE */}
      <div className="p-3 border-t border-gray-100 dark:border-[#2a2a2a] bg-gray-50 dark:bg-[#1a1a1a]/50 flex items-center justify-between">
        <div>
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">Autoplay</p>
            <p className="text-[10px] text-gray-500 dark:text-gray-500">Play similar tracks automatically</p>
        </div>
        
        <button
          onClick={toggleAutoplay}
          className={cn(
            "w-9 h-5 rounded-full transition-colors relative focus:outline-none",
            autoplay ? "bg-orange-500" : "bg-gray-300 dark:bg-gray-600"
          )}
        >
          <span
            className={cn(
              "absolute top-1 w-3 h-3 bg-white rounded-full transition-all shadow-sm",
              autoplay ? "right-1" : "left-1"
            )}
          />
        </button>
      </div>

    </div>
  );
}