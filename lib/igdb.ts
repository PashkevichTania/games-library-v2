"use server";

let accessToken: string | null = null;
let tokenExpiry: number | null = null;

async function getAccessToken() {
  if (accessToken && tokenExpiry && Date.now() < tokenExpiry) {
    return accessToken;
  }

  const clientId = process.env.IGDB_CLIENT_ID;
  const clientSecret = process.env.IGDB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("IGDB credentials not found in environment variables");
  }

  const response = await fetch(
    `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`,
    { 
      method: "POST",
      cache: 'no-store'
    }
  );

  if (!response.ok) {
    throw new Error("Failed to get IGDB access token");
  }

  const data = await response.json();
  accessToken = data.access_token;
  tokenExpiry = Date.now() + (data.expires_in - 60) * 1000; // Subtract 60s for safety
  return accessToken;
}

export async function searchIGDBGames(searchQuery: string) {
  try {
    const token = await getAccessToken();
    const clientId = process.env.IGDB_CLIENT_ID!;

    const response = await fetch("https://api.igdb.com/v4/games", {
      method: "POST",
      headers: {
        "Client-ID": clientId,
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: `search "${searchQuery}"; fields name, cover.url, first_release_date, summary, genres.name, involved_companies.company.name, involved_companies.developer, involved_companies.publisher, platforms.name, total_rating; limit 10;`,
      cache: 'no-store'
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("IGDB Search Error:", errorText);
      return [];
    }

    const games = await response.json();
    return games.map((game: any) => ({
      igdbId: game.id,
      title: game.name,
      description: game.summary || "",
      coverUrl: game.cover?.url ? `https:${game.cover.url.replace('t_thumb', 't_cover_big')}` : "/assets/cover-placeholder.jpg",
      releaseDate: game.first_release_date ? new Date(game.first_release_date * 1000).toISOString().split('T')[0] : "",
      genres: game.genres?.map((g: any) => g.name) || [],
      platforms: game.platforms?.map((p: any) => p.name) || [],
      developers: game.involved_companies?.filter((c: any) => c.developer).map((c: any) => c.company.name) || [],
      publishers: game.involved_companies?.filter((c: any) => c.publisher).map((c: any) => c.company.name) || [],
      igdbRating: game.total_rating ? Math.round(game.total_rating) : undefined,
    }));
  } catch (error) {
    console.error("IGDB Search Exception:", error);
    return [];
  }
}

export async function getIGDBGameDetails(igdbId: number) {
  try {
    const token = await getAccessToken();
    const clientId = process.env.IGDB_CLIENT_ID!;

    const response = await fetch("https://api.igdb.com/v4/games", {
      method: "POST",
      headers: {
        "Client-ID": clientId,
        "Authorization": `Bearer ${token}`,
        "Content-Type": "text/plain",
      },
      body: `where id = ${igdbId}; fields name, cover.url, screenshots.url, first_release_date, summary, genres.name, involved_companies.company.name, involved_companies.developer, involved_companies.publisher, platforms.name, total_rating;`,
      cache: 'no-store'
    });

    if (!response.ok) return null;

    const data = await response.json();
    if (!data || data.length === 0) return null;

    const game = data[0];
    return {
      igdbId: game.id,
      title: game.name,
      description: game.summary || "",
      coverUrl: game.cover?.url ? `https:${game.cover.url.replace('t_thumb', 't_cover_big')}` : "/assets/cover-placeholder.jpg",
      bgUrl: game.screenshots?.[0]?.url ? `https:${game.screenshots[0].url.replace('t_thumb', 't_720p')}` : "/assets/bg-placeholder.jpg",
      releaseDate: game.first_release_date ? new Date(game.first_release_date * 1000).toISOString().split('T')[0] : "",
      genres: game.genres?.map((g: any) => g.name) || [],
      platforms: game.platforms?.map((p: any) => p.name) || [],
      developers: game.involved_companies?.filter((c: any) => c.developer).map((c: any) => c.company.name) || [],
      publishers: game.involved_companies?.filter((c: any) => c.publisher).map((c: any) => c.company.name) || [],
      igdbRating: game.total_rating ? Math.round(game.total_rating) : undefined,
    };
  } catch (error) {
    console.error("IGDB Details Error:", error);
    return null;
  }
}
