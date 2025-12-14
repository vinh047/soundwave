"use client";

import Image from "next/image";
import { Play, Heart, Repeat, Share2 } from "lucide-react";
import StaticWaveform from "../../_components/utils/StaticWaveform";
import { usePlayerStore } from "@/store/playerStore";
import { Prisma } from "@repo/database";
import { TrackCoverPlaceholder } from "@/components/placeholders/TrackCover";

type TrackWithUser = Prisma.TrackGetPayload<{ include: { user: true } }>;

interface RecentTracksListProps {
  tracks: TrackWithUser[];
  artistName: string;
}

export default function RecentTracksList({
  tracks,
  artistName,
}: RecentTracksListProps) {
  const { play } = usePlayerStore();

  if (!tracks || tracks.length === 0) return null;

  return (
    <div className="space-y-4 mt-2">
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
        Recent
      </h3>

      {tracks.map((track) => (
        <div
          key={track.id}
          className="flex gap-3 p-2 rounded hover:bg-white dark:hover:bg-[#181818] transition group border border-transparent hover:border-gray-200 dark:hover:border-white/5 cursor-pointer"
          onClick={() => play(track)}
        >
          {/* Track Image */}
          <div className="w-12 h-12 bg-gray-300 shrink-0 relative rounded overflow-hidden">
            {track.imagePath ? (
              <Image
                src={track.imagePath || "/images/default-track.png"}
                alt={track.title}
                fill
                className="object-cover"
              />
            ) : (
              <TrackCoverPlaceholder />
            )}
            {/* Hover Play Icon */}
            <div className="absolute inset-0 bg-black/30 hidden group-hover:flex items-center justify-center">
              <Play size={16} className="text-white fill-current" />
            </div>
          </div>

          {/* Track Info */}
          <div className="flex-1 border-b border-gray-200 dark:border-white/10 pb-2 group-hover:border-transparent min-w-0">
            <div className="flex justify-between items-start">
              <div className="min-w-0 pr-2">
                <p className="text-xs text-gray-500 hover:underline">
                  {artistName}
                </p>
                <h4 className="text-sm font-normal text-gray-800 dark:text-gray-200 hover:text-black dark:hover:text-white truncate">
                  {track.title}
                </h4>
              </div>
              <span className="text-xs text-gray-400 whitespace-nowrap">
                5 days ago
              </span>
            </div>

            <div className="mt-2 flex items-center justify-between h-6">
              {/* Static Waveform (Nhẹ hơn Canvas) */}
              <div className="flex-1 max-w-[200px]">
                <StaticWaveform height="h-6" />
              </div>

              {/* Hover Actions */}
              <div
                className="flex items-center gap-4 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition duration-200"
                onClick={(e) => e.stopPropagation()} // Prevent playing when clicking actions
              >
                <button className="flex items-center gap-1 hover:text-black dark:hover:text-white">
                  <Heart size={12} /> 12K
                </button>
                <button className="flex items-center gap-1 hover:text-black dark:hover:text-white">
                  <Repeat size={12} /> 500
                </button>
                <button className="flex items-center gap-1 hover:text-black dark:hover:text-white">
                  <Share2 size={12} />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
