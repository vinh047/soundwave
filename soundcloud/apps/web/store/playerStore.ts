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

const PLAYER_STATE_KEY = "player-state";

const saveStateToLocalStorage = (state: PlayerState) => {
  if (typeof window !== "undefined") {
    try {
      const stateToSave = {
        currentTrack: state.currentTrack,
        isPlaying: state.isPlaying,
        volume: state.volume,
        queue: state.queue,
      };
      localStorage.setItem(PLAYER_STATE_KEY, JSON.stringify(stateToSave));
    } catch (error) {
      console.error("❌ Error saving state to localStorage:", error);
    }
  }
};

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentTrack: null,
  isPlaying: false,
  volume: 70,
  queue: [],

  play: (track) => {
    set({ currentTrack: track, isPlaying: true });

    saveStateToLocalStorage(get());
  },
  toggle: () => {
    set((state) => ({ isPlaying: !state.isPlaying }));

    saveStateToLocalStorage(get());
  },

  setVolume: (volume) => {
    set({ volume });

    saveStateToLocalStorage(get());
  },
}));

if (typeof window !== "undefined") {
  const stored = localStorage.getItem(PLAYER_STATE_KEY);
  if (stored) {
    try {
      const parsedState = JSON.parse(stored);

      const stateToUpdate: Partial<PlayerState> = {};

      if (parsedState && typeof parsedState === "object") {
        if (parsedState.volume !== undefined) {
          const parsedVolume = parseInt(parsedState.volume);
          if (!isNaN(parsedVolume)) {
            stateToUpdate.volume = parsedVolume;
          }
        }

        if (typeof parsedState.isPlaying === "boolean") {
          stateToUpdate.isPlaying = parsedState.isPlaying;
        }

        if (parsedState.currentTrack !== undefined) {
          stateToUpdate.currentTrack = parsedState.currentTrack;
        }

        if (Array.isArray(parsedState.queue)) {
          stateToUpdate.queue = parsedState.queue;
        }

        if (Object.keys(stateToUpdate).length > 0) {
          usePlayerStore.setState(stateToUpdate);
        }
      }
    } catch (err) {
      console.error("❌ Error parsing stored player state:", err);

      localStorage.removeItem(PLAYER_STATE_KEY);
    }
  }
}
