import { create } from 'zustand';
import { Game } from '@/lib/constants';
import { 
  collection, 
  query,
  getDocs, 
  getDoc,
  doc,
  deleteDoc,
  addDoc, 
  serverTimestamp,
  orderBy,
  limit,
  startAfter,
  QueryDocumentSnapshot
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface GameState {
  games: Game[];
  userGames: Game[];
  loading: boolean;
  lastVisible: QueryDocumentSnapshot | null;
  
  fetchGames: (reset?: boolean) => Promise<void>;
  fetchUserGames: (userId: string) => Promise<void>;
  fetchGameById: (gameId: string) => Promise<Game | null>;
  removeFromLibrary: (userId: string, gameId: string) => Promise<void>;
  addGame: (gameData: Omit<Game, 'id' | 'createdAt' | 'addedBy'>, userId: string) => Promise<void>;
}

export const useGameStore = create<GameState>((set, get) => ({
  games: [],
  userGames: [],
  loading: false,
  lastVisible: null,

  fetchGames: async (reset = false) => {
    set({ loading: true });
    try {
      const gamesRef = collection(db, 'games');
      let q = query(gamesRef, orderBy('createdAt', 'desc'), limit(12));
      
      if (!reset && get().lastVisible) {
        q = query(gamesRef, orderBy('createdAt', 'desc'), startAfter(get().lastVisible), limit(12));
      }

      const querySnapshot = await getDocs(q);
      const newGames = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Game));
      
      set({ 
        games: reset ? newGames : [...get().games, ...newGames],
        lastVisible: querySnapshot.docs[querySnapshot.docs.length - 1] || null,
        loading: false 
      });
    } catch (error) {
      console.error("Error fetching games:", error);
      set({ loading: false });
    }
  },

  fetchUserGames: async (userId: string) => {
    set({ loading: true });
    try {
      // Fetch from the dedicated user_libraries collection
      const q = query(collection(db, 'user_libraries', userId, 'games'), orderBy('addedToLibraryAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const userGames = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Game));
      set({ userGames, loading: false });
    } catch (error) {
      console.error("Error fetching user games:", error);
      set({ loading: false });
    }
  },

  fetchGameById: async (gameId: string) => {
    set({ loading: true });
    try {
      const gameDoc = await getDoc(doc(db, 'games', gameId));
      if (gameDoc.exists()) {
        set({ loading: false });
        return { id: gameDoc.id, ...gameDoc.data() } as Game;
      }
      set({ loading: false });
      return null;
    } catch (error) {
      console.error("Error fetching game by id:", error);
      set({ loading: false });
      return null;
    }
  },

  removeFromLibrary: async (userId: string, gameId: string) => {
    set({ loading: true });
    try {
      await deleteDoc(doc(db, 'user_libraries', userId, 'games', gameId));
      set({ 
        userGames: get().userGames.filter(g => g.id !== gameId),
        loading: false 
      });
    } catch (error) {
      console.error("Error removing from library:", error);
      set({ loading: false });
      throw error;
    }
  },

  addGame: async (gameData, userId) => {
    set({ loading: true });
    try {
      await addDoc(collection(db, 'games'), {
        ...gameData,
        addedBy: userId,
        createdAt: serverTimestamp(),
      });
      // Optionally refetch games
      get().fetchGames(true);
      set({ loading: false });
    } catch (error) {
      console.error("Error adding game:", error);
      set({ loading: false });
      throw error;
    }
  }
}));
