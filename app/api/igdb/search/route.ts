import { searchIGDBGames } from "@/lib/igdb";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const text = request?.nextUrl?.searchParams.get('text')

  if (!text) {
    return NextResponse.json({ error: "Query parameter 'text' is required" }, { status: 400 });
  }

  try {
    const results = await searchIGDBGames(text);
    return NextResponse.json(results);
  } catch (error) {
    console.error("API IGDB Search Error:", error);
    return NextResponse.json({ error: "Failed to search IGDB" }, { status: 500 });
  }
}
