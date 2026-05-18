"use client";

import Image from "next/image";
import { Game } from "@/lib/constants";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import { CheckCircle2, PlusCircle, Star, Trash2 } from "lucide-react";
import Link from "next/link";

interface GameCardProps {
  game: Game;
  onAdd?: (game: Game) => void;
  onRemove?: (gameId: string) => void;
  isInLibrary?: boolean;
}

export default function GameCard({ game, onAdd, onRemove, isInLibrary }: GameCardProps) {
  const { user } = useAuthStore();

  return (
    <Card className="group relative overflow-hidden bg-zinc-950 border-white/5 hover:border-cyan-500/50 transition-all duration-500 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]">
      <Link href={`/games/${game.id}`}>
        <div className="relative aspect-[3/4] overflow-hidden">
          <Image
            src={game.coverUrl || "/assets/cover-placeholder.jpg"}
            alt={game.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
            <p className="text-xs text-zinc-300 line-clamp-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">{game.description}</p>
          </div>
          
          {onRemove && (
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  onRemove(game.id);
                }}
                variant="destructive"
                size="icon"
                className="w-8 h-8 rounded-full shadow-lg"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </Link>
      
      <CardContent className="p-4 bg-zinc-950/50 backdrop-blur-sm">
        <h3 className="font-bold text-white truncate text-lg mb-1 group-hover:text-cyan-400 transition-colors" title={game.title}>{game.title}</h3>
        <div className="flex items-center justify-between">
            <div className="flex items-center text-yellow-500 text-sm">
                <Star className="w-4 h-4 fill-current mr-1" />
                <span className="font-bold">{game.rating || game.igdbRating || 'N/A'}</span>
            </div>
            <span className="text-zinc-500 text-xs truncate max-w-[100px] bg-white/5 px-2 py-0.5 rounded">
                {game.genres?.[0]}
            </span>
        </div>
      </CardContent>

      {user && onAdd && (
        <CardFooter className="p-4 pt-0 bg-zinc-950/50 backdrop-blur-sm">
          {isInLibrary ? (
            <Button 
              disabled
              variant="outline" 
              className="w-full gap-2 font-bold py-5 border-zinc-800 bg-zinc-900/50 text-zinc-400 opacity-100"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              In library
            </Button>
          ) : (
            <Button 
              onClick={() => onAdd(game)}
              variant="neonCyan" 
              className="w-full gap-2 font-bold py-5"
            >
              <PlusCircle className="w-4 h-4" />
              Add to Library
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
