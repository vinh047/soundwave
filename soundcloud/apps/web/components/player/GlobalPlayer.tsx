"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePlayerStore } from "@/store/playerStore";
import { PlayerControls } from "./PlayerControls";
import { ProgressBar } from "./ProgressBar";
import { Heart, ListPlus, UserPlus } from "lucide-react";

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

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !audioRef.current || !currentTrack) return;

    const audio = audioRef.current;

    const isSongChanged = currentTrack.id !== lastTrackIdRef.current;

    if (isSongChanged) {
      audio.src = currentTrack.audioPath;

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
  }, [setCurrentTime, resetTime, currentTime]);

  useEffect(() => {
    // Chỉ log khi đã mounted để tránh rác console bên server
    if (!isMounted) return;

    console.group("🔍 GlobalPlayer Debug Info");

    console.log("1. Trạng thái chung:");
    console.log("   - isMounted:", isMounted);
    console.log("   - isPlaying:", isPlaying);
    console.log("   - Volume:", volume);
    console.log("   - Current Time:", currentTime);

    console.log("2. Dữ liệu bài hát (currentTrack):", currentTrack);
    if (currentTrack) {
      console.log("   - ID:", currentTrack.id);
      console.log("   - Title:", currentTrack.title);
      console.log("   - Audio Path:", currentTrack.audioPath);
      console.log("   - Image Path:", currentTrack.imagePath);

      // Kiểm tra kỹ phần User/Artist xem có bị null không
      console.log("   - User Object:", currentTrack.user);
      console.log("   - User Name:", currentTrack.user?.name);
    } else {
      console.warn(
        "   ⚠️ Chưa có bài hát nào được chọn (currentTrack is null)"
      );
    }

    console.log("3. Thẻ Audio thực tế (HTMLAudioElement):", audioRef.current);
    if (audioRef.current) {
      console.log("   - Src hiện tại:", audioRef.current.src);
      console.log("   - Paused:", audioRef.current.paused);
      console.log("   - ReadyState:", audioRef.current.readyState);
    }

    console.groupEnd();
  }, [currentTrack, isPlaying, isMounted]);

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
          <button className="p-2">
            <Heart className="w-4 h-4" />
          </button>
          <button className="p-2">
            <UserPlus className="w-4 h-4" />
          </button>
          <button className="p-2">
            <ListPlus className="w-4 h-4" />
          </button>
        </div>
      </div>

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
        onPrev={() => {}}
        onNext={() => {}}
        volume={volume}
        onVolumeChange={setVolume}
      />

      {/* --- HIDDEN AUDIO ELEMENT --- */}
      <audio ref={audioRef} preload="metadata" />
    </div>
  );
}
