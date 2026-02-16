"use client"

import React from "react"

import { useState, useEffect, useCallback, useRef } from "react"
import type { FallingTile } from "@/lib/game-data"
import { spawnTile, spawnDeceitPair } from "@/lib/game-data"
import GameHeader from "@/components/game-header"
import Image from "next/image"
import { playClickSound, playBombSound } from "@/lib/sounds"

const COLUMNS = 4
const GAME_TIME = 60
const FRAME_INTERVAL = 20 // ms per frame
const GROUND_Y = 95 // % from top where tiles "hit ground"
const TILE_SIZE_CLASS = "w-14 h-14 sm:w-16 sm:h-16"

// Speed multiplier based on time remaining (0.8x at 60s, up to 1.8x at 0s)
function getSpeedMultiplier(timeLeft: number): number {
  const progress = 1 - timeLeft / GAME_TIME // 0 at start, 1 at end
  return 1 + progress * 0.8 // Goes up to 1.8x speed
}

// Spawn interval decreases as time runs out (600ms -> 300ms)
function getSpawnInterval(timeLeft: number): number {
  const progress = 1 - timeLeft / GAME_TIME
  return Math.max(300, 600 - progress * 300)
}

interface GameBoardProps {
  onGameOver: (score: number, crushed: number) => void
  highScore: number
  onHome?: () => void
}

