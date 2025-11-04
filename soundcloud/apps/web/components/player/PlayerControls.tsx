import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Repeat,
  Shuffle,
} from "lucide-react";

import { Slider } from "../ui2/Slider";
import { Button } from "../ui2/Button";

// ---- Player Controls ----
export function PlayerControls({
  isPlaying,
  onPlayPause,
  onPrev,
  onNext,
  volume,
  onVolumeChange,
}: {
  isPlaying: boolean;
  onPlayPause: () => void;
  onPrev: () => void;
  onNext: () => void;
  volume: number;
  onVolumeChange: (value: number) => void;
}) {
  return (
    <div className="flex items-center gap-4">
      <Button size="sm" variant="ghost" onClick={onPrev}>
        <SkipBack className="h-5 w-5" />
      </Button>
      <Button size="sm" className="h-10 w-10 p-0 cursor-pointer" onClick={onPlayPause}>
        {isPlaying ? (
          <Pause className="h-5 w-5" />
        ) : (
          <Play className="h-5 w-5 ml-0.5" />
        )}
      </Button>
      <Button size="sm" variant="ghost" onClick={onNext}>
        <SkipForward className="h-5 w-5" />
      </Button>

      <div className="hidden md:flex items-center gap-2 w-24">
        <Volume2 className="h-4 w-4 text-gray-400" />
        <Slider
          value={volume}
          onValueChange={onVolumeChange}
          max={100}
          step={1}
        />
      </div>

      <div className="hidden lg:flex gap-2">
        <Button size="sm" variant="ghost">
          <Repeat className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="ghost">
          <Shuffle className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
