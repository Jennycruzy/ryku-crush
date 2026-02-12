"use client"

import { useState, useCallback } from "react"
import GameStartScreen from "@/components/game-start-screen"
import GameBoard from "@/components/game-board"
import GameOverScreen from "@/components/game-over-screen"

import {
  startBackgroundMusic,
  stopBackgroundMusic,
  playEndGameSound
} from "@/lib/sounds"


type GameState = "start" | "playing" | "over"

export default function RykuCrushGame() {
  const [gameState, setGameState] = useState<GameState>("start")
  const [finalScore, setFinalScore] = useState(0)
  const [totalCrushed, setTotalCrushed] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [gameKey, setGameKey] = useState(0)

  const handleStart = useCallback(() => {
    setGameState("playing")
    setGameKey((prev) => prev + 1)

    startBackgroundMusic()
  }, [])

  const handleGameOver = useCallback(
    (score: number, crushed: number) => {
      setFinalScore(score)
      setTotalCrushed(crushed)
      if (score > highScore) {
        setHighScore(score)
      }
      setGameState("over")
    },

    stopBackgroundMusic()
    playEndGameSound(score)
    
    [highScore]
  )

  const handleHome = useCallback(() => {
    setGameState("start")
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {gameState === "start" && <GameStartScreen onStart={handleStart} />}
      {gameState === "playing" && (
        <GameBoard key={gameKey} onGameOver={handleGameOver} highScore={highScore} />
      )}
      {gameState === "over" && (
        <GameOverScreen
          score={finalScore}
          highScore={highScore}
          crushed={totalCrushed}
          onRestart={handleStart}
          onHome={handleHome}
        />
      )}
    </div>
  )
}
