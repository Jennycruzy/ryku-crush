'use client'

import { useState } from 'react'
import { login, register } from '@/lib/api'
import { useAuth } from '@/lib/auth-context'

interface LoginModalProps {
  onClose: () => void
}

export default function LoginModal({ onClose }: LoginModalProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login: authLogin } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = isLogin 
        ? await login(username, password)
        : await register(username, password)

      if (response.error) {
        setError(response.error)
      } else if (response.token && response.user) {
        authLogin(response.token, response.user)
        onClose()
      }
    } catch (err) {
      setError('Connection error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl p-8 max-w-md w-full border-2 border-[#BFFF00]/30">
        <h2 className="text-3xl font-bold text-[#BFFF00] mb-6 text-center">
          {isLogin ? 'Login' : 'Sign Up'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-[#BFFF00] focus:outline-none"
              required
              minLength={3}
              maxLength={20}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-[#BFFF00] focus:outline-none"
              required
              minLength={6}
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#BFFF00] text-black font-bold rounded-lg hover:bg-[#a8e600] transition-colors disabled:opacity-50"
          >
            {loading ? 'Loading...' : isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-[#BFFF00] text-sm hover:underline"
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Login'}
          </button>
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
