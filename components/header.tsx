'use client'

import { Pill, LogOut } from 'lucide-react'
import { useState, useEffect } from 'react'

interface HeaderProps {
  currentUser?: string | null
  onLogout?: () => void
}

export function Header({ currentUser, onLogout }: HeaderProps) {
  const [currentTime, setCurrentTime] = useState<string>('')
  const [currentDate, setCurrentDate] = useState<string>('')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const formattedTime = now.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
      const formattedDate = now.toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
      setCurrentTime(formattedTime)
      setCurrentDate(formattedDate)
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <header className="bg-card border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-4 md:py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Pill className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">MedTracker</h1>
              <p className="text-xs md:text-sm text-muted-foreground">Suivi apaisant de vos médicaments</p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
            <div className="text-right">
              <p className="text-xl md:text-2xl font-bold text-primary">{currentTime}</p>
              <p className="text-xs md:text-sm text-muted-foreground capitalize">{currentDate}</p>
            </div>

            {currentUser && (
              <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-8">
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">Connecté</p>
                  <p className="text-xs text-muted-foreground truncate max-w-32 md:max-w-none">{currentUser}</p>
                </div>
                <button
                  onClick={onLogout}
                  className="p-2 hover:bg-muted rounded-lg transition-colors flex-shrink-0"
                  title="Déconnexion"
                >
                  <LogOut className="w-5 h-5 text-foreground" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
