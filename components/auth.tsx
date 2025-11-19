'use client'

import { useState } from 'react'

interface User {
  id: string
  fullName: string
  username: string
  password: string
}

interface AuthProps {
  onAuthSuccess: (username: string) => void
}

export function Auth({ onAuthSuccess }: AuthProps) {
  const [isSignUp, setIsSignUp] = useState(false)
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const getUsers = (): User[] => {
    const saved = localStorage.getItem('medtracker_users')
    return saved ? JSON.parse(saved) : []
  }

  const saveUsers = (users: User[]) => {
    localStorage.setItem('medtracker_users', JSON.stringify(users))
  }

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!fullName.trim() || !username.trim() || !password.trim()) {
      setError('Tous les champs sont requis')
      return
    }

    const users = getUsers()
    if (users.some(u => u.username === username)) {
      setError('Ce nom d\'utilisateur existe déjà')
      return
    }

    const newUser: User = {
      id: Date.now().toString(),
      fullName,
      username,
      password,
    }

    saveUsers([...users, newUser])
    localStorage.setItem('medtracker_currentUser', username)
    onAuthSuccess(username)
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!username.trim() || !password.trim()) {
      setError('Nom d\'utilisateur et mot de passe requis')
      return
    }

    const users = getUsers()
    const user = users.find(u => u.username === username && u.password === password)

    if (!user) {
      setError('Identifiants invalides')
      return
    }

    localStorage.setItem('medtracker_currentUser', username)
    onAuthSuccess(username)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-card rounded-xl border border-border shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-2 text-primary">MedTracker</h1>
        <p className="text-center text-muted-foreground mb-8">Suivi de vos médicaments</p>

        <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Nom complet
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Jean Dupont"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Nom d'utilisateur
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="jean_dupont"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 text-destructive text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            {isSignUp ? 'Créer un compte' : 'Se connecter'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-muted-foreground text-sm">
            {isSignUp ? 'Vous avez déjà un compte?' : 'Pas encore de compte?'}
          </p>
          <button
            onClick={() => {
              setIsSignUp(!isSignUp)
              setError('')
              setFullName('')
              setUsername('')
              setPassword('')
            }}
            className="text-primary hover:underline font-medium text-sm mt-1"
          >
            {isSignUp ? 'Se connecter' : 'Créer un compte'}
          </button>
        </div>
      </div>
    </div>
  )
}
