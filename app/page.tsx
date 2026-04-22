"use client";

import HomeBG from "@/components/Home/HomeBG";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import stylesMain from "@/styles/main.module.scss";

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.style.display = isLoaded ? "none" : "fixed";
  }, [isLoaded]);

  return (
    <main className="relative w-full min-h-screen bg-black overflow-x-hidden">
        {/* Loading Overlay */}
        <div 
          className="fixed inset-0 bg-black z-[100] flex items-center justify-center transition-opacity duration-500" 
          ref={ref}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            <div className="text-cyan-400 text-xl font-black tracking-widest animate-pulse">LOADING...</div>
          </div>
        </div>
        
        <HomeBG setLoaded={setIsLoaded}/>

        {/* Background Images Layer */}
        <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden">
          <div className="absolute top-[20%] -left-20 w-[600px] h-[600px] opacity-20 blur-sm animate-pulse">
            <Image 
              src="/assets/glass_planet.png" 
              alt="Planet" 
              fill 
              className="object-contain"
            />
          </div>
          <div className="absolute bottom-[10%] -right-20 w-[700px] h-[700px] opacity-30 blur-sm animate-pulse" style={{ animationDelay: '2s' }}>
            <Image 
              src="/assets/ps4controller.png" 
              alt="Controller" 
              fill 
              className="object-contain rotate-12"
            />
          </div>
        </div>
        
        {/* Hero Section */}
        <div className="relative h-screen flex flex-col items-center justify-center z-10">
          <div className="text-center space-y-8 animate-in fade-in zoom-in duration-1000">
            <h1 className="text-7xl md:text-9xl font-black tracking-tighter">
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 via-blue-500 to-fuchsia-500 drop-shadow-[0_0_30px_rgba(6,182,212,0.3)]">
                GameX
              </span>
            </h1>
            
            <div className="flex items-center justify-center gap-4">
              <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-cyan-500" />
              <Button 
                variant="neonCyan" 
                size="lg" 
                className="rounded-full px-8 py-6 text-lg font-black tracking-widest uppercase group"
                onClick={() => document.getElementById('home_main')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center group-hover:scale-110 transition-transform mr-2">
                  <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[8px] border-l-black border-b-[5px] border-b-transparent ml-1" />
                </div>
                Learn More
              </Button>
              <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-cyan-500" />
            </div>
          </div>
          
          <div className="absolute bottom-12 animate-bounce">
            <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center p-2">
              <div className="w-1 h-2 bg-cyan-500 rounded-full" />
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div id="home_main" className="relative w-full bg-transparent py-32 z-10 border-t border-white/10">
          <div className="w-[90%] max-w-6xl text-white">
            <div className={`${stylesMain.glass} backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden`}>
              <div className="p-8 md:p-16">
                <div className="mb-12">
                  <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter">
                    <span className="text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 via-blue-500 to-fuchsia-500">
                      GAME LIB
                    </span>
                  </h1>
                  <p className="text-2xl md:text-3xl font-light text-gray-300 leading-tight">
                    Your ultimate destination to <span className="text-white font-semibold">track</span>,
                    <span className="text-white font-semibold"> rate</span>, and
                    <span className="text-white font-semibold"> discover</span> the gaming universe.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-16">
                  <div className="space-y-6">
                    <h3 className="text-3xl font-bold text-cyan-400">Personal Collection</h3>
                    <p className="text-lg text-gray-400 leading-relaxed">
                      Build your own digital library. Keep track of every game you&apos;ve played,
                      set your personal ratings, and never forget your gaming journey.
                    </p>
                    <div className="pt-4">
                      <Link href="/catalog">
                        <Button variant="neonCyan" size="lg" className="rounded-xl px-10 py-7 text-white font-black flex items-center gap-3">
                          Browse Catalog
                          <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                            <div className="w-0 h-0 border-t-[4px] border-t-transparent border-l-[7px] border-l-white border-b-[4px] border-b-transparent" />
                          </div>
                        </Button>
                      </Link>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-3xl font-bold text-fuchsia-400">Community Driven</h3>
                    <p className="text-lg text-gray-400 leading-relaxed">
                      Powered by the massive IGDB database. Find any game from retro classics
                      to modern masterpieces and contribute to our growing community.
                    </p>
                    <div className="pt-4">
                      <Link href="/profile">
                        <Button variant="neonFuchsia" size="lg" className="rounded-xl px-10 py-7 font-black">
                          My Library
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </main>
  );
}

