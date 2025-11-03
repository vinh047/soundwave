import { create } from "zustand";
import { Prisma } from "@repo/database";

interface PlayerState {
  currentTrack: Prisma.TrackGetPayload<{ include: { user: true } }> | null;
  isPlaying: boolean;
  volume: number;
  queue: Prisma.TrackGetPayload<{ include: { user: true } }>[];
  play: (track: Prisma.TrackGetPayload<{ include: { user: true } }>) => void;
  toggle: () => void;
  setVolume: (volume: number) => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  currentTrack: null,
  isPlaying: false,
  volume: 70,
  queue: [],
  play: (track) => set({ currentTrack: track, isPlaying: true }),
  toggle: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setVolume: (volume) => set({ volume }),
}));