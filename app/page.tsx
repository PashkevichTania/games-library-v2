"use client";

import HomeBG from "@/components/Home/HomeBG";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

import stylesMain from "@/styles/main.module.scss";
import {cn} from "@/lib/utils";

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.style.display = isLoaded ? "none" : "fixed";
  }, [isLoaded]);

  return (
    <main className="relative w-full h-full bg-black overflow-hidden">
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

        {/* Content Section */}
      <div
          id="home_main"
          className="relative flex flex-col justify-center items-center bg-gradient-to-b from-[#070f4d] to-[#000515] pt-16 pb-32"
      >
        <div className="w-[90%] text-white">
          <div className={`border-none! ${stylesMain.glass} ${stylesMain.rainbowBorderGlass}`}>
            <div className="pt-12 pb-12 pr-10 pl-10">
              <div className="align-bottom mb-6">
                <h2 className="text-5xl font-extrabold mr-5 inline-block">
                  <span className="text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-fuchsia-300">
                    Game lib
                  </span>
                </h2>
                <p className="text-3xl inline-block">
                  It&apos;s a website to explore gaming world!
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-16">
                <div className="space-y-6">
                  <h3 className="text-3xl font-bold text-cyan-400">Personal Collection</h3>
                  <p className="text-lg text-white leading-relaxed">
                    Build your own digital library. Keep track of every game you&apos;ve played,
                    set your personal ratings, and never forget your gaming journey.
                  </p>
                  <div className="pt-4">
                    <Link href="/catalog">
                      <Button variant="neonCyan" size="lg" className="rounded-xl px-10 py-7 text-cyan-400 font-black flex items-center gap-3">
                        Browse Catalog
                        <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center">
                          <div className="w-0 h-0 border-t-[4px] border-t-transparent border-l-[7px] border-l-cyan-400 border-b-[4px] border-b-transparent" />
                        </div>
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-3xl font-bold text-fuchsia-400">Community Driven</h3>
                  <p className="text-lg text-white leading-relaxed">
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

        {/* Background Images Layer */}
        <div className="inset-0 z-[1] pointer-events-none overflow-hidden">
          <div className="absolute top-[-70px] -left-10 w-[600px] h-[600px]">
            <Image
                src="/assets/glass_planet.png"
                alt="Planet"
                fill
                className="object-contain"
            />
          </div>
          <div className="absolute bottom-[-140px] -right-[-40px] w-[500px] h-[500px]">
            <Image
                src="/assets/ps4controller.png"
                alt="Controller"
                fill
                className="object-contain rotate-12"
            />
          </div>
        </div>
      </div>
    </main>
  );
}

