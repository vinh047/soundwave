"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Play, Pause, Heart, MoreHorizontal } from "lucide-react";
import { Button } from "../ui2/Button";
import { formatPlayCount, timeAgo } from "@/lib/format";
import { usePlayerStore } from "@/store/playerStore";
import { Prisma } from "@repo/database";
import Link from "next/link";
import { cn } from "@/lib/utils";
import MoreMenu from "../common/MoreMenu";
import trackApi from "@/lib/api/trackApi";
import { useAuth } from "@/app/contexts/AuthContext";
import { toast } from "sonner";

interface TrackCardProps {
  track: Prisma.TrackGetPayload<{ include: { user: true; likes: true } }>;
}

export function TrackCard({ track }: TrackCardProps) {
  const { play, toggle, currentTrack, isPlaying } = usePlayerStore();
  const { user } = useAuth();

  const hasLikedInitially = user
    ? track.likes?.some((like) => like.userId === user.id)
    : false;

  const [isLiked, setIsLiked] = useState(hasLikedInitially);

  useEffect(() => {
    if (user && track.likes) {
      setIsLiked(track.likes.some((like) => like.userId === user.id));
    } else {
      setIsLiked(false);
    }
  }, [user, track.likes]);

  const isCurrentTrack = currentTrack?.id === track.id;
  const isActive = isCurrentTrack && isPlaying;

  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isCurrentTrack) {
      toggle();
    } else {
      play(track);
    }
  };

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error("Please login to like tracks");
      return;
    }

    const previousState = isLiked;
    setIsLiked(!isLiked);

    try {
      if (previousState) {
        await trackApi.unlikeTrack(track.id);
      } else {
        await trackApi.likeTrack(track.id);
      }
    } catch (error) {
      setIsLiked(previousState);
      console.error(error);
    }
  };

  const handleMoreClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div
      className={`
        group relative rounded-lg p-4 transition-all block
        bg-white hover:bg-gray-100 text-gray-900 
        border border-gray-200 shadow-sm
        dark:bg-gray-900 dark:hover:bg-gray-800 dark:text-white 
        dark:border-gray-700
      `}
    >
      <Link
        href={`/tracks/${track.id}`}
        className="absolute inset-0 z-0"
        aria-label={`View track ${track.title}`}
      />

      {/* --- IMAGE AREA --- */}
      <div className="relative group/image">
        <Image
          src={track.imagePath || "/placeholder.png"}
          alt={track.title}
          width={400}
          height={400}
          className="w-full aspect-square object-cover rounded"
        />

        {/* Layer Play Button */}
        <div
          className={cn(
            "absolute inset-0 transition-opacity flex items-center justify-center bg-black/20 dark:bg-black/40",
            isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100",
            "pointer-events-none"
          )}
        >
          <Button
            size="lg"
            className="h-14 w-14 rounded-full p-0 cursor-pointer transition-transform hover:scale-105 pointer-events-auto relative z-10"
            onClick={handlePlayClick}
          >
            {isActive ? (
              <Pause className="h-6 w-6 fill-current text-white" />
            ) : (
              <Play className="h-6 w-6 ml-1 fill-current text-white" />
            )}
          </Button>
        </div>

        {/* Layer Actions (Like + More) */}
        <div
          className="absolute bottom-2 right-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Nút Like */}
          <button
            onClick={handleLikeClick}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-black/50 hover:bg-black/70 hover:scale-105 transition-all text-white backdrop-blur-sm cursor-pointer"
            title={isLiked ? "Unlike" : "Like"}
          >
            <Heart
              className={cn(
                "w-4 h-4 transition-colors",
                isLiked ? "fill-orange-500 text-orange-500" : "text-white"
              )}
            />
          </button>

          {/* Nút More Menu */}
          <div onClick={handleMoreClick}>
            <MoreMenu
              track={track}
              trigger={
                <button className="flex h-8 w-8 items-center justify-center rounded-full bg-black/50 hover:bg-black/70 hover:scale-105 transition-all text-white backdrop-blur-sm cursor-pointer">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              }
            />
          </div>
        </div>
      </div>

      <h3 className="font-semibold mt-3 truncate text-gray-900 dark:text-white relative z-0 pointer-events-none">
        {track.title}
      </h3>

      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 relative z-10 w-fit">
        <Link
          href={`/artist/${track.user.id}`}
          className="hover:underline hover:text-orange-500 transition-colors"
        >
          {track.user.name}
        </Link>
      </p>

      <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400 relative z-0 pointer-events-none">
        <span className="flex items-center gap-1" title="Plays">
          <Play className="w-3 h-3 fill-current" />
          {formatPlayCount(track.playCount)}
        </span>

        <span className="flex items-center gap-1" title="Posted">
          {timeAgo(track.createdAt)}
        </span>
      </div>
    </div>
  );
}
