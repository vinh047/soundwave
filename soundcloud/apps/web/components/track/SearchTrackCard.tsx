"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Play, Heart, MessageSquare, Repeat, Pause } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePlayerStore } from "@/store/playerStore";
import trackApi from "@/lib/api/trackApi";
import { toast } from "sonner";
import { useAuth } from "@/app/contexts/AuthContext";
import MoreMenu, { ActionButton } from "../common/MoreMenu";
import { useAuthModal } from "@/hooks/use-auth-modal";

// --- TYPES ---
interface TrackData {
  id: string;
  title: string;
  imagePath?: string | null;
  audioPath?: string;
  user?: {
    name?: string | null;
  };
  createdAt: string | Date;
  playCount: number;
  waveform?: number[];
  likes?: { userId: string }[];
  reposts?: { userId: string }[];
  _count?: {
    likes: number;
    reposts: number;
    comments: number;
  };
}

interface SearchTrackCardProps {
  track: TrackData;
}

// --- MAIN COMPONENT ---
export function SearchTrackCard({ track }: SearchTrackCardProps) {
  const { user } = useAuth();
  const currentUserId = user?.id;
  const { currentTrack, isPlaying, play, toggle } = usePlayerStore();

  // --- STATE SETUP ---
  const hasUserLiked = Array.isArray(track.likes) && track.likes.length > 0;
  const hasUserReposted =
    Array.isArray(track.reposts) && track.reposts.length > 0;

  const [isLiked, setIsLiked] = useState<boolean>(hasUserLiked);
  const [likeCount, setLikeCount] = useState<number>(track._count?.likes || 0);

  const [isReposted, setIsReposted] = useState<boolean>(hasUserReposted);
  const [repostCount, setRepostCount] = useState<number>(
    track._count?.reposts || 0
  );

  // --- EFFECT: Sync state ---
  useEffect(() => {
    const liked = Array.isArray(track.likes) && track.likes.length > 0;
    const reposted = Array.isArray(track.reposts) && track.reposts.length > 0;

    setIsLiked(liked);
    setIsReposted(reposted);
    setLikeCount(track._count?.likes || 0);
    setRepostCount(track._count?.reposts || 0);
  }, [track]);

  const authModal = useAuthModal();

  // --- HANDLERS ---
  const handleToggleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUserId) return authModal.onOpen();

    const previousState = isLiked;
    setIsLiked(!isLiked);
    setLikeCount((prev) => (previousState ? prev - 1 : prev + 1));

    try {
      if (previousState) {
        await trackApi.unlikeTrack(track.id);
      } else {
        await trackApi.likeTrack(track.id);
      }
    } catch {
      setIsLiked(previousState);
      setLikeCount((prev) => (previousState ? prev + 1 : prev - 1));
      toast.error("Có lỗi xảy ra khi like.");
    }
  };

  const handleToggleRepost = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUserId) return authModal.onOpen();

    const previousState = isReposted;
    setIsReposted(!isReposted);
    setRepostCount((prev) => (previousState ? prev - 1 : prev + 1));

    try {
      if (previousState) {
        await trackApi.unrepostTrack(track.id);
      } else {
        await trackApi.repostTrack(track.id);
      }
    } catch {
      setIsReposted(previousState);
      setRepostCount((prev) => (previousState ? prev + 1 : prev - 1));
      toast.error("Có lỗi xảy ra khi repost.");
    }
  };

  const isActive = currentTrack?.id === track.id;
  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isActive) {
      toggle();
    } else {
      play(track as any);
    }
  };

  const waveform = useMemo(() => {
    if (
      track.waveform &&
      Array.isArray(track.waveform) &&
      track.waveform.length > 0
    ) {
      return track.waveform;
    }
    return Array.from({ length: 80 }, (_, i) => {
      const charCode = track.id.charCodeAt(i % track.id.length) || 0;
      return Math.max(0.2, Math.abs(Math.sin(charCode + i)));
    });
  }, [track.waveform, track.id]);

  return (
    <div className="flex gap-4 p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors rounded-lg group border border-transparent hover:border-gray-200 dark:hover:border-gray-800">
      {/* --- SỬA ĐỔI Ở ĐÂY: Dùng Link bọc ảnh, bỏ overlay play --- */}
      <Link
        href={`/tracks/${track.id}`}
        className="relative w-40 h-40 shrink-0 cursor-pointer block"
      >
        <Image
          src={track.imagePath || "/images/default-cover.jpg"}
          alt={track.title}
          fill
          className="object-cover shadow-sm rounded-sm hover:opacity-90 transition-opacity"
        />
      </Link>

      {/* CONTENT */}
      <div className="flex flex-col flex-1 min-w-0 justify-between py-1">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Đây là nút Play duy nhất còn lại */}
            <button
              onClick={handlePlay}
              className={cn(
                "w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white hover:bg-orange-600 transition-all shrink-0 shadow-md",
                isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              )}
            >
              {isActive && isPlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 ml-1 fill-current" />
              )}
            </button>

            <div className="flex flex-col">
              <span className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                {track.user?.name || "Unknown Artist"}
              </span>
              <Link
                href={`/tracks/${track.id}`}
                className="font-medium text-gray-900 dark:text-gray-200 hover:text-black dark:hover:text-white truncate text-base leading-tight"
              >
                {track.title}
              </Link>
            </div>
          </div>

          <span className="text-xs text-gray-400 whitespace-nowrap">
            {track.createdAt
              ? formatDistanceToNow(new Date(track.createdAt), {
                  addSuffix: true,
                })
              : ""}
          </span>
        </div>

        {/* WAVEFORM */}
        <div
          onClick={handlePlay}
          className="h-12 w-full flex items-end gap-0.5 opacity-60 mt-3 mb-4 cursor-pointer hover:opacity-80 transition-opacity"
        >
          {waveform.map((val: number, index: number) => (
            <div
              key={index}
              className={cn(
                "w-full rounded-t-[1px] transition-colors flex-1",
                isActive ? "bg-orange-500" : "bg-gray-500 dark:bg-gray-400"
              )}
              style={{ height: `${(val * 100).toFixed(1)}%` }}
            />
          ))}
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ActionButton
              icon={Heart}
              label="Like"
              count={likeCount}
              active={isLiked}
              onClick={handleToggleLike}
              activeColor="text-orange-500 border-orange-500"
            />

            <ActionButton
              icon={Repeat}
              label="Repost"
              count={repostCount}
              active={isReposted}
              onClick={handleToggleRepost}
              activeColor="text-green-500 border-green-500"
            />

            <MoreMenu track={track} />
          </div>

          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 font-medium">
            <div className="flex items-center gap-1.5">
              <Play className="w-3 h-3 text-gray-400" />
              <span>{track.playCount?.toLocaleString() || 0}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MessageSquare className="w-3 h-3 text-gray-400" />
              <span>{track._count?.comments || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
