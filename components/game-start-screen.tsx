"use client"

import Image from "next/image"
import { useState } from "react"
import { Volume2, VolumeX } from "lucide-react"
import { isSoundEnabled, setSoundEnabled } from "@/lib/sounds"
import { useAuth } from "@/lib/auth-context"
import LoginModal from "./login-modal"
import Leaderboard from "./leaderboard"

interface GameStartScreenProps {
  onStart: () => void
}

export default function GameStartScreen({ onStart }: GameStartScreenProps) {
  const [soundEnabled, setSoundEnabledState] = useState(isSoundEnabled());
  const { user, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  
  const toggleSound = () => {
    const newValue = !soundEnabled;
    setSoundEnabled(newValue);
    setSoundEnabledState(newValue);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-between py-8 px-4 bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Settings button */}
      <div className="self-end">
        <button
          onClick={toggleSound}
          className="flex items-center gap-2 rounded-xl border border-[#BFFF00]/30 bg-gray-900/80 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-gray-800"
          style={{ boxShadow: '0 0 8px rgba(191, 255, 0, 0.15)' }}
        >
          {soundEnabled ? <Volume2 className="h-4 w-4 text-[#BFFF00]" /> : <VolumeX className="h-4 w-4 text-gray-500" />}
          <span>Sound {soundEnabled ? 'ON' : 'OFF'}</span>
        </button>
      </div>
      
      <div className="flex flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-6">
          <div className="relative h-20 w-20 overflow-hidden rounded-xl border-2 border-[#BFFF00]/30"
               style={{ boxShadow: '0 0 12px rgba(191, 255, 0, 0.25)' }}>
            <Image
              src="/images/raiku-logo.jpg"
              alt="Raiku logo"
              fill
              className="object-cover"
            />
          </div>

          <div className="relative h-48 w-48 sm:h-64 sm:w-64">
            <Image
              src="/images/rykuan-mascot.jpg"
              alt="Rykuan mascot"
              fill
              className="rounded-2xl object-cover"
              priority
            />
            <div className="absolute inset-0 rounded-2xl ring-2 ring-[#BFFF00]/30" 
                 style={{ boxShadow: '0 0 20px rgba(191, 255, 0, 0.3)' }} />
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-4xl font-black uppercase tracking-tight text-[#BFFF00] sm:text-5xl"
              style={{ textShadow: '0 0 25px rgba(191, 255, 0, 0.5)' }}>
            Ryku Crush
          </h1>
          <p className="max-w-xs text-sm text-gray-400">
            Crush profile pictures to score points. Watch out for bombs!
          </p>
        </div>

        <div className="flex flex-col items-center gap-4">
          {/* Login/Logout Section */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="text-center">
                <p className="text-white mb-2">Welcome, <span className="text-[#BFFF00] font-bold">{user.username}</span>!</p>
                <button
                  onClick={logout}
                  className="text-sm text-gray-400 hover:text-[#BFFF00] transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className="px-6 py-3 border-2 border-[#BFFF00] text-[#BFFF00] rounded-xl font-bold hover:bg-[#BFFF00] hover:text-black transition-colors"
              >
                Login / Sign Up
              </button>
            )}
          </div>

          <button
            onClick={onStart}
            type="button"
            className="animate-glow-pulse rounded-xl bg-[#BFFF00] px-10 py-4 text-lg font-bold uppercase tracking-wider text-black transition-transform hover:scale-105 active:scale-95"
            style={{ boxShadow: '0 0 25px rgba(191, 255, 0, 0.4)' }}
          >
            Play as Guest
          </button>

          <div className="flex items-center gap-6 text-xs text-gray-500">
            <div className="flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#BFFF00]" 
                    style={{ boxShadow: '0 0 5px rgba(191, 255, 0, 0.5)' }} />
              <span>Points</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-destructive" />
              <span>Bomb</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-600">
          Powered by Raiku
        </p>
      </div>

      {/* Weekly Leaderboard */}
      <div className="w-full max-w-2xl mt-8">
        <Leaderboard />
      </div>
      
      {/* Login Modal */}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      
      {/* Footer */}
      <footer className="text-sm text-gray-600">
        Made with <span className="text-red-500">❤️</span> by jennycruzy
      </footer>
    </div>
  )
}