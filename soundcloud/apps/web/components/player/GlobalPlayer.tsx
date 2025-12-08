"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePlayerStore } from "@/store/playerStore";
import { PlayerControls } from "./PlayerControls";
import { ProgressBar } from "./ProgressBar";
import { Heart, ListPlus, UserPlus } from "lucide-react";
import trackApi from "@/lib/api/trackApi";
import { cn } from "@/lib/utils";
import { NextUpList } from "./NextUpList"; // 👇 Import component danh sách chờ

export function GlobalPlayer() {
  const {
    currentTrack,
    isPlaying,
    toggle,
    volume,
    setVolume,
    currentTime,
    setCurrentTime,
    playNext, // 👇 Lấy hàm chuyển bài từ store
    playPrev, // 👇 Lấy hàm lùi bài từ store
    queue,    // 👇 Lấy queue để check hiển thị chấm đỏ (optional)
  } = usePlayerStore();

  const audioRef = useRef<HTMLAudioElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [showQueue, setShowQueue] = useState(false); // 👇 State bật tắt Popup Next Up

  const lastTrackIdRef = useRef<string | null>(null);
  const isCountedRef = useRef(false);

  // 1. Mount Check
  useEffect(() => {
    setIsMounted(true);
  }, []);

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
      setCurrentTime(audio.currentTime);

      // Logic tính lượt nghe (nghe > 10s)
      if (
        currentTrack &&
        audio.currentTime > 10 &&
        !isCountedRef.current
      ) {
        isCountedRef.current = true;
        console.log("📈 Tăng play count cho:", currentTrack.title);
        
        trackApi
          .increasePlayCount(currentTrack.id)
          .catch((err) => console.error("Lỗi tăng view:", err));
      }
    };

    // 👇 KHI HẾT BÀI -> GỌI PLAY NEXT
    const handleEnded = () => {
      playNext();
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
  }, [setCurrentTime, currentTime, currentTrack, playNext]);

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
          <Image
            src={currentTrack.imagePath || "/images/default-cover.jpg"}
            alt={currentTrack.title}
            fill
            className="rounded-[3px] object-cover"
          />
        </div>
        
        <div className="flex flex-col min-w-0 mr-2">
          <h4 className="font-medium truncate text-sm leading-tight text-gray-900 dark:text-gray-100">
            {currentTrack.title}
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate hover:underline cursor-pointer">
            {currentTrack.user.name}
          </p>
        </div>

        <div className="flex items-center gap-1">
          <button className="p-2 text-gray-500 hover:text-orange-500 transition-colors">
            <Heart className="w-4 h-4" />
          </button>
          <button className="p-2 text-gray-500 hover:text-orange-500 transition-colors hidden sm:block">
            <UserPlus className="w-4 h-4" />
          </button>
          
          {/* 👇 BUTTON TOGGLE NEXT UP LIST */}
          <button 
            onClick={() => setShowQueue(!showQueue)}
            className={cn(
                "p-2 transition-colors relative",
                showQueue ? "text-orange-500" : "text-gray-500 hover:text-orange-500"
            )}
          >
            <ListPlus className="w-4 h-4" />
            {/* Dot thông báo nếu có bài trong queue (Optional) */}
            {queue.length > 1 && !showQueue && (
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-orange-500 rounded-full border border-white dark:border-black" />
            )}
          </button>
        </div>
      </div>

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
        />
      </div>

      {/* --- HIDDEN AUDIO --- */}
      <audio ref={audioRef} preload="metadata" />

      {/* 👇 HIỂN THỊ DANH SÁCH CHỜ (POPUP) */}
      {showQueue && (
          <NextUpList onClose={() => setShowQueue(false)} />
      )}
    </div>
  );
}