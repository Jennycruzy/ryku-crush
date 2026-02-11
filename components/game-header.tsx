"use client"

import Image from "next/image"
import { Zap, Timer, Trophy } from "lucide-react"

interface GameHeaderProps {
  score: number
  timeLeft: number
  combo: number
  highScore: number
}

export default function GameHeader({ score, timeLeft, combo, highScore }: GameHeaderProps) {
  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const isUrgent = timeLeft <= 10;

  return (
    <header className="flex items-center justify-between border-b-2 border-[#BFFF00]/20 bg-black/90 px-3 py-2 backdrop-blur-sm sm:px-6 sm:py-3"
            style={{ boxShadow: '0 2px 10px rgba(191, 255, 0, 0.1)' }}>
      <div className="flex items-center gap-2">
        <div className="relative h-8 w-8 overflow-hidden rounded-lg border border-[#BFFF00]/30"
             style={{ boxShadow: '0 0 8px rgba(191, 255, 0, 0.2)' }}>
          <Image
            src="/images/raiku-logo.jpg"
            alt="Raiku"
            fill
            className="object-cover"
          />
        </div>
        <span className="hidden text-sm font-bold uppercase tracking-wider text-[#BFFF00] sm:inline"
              style={{ textShadow: '0 0 8px rgba(191, 255, 0, 0.4)' }}>
          Ryku Crush
        </span>
      </div>

      <div className="flex items-center gap-3 sm:gap-5">
        {combo > 1 && (
          <div className="flex items-center gap-1 rounded-full bg-[#BFFF00]/10 px-2 py-0.5 text-xs font-bold text-[#BFFF00] border border-[#BFFF00]/30"
               style={{ boxShadow: '0 0 8px rgba(191, 255, 0, 0.3)' }}>
            <Zap className="h-3 w-3" />
            <span>{combo}x</span>
          </div>
        )}

        <div className="flex items-center gap-1.5 text-sm">
          <Trophy className="h-4 w-4 text-gray-500" />
          <span className="font-mono text-xs text-gray-400">{highScore}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <Timer className={`h-4 w-4 ${isUrgent ? "text-destructive animate-pulse" : "text-[#BFFF00]"}`} />
          <span className={`font-mono text-sm font-bold ${isUrgent ? "text-destructive animate-pulse" : "text-white"}`}>
            {minutes}:{seconds.toString().padStart(2, "0")}
          </span>
        </div>

        <div className="flex flex-col items-end">
          <span className="text-[10px] uppercase tracking-wider text-gray-500">Score</span>
          <span className="font-mono text-lg font-black leading-tight text-[#BFFF00]"
                style={{ textShadow: '0 0 10px rgba(191, 255, 0, 0.5)' }}>{score}</span>
        </div>
      </div>
    </header>
  )
}
