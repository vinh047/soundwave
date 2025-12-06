"use client";

import { useEffect, useRef } from "react";
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
    // Không cần dùng setDuration ở đây nếu track.duration đã có trong DB
    // Nhưng nếu muốn audio tự update duration thật (phòng khi DB sai), có thể dùng
  } = usePlayerStore();

  const audioRef = useRef<HTMLAudioElement>(null);

  // Sync time
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => {
      resetTime();
      usePlayerStore.setState({ isPlaying: false }); // Auto pause khi hết bài
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [setCurrentTime, resetTime]);

  // Sync Play/Pause
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    if (isPlaying) {
      audio.play().catch((e) => console.log("Play interrupted", e));
    } else {
      audio.pause();
    }
  }, [isPlaying, currentTrack]);

  // Load track
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    // Model: audioPath là bắt buộc (String)
    audio.src = currentTrack.audioPath;
    audio.load();
    resetTime();
  }, [currentTrack, resetTime]);
  // Lưu ý: bỏ isPlaying khỏi dependency này để tránh reload khi pause/play

  // Volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const handleSeek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
    setCurrentTime(time);
  };

  if (!currentTrack) return null;

  // Xử lý fallback cho duration (vì model là Int?)
  const trackDuration = currentTrack.duration || 0;

  return (
    <div className="fixed h-16 bottom-0 left-0 right-0 bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 px-6 py-4 flex flex-col md:flex-row items-center gap-4 text-gray-800 dark:text-white z-50">
      {/* Left: Info */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="relative w-9 h-9 shrink-0">
          <Image
            src={currentTrack.imagePath || "/images/default-cover.jpg"}
            alt="cover"
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

        {/* Actions */}
        <div className="flex items-center gap-2 ml-3">
          <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
            <Heart className="w-4 h-4 text-gray-600 dark:text-gray-300 hover:text-red-500" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
            <UserPlus className="w-4 h-4 text-gray-600 dark:text-gray-300 hover:text-red-500" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
            <ListPlus className="w-4 h-4 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      </div>

      {/* Center: Progress */}
      <div className="flex-1 max-w-2xl w-full">
        <ProgressBar
          currentTime={currentTime}
          duration={trackDuration}
          onSeek={handleSeek}
        />
      </div>

      {/* Right: Controls */}
      <PlayerControls
        isPlaying={isPlaying}
        onPlayPause={toggle}
        onPrev={() => {}}
        onNext={() => {}}
        volume={volume}
        onVolumeChange={setVolume}
      />

      <audio ref={audioRef} />
    </div>
  );
}
