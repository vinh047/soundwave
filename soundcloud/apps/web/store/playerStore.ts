import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Prisma } from "@repo/database";

// Type đầy đủ bao gồm thông tin User
export type TrackWithUser = Prisma.TrackGetPayload<{
  include: { user: true };
}>;

interface PlayerState {
  currentTrack: TrackWithUser | null;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;

  queue: TrackWithUser[];
  currentIndex: number;

  autoplay: boolean;
  play: (track: TrackWithUser) => void;
  toggle: () => void;
  setVolume: (volume: number) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  resetTime: () => void;

  setQueue: (tracks: TrackWithUser[], clickedTrackId?: string) => void;
  addToQueue: (track: TrackWithUser) => void;
  playNext: () => void;
  playPrev: () => void;
  removeFromQueue: (index: number) => void;

  toggleAutoplay: () => void;
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      currentTrack: null,
      isPlaying: false,
      volume: 70,
      currentTime: 0,
      duration: 0,

      queue: [],
      currentIndex: -1,

      autoplay: true,

      play: (track) => {
        const { queue } = get();

        // 1. Kiểm tra xem bài hát đã tồn tại trong queue chưa
        const foundIndex = queue.findIndex((t) => t.id === track.id);

        if (foundIndex !== -1) {
          // TH1: Đã có trong queue -> Nhảy đến bài đó và hát
          set({
            currentTrack: track,
            currentIndex: foundIndex,
            isPlaying: true,
          });
        } else {
          // TH2: Chưa có -> Thêm vào cuối queue -> Hát bài mới thêm
          const newQueue = [...queue, track];
          set({
            queue: newQueue,
            currentTrack: track,
            currentIndex: newQueue.length - 1, // Vị trí cuối cùng
            isPlaying: true,
          });
        }
      },

      setQueue: (tracks, clickedTrackId) => {
        const index = clickedTrackId
          ? tracks.findIndex((t) => t.id === clickedTrackId)
          : 0;

        set({
          queue: tracks,
          currentTrack: tracks[index] || null,
          currentIndex: index,
          isPlaying: true,
        });
      },

      addToQueue: (track) =>
        set((state) => ({
          queue: [...state.queue, track],
        })),

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

      playNext: () => {
        const { queue, currentIndex } = get();
        if (queue.length === 0) return;

        const nextIndex = currentIndex + 1;

        // Nếu chưa hết playlist
        if (nextIndex < queue.length) {
          set({
            currentTrack: queue[nextIndex],
            currentIndex: nextIndex,
            isPlaying: true,
          });
        } else {
          // Hết playlist: Reset về đầu và dừng (hoặc loop tùy ý)
          set({ isPlaying: false, currentIndex: 0, currentTrack: queue[0] });
        }
      },

      playPrev: () => {
        const { queue, currentIndex } = get();
        if (queue.length === 0) return;

        const prevIndex = currentIndex - 1;

        if (prevIndex >= 0) {
          set({
            currentTrack: queue[prevIndex],
            currentIndex: prevIndex,
            isPlaying: true,
          });
        } else {
          // Nếu đang ở bài đầu tiên, reset về 0
          set({ currentIndex: 0, currentTrack: queue[0], isPlaying: true });
        }
      },

      removeFromQueue: (indexToRemove) => {
        const { queue, currentIndex, currentTrack, isPlaying } = get();

        // Tạo queue mới đã lọc bỏ bài hát
        const newQueue = queue.filter((_, index) => index !== indexToRemove);

        // Nếu xóa đúng bài đang hát -> Dừng nhạc hoặc chuyển bài khác tùy logic
        if (indexToRemove === currentIndex) {
          // Logic đơn giản: Nếu xóa bài đang hát thì dừng nhạc
          set({
            queue: newQueue,
            isPlaying: false,
            // Cập nhật lại index cho bài tiếp theo
            currentIndex: currentIndex >= newQueue.length ? 0 : currentIndex,
          });
        } else {
          // Nếu xóa bài khác, chỉ cần cập nhật queue và chỉnh lại currentIndex nếu bài bị xóa nằm trước bài đang hát
          let newIndex = currentIndex;
          if (indexToRemove < currentIndex) {
            newIndex = currentIndex - 1;
          }
          set({ queue: newQueue, currentIndex: newIndex });
        }
      },
      toggleAutoplay: () => set((state) => ({ autoplay: !state.autoplay })),
    }),

    {
      name: "player-storage",
      storage: createJSONStorage(() => localStorage),
      // Chỉ lưu những state cần thiết, không lưu trạng thái đang play để tránh F5 tự hát
      partialize: (state) => ({
        currentTrack: state.currentTrack,
        volume: state.volume,
        queue: state.queue, // Nên lưu queue để F5 vẫn còn danh sách
        currentIndex: state.currentIndex,
        // currentTime: state.currentTime, // Có thể bỏ currentTime nếu muốn F5 nghe lại từ đầu bài
        autoplay: state.autoplay,
      }),
    }
  )
);
