"use client";

import Image from "next/image";
import { Play } from "lucide-react";
import { Button } from "../ui2/Button";
import { formatPlayCount, timeAgo } from "@/lib/format";
import { usePlayerStore } from "@/store/playerStore";
import { Prisma } from "@repo/database";
import Link from "next/link";

interface TrackCardProps {
  track: Prisma.TrackGetPayload<{ include: { user: true } }>;
}

export function TrackCard({ track }: TrackCardProps) {
  const { play } = usePlayerStore();

  return (
    <Link
      href={`/tracks/${track.id}`}
      className={`
        group cursor-pointer rounded-lg p-4 transition-all block
        
        /* 🔥 Light mode */
        bg-white hover:bg-gray-100 text-gray-900 
        border border-gray-200 shadow-sm

        /* 🌙 Dark mode */
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

        {/* overlay khi hover */}
        <div
          className="
          absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity 
          flex items-center justify-center

          /* Light */
          bg-black/20

          /* Dark */
          dark:bg-black/40
        "
        >
          <Button
            size="lg"
            className="h-14 w-14 rounded-full p-0 cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              play(track);
            }}
          >
            <Play className="h-6 w-6 ml-1" />
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
