"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Gamepad2, LogOut, LogIn } from "lucide-react";

export default function Navbar() {
  const { user, loading } = useAuthStore();

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <Gamepad2 className="w-8 h-8 text-cyan-400" />
            <span className="font-black text-xl tracking-tighter text-white">GAME LIB</span>
          </Link>

          <div className="flex items-center gap-6">
            <Link href="/catalog" className="text-gray-300 hover:text-white transition-colors font-medium">Catalog</Link>
            {user && (
              <Link href="/profile" className="text-gray-300 hover:text-white transition-colors font-medium">My Library</Link>
            )}
            
            {!loading && (
              user ? (
                <div className="flex items-center gap-4 pl-4 border-l border-white/10">
                  <div className="hidden sm:flex flex-col items-end">
                    <span className="text-xs font-bold text-white truncate max-w-[120px]">
                        {user.displayName || 'User'}
                    </span>
                    <span className="text-[10px] text-zinc-500 truncate max-w-[120px]">
                        {user.email}
                    </span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout" className="text-gray-400 hover:text-red-400 transition-colors">
                    <LogOut className="w-5 h-5" />
                  </Button>
                </div>
              ) : (
                <Button onClick={handleGoogleLogin} variant="neonCyan" className="rounded-full px-6 font-bold">
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </Button>
              )
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
