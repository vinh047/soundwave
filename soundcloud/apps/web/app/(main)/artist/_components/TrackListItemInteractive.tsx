"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
  Play,
  Heart,
  MessageSquare,
  Repeat,
  MoreHorizontal,
  Pause,
  LucideIcon,
  ListPlus,
  ListMusic,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePlayerStore } from "@/store/playerStore";
import trackApi from "@/lib/api/trackApi";
import { toast } from "sonner";
import { useAuth } from "@/app/contexts/AuthContext";
import { Prisma } from "@repo/database"; // Đảm bảo đường dẫn này đúng với project của bạn
import { TrackCoverPlaceholder } from "@/components/placeholders/TrackCover";
import { useAuthModal } from "@/hooks/use-auth-modal";
import { useAddToPlaylistModal } from "@/store/useAddToPlaylistModal";

// --- TYPES FIX ---
// Sửa lại cú pháp Prisma GetPayload cho đúng chuẩn
type TrackData = Prisma.TrackGetPayload<{
  include: {
    user: true;
    likes: true;
    reposts: true;
    _count: {
      select: { likes: true; reposts: true; comments: true };
    };
  };
}>;

interface TrackListItemInteractiveProps {
  track: TrackData;
}

// --- MAIN COMPONENT ---
export function TrackListItemInteractive({
  track,
}: TrackListItemInteractiveProps) {
  const { user } = useAuth();
  const currentUserId = user?.id;
  const { currentTrack, isPlaying, play, toggle } = usePlayerStore();

  // --- STATE SETUP ---
  const hasUserLiked =
    Array.isArray(track.likes) &&
    track.likes.some((like) => like.userId === currentUserId);
  const hasUserReposted =
    Array.isArray(track.reposts) &&
    track.reposts.some((repost) => repost.userId === currentUserId);

  const [isLiked, setIsLiked] = useState<boolean>(hasUserLiked);
  const [likeCount, setLikeCount] = useState<number>(track._count?.likes || 0);

  const [isReposted, setIsReposted] = useState<boolean>(hasUserReposted);
  const [repostCount, setRepostCount] = useState<number>(
    track._count?.reposts || 0
  );

  // --- EFFECT: Sync state when track prop changes ---
  useEffect(() => {
    // Logic kiểm tra lại mảng likes/reposts dựa trên cấu trúc dữ liệu thực tế (thường chứa object có userId)
    // Nếu mảng likes chỉ chứa id string thì dùng includes, nếu chứa object thì dùng some.
    // Ở đây giả định là object vì Prisma trả về relation array.
    const liked =
      Array.isArray(track.likes) &&
      track.likes.some((like) => like.userId === currentUserId);
    const reposted =
      Array.isArray(track.reposts) &&
      track.reposts.some((repost) => repost.userId === currentUserId);

    setIsLiked(liked);
    setIsReposted(reposted);
    setLikeCount(track._count?.likes || 0);
    setRepostCount(track._count?.reposts || 0);
  }, [track, currentUserId]);

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

  const authModal = useAuthModal();

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
      play(track);
    }
  };

  const waveform = useMemo(() => {
    if (
      track.waveform &&
      Array.isArray(track.waveform) &&
      track.waveform.length > 0
    ) {
      return track.waveform as number[];
    }
    // Fallback waveform generator
    return Array.from({ length: 80 }, (_, i) => {
      const charCode = track.id.charCodeAt(i % track.id.length) || 0;
      return Math.max(0.2, Math.abs(Math.sin(charCode + i)));
    });
  }, [track.waveform, track.id]);

  return (
    <div className="flex gap-4 p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors rounded-lg group border border-transparent hover:border-gray-200 dark:hover:border-gray-800">
      {/* IMAGE SECTION */}
      <Link
        href={`/tracks/${track.id}`}
        className="relative w-40 h-40 shrink-0 cursor-pointer block group/image"
      >
        {track.imagePath ? (
          <Image
            src={track.imagePath || "/images/default-cover.jpg"}
            alt={track.title}
            fill
            className="object-cover shadow-sm rounded-sm hover:opacity-90 transition-opacity"
          />
        ) : (
          <TrackCoverPlaceholder />
        )}
        {/* Optional: Overlay khi hover vào ảnh để play nhanh */}
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover/image:opacity-100 transition-opacity",
            isActive && "opacity-100 bg-black/40"
          )}
        >
          <button
            className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-white shadow-lg transform scale-90 hover:scale-100 transition-transform"
            onClick={(e) => {
              e.preventDefault(); // Ngăn Link navigatition
              handlePlay(e);
            }}
          >
            {isActive && isPlaying ? (
              <Pause className="w-6 h-6 fill-current" />
            ) : (
              <Play className="w-6 h-6 ml-1 fill-current" />
            )}
          </button>
        </div>
      </Link>

      {/* CONTENT SECTION */}
      <div className="flex flex-col flex-1 min-w-0 justify-between py-1">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Play button small (chỉ hiện khi hover row hoặc đang active) */}
            <button
              onClick={handlePlay}
              className={cn(
                "w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white hover:bg-orange-600 transition-all shrink-0 shadow-md"
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

        {/* FOOTER ACTIONS */}
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

// --- HELPER COMPONENTS ---

interface ActionButtonProps {
  icon: LucideIcon;
  label: string;
  count?: number;
  onClick?: (e: React.MouseEvent) => void;
  active?: boolean;
  activeColor?: string;
}

function ActionButton({
  icon: Icon,
  label,
  count,
  onClick,
  active,
  activeColor,
}: ActionButtonProps) {
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

function MoreMenu({ track }: { track: TrackData }) {
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
    // Ép kiểu về any hoặc đúng type của store nếu store định nghĩa khác với prisma payload
    addToQueue(track);
    setIsOpen(false);
    toast.success("Added to Next up");
  };

  const authModal = useAuthModal();
  const { user } = useAuth();

  const uploadModal = useAddToPlaylistModal();

  const handleAddToPlaylist = (e: React.MouseEvent) => {
    setIsOpen(false);
    setIsOpen(false);
    if (!user) {
      authModal.onOpen();
    } else {
      uploadModal.onOpen(track.id);
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <ActionButton
        icon={MoreHorizontal}
        label="More"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        active={isOpen}
        activeColor="border-gray-400 dark:border-gray-500 bg-gray-100 dark:bg-neutral-800"
      />

      {isOpen && (
        <div className="absolute left-0 bottom-full mb-2 w-48 bg-white dark:bg-[#1f1f1f] border border-gray-200 dark:border-[#333] rounded-md shadow-xl z-50 py-1 animate-in fade-in zoom-in-95 duration-100 origin-bottom-left">
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
