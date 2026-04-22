import { create } from 'zustand';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AuthState {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
}));

// Initialize auth listener
if (typeof window !== 'undefined') {
  onAuthStateChanged(auth, (user) => {
    useAuthStore.getState().setUser(user);
    useAuthStore.getState().setLoading(false);
  });
}
