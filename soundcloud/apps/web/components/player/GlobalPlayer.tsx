"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePlayerStore } from "@/store/playerStore";
import { PlayerControls } from "./PlayerControls";
import { ProgressBar } from "./ProgressBar";
import { cn } from "@/lib/utils";
import { NextUpList } from "./NextUpList";
import { useAuth } from "@/app/contexts/AuthContext";
import { toast } from "sonner";
import { Heart, ListPlus, UserPlus, UserCheck, ListMusic } from "lucide-react";
import trackApi from "@/lib/api/trackApi";
import userApi from "@/lib/api/usersApi";
import { useAuthStore } from "@/store/authStore";
import { AddToPlaylistModal } from "../playlist/AddToPlaylistModal";
import Link from "next/link";

export function GlobalPlayer() {
  const {
    currentTrack,
    isPlaying,
    toggle,
    volume,
    setVolume,
    currentTime,
    setCurrentTime,
    playNext,
    playPrev,
    queue,
    autoplay,
    repeatMode,
    isShuffle,
    toggleRepeat,
    toggleShuffle,
  } = usePlayerStore();

  // const { user } = useAuth();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [showQueue, setShowQueue] = useState(false);

  const [isFollowed, setIsFollowed] = useState(false);

  const lastTrackIdRef = useRef<string | null>(null);
  const isCountedRef = useRef(false);
  const { user } = useAuthStore();

  const [isLiked, setIsLiked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isAddToPlaylistOpen, setIsAddToPlaylistOpen] = useState(false);

  const isOwner = user?.id === currentTrack?.user?.id;

  // 1. Mount Check
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // --- LOGIC CHECK FOLLOW TỪ API ---
  useEffect(() => {
    // Reset state mỗi khi đổi bài hoặc logout
    if (!currentTrack || !user) {
      setIsLiked(false);
      setIsFollowed(false);
      return;
    }

    const artistId = currentTrack.user?.id; // Lấy ID tác giả bài hát

    // Gọi API check follow nếu có ID tác giả
    if (artistId && artistId !== user.id) {
      userApi
        .checkFollow(artistId)
        .then((res) => {
          setIsFollowed(res.data.isFollowing);
        })
        .catch((err) => {
          console.error("Check follow failed:", err);
          setIsFollowed(false);
        });
    } else {
      setIsFollowed(false);
    }

    trackApi
      .checkLike(currentTrack.id)
      .then((res) => setIsLiked(res.data.isLiked))
      .catch(() => setIsLiked(false));
  }, [currentTrack, user]);

  const handleToggleFollow = async () => {
    if (!user) return toast.error("Please login to follow");
    if (!currentTrack?.user?.id) return;
    if (isOwner) return;

    const artistId = currentTrack.user.id;
    const previousState = isFollowed;

    // Optimistic Update: Cập nhật UI ngay lập tức
    setIsFollowed(!previousState);

    try {
      if (previousState) {
        await userApi.unfollowUser(artistId);
        toast.success(`Unfollowed ${currentTrack.user.name}`);
      } else {
        await userApi.followUser(artistId);
        toast.success(`Following ${currentTrack.user.name}`);
      }
    } catch {
      setIsFollowed(previousState); // Revert nếu lỗi
      toast.error("Failed to update follow status");
    }
  };

  const handleToggleLike = async () => {
    if (!user) return toast.error("Please login to like tracks");
    if (!currentTrack) return;

    // Logic Like tạm thời (giống cũ)
    const previousState = isLiked;
    setIsLiked(!previousState);

    try {
      if (previousState) {
        await trackApi.unlikeTrack(currentTrack.id);
      } else {
        await trackApi.likeTrack(currentTrack.id);
      }
    } catch {
      setIsLiked(previousState);
      toast.error("Failed to update like");
    }
  };

  // 2. Xử lý khi đổi bài hát
  useEffect(() => {
    if (!isMounted || !audioRef.current || !currentTrack) return;

    const audio = audioRef.current;
    const isSongChanged = currentTrack.id !== lastTrackIdRef.current;

    if (isSongChanged) {
      audio.src = currentTrack.audioPath;
      isCountedRef.current = false;

      // Nếu chỉ reload trang mà có currentTime đã lưu -> giữ nguyên
      if (lastTrackIdRef.current === null && currentTime > 0) {
        audio.currentTime = currentTime;
      } else {
        // Nếu là chuyển bài thật -> Reset về 0 và tự Play
        audio.currentTime = 0;
        setCurrentTime(0);
        usePlayerStore.setState({ isPlaying: true });
      }

      lastTrackIdRef.current = currentTrack.id;
    }
  }, [currentTime, currentTrack, isMounted, setCurrentTime]);

  // 3. Sync Play/Pause với thẻ Audio
  // Check Like & Follow status when track changes
  useEffect(() => {
    if (!currentTrack || !user) return;

    // Check Like
    // Note: currentTrack.likes might be available if included in the payload
    // otherwise we might need to fetch it. For now, let's assume we fetch or check API
    // Actually, trackApi.getTrackById includes likes.
    // But currentTrack from store might not have it updated for the current user.
    // Let's use a simple check if we have the data, or call API if needed.
    // For simplicity and accuracy, let's just assume false or check if we have an array.
    // Ideally, we should have an API `checkLike` similar to `checkFollow`.
    // But since we don't, let's try to infer from `currentTrack` if it has `likes` array
    // and that array contains our user ID.
    // If `currentTrack` comes from `getTracks`, it might have `likes` array.
    if ((currentTrack as any).likes) {
      const likes = (currentTrack as any).likes as any[];
      const liked = likes.some((l) => l.userId === user.id);
      setIsLiked(liked);
    } else {
      // Fallback: assume false or maybe fetch track details?
      // Let's leave it as false for now to avoid too many requests,
      // or we could implement checkLike in backend.
      setIsLiked(false);
    }

    // Check Follow
    userApi.checkFollow(currentTrack.userId).then((res) => {
      setIsFollowing(res.data.isFollowing);
    });
  }, [currentTrack, user]);

  const handleLike = async () => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để thích bài hát");
      return;
    }
    if (!currentTrack) return;

    const previousState = isLiked;
    setIsLiked(!previousState); // Optimistic update

    try {
      if (previousState) {
        await trackApi.unlikeTrack(currentTrack.id);
      } else {
        await trackApi.likeTrack(currentTrack.id);
      }
    } catch (error) {
      setIsLiked(previousState); // Revert
      toast.error("Có lỗi xảy ra");
    }
  };

  const handleFollow = async () => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để theo dõi");
      return;
    }
    if (!currentTrack) return;

    const previousState = isFollowing;
    setIsFollowing(!previousState); // Optimistic update

    try {
      if (previousState) {
        await userApi.unfollowUser(currentTrack.userId);
      } else {
        await userApi.followUser(currentTrack.userId);
      }
    } catch (error) {
      setIsFollowing(previousState); // Revert
      toast.error("Có lỗi xảy ra");
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error("Auto-play prevented:", error);
          usePlayerStore.setState({ isPlaying: false });
        });
      }
    } else {
      audio.pause();
    }
  }, [isPlaying, currentTrack]);

  // 4. Sync Volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  // 5. Xử lý sự kiện Audio
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      if (!currentTrack) return;
      const current = audio.currentTime;
      const limit = currentTrack.duration || 0; // Lấy giới hạn từ DB

      // --- 1. LOGIC MỚI: Ép dừng nếu chạy lố thời gian ---
      // Nếu có duration trong DB và thời gian thực >= duration
      if (limit > 0 && current >= limit) {
        audio.pause(); // Dừng audio thật
        audio.currentTime = 0; // Reset về đầu
        handleEnded(); // Gọi hàm xử lý hết bài (để next hoặc dừng hẳn)
        return; // Thoát luôn, không chạy đoạn dưới nữa
      }

      // --- 2. LOGIC CŨ: Cập nhật UI ---
      setCurrentTime(current);

      // --- 3. LOGIC CŨ: Tăng view (Giữ nguyên) ---
      if (currentTrack && current > 10 && !isCountedRef.current) {
        isCountedRef.current = true;
        console.log("📈 Tăng play count cho:", currentTrack.title);

        trackApi
          .increasePlayCount(currentTrack.id)
          .catch((err) => console.error("Lỗi tăng view:", err));
      }
    };

    const handleEnded = () => {
      const { autoplay, playNext, resetTime, repeatMode } = usePlayerStore.getState();
      const audio = audioRef.current;

      // Logic Repeat One: Tự động phát lại bài hiện tại khi hết
      if (repeatMode === "one") {
        if (audio) {
          audio.currentTime = 0;
          audio.play();
        }
        return;
      }

      if (autoplay) {
        playNext();
      } else {
        // Dừng nhạc
        usePlayerStore.setState({ isPlaying: false });

        resetTime();

        if (audio) audio.currentTime = 0;
      }
    };

    const handleLoadedMetadata = () => {
      if (currentTime > 0 && Math.abs(audio.currentTime - currentTime) > 1) {
        audio.currentTime = currentTime;
      }
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [setCurrentTime, currentTime, currentTrack, playNext, autoplay]);

  // Xử lý tua nhạc
  const handleSeek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
    setCurrentTime(time);
  };

  if (!isMounted || !currentTrack) return null;

  return (
    <div className="fixed h-16 bottom-0 left-0 right-0 bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 px-4 md:px-6 py-4 flex flex-col md:flex-row items-center gap-4 text-gray-800 dark:text-white z-50">
      {/* --- LEFT: TRACK INFO --- */}
      <div className="flex items-center gap-3 flex-1 min-w-0 w-full md:w-auto">
        <div className="relative w-10 h-10 shrink-0 group cursor-pointer">
          <Link href={`/tracks/${currentTrack.id}`}>
            <Image
              src={currentTrack.imagePath || "/images/default-cover.jpg"}
              alt={currentTrack.title}
              fill
              className="rounded-[3px] object-cover"
            />
          </Link>
        </div>

        <div className="flex flex-col min-w-0 mr-2">
          <Link href={`/tracks/${currentTrack.id}`}>
            <h4 className="font-medium truncate text-sm leading-tight text-gray-900 dark:text-gray-100">
              {currentTrack.title}
            </h4>
          </Link>

          <Link href={`/artist/${currentTrack.userId}`}>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate hover:underline cursor-pointer">
              {currentTrack.user.name}
            </p>
          </Link>
        </div>

        <div className="hidden lg:flex items-center gap-1 ml-2">
          {/* LIKE BUTTON */}
          <button
            onClick={handleToggleLike}
            className={cn(
              "rounded-full p-2 transition-colors hover:bg-gray-100 dark:hover:bg-white/10 cursor-pointer",
              isLiked
                ? "text-orange-500"
                : "text-gray-400 hover:text-orange-500"
            )}
            title={isLiked ? "Unlike" : "Like"}
          >
            <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
          </button>

          {/* FOLLOW BUTTON (Đã tích hợp API checkFollow) */}
          {!isOwner && (
            <button
              onClick={handleToggleFollow}
              className={cn(
                "rounded-full p-2 transition-colors hover:bg-gray-100 dark:hover:bg-white/10 cursor-pointer",
                isFollowed
                  ? "text-orange-500"
                  : "text-gray-400 hover:text-orange-500"
              )}
              title={isFollowed ? "Unfollow" : "Follow"}
            >
              {isFollowed ? (
                <UserCheck className="h-4 w-4" />
              ) : (
                <UserPlus className="h-4 w-4" />
              )}
            </button>
          )}

          <button className="p-2 cursor-pointer" onClick={() => setIsAddToPlaylistOpen(true)}>
            <ListPlus className="w-4 h-4" />
          </button>
        </div>
      </div>

      <AddToPlaylistModal
        isOpen={isAddToPlaylistOpen}
        onClose={() => setIsAddToPlaylistOpen(false)}
        trackId={currentTrack?.id || null}
      />

      {/* --- CENTER: PROGRESS BAR --- */}
      <div className="flex-1 w-full max-w-xl px-2">
        <ProgressBar
          currentTime={currentTime}
          duration={currentTrack.duration || 0}
          onSeek={handleSeek}
        />
      </div>

      {/* --- RIGHT: CONTROLS --- */}
      <div className="flex-1 flex justify-end">
        <PlayerControls
          isPlaying={isPlaying}
          onPlayPause={toggle}
          onPrev={playPrev} // Gắn hàm lùi
          onNext={playNext} // Gắn hàm tới
          volume={volume}
          onVolumeChange={setVolume}
          repeatMode={repeatMode}
          isShuffle={isShuffle}
          onToggleRepeat={toggleRepeat}
          onToggleShuffle={toggleShuffle}
        />
      </div>

      {/* NEXT UP BUTTON */}
      <button
        onClick={() => setShowQueue(!showQueue)}
        className={cn(
          "p-2 transition-colors relative",
          showQueue ? "text-orange-500" : "text-gray-500 hover:text-orange-500 cursor-pointer"
        )}
      >
        <ListMusic className="w-4 h-4" />
        {/* Dot thông báo nếu có bài trong queue (Optional) */}
        {queue.length > 1 && !showQueue && (
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-orange-500 rounded-full border border-white dark:border-black" />
        )}
      </button>
      {/* --- HIDDEN AUDIO --- */}
      <audio ref={audioRef} preload="metadata" />

      {/* HIỂN THỊ DANH SÁCH CHỜ (POPUP) */}
      {showQueue && <NextUpList onClose={() => setShowQueue(false)} />}
    </div>
  );
}
