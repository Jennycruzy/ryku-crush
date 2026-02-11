"use client"

import Image from "next/image"
import { useEffect } from "react"
import { playEndGameSound } from "@/lib/sounds"

interface GameOverScreenProps {
  score: number
  highScore: number
  crushed: number
  onRestart: () => void
  onHome: () => void
}

export default function GameOverScreen({
  score,
  highScore,
  crushed,
  onRestart,
  onHome,
}: GameOverScreenProps) {
  const isNewHigh = score >= highScore && score > 0
  
  // Play end game sound
  useEffect(() => {
    playEndGameSound(score);
  }, [score]);
  
  // Get message based on score
  const getMessage = () => {
    if (score >= 5000) return "Great Chad";
    if (score >= 3000) return "Keep it up Chad";
    if (score >= 1000) return "Try harder";
    return "You are a role farmer";
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-4 bg-gradient-to-b from-black via-gray-900 to-black">
      <div className="relative h-36 w-36 sm:h-44 sm:w-44">
        <Image
          src="/images/rykuan-mascot.jpg"
          alt="Rykuan"
          fill
          className="rounded-2xl object-cover"
        />
        <div className="absolute inset-0 rounded-2xl ring-2 ring-[#BFFF00]/30" 
             style={{ boxShadow: '0 0 15px rgba(191, 255, 0, 0.25)' }} />
      </div>

      <div className="flex flex-col items-center gap-2 text-center">
        <h2 className="text-3xl font-black uppercase tracking-tight text-[#BFFF00] sm:text-4xl"
            style={{ textShadow: '0 0 20px rgba(191, 255, 0, 0.4)' }}>
          {isNewHigh ? "New High Score!" : "Game Over"}
        </h2>
        <p className="text-sm text-gray-400">
          {getMessage()}
        </p>
      </div>

      <div className="flex items-center gap-8">
        <div className="flex flex-col items-center">
          <span className="text-xs uppercase tracking-wider text-gray-500">Score</span>
          <span className="font-mono text-3xl font-black text-[#BFFF00]"
                style={{ textShadow: '0 0 10px rgba(191, 255, 0, 0.4)' }}>{score}</span>
        </div>
        <div className="h-10 w-px bg-[#BFFF00]/20" />
        <div className="flex flex-col items-center">
          <span className="text-xs uppercase tracking-wider text-gray-500">Best</span>
          <span className="font-mono text-3xl font-black text-white">{highScore}</span>
        </div>
        <div className="h-10 w-px bg-[#BFFF00]/20" />
        <div className="flex flex-col items-center">
          <span className="text-xs uppercase tracking-wider text-gray-500">Crushed</span>
          <span className="font-mono text-3xl font-black text-white">{crushed}</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onRestart}
          type="button"
          className="rounded-xl bg-[#BFFF00] px-8 py-3 text-sm font-bold uppercase tracking-wider text-black transition-transform hover:scale-105 active:scale-95"
          style={{ boxShadow: '0 0 20px rgba(191, 255, 0, 0.3)' }}
        >
          Play Again
        </button>
        <button
          onClick={onHome}
          type="button"
          className="rounded-xl border-2 border-[#BFFF00]/30 bg-transparent px-8 py-3 text-sm font-bold uppercase tracking-wider text-white transition-transform hover:scale-105 hover:bg-[#BFFF00]/10 active:scale-95"
        >
          Home
        </button>
      </div>
    </div>
  )
}
