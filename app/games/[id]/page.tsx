"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGameStore } from "@/store/useGameStore";
import { Game } from "@/lib/constants";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { 
  Star, 
  Calendar, 
  Users, 
  Building2, 
  Gamepad2, 
  ArrowLeft,
  PlusCircle,
  ExternalLink,
  CheckCircle2
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function GameDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { fetchGameById, userGames, fetchUserGames } = useGameStore();
  const { user } = useAuthStore();
  
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGame = async () => {
      if (typeof id === 'string') {
        const gameData = await fetchGameById(id);
        setGame(gameData);
        setLoading(false);
      }
    };
    loadGame();
  }, [id, fetchGameById]);

  useEffect(() => {
    if (user) {
      fetchUserGames(user.uid);
    }
  }, [user, fetchUserGames]);

  const isInLibrary = game && userGames.some(ug => ug.id === game.id);

  const handleAddToLibrary = async () => {
    if (!user || !game) return;
    
    try {
        const userGameRef = doc(db, 'user_libraries', user.uid, 'games', game.id);
        await setDoc(userGameRef, {
            ...game,
            addedToLibraryAt: serverTimestamp(),
        });
        fetchUserGames(user.uid);
        alert(`"${game.title}" added to your library!`);
    } catch (error) {
        console.error("Error adding to library:", error);
        alert("Failed to add game to library.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
        <h1 className="text-4xl font-bold mb-4">Game not found</h1>
        <Button onClick={() => router.back()} variant="outline" className="border-zinc-800 text-zinc-400">
          <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Hero Section with Background */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={game.bgUrl || game.coverUrl || "/assets/bg-placeholder.jpg"}
            alt={game.title}
            fill
            className="object-cover opacity-40 blur-sm scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        </div>

        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-12">
          <Button 
            variant="ghost" 
            className="absolute top-8 left-4 sm:left-8 text-zinc-400 hover:text-white hover:bg-white/10"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>

          <div className="flex flex-col md:flex-row gap-8 items-end">
            {/* Cover Image */}
            <div className="relative w-48 h-64 sm:w-64 sm:h-80 flex-shrink-0 rounded-2xl overflow-hidden shadow-2xl border border-zinc-800/50">
              <Image
                src={game.coverUrl || "/assets/cover-placeholder.jpg"}
                alt={game.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex-1 space-y-4">
              <div className="flex flex-wrap gap-2">
                {game.genres.map(genre => (
                  <span key={genre} className="px-3 py-1 bg-cyan-500/10 text-cyan-400 rounded-full text-xs font-medium border border-cyan-500/20">
                    {genre}
                  </span>
                ))}
              </div>
              
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight">{game.title}</h1>
              
              <div className="flex flex-wrap items-center gap-6 text-zinc-300">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  <span className="text-xl font-bold text-white">{game.rating || game.igdbRating || 'N/A'}</span>
                  <span className="text-sm text-zinc-500">/ 100</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-zinc-500" />
                  <span>{game.releaseDate || "TBA"}</span>
                </div>
              </div>

              {user && (
                <div className="pt-4">
                  {isInLibrary ? (
                    <Button 
                      disabled
                      className="bg-zinc-900 border border-zinc-800 text-zinc-400 font-bold px-8 py-6 rounded-xl gap-2 opacity-100"
                    >
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      In My Library
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleAddToLibrary}
                      className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-8 py-6 rounded-xl gap-2 shadow-lg shadow-cyan-500/20"
                    >
                      <PlusCircle className="w-5 h-5" />
                      Add to My Library
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <span className="w-1 h-6 bg-cyan-500 rounded-full" />
                About
              </h2>
              <p className="text-zinc-400 leading-relaxed text-lg whitespace-pre-wrap">
                {game.description || "No description available for this game."}
              </p>
            </section>

            {game.igdbId && (
              <section className="p-6 bg-zinc-900/50 rounded-2xl border border-zinc-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-bold mb-1">IGDB Integration</h3>
                    <p className="text-sm text-zinc-500">Data provided by Internet Game Database</p>
                  </div>
                  <a 
                    href={`https://www.igdb.com/games/${game.igdbId}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 flex items-center gap-2 text-sm font-medium"
                  >
                    View on IGDB <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </section>
            )}
          </div>

          {/* Sidebar Info */}
          <div className="space-y-8">
            <div className="bg-zinc-900/30 rounded-3xl p-8 border border-zinc-800/50 backdrop-blur-sm space-y-8">
              <section>
                <h3 className="text-zinc-500 text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Building2 className="w-4 h-4" /> Developers
                </h3>
                <div className="flex flex-wrap gap-2 text-white font-medium">
                  {game.developers.length > 0 ? game.developers.join(", ") : "Unknown"}
                </div>
              </section>

              <section>
                <h3 className="text-zinc-500 text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Users className="w-4 h-4" /> Publishers
                </h3>
                <div className="flex flex-wrap gap-2 text-white font-medium">
                  {game.publishers.length > 0 ? game.publishers.join(", ") : "Unknown"}
                </div>
              </section>

              <section>
                <h3 className="text-zinc-500 text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Gamepad2 className="w-4 h-4" /> Platforms
                </h3>
                <div className="flex flex-wrap gap-2">
                  {game.platforms.map(platform => (
                    <span key={platform} className="px-3 py-1 bg-zinc-800 text-zinc-300 rounded-lg text-xs border border-zinc-700">
                      {platform}
                    </span>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
