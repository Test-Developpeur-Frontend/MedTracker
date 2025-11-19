'use client'

import { CheckCircle2, Circle, AlertCircle } from 'lucide-react'

interface DoseRecord {
  id: string
  medicationId: string
  date: string
  time: string
  completed: boolean
}

interface Medication {
  id: string
  name: string
  dose: string
  color: string
}

interface TodayScheduleProps {
  todayDoses: DoseRecord[]
  medications: Medication[]
  onToggleDose: (id: string) => void
}

const colorMap: Record<string, { bg: string; border: string; icon: string; accent: string }> = {
  blue: { bg: 'bg-blue-50 dark:bg-blue-950/30', border: 'border-blue-300 dark:border-blue-700', icon: 'text-blue-600 dark:text-blue-400', accent: 'bg-blue-500' },
  green: { bg: 'bg-green-50 dark:bg-green-950/30', border: 'border-green-300 dark:border-green-700', icon: 'text-green-600 dark:text-green-400', accent: 'bg-green-500' },
  violet: { bg: 'bg-violet-50 dark:bg-violet-950/30', border: 'border-violet-300 dark:border-violet-700', icon: 'text-violet-600 dark:text-violet-400', accent: 'bg-violet-500' },
  pink: { bg: 'bg-pink-50 dark:bg-pink-950/30', border: 'border-pink-300 dark:border-pink-700', icon: 'text-pink-600 dark:text-pink-400', accent: 'bg-pink-500' },
  yellow: { bg: 'bg-yellow-50 dark:bg-yellow-950/30', border: 'border-yellow-300 dark:border-yellow-700', icon: 'text-yellow-600 dark:text-yellow-400', accent: 'bg-yellow-500' },
  orange: { bg: 'bg-orange-50 dark:bg-orange-950/30', border: 'border-orange-300 dark:border-orange-700', icon: 'text-orange-600 dark:text-orange-400', accent: 'bg-orange-500' },
  red: { bg: 'bg-red-50 dark:bg-red-950/30', border: 'border-red-300 dark:border-red-700', icon: 'text-red-600 dark:text-red-400', accent: 'bg-red-500' },
  cyan: { bg: 'bg-cyan-50 dark:bg-cyan-950/30', border: 'border-cyan-300 dark:border-cyan-700', icon: 'text-cyan-600 dark:text-cyan-400', accent: 'bg-cyan-500' },
  indigo: { bg: 'bg-indigo-50 dark:bg-indigo-950/30', border: 'border-indigo-300 dark:border-indigo-700', icon: 'text-indigo-600 dark:text-indigo-400', accent: 'bg-indigo-500' },
}

export function TodaySchedule({ todayDoses, medications, onToggleDose }: TodayScheduleProps) {
  const getMedication = (medicationId: string) => 
    medications.find(m => m.id === medicationId)

  const sortedDoses = [...todayDoses].sort((a, b) => a.time.localeCompare(b.time))

  const now = new Date()
  const currentTime = now.getHours() * 60 + now.getMinutes()

  const isOverdue = (dose: DoseRecord) => {
    if (dose.completed) return false
    const [hours, minutes] = dose.time.split(':').map(Number)
    const doseTime = hours * 60 + minutes
    return currentTime > doseTime
  }

  const completedCount = todayDoses.filter(d => d.completed).length
  const totalCount = todayDoses.length

  const getColorStyles = (colorName?: string) => {
    if (!colorName || !colorMap[colorName]) {
      return colorMap['blue']
    }
    return colorMap[colorName]
  }

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      {totalCount > 0 && (
        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-foreground">Progression du jour</h2>
            <span className="text-2xl font-bold text-primary">{completedCount}/{totalCount}</span>
          </div>
          <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-primary to-accent h-full transition-all duration-500"
              style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
            />
          </div>
        </div>
      )}

      {/* Doses List */}
      <div className="space-y-3">
        {todayDoses.length === 0 ? (
          <div className="bg-card rounded-xl p-8 border border-border text-center">
            <p className="text-muted-foreground">Aucun médicament ajouté pour aujourd'hui</p>
          </div>
        ) : (
          sortedDoses.map(dose => {
            const med = getMedication(dose.medicationId)
            const overdue = isOverdue(dose)
            const colors = getColorStyles(med?.color)

            if (!med) return null

            return (
              <button
                key={dose.id}
                onClick={() => onToggleDose(dose.id)}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                  dose.completed
                    ? `${colors.bg} border-2 border-green-400 dark:border-green-600`
                    : overdue
                    ? `bg-destructive/10 border-destructive`
                    : `${colors.bg} ${colors.border} hover:border-opacity-100`
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="pt-1">
                    {dose.completed ? (
                      <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                    ) : overdue ? (
                      <AlertCircle className="w-6 h-6 text-destructive animate-pulse" />
                    ) : (
                      <Circle className={`w-6 h-6 ${colors.icon}`} />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-foreground">{med.name}</h3>
                      <span className={`text-sm font-bold text-white px-2 py-1 rounded ${colors.accent}`}>
                        {dose.time}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{med.dose}</p>
                    {dose.completed && (
                      <p className="text-xs text-green-600 dark:text-green-400 font-medium mt-1">✓ Complété</p>
                    )}
                    {overdue && !dose.completed && (
                      <p className="text-xs text-destructive font-medium mt-1">⚠ En retard</p>
                    )}
                  </div>
                </div>
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}
