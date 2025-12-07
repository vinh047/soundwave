import { create } from 'zustand';
import { PublicUser } from '@/lib/api/authApi';

interface AuthState {
    user: PublicUser | null;
    setUser: (user: PublicUser | null) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    logout: () => set({ user: null }),
}));
