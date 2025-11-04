"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

import { usePlayerStore } from "@/store/playerStore";
import { PlayerControls } from "./PlayerControls";
import { ProgressBar } from "./ProgressBar";
import { Heart, ListPlus, UserPlus } from "lucide-react";

// ---- Global Player ----
export function GlobalPlayer() {
  const { currentTrack, isPlaying, toggle, volume, setVolume } =
    usePlayerStore();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoaded = () => setDuration(audio.duration);

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoaded);

    if (currentTrack) {
      audio.pause();
      audio.load();
      if (isPlaying) {
        audio.oncanplay = () => audio.play().catch(() => {});
      }
    }

    // Khi toggle play/pause
    if (!currentTrack) return;
    if (isPlaying) audio.play().catch(() => {});
    else audio.pause();

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoaded);
      audio.oncanplay = null;
    };
  }, [isPlaying, currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const handleSeek = (time: number) => {
    if (audioRef.current) audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 px-6 py-4 flex flex-col md:flex-row items-center gap-4 text-white z-50">
      {/* Left: Track Info */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Ảnh bài hát */}
        <Image
          src={currentTrack.imagePath || "/placeholder.png"}
          alt="cover"
          width={48}
          height={48}
          className="rounded-md object-cover"
        />

        {/* Thông tin bài hát */}
        <div className="flex flex-col w-42">
          <h4 className="font-medium truncate">{currentTrack.title}</h4>
          <p className="text-sm text-gray-400 truncate">
            {currentTrack.user.name}
          </p>
        </div>

        {/* Hành động (tym + thêm hàng chờ) */}
        <div className="flex items-center gap-2 ml-3">
          <button
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
            title="Yêu thích"
          >
            <Heart className="w-4 h-4 text-gray-300 hover:text-red-500" />
          </button>

          <button
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
            title="Theo dõi"
          >
            <UserPlus className="w-4 h-4 text-gray-300 hover:text-red-500" />
          </button>

          <button
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
            title="Thêm vào hàng chờ"
          >
            <ListPlus className="w-4 h-4 text-gray-300 hover:text-white" />
          </button>
        </div>
      </div>

      {/* Center: Progress Bar */}
      <div className="flex-1 max-w-2xl w-full">
        <ProgressBar
          currentTime={currentTime}
          duration={duration}
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

      <audio
        ref={audioRef}
        src={currentTrack.audioPath || "/SoundHelix-Song-1.mp3"}
      />
    </div>
  );
}
