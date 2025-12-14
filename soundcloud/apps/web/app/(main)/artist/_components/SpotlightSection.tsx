"use client";

import Image from "next/image";
import {
  Play,
  Pause,
  Heart,
  Repeat,
  Share2,
  MessageSquare,
  MoreHorizontal,
  ListPlus,
  ListMusic,
  LucideIcon,
} from "lucide-react";

import { usePlayerStore } from "@/store/playerStore";
import { Prisma } from "@repo/database";
import WaveformPlayer from "../../tracks/[id]/_components/WaveformPlayer";
import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAuth } from "@/app/contexts/AuthContext";
import trackApi from "@/lib/api/trackApi";
import ShareModal from "@/components/modals/ShareModal";
import { formatDistanceToNow } from "date-fns";
import { TrackCoverPlaceholder } from "@/components/placeholders/TrackCover";

// --- TYPES CẬP NHẬT: Thêm _count cho thống kê nhanh ---
type SpotlightTrack = Prisma.TrackGetPayload<{
  include: {
    user: true;
    likes: true;
    reposts: true;
    _count: {
      select: { likes: true; reposts: true; comments: true };
    };
  };
}>;

interface SpotlightSectionProps {
  track: SpotlightTrack;
}

// ========================================================
// --- HELPER COMPONENTS (ActionBtn & MoreMenu) ---
// ========================================================

// Utility Component: ActionBtn (Cập nhật để hỗ trợ active state)
interface ActionBtnProps {
  icon: LucideIcon;
  label: string | number;
  count?: number;
  activeColor?: string;
  onClick?: (e: React.MouseEvent) => void;
  active?: boolean;
  fillIcon?: boolean;
}

function ActionBtn({
  icon: Icon,
  label,
  count,
  activeColor = "hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-500/10",
  onClick,
  active = false,
}: ActionBtnProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 px-2.5 py-1 border rounded-[3px] text-xs font-medium transition-colors bg-transparent",
        active
          ? cn(activeColor, "bg-gray-50 dark:bg-white/5")
          : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500"
      )}
    >
      <Icon className={cn("w-3.5 h-3.5", active && "fill-current")} />
      <span className="hidden sm:inline">{label}</span>
      {count !== undefined && count > 0 && (
        <span className={cn(active ? "text-current" : "text-gray-400")}>
          {count}
        </span>
      )}
    </button>
  );
}

// Utility Component: MoreMenu (Tái sử dụng từ TrackListItemInteractive)
function MoreMenu({ track }: { track: SpotlightTrack }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const { addToQueue } = usePlayerStore();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNextUp = (e: React.MouseEvent) => {
    e.stopPropagation();

    addToQueue(track);
    setIsOpen(false);
    toast.success("Added to Next up");
  };

  const handleAddToPlaylist = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
    toast.info("Open Playlist Modal...");
  };

  return (
    <div className="relative" ref={menuRef}>
      <ActionBtn
        icon={MoreHorizontal}
        label="More"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        active={isOpen}
      />

      {isOpen && (
        <div className="absolute right-0 bottom-full mb-2 w-48 bg-white dark:bg-[#1f1f1f] border border-gray-200 dark:border-[#333] rounded-md shadow-xl z-50 py-1 animate-in fade-in zoom-in-95 duration-100 origin-bottom-right">
          <button
            onClick={handleNextUp}
            className="w-full text-left px-3 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#333] flex items-center gap-2 transition-colors"
          >
            <ListPlus className="w-4 h-4" />
            Add to Next up
          </button>

          <button
            onClick={handleAddToPlaylist}
            className="w-full text-left px-3 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#333] flex items-center gap-2 transition-colors"
          >
            <ListMusic className="w-4 h-4" />
            Add to Playlist
          </button>
        </div>
      )}
    </div>
  );
}

// ========================================================
// --- MAIN COMPONENT: SpotlightSection ---
// ========================================================

