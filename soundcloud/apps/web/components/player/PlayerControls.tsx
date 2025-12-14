"use client";

import { useEffect, useRef } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Volume1,
  VolumeX,
  Repeat,
  Shuffle,
} from "lucide-react";

import { Slider } from "../ui2/Slider";
import { Button } from "../ui2/Button";
import { cn } from "@/lib/utils";

export function PlayerControls({
  isPlaying,
  onPlayPause,
  onPrev,
  onNext,
  volume,
  onVolumeChange,
  repeatMode,
  isShuffle,
  onToggleRepeat,
  onToggleShuffle,
}: {
  isPlaying: boolean;
  onPlayPause: () => void;
  onPrev: () => void;
  onNext: () => void;
  volume: number;
  onVolumeChange: (value: number) => void;
  repeatMode: "off" | "all" | "one";
  isShuffle: boolean;
  onToggleRepeat: () => void;
  onToggleShuffle: () => void;
}) {
  const lastVolumeRef = useRef(70);

  useEffect(() => {
    if (volume > 0) {
      lastVolumeRef.current = volume;
    }
  }, [volume]);

  const toggleMute = () => {
    if (volume === 0) {
      onVolumeChange(lastVolumeRef.current);
    } else {
      onVolumeChange(0);
    }
  };

  const VolumeIcon = volume === 0 ? VolumeX : volume < 50 ? Volume1 : Volume2;

  return (
    <div className="flex items-center gap-4 sm:gap-6">
      {/* --- PREV / NEXT / PLAY --- */}
      <div className="flex items-center gap-4">
        <Button
          size="sm"
          variant="ghost"
          onClick={onPrev}
          className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors cursor-pointer"
        >
          <SkipBack className="h-5 w-5" />
        </Button>

        <Button
          size="sm"
          className="h-10 w-10 p-0 cursor-pointer rounded-full"
          onClick={onPlayPause}
        >
          {isPlaying ? (
            <Pause className="h-5 w-5 fill-current" />
          ) : (
            <Play className="h-5 w-5 ml-0.5 fill-current" />
          )}
        </Button>

        <Button
          size="sm"
          variant="ghost"
          onClick={onNext}
          className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors cursor-pointer"
        >
          <SkipForward className="h-5 w-5" />
        </Button>
      </div>

      {/* --- VOLUME CONTROL --- */}
      <div className="hidden md:flex items-center gap-3 w-32 group">
        <button
          onClick={toggleMute}
          className={cn(
            "p-1 rounded-full transition-colors focus:outline-none cursor-pointer",
            volume === 0
              ? "text-gray-400 hover:text-red-500"
              : "text-gray-500 hover:text-orange-500 dark:text-gray-400 dark:hover:text-orange-500"
          )}
          title={volume === 0 ? "Unmute" : "Mute"}
        >
          <VolumeIcon className="h-5 w-5" />
        </button>

        <div className="flex-1">
          <Slider
            value={volume}
            onValueChange={onVolumeChange}
            max={100}
            step={1}
            className="cursor-pointer"
          />
        </div>
      </div>

      {/* --- EXTRA CONTROLS --- */}
      <div className="hidden lg:flex gap-2 border-l border-gray-200 dark:border-gray-800 pl-4">
        <Button
          size="sm"
          variant="ghost"
          onClick={onToggleRepeat}
          className={cn(
            "transition-colors relative",
            repeatMode !== "off"
              ? "text-orange-500 hover:text-orange-600"
              : "text-gray-400 hover:text-orange-500"
          )}
          title={`Repeat: ${repeatMode}`}
        >
          <Repeat className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={onToggleShuffle}
          className={cn(
            "transition-colors",
            isShuffle
              ? "text-orange-500 hover:text-orange-600"
              : "text-gray-400 hover:text-orange-500"
          )}
          title={isShuffle ? "Shuffle On" : "Shuffle Off"}
        >
          <Shuffle className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
