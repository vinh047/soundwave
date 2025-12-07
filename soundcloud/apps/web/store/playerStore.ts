import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Prisma } from "@repo/database";

export type TrackWithUser = Prisma.TrackGetPayload<{
  include: { user: true };
}>;

interface PlayerState {
  currentTrack: TrackWithUser | null;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;

  play: (track: TrackWithUser) => void;
  toggle: () => void;
  setVolume: (volume: number) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  resetTime: () => void;
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set) => ({
      currentTrack: null,
      isPlaying: false,
      volume: 70,
      currentTime: 0,
      duration: 0,

      play: (track) => {
        set({ currentTrack: track, isPlaying: true });
      },
      toggle: () => {
        set((state) => ({ isPlaying: !state.isPlaying }));
      },
      setVolume: (volume) => {
        set({ volume });
      },
      setCurrentTime: (time) => {
        set({ currentTime: time });
      },
      setDuration: (duration) => set({ duration }),
      resetTime: () => set({ currentTime: 0 }),
    }),
    {
      name: "player-storage",
      storage: createJSONStorage(() => localStorage),

      partialize: (state) => ({
        currentTrack: state.currentTrack,
        volume: state.volume,
        currentTime: state.currentTime,

        isPlaying: false,
      }),
    }
  )
);
