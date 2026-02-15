'use client'

import { useState, useEffect } from 'react'
import { getLeaderboard } from '@/lib/api'

interface LeaderboardEntry {
  rank: number
  username: string
  score: number
  crushed: number
}

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadLeaderboard()
  }, [])

  const loadLeaderboard = async () => {
    try {
      const data = await getLeaderboard()
      setLeaderboard(data.leaderboard || [])
    } catch (error) {
      console.error('Failed to load leaderboard:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-gray-900/80 rounded-xl p-6 border border-[#BFFF00]/20">
        <h2 className="text-2xl font-bold text-[#BFFF00] mb-4">Weekly Leaderboard</h2>
        <p className="text-gray-400">Loading...</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-900/80 rounded-xl p-6 border border-[#BFFF00]/20 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-[#BFFF00] mb-4 text-center">
        🏆 Weekly Leaderboard
      </h2>

      {leaderboard.length === 0 ? (
        <p className="text-gray-400 text-center py-8">
          No scores yet. Be the first to play!
        </p>
      ) : (
        <div className="space-y-2">
          {leaderboard.map((entry) => (
            <div
              key={entry.rank}
              className="flex items-center justify-between bg-gray-800 p-4 rounded-lg hover:bg-gray-750 transition-colors"
            >
              <div className="flex items-center gap-4">
                <span className={`text-2xl font-bold ${
                  entry.rank === 1 ? 'text-yellow-400' :
                  entry.rank === 2 ? 'text-gray-300' :
                  entry.rank === 3 ? 'text-orange-400' :
                  'text-gray-500'
                }`}>
                  #{entry.rank}
                </span>
                <span className="text-white font-medium">{entry.username}</span>
              </div>

              <div className="flex items-center gap-6 text-right">
                <div>
                  <p className="text-[#BFFF00] font-bold text-lg">{entry.score}</p>
                  <p className="text-gray-400 text-xs">points</p>
                </div>
                <div>
                  <p className="text-white">{entry.crushed}</p>
                  <p className="text-gray-400 text-xs">crushed</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
