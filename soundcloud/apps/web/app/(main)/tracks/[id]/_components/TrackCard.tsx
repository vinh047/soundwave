"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

import { Prisma } from "@repo/database";
import { Pause, Play, SkipBack, SkipForward } from "lucide-react";
import WaveformPlayer from "./WaveformPlayer";

export default function TrackCard({
  track,
}: {
  track: Prisma.TrackGetPayload<{ include: { user: true } }>;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  // --- AUDIO LOGIC (Giữ nguyên) ---
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateState = () => {
      setIsPlaying(!audio.paused);
      setCurrentTime(audio.currentTime);
    };
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      audio.currentTime = 0;
    };
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);

    audio.addEventListener("play", updateState);
    audio.addEventListener("pause", updateState);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      audio.removeEventListener("play", updateState);
      audio.removeEventListener("pause", updateState);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      isPlaying ? audioRef.current.pause() : audioRef.current.play();
    }
  };

  const handleSkip = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(
        0,
        Math.min(duration, audioRef.current.currentTime + seconds)
      );
    }
  };

  const handleSeek = (percent: number) => {
    if (audioRef.current && duration > 0) {
      audioRef.current.currentTime = percent * duration;
    }
  };

  return (
    <div>
      {/* LIGHT: bg-white, shadow-sm 
         DARK: bg-transparent (hoặc bg-white/5), text-white
      */}
      <div className="py-6 flex flex-col md:flex-row gap-6 items-stretch">
        {/* --- CỘT TRÁI: ẢNH BÌA --- */}
        <div className="relative group shrink-0 self-center md:self-auto">
          <div className="relative w-48 h-48 md:w-64 md:h-64 overflow-hidden rounded-xl shadow-2xl dark:shadow-black/60 shadow-gray-200/50">
            <Image
              src={track.imagePath || "/images/default-cover.jpg"}
              alt={track.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
          </div>
        </div>

        {/* --- CỘT PHẢI: INFO & PLAYER --- */}
        <div className="flex flex-col justify-between flex-1 gap-4">
          {/* Header & Buttons */}
          <div className="flex items-center justify-between space-y-3">
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-transparent dark:bg-clip-text dark:bg-linear-to-r dark:from-white dark:to-gray-400 line-clamp-1">
                {track.title}
              </h1>
              <p className="text-[#ff6b6b] font-medium text-lg">
                @{track.user.name}
              </p>
            </div>

            {/* Controller Buttons */}
            <div className="flex items-center gap-4 md:gap-6 mt-1">
              <button
                onClick={() => handleSkip(-10)}
                className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition p-2"
              >
                <SkipBack size={24} />
              </button>

              <button
                onClick={togglePlay}
                className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#4ecdc4] hover:bg-[#3dbdb4] flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all text-white"
              >
                {isPlaying ? (
                  <Pause size={28} fill="currentColor" />
                ) : (
                  <Play size={28} fill="currentColor" className="ml-1" />
                )}
              </button>

              <button
                onClick={() => handleSkip(10)}
                className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition p-2"
              >
                <SkipForward size={24} />
              </button>
            </div>
          </div>

          {/* Waveform Visualizer */}
          <div className="w-full mt-auto pt-4 border-t border-gray-200 dark:border-white/10">
            {/* Cần đảm bảo WaveformPlayer hỗ trợ màu dynamic hoặc dùng currentColor */}
            <WaveformPlayer
              track={track}
              currentTime={currentTime}
              duration={duration}
              isPlaying={isPlaying}
              onSeek={handleSeek}
            />
          </div>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={track.audioPath || "/sample.mp3"}
        onEnded={() => setIsPlaying(false)}
      />
    </div>
  );
}
