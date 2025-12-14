import { create } from "zustand";

interface AddToPlaylistModalStore {
  isOpen: boolean;
  trackId: string | null; // ID bài hát (có thể null nếu mở từ Sidebar)
  onOpen: (id?: string) => void;
  onClose: () => void;
}

export const useAddToPlaylistModal = create<AddToPlaylistModalStore>((set) => ({
  isOpen: false,
  trackId: null,
  // Nếu có id thì lưu, không có thì set null
  onOpen: (id?: string) => set({ isOpen: true, trackId: id || null }),
  onClose: () => set({ isOpen: false, trackId: null }),
}));
