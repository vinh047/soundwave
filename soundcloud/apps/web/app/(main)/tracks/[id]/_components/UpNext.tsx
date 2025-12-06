"use client";

import { List } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function UpNext() {
  const [autoplay, setAutoplay] = useState(true);

  // Dữ liệu giả định (đã rút gọn để demo)
  const queue = [
    {
      id: "1",
      title: "Neon Cruise",
      artist: "@synthwavekid",
      duration: "3:42",
      cover: "/images/istockphoto-161839324-612x612.jpg",
    },
    {
      id: "2",
      title: "Retro Sunset",
      artist: "@kato_synth",
      duration: "4:15",
      cover: "/images/istockphoto-161839324-612x612.jpg",
    },
    {
      id: "3",
      title: "Night City",
      artist: "@cyber_punk",
      duration: "2:50",
      cover: "/images/istockphoto-161839324-612x612.jpg",
    },
  ];

  return (
    <div
      className="p-5 h-full overflow-auto scrollbar-hide rounded-xl border shadow-sm
      bg-white border-gray-200
      dark:bg-white/5 dark:border-white/5 dark:shadow-none dark:backdrop-blur-xl"
    >
      <h3 className="text-lg font-bold flex items-center gap-2 mb-4 text-gray-900 dark:text-white">
        <List size={20} /> Up Next
      </h3>

      <div className="space-y-1">
        {queue.map((item, i) => (
          <div
            key={item.id}
            className="flex items-center gap-3 p-2 rounded-lg transition cursor-pointer
              hover:bg-gray-100 
              dark:hover:bg-white/10"
          >
            <span className="text-gray-400 w-4 text-center text-sm">
              {i + 1}
            </span>
            <div className="relative w-10 h-10 shrink-0 rounded overflow-hidden">
              <Image
                src={item.cover}
                alt={item.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate text-gray-900 dark:text-white">
                {item.title}
              </p>
              <p className="text-xs truncate text-gray-500 dark:text-gray-400">
                {item.artist}
              </p>
            </div>
            <span className="text-xs text-gray-400">{item.duration}</span>
          </div>
        ))}
      </div>

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
          onClick={() => setAutoplay(!autoplay)}
          className={`w-12 h-7 rounded-full transition relative ${
            autoplay
              ? "bg-linear-to-r from-[#ff6b6b] to-[#4ecdc4]"
              : "bg-gray-300 dark:bg-gray-600"
          }`}
        >
          <span
            className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all shadow-sm ${
              autoplay ? "right-1" : "left-1"
            }`}
          />
        </button>
      </div>

      <div
        className="mt-4 p-3 rounded-xl flex items-center gap-3 border
        bg-gray-50 border-gray-200 
        dark:bg-white/5 dark:border-white/10"
      >
        <div className="w-10 h-10 rounded bg-gray-300 dark:bg-gray-700" />
        <div>
          <p className="font-medium text-sm text-gray-900 dark:text-white">
            Luna Waves Radio
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Based on this track
          </p>
        </div>
      </div>
    </div>
  );
}