export default function GameBoard({ onGameOver, highScore, onHome }: GameBoardProps) {
  const [tiles, setTiles] = useState<FallingTile[]>([])
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(GAME_TIME)
  const [combo, setCombo] = useState(0)
  const [crushedCount, setCrushedCount] = useState(0)
  const [shaking, setShaking] = useState(false)
  const [floatingTexts, setFloatingTexts] = useState
  { id: string; text: string; x: number; y: number; color: string }[]
>([])
  const lastCrushTime = useRef(0)
  const gameAreaRef = useRef<HTMLDivElement>(null)
  const gameRunning = useRef(true)
  const timeLeftRef = useRef(GAME_TIME)

  // Timer countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          gameRunning.current = false
          timeLeftRef.current = 0
          return 0
        }
        timeLeftRef.current = prev - 1
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Game over trigger
  useEffect(() => {
    if (timeLeft === 0) {
      const timer = setTimeout(() => {
        onGameOver(score, crushedCount)
      }, 800)
      return () => clearTimeout(timer)
    }
  }, [timeLeft, score, crushedCount, onGameOver])

  // Spawn tiles with dynamic interval (gets faster as timer decreases)
  useEffect(() => {
    let timeoutId: NodeJS.Timeout
    function scheduleSpawn() {
      const interval = getSpawnInterval(timeLeftRef.current)
      timeoutId = setTimeout(() => {
        if (!gameRunning.current) return
        const roll = Math.random()
        const speedMult = getSpeedMultiplier(timeLeftRef.current)
        // More tiles spawn as time decreases
        const extraTileChance = speedMult > 1.5 ? 0.4 : speedMult > 1.2 ? 0.25 : 0.15
        setTiles((prev) => {
          // 20% chance: deceit pair
          if (roll < 0.2) {
            const pair = spawnDeceitPair(COLUMNS)
            pair.forEach(t => { t.speed *= speedMult })
            return [...prev, ...pair]
          }
          // Chance for 3 tiles increases with speed
          if (roll < 0.2 + extraTileChance) {
            const batch = Array.from({ length: 3 }, () => {
              const t = spawnTile(COLUMNS)
              t.speed *= speedMult
              return t
            })
            return [...prev, ...batch]
          }
          // 30% chance: 2 tiles
          if (roll < 0.7) {
            const t1 = spawnTile(COLUMNS); t1.speed *= speedMult
            const t2 = spawnTile(COLUMNS); t2.speed *= speedMult
            return [...prev, t1, t2]
          }
          // Single tile
          const t = spawnTile(COLUMNS)
          t.speed *= speedMult
          return [...prev, t]
        })
        scheduleSpawn()
      }, interval)
    }
    scheduleSpawn()
    return () => clearTimeout(timeoutId)
  }, [])

  // Animation loop: move tiles down (speed scales with timer)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!gameRunning.current) return
      setTiles((prev) =>
        prev
          .map((t) => {
            if (t.crushed) return t
            const newY = t.y + t.speed
            if (newY >= GROUND_Y) {
              return { ...t, y: GROUND_Y, missed: true }
            }
            return { ...t, y: newY }
          })
          .filter((t) => {
            if (t.crushed && t.y < -20) return false
            if (t.missed) return false
            return true
          })
      )
    }, FRAME_INTERVAL)
    return () => clearInterval(interval)
  }, [])

  // Clean floating texts
  useEffect(() => {
    if (floatingTexts.length === 0) return
    const timer = setTimeout(() => {
      setFloatingTexts((prev) => prev.slice(1))
    }, 900)
    return () => clearTimeout(timer)
  }, [floatingTexts])

  const handleCrush = useCallback(
    (tile: FallingTile, e: React.MouseEvent | React.TouchEvent) => {
      if (tile.crushed || tile.missed) return

      const now = Date.now()
      const timeSinceLastCrush = now - lastCrushTime.current
      lastCrushTime.current = now
      const isCombo = timeSinceLastCrush < 800
      const newCombo = isCombo ? combo + 1 : 1
      setCombo(newCombo)

      let pointsEarned = 0
      let textColor = "text-primary"

      if (tile.type === "bomb") {
        pointsEarned = -score
        setScore(0)
        setShaking(true)
        setTimeout(() => setShaking(false), 500)
        textColor = "text-destructive"
        playBombSound()
      } else if (tile.type === "minus") {
        setScore((prev) => Math.max(0, prev + tile.points))
        setShaking(true)
        setTimeout(() => setShaking(false), 500)
        textColor = "text-amber-500"
        pointsEarned = tile.points
        playBombSound() // ETH trap also gets bomb sound
      } else {
        const comboMultiplier = Math.min(newCombo, 5)
        pointsEarned = tile.points * comboMultiplier
        setScore((prev) => prev + pointsEarned)
        playClickSound()
      }

      setCrushedCount((prev) => prev + 1)

      // Mark tile as crushed
      setTiles((prev) => prev.filter((t) => t.uid !== tile.uid))

      // Floating text
      const rect = gameAreaRef.current?.getBoundingClientRect()
      if (rect) {
        const clientX =
          "touches" in e ? e.touches[0]?.clientX ?? rect.left + rect.width / 2 : e.clientX
        const clientY =
          "touches" in e ? e.touches[0]?.clientY ?? rect.top + rect.height / 2 : e.clientY
        const xPct = ((clientX - rect.left) / rect.width) * 100
        const yPct = ((clientY - rect.top) / rect.height) * 100
        setFloatingTexts((prev) => [
          ...prev,
          {
            id: tile.uid,
            text:
              tile.type === "bomb"
                ? "BOOM! 0"
                : tile.type === "minus"
                  ? `${pointsEarned}`
                  : `+${pointsEarned}`,
            x: xPct,
            y: yPct,
            color: textColor,
          },
        ])
      }
    },
    [combo, score]
  )

  // Handle exit with confirmation
  const handleExit = () => {
    if (window.confirm('Exit game? Your progress will be lost and score will not be saved.')) {
      onHome && onHome()
    }
  }

  // Column positions as percentages
  const colWidth = 100 / COLUMNS
  
  // Urgency effects near end of game
  const urgencyLevel = timeLeft <= 10 ? (10 - timeLeft) / 10 : 0;
  const glowIntensity = 0.4 + urgencyLevel * 0.6;

  return (
    <div className={`flex h-dvh flex-col ${shaking ? "animate-shake" : ""} ${timeLeft <= 10 ? "animate-pulse-subtle" : ""}`}>
      <GameHeader score={score} timeLeft={timeLeft} combo={combo} highScore={highScore} />

      {/* Play area */}
      <div
        ref={gameAreaRef}
        className="relative flex-1 overflow-hidden bg-gradient-to-b from-black via-gray-900 to-gray-950"
        style={{
          boxShadow: timeLeft <= 10 ? `inset 0 0 ${20 + urgencyLevel * 30}px rgba(191, 255, 0, ${glowIntensity * 0.2})` : 'none'
        }}
      >
        {/* Exit Button */}
        {onHome && (
          <button
            onClick={handleExit}
            className="absolute top-4 left-4 z-50 rounded-lg bg-gray-900/90 p-2 border-2 border-[#BFFF00]/30 hover:border-[#BFFF00] hover:bg-[#BFFF00]/10 transition-all group"
            style={{ boxShadow: '0 0 10px rgba(191, 255, 0, 0.2)' }}
            aria-label="Exit game"
            title="Exit game"
          >
            <svg 
              className="w-6 h-6 text-[#BFFF00]/70 group-hover:text-[#BFFF00] transition-colors" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
          </button>
        )}

        {/* Neon particles overlay - fewer and more subtle */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={`particle-${i}`}
              className="absolute w-0.5 h-0.5 bg-[#BFFF00] rounded-full animate-float-particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
                opacity: 0.2 + Math.random() * 0.3,
                boxShadow: `0 0 ${3 + Math.random() * 4}px rgba(191, 255, 0, 0.6)`
              }}
            />
          ))}
        </div>

        {/* Column guide lines - subtle */}
        {Array.from({ length: COLUMNS - 1 }).map((_, i) => (
          <div
            key={`line-${i}`}
            className="absolute top-0 bottom-0 w-px bg-[#BFFF00]/10"
            style={{ left: `${colWidth * (i + 1)}%` }}
          />
        ))}

        {/* Ground line */}
        <div
          className="absolute right-0 left-0 h-px bg-destructive/40"
          style={{ 
            top: `${GROUND_Y}%`,
            boxShadow: '0 0 4px rgba(239, 68, 68, 0.5)'
          }}
        />
        <div
          className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-destructive/10 to-transparent"
          style={{ top: `${GROUND_Y}%` }}
        />

        {/* Falling tiles */}
        {tiles.map((tile) => {
          // Ethereum bomb is deceptive - looks like a normal tile
          const displayClass = tile.id === "ethereum"
            ? "border-gray-700 shadow-[0_0_6px_rgba(191,255,0,0.2)] bg-gray-800" // Looks normal!
            : tile.id === "solana"
              ? "border-yellow-400/80 shadow-[0_0_12px_rgba(250,204,21,0.5)] bg-gray-900"
              : tile.id === "raiku-logo"
                ? "border-[#BFFF00] shadow-[0_0_12px_rgba(191,255,0,0.6)] bg-gray-900"
                : "border-gray-700 shadow-[0_0_6px_rgba(191,255,0,0.2)] bg-gray-800";
                  
          return (
            <button
              key={tile.uid}
              type="button"
              onClick={(e) => handleCrush(tile, e)}
              onTouchStart={(e) => handleCrush(tile, e)}
              className={`absolute transition-none ${TILE_SIZE_CLASS} -translate-x-1/2 rounded-full border-2 overflow-hidden active:scale-90 ${displayClass}`}
              style={{
                left: `${colWidth * tile.column + colWidth / 2}%`,
                top: `${tile.y}%`,
              }}
            >
              <Image
                src={tile.src || "/placeholder.svg"}
                alt={tile.label}
                fill
                className="object-cover pointer-events-none rounded-full"
                sizes="64px"
              />
            </button>
          );
        })}

        {/* Floating point texts */}
        {floatingTexts.map((ft) => (
          <div
            key={ft.id}
            className={`animate-float-up pointer-events-none absolute ${ft.color}`}
            style={{ left: `${ft.x}%`, top: `${ft.y}%` }}
          >
            <span className="text-lg font-black drop-shadow-lg">{ft.text}</span>
          </div>
        ))}

        {/* Bottom label */}
        <div className="absolute right-0 bottom-2 left-0 text-center text-[10px] uppercase tracking-wider text-muted-foreground/50">
          Crush before they fall, Avoid ETH Bombs!
        </div>
      </div>
    </div>
  )
}