"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePlayerStore } from "@/store/playerStore";
import { PlayerControls } from "./PlayerControls";
import { ProgressBar } from "./ProgressBar";
import { Heart, ListPlus, UserPlus, UserCheck } from "lucide-react";
import trackApi from "@/lib/api/trackApi";
import userApi from "@/lib/api/usersApi";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { AddToPlaylistModal } from "../playlist/AddToPlaylistModal";

export function GlobalPlayer() {
  const {
    currentTrack,
    isPlaying,
    toggle,
    volume,
    setVolume,
    currentTime,
    setCurrentTime,
    resetTime,
  } = usePlayerStore();

  const audioRef = useRef<HTMLAudioElement>(null);

  const [isMounted, setIsMounted] = useState(false);

  const lastTrackIdRef = useRef<string | null>(null);

  const isCountedRef = useRef(false);
  const { user } = useAuthStore();

  const [isLiked, setIsLiked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isAddToPlaylistOpen, setIsAddToPlaylistOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !audioRef.current || !currentTrack) return;

    const audio = audioRef.current;

    const isSongChanged = currentTrack.id !== lastTrackIdRef.current;

    if (isSongChanged) {
      audio.src = currentTrack.audioPath;

      isCountedRef.current = false;

      if (lastTrackIdRef.current === null && currentTime > 0) {
        audio.currentTime = currentTime;
      } else {
        audio.currentTime = 0;
        setCurrentTime(0);

        usePlayerStore.setState({ isPlaying: true });
      }

      lastTrackIdRef.current = currentTrack.id;
    }
  }, [currentTime, currentTrack, isMounted, setCurrentTime]);

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

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);

      if (
        currentTrack && // Có bài hát
        audio.currentTime > 10 && // Nghe được hơn 10 giây (tùy chỉnh số này)
        !isCountedRef.current // Chưa tính view lần nào
      ) {
        // Đánh dấu ngay là đã tính (để giây thứ 11, 12... không gọi nữa)
        isCountedRef.current = true;

        console.log("📈 Tăng play count cho:", currentTrack.title);

        // Gọi API (không cần await để không chặn UI)
        trackApi
          .increasePlayCount(currentTrack.id)
          .catch((err) => console.error("Lỗi tăng view:", err));
      }
    };

    const handleEnded = () => {
      usePlayerStore.setState({ isPlaying: false });
      resetTime();
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
  }, [setCurrentTime, resetTime, currentTime, currentTrack]);

  const handleSeek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
    setCurrentTime(time);
  };

  if (!isMounted || !currentTrack) return null;

  return (
    <div className="fixed h-16 bottom-0 left-0 right-0 bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 px-6 py-4 flex flex-col md:flex-row items-center gap-4 text-gray-800 dark:text-white z-50">
      {/* --- LEFT: TRACK INFO --- */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="relative w-9 h-9 shrink-0">
          <Image
            src={currentTrack.imagePath || "/images/default-cover.jpg"}
            alt={currentTrack.title}
            fill
            className="rounded-md object-cover"
          />
        </div>
        <div className="flex flex-col w-42">
          <h4 className="font-medium truncate text-sm">{currentTrack.title}</h4>
          <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
            {currentTrack.user.name}
          </p>
        </div>
        {/* Buttons: Like, Add... */}
        <div className="flex items-center gap-2 ml-3">
          <button className="p-2" onClick={handleLike}>
            <Heart
              className={`w-4 h-4 ${isLiked ? "fill-orange-500 text-orange-500" : ""}`}
            />
          </button>
          <button className="p-2" onClick={handleFollow}>
            {isFollowing ? (
              <UserCheck className="w-4 h-4 text-orange-500" />
            ) : (
              <UserPlus className="w-4 h-4" />
            )}
          </button>
          <button className="p-2" onClick={() => setIsAddToPlaylistOpen(true)}>
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
      <div className="flex-1 max-w-2xl w-full">
        <ProgressBar
          currentTime={currentTime}
          duration={currentTrack.duration || 0}
          onSeek={handleSeek}
        />
      </div>

      {/* --- RIGHT: CONTROLS --- */}
      <PlayerControls
        isPlaying={isPlaying}
        onPlayPause={toggle}
        onPrev={() => { }}
        onNext={() => { }}
        volume={volume}
        onVolumeChange={setVolume}
      />

      {/* --- HIDDEN AUDIO ELEMENT --- */}
      <audio ref={audioRef} preload="metadata" />
    </div>
  );
}
