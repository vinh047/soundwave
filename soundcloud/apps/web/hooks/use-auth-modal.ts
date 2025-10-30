import { create } from "zustand";

// Định nghĩa trạng thái của modal
interface AuthModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

// Tạo hook
export const useAuthModal = create<AuthModalStore>((set) => ({
  isOpen: false, // Mặc định là đóng
  onOpen: () => set({ isOpen: true }), // Hàm để mở
  onClose: () => set({ isOpen: false }), // Hàm để đóng
}));
