"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEsc);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="sticky top-0 z-10 bg-zinc-950/80 backdrop-blur-md p-6 border-b border-zinc-800 flex items-center justify-between">
          <h2 className="text-2xl font-black text-white tracking-tight">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
