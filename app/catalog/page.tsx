"use client";

import { useEffect, useState } from "react";
import { useGameStore } from "@/store/useGameStore";
import GameCard from "@/components/Catalog/GameCard";
import { Input } from "@/components/ui/input";
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";
import { GENRES, Game } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {cn} from "@/lib/utils";

export default function CatalogPage() {
  const { games, loading, fetchGames } = useGameStore();
  const { user } = useAuthStore();
  const [search, setSearch] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string>("all");

  useEffect(() => {
    fetchGames(true);
  }, [fetchGames]);

  console.log('games', games)

  const filteredGames = games.filter(game => {
    const matchesSearch = game.title.toLowerCase().includes(search.toLowerCase());
    const matchesGenre = selectedGenre === "all" || game.genres.includes(selectedGenre as any);
    return matchesSearch && matchesGenre;
  });

  const handleAddToLibrary = async (game: Game) => {
    if (!user) return;
    
    try {
        const userGameRef = doc(db, 'user_libraries', user.uid, 'games', game.id);
        await setDoc(userGameRef, {
            ...game,
            addedToLibraryAt: serverTimestamp(),
        });
        alert(`"${game.title}" added to your library!`);
    } catch (error) {
        console.error("Error adding to library:", error);
        alert("Failed to add game to library.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-20">
      <div className={cn('bg-dot-mask-pattern', 'fixed left-0 top-0 w-screen h-screen')}></div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
            <h1 className="text-4xl font-black tracking-tight text-white mb-2">Game Catalog</h1>
            <p className="text-zinc-400">Discover and explore games from our database.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-cyan-400 transition-colors" />
                <Input 
                    placeholder="Search games..." 
                    className="pl-10 w-full sm:w-[250px] text-white"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            
            <Select value={selectedGenre} onValueChange={(value) => {
                if (!value) setSelectedGenre('all')
                else setSelectedGenre(value)
            }}>
                <SelectTrigger className="w-full sm:w-[180px] bg-zinc-900 border-zinc-800 text-white">
                    <div className="flex items-center">
                        <SlidersHorizontal className="w-4 h-4 mr-2 text-zinc-500" />
                        <SelectValue placeholder="Genre" />
                    </div>
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800 text-white max-h-100">
                    <SelectItem value="all">All Genres</SelectItem>
                    {GENRES.map(genre => (
                        <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
      </div>

      {loading && games.length === 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {[...Array(12)].map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-zinc-900 rounded-xl animate-pulse border border-zinc-800" />
            ))}
        </div>
      ) : filteredGames.length > 0 ? (
        <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                {filteredGames.map(game => (
                    <GameCard key={game.id} game={game} onAdd={handleAddToLibrary} />
                ))}
            </div>
            
            {!loading && games.length >= 12 && (
                <div className="mt-16 flex justify-center">
                    <Button 
                        variant="neonCyan" 
                        onClick={() => fetchGames(false)}
                        className="px-12 py-6 rounded-full font-bold"
                    >
                        Load More Games
                    </Button>
                </div>
            )}
        </>
      ) : (
        <div className="text-center py-24">
            <p className="text-zinc-500 text-lg">No games found matching your criteria.</p>
            <Button variant="link" className="text-cyan-400" onClick={() => {setSearch(""); setSelectedGenre("all")}}>
                Clear all filters
            </Button>
        </div>
      )}
    </div>
  );
}
