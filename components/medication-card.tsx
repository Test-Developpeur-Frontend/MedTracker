'use client'

import { Trash2, Calendar, Clock, Edit2 } from 'lucide-react'

interface Medication {
  id: string
  name: string
  dose: string
  frequency: string
  times: string[]
  days: string[]
  color: string
  createdAt?: number
}

interface DoseRecord {
  id: string
  medicationId: string
  date: string
  time: string
  completed: boolean
}

interface MedicationCardProps {
  medication: Medication
  doseRecords: DoseRecord[]
  onDelete: () => void
  onEdit: () => void
}

const DAY_LABELS = {
  lundi: 'Lun',
  mardi: 'Mar',
  mercredi: 'Mer',
  jeudi: 'Jeu',
  vendredi: 'Ven',
  samedi: 'Sam',
  dimanche: 'Dim'
}

export function MedicationCard({ medication, doseRecords, onDelete, onEdit }: MedicationCardProps) {
  const getCompletionStats = (medicationId: string) => {
    const last7Days = new Date()
    last7Days.setDate(last7Days.getDate() - 7)
    const last7DaysStr = last7Days.toISOString().split('T')[0]
    const todayStr = new Date().toISOString().split('T')[0]

    const relevantRecords = doseRecords.filter(
      d => d.medicationId === medicationId && d.date >= last7DaysStr && d.date <= todayStr
    )

    const completed = relevantRecords.filter(d => d.completed).length
    const total = relevantRecords.length

    return { completed, total }
  }

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return ''
    const date = new Date(timestamp)
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  const { completed, total } = getCompletionStats(medication.id)
  const percentage = total > 0 ? (completed / total) * 100 : 0

  const times = medication.times || []
  const days = medication.days || []

  return (
    <div className={`rounded-xl p-5 border-2 border-border hover:shadow-md transition-all ${medication.color}`}>
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg text-foreground">{medication.name}</h3>
          <p className="text-sm text-muted-foreground">{medication.dose}</p>
          {medication.createdAt && (
            <p className="text-xs text-muted-foreground/70 mt-1">
              Ajouté le {formatDate(medication.createdAt)}
            </p>
          )}
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={onEdit}
            className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Times */}
      <div className="flex items-center gap-2 mb-3 text-sm">
        <Clock className="w-4 h-4 text-muted-foreground" />
        <span className="text-muted-foreground font-medium">
          {times.length > 0 ? times.join(', ') : 'Pas d\'horaire'}
        </span>
      </div>

      {/* Days */}
      <div className="flex items-start gap-2 mb-4">
        <Calendar className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
        <div className="flex flex-wrap gap-1">
          {days.length > 0 ? (
            days.map((day) => (
              <span
                key={day}
                className="text-xs font-semibold px-2 py-1 bg-card/50 text-foreground rounded border border-border/50"
              >
                {DAY_LABELS[day as keyof typeof DAY_LABELS]}
              </span>
            ))
          ) : (
            <span className="text-xs text-muted-foreground">Pas de jours sélectionnés</span>
          )}
        </div>
      </div>

      {/* Adherence */}
      {total > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground">
              Adhérence (7 jours)
            </span>
            <span className="text-sm font-bold text-primary">
              {Math.round(percentage)}%
            </span>
          </div>
          <div className="w-full bg-muted/30 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-primary to-accent h-full transition-all"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
