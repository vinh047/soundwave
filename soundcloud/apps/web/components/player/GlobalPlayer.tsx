"use client";
import { Waveform } from "./Waveform";
import { PlayerControls } from "./PlayerControls";
import Image from "next/image";
import { usePlayerStore } from "@/store/playerStore";

export function GlobalPlayer() {
  const { currentTrack, isPlaying, toggle, volume, setVolume } = usePlayerStore();

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 p-4 flex items-center gap-4 text-white z-50">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Image
          src={currentTrack.imagePath || "/placeholder.png"}
          alt=""
          width={56}
          height={56}
          className="rounded"
        />
        <div className="min-w-0">
          <h4 className="font-medium truncate">{currentTrack.title}</h4>
          <p className="text-sm text-gray-400 truncate">{currentTrack.user.name}</p>
        </div>
      </div>

      <div className="flex-1 max-w-2xl">
        <Waveform url={currentTrack.audioPath} height={60} interactive />
      </div>

      <PlayerControls
        isPlaying={isPlaying}
        onPlayPause={toggle}
        onPrev={() => {}}
        onNext={() => {}}
        volume={volume}
        onVolumeChange={setVolume}
      />
    </div>
  );
}