"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useGameStore } from "@/store/useGameStore";
import GameCard from "@/components/Catalog/GameCard";
import { Button } from "@/components/ui/button";
import { Plus, Search, Library, Gamepad2, Loader2 } from "lucide-react";
import AddGameModal from "@/components/Profile/AddGameModal";
import { Input } from "@/components/ui/input";
import { collection, query, getDocs, limit, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import Image from "next/image";

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuthStore();
  const { userGames, loading: gamesLoading, fetchUserGames, removeFromLibrary } = useGameStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [dbSearch, setDbSearch] = useState("");
  const [dbSearchResults, setDbSearchResults] = useState<any[]>([]);
  const [isSearchingDb, setIsSearchingDb] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserGames(user.uid);
    }
  }, [user, fetchUserGames]);

  const handleRemoveFromLibrary = async (gameId: string) => {
    if (!user) return;
    if (confirm("Are you sure you want to remove this game from your library?")) {
      try {
        await removeFromLibrary(user.uid, gameId);
      } catch (error) {
        console.error("Error removing game:", error);
        alert("Failed to remove game.");
      }
    }
  };

  const handleSearchDb = async () => {
    if (!dbSearch.trim()) {
        setDbSearchResults([]);
        return;
    }
    setIsSearchingDb(true);
    try {
        const q = query(collection(db, "games"), limit(50));
        const snapshot = await getDocs(q);
        const results = snapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .filter((game: any) => game.title.toLowerCase().includes(dbSearch.toLowerCase()));
        setDbSearchResults(results);
    } catch (error) {
        console.error("DB search error:", error);
    } finally {
        setIsSearchingDb(false);
    }
  };

  const handleAddToLibrary = async (game: any) => {
    if (!user) return;
    try {
        const userGameRef = doc(db, 'user_libraries', user.uid, 'games', game.id);
        await setDoc(userGameRef, {
            ...game,
            addedToLibraryAt: serverTimestamp(),
        });
        fetchUserGames(user.uid);
        setDbSearchResults([]);
        setDbSearch("");
        alert(`"${game.title}" added to your library!`);
    } catch (error) {
        console.error("Error adding to library:", error);
        alert("Failed to add game to library.");
    }
  };

  if (authLoading) return (
    <div className="flex-1 flex items-center justify-center">
        <div className="text-cyan-400 animate-pulse text-xl">Checking authentication...</div>
    </div>
  );

  if (!user) return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <Gamepad2 className="w-16 h-16 text-zinc-800 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
        <p className="text-zinc-500 max-w-md">You must be logged in to view your library. Please use the login button in the navigation bar.</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Top Section: Search & Add */}
      <div className="bg-zinc-950/50 backdrop-blur-xl rounded-3xl p-8 border border-white/5 mb-12 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-black text-white flex items-center gap-3">
                    <Library className="w-8 h-8 text-cyan-400" />
                    My Library
                </h1>
                <p className="text-zinc-400">Manage your collection and add new games.</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-cyan-400 transition-colors" />
                    <Input 
                        placeholder="Search existing games..." 
                        value={dbSearch}
                        onChange={(e) => setDbSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearchDb()}
                        className="pl-10"
                    />
                </div>
                <Button 
                    onClick={() => setIsModalOpen(true)}
                    variant="neonCyan"
                    className="rounded-xl h-10 px-6 font-bold"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Game
                </Button>
            </div>
        </div>

        {/* DB Search Results */}
        {(isSearchingDb || dbSearchResults.length > 0) && (
            <div className="mt-8 p-4 bg-zinc-950 rounded-2xl border border-zinc-800 animate-in fade-in slide-in-from-top-2">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                        {isSearchingDb && <Loader2 className="w-3 h-3 animate-spin" />}
                        Search Results
                    </h3>
                    <Button variant="ghost" size="sm" onClick={() => {setDbSearchResults([]); setDbSearch("");}} className="text-zinc-500 hover:text-white">Clear</Button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {dbSearchResults.map((game) => (
                        <div key={game.id} className="relative aspect-[3/4] rounded-lg overflow-hidden border border-zinc-800 group cursor-pointer">
                            <Image src={game.coverUrl || "/assets/cover-placeholder.jpg"} alt={game.title} fill className="object-cover transition-transform group-hover:scale-110" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 text-center">
                                <p className="text-[10px] font-bold text-white mb-2 line-clamp-2">{game.title}</p>
                                <Button 
                                    onClick={() => handleAddToLibrary(game)}
                                    size="sm" 
                                    className="h-7 text-[10px] bg-cyan-500 hover:bg-cyan-600 text-black font-bold"
                                >
                                    Add
                                </Button>
                            </div>
                        </div>
                    ))}
                    {dbSearchResults.length === 0 && !isSearchingDb && (
                        <div className="col-span-full py-4 text-center text-zinc-500 text-sm">No games found in database.</div>
                    )}
                </div>
            </div>
        )}
      </div>

      {/* User Games Grid */}
      <div>
        <h2 className="text-2xl font-black text-white mb-8">My Collection ({userGames.length})</h2>
        
        {gamesLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="aspect-[3/4] bg-zinc-900 rounded-xl animate-pulse border border-zinc-800" />
                ))}
            </div>
        ) : userGames.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                {userGames.map(game => (
                    <GameCard 
                      key={game.id} 
                      game={game} 
                      onRemove={() => handleRemoveFromLibrary(game.id)} 
                    />
                ))}
            </div>
        ) : (
            <div className="text-center py-24 bg-zinc-950/20 rounded-3xl border border-dashed border-white/5 backdrop-blur-sm">
                <Gamepad2 className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
                <p className="text-zinc-500 text-lg mb-6">Your library is empty. Start adding games!</p>
                <Link href="/catalog">
                    <Button variant="neonCyan" className="px-8 font-bold">
                        Browse Catalog
                    </Button>
                </Link>
            </div>
        )}
      </div>

      <AddGameModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