export default function SpotlightSection({ track }: SpotlightSectionProps) {
  const { currentTrack, isPlaying, toggle, currentTime, setCurrentTime } =
    usePlayerStore();
  const { user } = useAuth();
  const currentUserId = user?.id;

  const isActiveTrack = currentTrack?.id === track.id;
  const isShowPlaying = isActiveTrack ? isPlaying : false;
  const showCurrentTime = isActiveTrack ? currentTime : 0;
  const duration = track.duration || 0;

  const hasUserLikedInitial = useMemo(
    () =>
      Array.isArray(track.likes) &&
      track.likes.some((like) => like.userId === currentUserId),
    [track.likes, currentUserId]
  );

  const hasUserRepostedInitial = useMemo(
    () =>
      Array.isArray(track.reposts) &&
      track.reposts.some((repost) => repost.userId === currentUserId),
    [track.reposts, currentUserId]
  );

  const [isLiked, setIsLiked] = useState<boolean>(hasUserLikedInitial);
  const [likeCount, setLikeCount] = useState<number>(track._count?.likes || 0);

  const [isReposted, setIsReposted] = useState<boolean>(hasUserRepostedInitial);
  const [repostCount, setRepostCount] = useState<number>(
    track._count?.reposts || 0
  );

  useEffect(() => {
    setIsLiked(hasUserLikedInitial);
    setIsReposted(hasUserRepostedInitial);
    setLikeCount(track._count?.likes || 0);
    setRepostCount(track._count?.reposts || 0);
  }, [track, currentUserId, hasUserLikedInitial, hasUserRepostedInitial]);

  const handleToggleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUserId) return toast.error("Vui lòng đăng nhập để thực hiện.");

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
    if (!currentUserId) return toast.error("Vui lòng đăng nhập.");

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

  const handlePlayClick = () => {
    if (isActiveTrack) {
      toggle();
    } else {
      usePlayerStore.setState({
        currentTrack: track,
        isPlaying: true,
        currentTime: 0,
      });
    }
  };

  const handleSeek = (percent: number) => {
    const newTime = percent * duration;

    if (isActiveTrack) {
      const globalAudio = document.querySelector("audio") as HTMLAudioElement;
      if (globalAudio) {
        globalAudio.currentTime = newTime;
      }
      setCurrentTime(newTime);
    } else {
      usePlayerStore.setState({
        currentTrack: track,
        isPlaying: true,
        currentTime: newTime,
      });
    }
  };

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/tracks/${track.id}`
      : `https://yourdomain.com/tracks/${track.id}`;

  const shareTitle = `Check out "${track.title}" by ${track.user.name} on SoundWave`;

  const formattedDate = track.createdAt
    ? formatDistanceToNow(new Date(track.createdAt), { addSuffix: true })
    : "";

  return (
    <div className="mb-10 group">
      <div className="flex items-center justify-between mb-4 px-1">
        <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
          Spotlight Track
        </h3>
        <span className="text-xs font-medium px-2 py-1 rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
          Featured
        </span>
      </div>

      {/* Main Card Container with Gradient Border Effect */}
      <div className="relative p-px rounded-lg  dark:to-pink-700/50">
        <div className="relative p-5 sm:p-6 flex flex-col sm:flex-row gap-6 sm:gap-8 overflow-hidden bg-white dark:bg-zinc-900 rounded-lg">
          {/* Background Glow Effect (Optional styling) */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-lg blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

          {/* 1. Image Section - Elevated Look */}
          <div className="relative shrink-0 mx-auto sm:mx-0">
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden shadow-2xl shadow-gray-200 dark:shadow-black/50 group-hover:scale-[1.02] transition-transform duration-500 ease-out">
              {track.imagePath ? (
                <Image
                  src={track.imagePath || "/images/default-track.png"}
                  alt={track.title}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <TrackCoverPlaceholder />
              )}

              {/* Dark Overlay on Hover */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Link href={`/tracks/${track.id}`}>
                {/* Center Play Button */}
                <div className="absolute inset-0 flex items-center justify-center cursor-pointer">
                  <div
                    className={`
                      w-16 h-16 rounded-full flex 
                      bg-orange-500 items-center justify-center text-white
                      shadow-lg border border-white/20 dark:border-white/10
                      transition-all duration-300 transform
                      ${isShowPlaying ? "scale-100 opacity-100" : "scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100"}
                    `}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();

                      handlePlayClick();
                    }}
                  >
                    {isShowPlaying ? (
                      <Pause size={28} fill="currentColor" />
                    ) : (
                      <Play size={28} fill="currentColor" className="ml-1" />
                    )}
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* 2. Info & Waveform Section */}
          <div className="flex-1 flex flex-col justify-between min-w-0 z-10">
            {/* Top Info */}
            <div className="flex flex-col gap-1 mb-4 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                <button
                  onClick={handlePlayClick}
                  className="sm:hidden w-8 h-8 rounded-lg bg-orange-500 text-white flex items-center justify-center"
                >
                  {isShowPlaying ? (
                    <Pause size={14} fill="currentColor" />
                  ) : (
                    <Play size={14} fill="currentColor" className="ml-0.5" />
                  )}
                </button>
                <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight leading-tight truncate">
                  {track.title}
                </h2>
              </div>

              <div className="flex items-center justify-center sm:justify-start gap-2 text-base sm:text-lg text-gray-500 dark:text-gray-400 font-medium">
                <Link
                  href={`/user/${track.user.id}`}
                  className="hover:text-orange-500 transition-colors cursor-pointer"
                >
                  {track.user.name}
                </Link>
                <span className="text-gray-300 dark:text-gray-600">•</span>
                <span className="text-sm text-gray-400">{formattedDate}</span>
              </div>
            </div>

            {/* Waveform Area */}
            <div className="flex-1 h-16 flex items-center py-2">
              <div className="relative w-full h-20 -top-10">
                <WaveformPlayer
                  track={track}
                  currentTime={showCurrentTime}
                  duration={duration}
                  isPlaying={isShowPlaying}
                  onSeek={handleSeek}
                />
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="flex flex-wrap items-center justify-between pt-4 border-t border-gray-100 dark:border-white/5">
              {/* Left Actions */}
              <div className="flex items-center gap-2">
                <ActionBtn
                  icon={Heart}
                  label="Like"
                  count={likeCount || 0}
                  onClick={handleToggleLike}
                  active={isLiked}
                  activeColor="text-red-500"
                  fillIcon={true}
                />
                <ActionBtn
                  icon={Repeat}
                  label="repost"
                  count={repostCount || 0}
                  onClick={handleToggleRepost}
                  active={isReposted}
                  activeColor="text-green-500"
                  fillIcon={true}
                />
                <ShareModal
                  shareUrl={shareUrl}
                  shareTitle={shareTitle}
                  trigger={
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 border border-transparent hover:border-gray-200 dark:hover:border-white/10 transition-all duration-200 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-500/10">
                      <Share2 size={18} />
                      <span>Share</span>
                    </button>
                  }
                />

                <MoreMenu track={track} />
              </div>

              {/* Right Stats */}
              <div className="flex items-center gap-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                <div className="flex items-center gap-1.5">
                  <Play size={14} />
                  <span>{track.playCount?.toLocaleString() || 0} Plays</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MessageSquare size={14} />
                  <span>{track._count?.comments || 0} Comments</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
