export const GENRES = [
  "Point-and-click", "Fighting", "Shooter", "Music", "Platform", "Puzzle", 
  "Racing", "Real Time Strategy (RTS)", "Role-playing (RPG)", "Simulator", 
  "Sport", "Strategy", "Turn-based strategy (TBS)", "Tactical", "Quiz/Trivia", 
  "Hack and slash/Beat 'em up", "Pinball", "Adventure", "Indie", "Arcade", 
  "Visual Novel", "Card & Board Game", "MOBA"
] as const;

export const PLATFORMS = [
  "PC (Microsoft Windows)", "PlayStation 5", "PlayStation 4", "PlayStation 3", 
  "PlayStation 2", "PlayStation", "Xbox Series X|S", "Xbox One", "Xbox 360", 
  "Nintendo Switch", "Nintendo 3DS", "iOS", "Android", "macOS", "Linux", 
  "PlayStation Vita", "Wii U", "Nintendo DS", "PlayStation Portable (PSP)", 
  "Xbox", "GameCube", "Game Boy Advance", "Sega Genesis", "Super Nintendo (SNES)", "NES"
] as const;

export type Genre = typeof GENRES[number];
export type Platform = typeof PLATFORMS[number];

export interface Game {
  id: string;
  igdbId?: number;
  title: string;
  description: string;
  coverUrl: string;
  bgUrl: string;
  developers: string[];
  publishers: string[];
  genres: Genre[];
  platforms: Platform[];
  releaseDate: string;
  rating: number; // User rating
  igdbRating?: number;
  addedBy: string; // User ID
  createdAt: any;
}
