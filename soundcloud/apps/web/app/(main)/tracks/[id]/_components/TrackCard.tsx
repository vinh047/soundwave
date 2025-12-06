"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { Pause, Play, SkipBack, SkipForward } from "lucide-react";
import WaveformPlayer from "./WaveformPlayer";
import { usePlayerStore, TrackWithUser } from "@/store/playerStore";

export default function TrackCard({ track }: { track: TrackWithUser }) {
  const {
    currentTrack,
    isPlaying,
    play,
    toggle,
    currentTime: globalCurrentTime,
    duration: globalDurationState,
    setDuration: setGlobalDuration,
    setCurrentTime,
  } = usePlayerStore();

  const isCurrent = currentTrack?.id === track.id;
  const localAudioRef = useRef<HTMLAudioElement>(null);

  // Nếu bài hát đang chơi, ta ưu tiên dùng duration từ DB trước, nếu null mới lấy từ audio
  const displayDuration = isCurrent
    ? track.duration || globalDurationState
    : track.duration || 0;

  // Chỉ dùng localAudio để lấy metadata nếu DB chưa có duration
  useEffect(() => {
    const audio = localAudioRef.current;
    if (!audio) return;

    // Nếu track DB đã có duration rồi thì không cần load thẻ audio ẩn này nữa để tối ưu
    if (track.duration) return;

    const onLoaded = () => {
      // Chỉ cập nhật nếu đang là bài hiện tại và DB thiếu duration
      if (isCurrent && !track.duration) {
        setGlobalDuration(audio.duration);
      }
    };
    audio.addEventListener("loadedmetadata", onLoaded);
    return () => audio.removeEventListener("loadedmetadata", onLoaded);
  }, [isCurrent, setGlobalDuration, track.duration]);

  const handleSkip = (sec: number) => {
    // Logic tìm global audio element hơi thủ công nhưng giữ nguyên theo code cũ của bạn
    const globalAudio = document.querySelector("audio") as HTMLAudioElement;
    // Lưu ý: nên tìm cách access ref tốt hơn trong tương lai
    if (!globalAudio || !displayDuration) return;

    const nextTime = Math.max(
      0,
      Math.min(displayDuration, globalAudio.currentTime + sec)
    );
    globalAudio.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  const handleSeek = (p: number) => {
    const globalAudio = document.querySelector("audio") as HTMLAudioElement;
    if (!globalAudio || !displayDuration) return;

    const nextTime = p * displayDuration;
    globalAudio.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  const handlePlay = () => {
    if (!isCurrent) {
      play(track);
    } else {
      toggle();
    }
  };

  const displayCurrentTime = isCurrent ? globalCurrentTime : 0;
  const trackForWaveform = isCurrent ? currentTrack : track;

  return (
    <div>
      <div className="py-6 flex flex-col md:flex-row gap-6 items-stretch">
        {/* Cover */}
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

        {/* Info + Controls */}
        <div className="flex flex-col justify-between flex-1 gap-4">
          <div className="flex items-center justify-between space-y-3">
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-transparent dark:bg-clip-text dark:bg-linear-to-r dark:from-white dark:to-gray-400 line-clamp-1">
                {track.title}
              </h1>
              <p className="text-[#ff6b6b] font-medium text-lg">
                @{track.user.name}
              </p>
            </div>

            <div className="flex items-center gap-4 md:gap-6 mt-1">
              <button
                onClick={() => handleSkip(-10)}
                className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition p-2"
              >
                <SkipBack size={24} />
              </button>

              <button
                onClick={handlePlay}
                className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#4ecdc4] hover:bg-[#3dbdb4] flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all text-white"
              >
                {isCurrent && isPlaying ? (
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

          {/* Waveform */}
          <div className="w-full mt-auto pt-4 border-t border-gray-200 dark:border-white/10">
            <WaveformPlayer
              track={trackForWaveform}
              currentTime={displayCurrentTime}
              duration={displayDuration}
              isPlaying={isCurrent ? isPlaying : false}
              onSeek={handleSeek}
            />
          </div>
        </div>
      </div>

      {/* Hidden audio: Chỉ render nếu chưa có duration trong DB */}
      {!track.duration && (
        <audio ref={localAudioRef} src={track.audioPath} className="hidden" />
      )}
    </div>
  );
}
