"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Play,
  Pause,
  Heart,
  MessageSquare,
  Repeat,
  MoreHorizontal,
} from "lucide-react";
import { Prisma } from "@repo/database";
import { usePlayerStore } from "@/store/playerStore";
import { toast } from "sonner";
import { formatDuration } from "../../tracks/[id]/_components/utils";

type FullTrack = Prisma.TrackGetPayload<{
  include: {
    user: true;
    likes: true;
  };
}>;

interface TrackListItemProps {
  track: FullTrack;

  user: FullTrack["user"];

  metadata?: {
    repostedBy?: string;
    likedBy?: string;
    createdAt?: Date;
  };
}

export default function TrackListItem({ track, metadata }: TrackListItemProps) {
  const { currentTrack, isPlaying, toggle, play } = usePlayerStore();

  const isCurrentTrack = currentTrack?.id === track.id;
  const isCurrentPlaying = isCurrentTrack && isPlaying;

  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isCurrentTrack) {
      toggle();
    } else {
      play(track);
    }
  };

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    toast.info("Tạm thời chưa hỗ trợ Like trực tiếp.");
  };

  const trackDuration = track.duration
    ? formatDuration(track.duration)
    : "0:00";
  const trackLikesCount = track.likes?.length || 0;

  return (
    <div
      className={`flex gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
        isCurrentPlaying
          ? "bg-white dark:bg-[#1f1f1f] border-[#ff5500] shadow-md"
          : "bg-white dark:bg-[#181818] border-gray-100 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/20 hover:shadow-lg hover:-translate-y-0.5"
      }`}
    >
      {/* Header Metadata (Nếu có Repost/Like) */}
      {(metadata?.repostedBy || metadata?.likedBy) && (
        <div className="absolute -top-6 left-0 text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-1.5 ml-1">
          {metadata.repostedBy && (
            <>
              <Repeat size={12} className="text-gray-400" />
              <span>Reposted by {metadata.repostedBy}</span>
            </>
          )}
          {metadata.likedBy && (
            <>
              <Heart size={12} className="text-gray-400" />
              <span>Liked by {metadata.likedBy}</span>
            </>
          )}
          {metadata.createdAt && (
            <span className="ml-1">
              {" "}
              • {formatRelativeTime(metadata.createdAt)}
            </span>
          )}
        </div>
      )}

      {/* Track Image & Play Button */}
      <div
        className="w-20 h-20 md:w-24 md:h-24 bg-gray-200 shrink-0 relative rounded-lg overflow-hidden shadow-inner group"
        onClick={handlePlay}
      >
        <Image
          src={track.imagePath || "/images/default-track.png"}
          alt={track.title}
          fill
          className="object-cover"
        />
        <div
          className={`absolute inset-0 bg-black/30 flex items-center justify-center transition-opacity ${isCurrentPlaying ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
        >
          <div className="w-10 h-10 rounded-full bg-[#ff5500] text-white flex items-center justify-center shadow-lg transform active:scale-95 transition">
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
                onClick={(e) => e.stopPropagation()}
              >
                {track.user?.name || "Unknown Artist"}
              </Link>
              <Link href={`/track/${track.id}`} className="block">
                <h4
                  className={`text-base md:text-lg font-bold truncate ${isCurrentPlaying ? "text-[#ff5500]" : "text-gray-900 dark:text-white"}`}
                >
                  {track.title}
                </h4>
              </Link>
            </div>
            <span className="text-xs text-gray-400 tabular-nums shrink-0 ml-4">
              {trackDuration}
            </span>
          </div>
        </div>

        {/* Stats & Actions */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-4 text-xs text-gray-500 font-medium">
            <span className="flex items-center gap-1.5 bg-gray-100 dark:bg-white/10 px-2 py-1 rounded-full">
              <Play size={10} className="fill-current" />
              {track.playCount.toLocaleString()}
            </span>

            <button
              onClick={handleLike}
              className="flex items-center gap-1.5 hover:text-red-500 transition-colors"
            >
              <Heart size={14} />
              {trackLikesCount}
            </button>

            {/* Comments/Shares có thể được thêm vào đây */}
            <span className="flex items-center gap-1.5 opacity-70">
              <MessageSquare size={14} />
              {/* {track.comments?.length || 0} */}
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
  );
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days < 1) return `${Math.floor(diff / (1000 * 60 * 60))} hours ago`;
  if (days < 7) return `${days} days ago`;
  return date.toLocaleDateString();
}
