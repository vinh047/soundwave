import { create } from "zustand";
import { Prisma } from "@repo/database";

// 1. Định nghĩa Type chuẩn và export ra để dùng ở các file khác
export type TrackWithUser = Prisma.TrackGetPayload<{
  include: { user: true };
}>;

interface PlayerState {
  currentTrack: TrackWithUser | null;
  isPlaying: boolean;
  volume: number;
  queue: TrackWithUser[];
  currentTime: number;
  // Thêm duration vào state để PlayerControls có thể access nếu cần
  duration: number;

  play: (track: TrackWithUser) => void;
  toggle: () => void;
  setVolume: (volume: number) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void; // Thêm setter
  resetTime: () => void;
}

const PLAYER_STATE_KEY = "player-state";

// Helper save local storage (giữ nguyên logic của bạn)
const saveStateToLocalStorage = (state: PlayerState) => {
  if (typeof window !== "undefined") {
    try {
      const { currentTrack, isPlaying, volume, queue, currentTime } = state;
      localStorage.setItem(
        PLAYER_STATE_KEY,
        JSON.stringify({ currentTrack, isPlaying, volume, queue, currentTime })
      );
    } catch (error) {
      console.error("❌ Error saving state:", error);
    }
  }
};

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentTrack: null,
  isPlaying: false,
  volume: 70,
  queue: [],
  currentTime: 0,
  duration: 0,

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
  setCurrentTime: (time) => {
    set({ currentTime: time });
    // Không cần save currentTime liên tục vào localStorage để tránh lag,
    // nhưng nếu bạn muốn giữ logic cũ thì uncomment dòng dưới:
    // saveStateToLocalStorage(get());
  },
  setDuration: (duration) => set({ duration }),

  resetTime: () => set({ currentTime: 0 }),
}));

// Hydration (giữ nguyên)
if (typeof window !== "undefined") {
  const stored = localStorage.getItem(PLAYER_STATE_KEY);
  if (stored) {
    try {
      const parsedState = JSON.parse(stored);
      usePlayerStore.setState((state) => ({ ...state, ...parsedState }));
    } catch (err) {
      console.error("❌ Error parsing stored state:", err);
      localStorage.removeItem(PLAYER_STATE_KEY);
    }
  }
}
