"use client";

import { useState } from "react";
import Modal from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { GENRES, PLATFORMS, Genre, Platform } from "@/lib/constants";
import { Search, Loader2, Sparkles, Plus } from "lucide-react";
import Image from "next/image";
import { useGameStore } from "@/store/useGameStore";
import { useAuthStore } from "@/store/useAuthStore";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

interface AddGameModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddGameModal({ isOpen, onClose }: AddGameModalProps) {
  const { user } = useAuthStore();
  const { fetchGames } = useGameStore();
  
  const [igdbSearch, setIgdbSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    coverUrl: "",
    bgUrl: "",
    releaseDate: "",
    developers: "",
    publishers: "",
    genres: [] as Genre[],
    platforms: [] as Platform[],
    rating: 0,
    igdbId: null as number | null,
    igdbRating: null as number | null
  });

  const handleIGDBSearch = async () => {
    if (!igdbSearch.trim()) return;
    setIsSearching(true);
    try {
        // const results = await searchIGDBGames(igdbSearch);
      const params = new URLSearchParams();
      params.append("text", igdbSearch);
      const response = await fetch(`/api/igdb/search?${params}`, {
        method: 'GET',
      })
      const results = await response.json();
      console.log(results);
        setSearchResults(results);
    } catch (error) {
        console.error("IGDB search error:", error);
    } finally {
        setIsSearching(false);
    }
  };

  const selectGameFromIGDB = (game: any) => {
    setFormData({
      ...formData,
      title: game.title,
      description: game.description,
      coverUrl: game.coverUrl,
      bgUrl: game.bgUrl || "",
      releaseDate: game.releaseDate,
      // Map and filter to match our predefined constants
      genres: (game.genres || []).filter((g: string) => GENRES.includes(g as Genre)) as Genre[],
      platforms: (game.platforms || []).filter((p: string) => PLATFORMS.includes(p as Platform)) as Platform[],
      igdbId: game.igdbId,
      igdbRating: game.igdbRating,
      developers: (game.developers || []).join(", "),
      publishers: (game.publishers || []).join(", ")
    });
    setSearchResults([]);
    setIgdbSearch("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const gameToSave = {
        ...formData,
        developers: formData.developers.split(",").map(s => s.trim()).filter(Boolean),
        publishers: formData.publishers.split(",").map(s => s.trim()).filter(Boolean),
        addedBy: user.uid,
        createdAt: serverTimestamp(),
        rating: Number(formData.rating)
      };

      console.log('gameToSave', gameToSave)

      await addDoc(collection(db, "games"), gameToSave);
      fetchGames(true);
      onClose();
      // Reset form
      setFormData({
        title: "",
        description: "",
        coverUrl: "",
        bgUrl: "",
        releaseDate: "",
        developers: "",
        publishers: "",
        genres: [],
        platforms: [],
        rating: 0,
        igdbId: null,
        igdbRating: null
      });
    } catch (error) {
      console.error("Error adding game:", error);
      alert("Failed to add game.");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Game">
      <div className="space-y-8">
        {/* IGDB Search Section */}
        <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-white">Auto-fill from IGDB</h3>
          </div>
          <div className="flex gap-2">
            <Input 
              placeholder="Search game on IGDB..." 
              value={igdbSearch}
              onChange={(e) => setIgdbSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleIGDBSearch();
                }
              }}
              className="bg-zinc-950 border-zinc-800 text-white"
            />
            <Button 
              type="button"
              onClick={handleIGDBSearch} 
              disabled={isSearching} 
              className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold"
            >
              {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            </Button>
          </div>

          {searchResults.length > 0 && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-2">
              {searchResults.map((game) => (
                <div 
                  key={game.igdbId} 
                  onClick={() => selectGameFromIGDB(game)}
                  className="flex items-center gap-3 p-2 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-cyan-500/50 cursor-pointer transition-all group"
                >
                  <div className="relative w-12 h-16 rounded overflow-hidden flex-shrink-0 bg-zinc-900">
                    <Image 
                        src={game.coverUrl || "/assets/cover-placeholder.jpg"} 
                        alt={game.title} 
                        fill 
                        className="object-cover" 
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate group-hover:text-cyan-400">{game.title}</p>
                    <p className="text-xs text-zinc-500">{game.releaseDate?.split('-')[0] || 'Unknown'}</p>
                  </div>
                  <Plus className="w-4 h-4 text-zinc-500 group-hover:text-cyan-400" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Manual Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-zinc-400 mb-1.5 block">Game Title</label>
              <Input 
                required 
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})}
                className="bg-zinc-900 border-zinc-800 text-white"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-400 mb-1.5 block">Description</label>
              <Textarea 
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="bg-zinc-900 border-zinc-800 text-white h-[120px]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-zinc-400 mb-1.5 block">Cover Image URL</label>
                <Input 
                  placeholder="https://..." 
                  value={formData.coverUrl} 
                  onChange={e => setFormData({...formData, coverUrl: e.target.value})}
                  className="bg-zinc-900 border-zinc-800 text-white"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-400 mb-1.5 block">Background URL</label>
                <Input 
                  placeholder="https://..." 
                  value={formData.bgUrl} 
                  onChange={e => setFormData({...formData, bgUrl: e.target.value})}
                  className="bg-zinc-900 border-zinc-800 text-white"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-zinc-400 mb-1.5 block">Release Date</label>
                <Input 
                  type="date" 
                  value={formData.releaseDate} 
                  onChange={e => setFormData({...formData, releaseDate: e.target.value})}
                  className="bg-zinc-900 border-zinc-800 text-white"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-400 mb-1.5 block">Your Rating (0-100)</label>
                <Input 
                  type="number" 
                  min="0" max="100" 
                  value={formData.rating} 
                  onChange={e => setFormData({...formData, rating: Number(e.target.value)})}
                  className="bg-zinc-900 border-zinc-800 text-white"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-400 mb-1.5 block">Developers (comma separated)</label>
              <Input 
                value={formData.developers} 
                onChange={e => setFormData({...formData, developers: e.target.value})}
                className="bg-zinc-900 border-zinc-800 text-white"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-zinc-400 mb-1.5 block">Genres</label>
              <div className="flex flex-wrap gap-2 max-h-[100px] overflow-y-auto p-2 bg-zinc-900 rounded-lg border border-zinc-800">
                {GENRES.map(genre => (
                  <button
                    key={genre}
                    type="button"
                    onClick={() => {
                      const newGenres = formData.genres.includes(genre)
                        ? formData.genres.filter(g => g !== genre)
                        : [...formData.genres, genre];
                      setFormData({...formData, genres: newGenres});
                    }}
                    className={`px-3 py-1 rounded-full text-xs transition-colors ${
                      formData.genres.includes(genre) 
                        ? 'bg-cyan-500 text-black font-bold' 
                        : 'bg-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-black h-12 rounded-xl mt-4 transition-all active:scale-95">
              Add Game to Database
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
