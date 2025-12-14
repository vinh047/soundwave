// fileName: SpotlightSection.tsx
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
} from "lucide-react";

import { usePlayerStore } from "@/store/playerStore";
import { Prisma } from "@repo/database";
import WaveformPlayer from "../../tracks/[id]/_components/WaveformPlayer";
import React, { useState } from "react";
import Link from "next/link";
import ShareModal from "@/components/modals/ShareModal";

type SpotlightTrack = Prisma.TrackGetPayload<{
  include: {
    user: true;
    likes: true;
    reposts: true;
    comments: true;
  };
}>;

interface SpotlightSectionProps {
  track: SpotlightTrack;
}

// Utility Component (Giữ nguyên)
interface ActionBtnProps {
  icon: React.ReactNode;
  label: string | number;
  activeColor?: string;
  onClick?: () => void;
}

function ActionBtn({
  icon,
  label,
  activeColor = "hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-500/10",
  onClick,
}: ActionBtnProps) {
  return (
    <button
      onClick={onClick}
      className={`
            flex items-center gap-1.5 px-3 py-1.5 rounded-full 
            text-sm font-medium text-gray-600 dark:text-gray-300 
            border border-transparent hover:border-gray-200 dark:hover:border-white/10
            transition-all duration-200
            ${activeColor}
        `}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

export default function SpotlightSection({ track }: SpotlightSectionProps) {
  const { currentTrack, isPlaying, toggle, currentTime, setCurrentTime } =
    usePlayerStore();

  const isActiveTrack = currentTrack?.id === track.id;
  const isShowPlaying = isActiveTrack ? isPlaying : false;
  const showCurrentTime = isActiveTrack ? currentTime : 0;
  const duration = track.duration || 0;

  const handlePlayClick = () => {
    if (isActiveTrack) {
      toggle();
    } else {
      // Khi click Play/Pause, BẮT ĐẦU bài mới từ 0
      usePlayerStore.setState({
        currentTrack: track,
        isPlaying: true,
        currentTime: 0,
      });
    }
  };

  const handleSeek = (percent: number) => {
    const newTime = percent * duration;

    // 1. Nếu là bài hát đang active, chỉ cần tua (seek)
    if (isActiveTrack) {
      // Cần tìm audio element để tua vật lý
      const globalAudio = document.querySelector("audio") as HTMLAudioElement;
      if (globalAudio) {
        globalAudio.currentTime = newTime;
      }
      setCurrentTime(newTime);
    } else {
      // 2. Nếu là bài hát KHÁC, CHUYỂN BÀI VÀ BẮT ĐẦU TỪ VỊ TRÍ SEEK
      usePlayerStore.setState({
        currentTrack: track,
        isPlaying: true,
        currentTime: newTime, // ✅ Khởi tạo bài mới tại thời điểm seek
      });
      // HỆ THỐNG PLAYER CONTROLLER bên ngoài sẽ nhận state này và xử lý tải/tua.
    }
  };

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/tracks/${track.id}`
      : `https://yourdomain.com/tracks/${track.id}`;

  const shareTitle = `Check out "${track.title}" by ${track.user.name} on SoundWave`;

  return (
    <div className="mb-10 group">
      <div className="flex items-center justify-between mb-4 px-1">
        <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
          Spotlight Track
        </h3>
        <span className="text-xs font-medium px-2 py-1 rounded-full bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
          Featured
        </span>
      </div>

      {/* Main Card Container with Gradient Border Effect */}
      <div className="relative p-px rounded-lg ">
        <div className="relative p-5 sm:p-6 flex flex-col sm:flex-row gap-6 sm:gap-8 overflow-hidden">
          {/* Background Glow Effect (Optional styling) */}
          <div className="absolute top-0 right-0 w-64 h-64  rounded-lg  -translate-y-1/2 translate-x-1/2 pointer-events-none" />

          {/* 1. Image Section - Elevated Look */}
          <div className="relative shrink-0 mx-auto sm:mx-0">
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden shadow-2xl shadow-gray-200 dark:shadow-black/50 group-hover:scale-[1.02] transition-transform duration-500 ease-out">
              <Image
                src={track.imagePath || "/images/default-track.png"}
                alt={track.title}
                fill
                className="object-cover"
                priority
              />

              {/* Dark Overlay on Hover */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Link href={`/tracks/${track.id}`}>
                {/* Center Play Button */}
                <div className="absolute inset-0 flex items-center justify-center cursor-pointer">
                  <div
                    className={`
                                     w-16 h-16 rounded-full flex items-center justify-center 
                                     bg-white/90 dark:bg-black/60 backdrop-blur-md text-orange-600 dark:text-orange-500 
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
                  className="sm:hidden w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center"
                >
                  {isShowPlaying ? (
                    <Pause size={14} fill="currentColor" />
                  ) : (
                    <Play size={14} fill="currentColor" className="ml-0.5" />
                  )}
                </button>
                <h2 className="text-2xl sm:text-xl font-black text-gray-900 dark:text-white tracking-tight leading-tight truncate">
                  {track.title}
                </h2>
              </div>

              <div className="flex items-center justify-center sm:justify-start gap-2 text-base sm:text-lg text-gray-500 dark:text-gray-400 font-medium">
                <span className="hover:text-orange-500 transition-colors cursor-pointer">
                  {track.user.name}
                </span>
                <span className="text-gray-300 dark:text-gray-600">•</span>
                <span className="text-sm text-gray-400">2 months ago</span>
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
            <div className="flex flex-wrap items-center justify-between  border-t border-gray-100 dark:border-white/5">
              {/* Left Actions */}
              <div className="flex items-center gap-2">
                <ActionBtn
                  icon={<Heart size={18} />}
                  label={track.likes?.length || 0}
                  activeColor="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                />
                <ActionBtn
                  icon={<Repeat size={18} />}
                  label={track.reposts?.length || 0}
                  activeColor="text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20"
                />
                <ShareModal
                  shareUrl={shareUrl}
                  shareTitle={shareTitle}
                  trigger={
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-gray-600 dark:text-gray-300 border border-transparent hover:border-gray-200 dark:hover:border-white/10 transition-all duration-200 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-500/10">
                      <Share2 size={18} />
                      <span>Share</span>
                    </button>
                  }
                />
                <button className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition rounded-full hover:bg-gray-100 dark:hover:bg-white/5">
                  <MoreHorizontal size={18} />
                </button>
              </div>

              {/* Right Stats */}
              <div className="flex items-center gap-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                <div className="flex items-center gap-1.5">
                  <Play size={14} />
                  <span>{track.playCount.toLocaleString()} Plays</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MessageSquare size={14} />
                  <span>{track.comments?.length || 0} Comments</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
