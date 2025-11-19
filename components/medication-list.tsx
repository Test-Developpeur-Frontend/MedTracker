'use client'

import { Trash2, Pill } from 'lucide-react'

interface Medication {
  id: string
  name: string
  dose: string
  frequency: string
  times: string[]
  color: string
}

interface DoseRecord {
  id: string
  medicationId: string
  date: string
  time: string
  completed: boolean
}

interface MedicationListProps {
  medications: Medication[]
  doseRecords: DoseRecord[]
  onDelete: (id: string) => void
}

export function MedicationList({ medications, doseRecords, onDelete }: MedicationListProps) {
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

  return (
    <div className="space-y-4">
      {medications.length === 0 ? (
        <div className="bg-card rounded-xl p-8 border border-border text-center">
          <Pill className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
          <p className="text-muted-foreground text-lg">Aucun médicament ajouté</p>
          <p className="text-sm text-muted-foreground mt-1">Commencez par en ajouter un</p>
        </div>
      ) : (
        medications.map(med => {
          const { completed, total } = getCompletionStats(med.id)
          const percentage = total > 0 ? (completed / total) * 100 : 0

          return (
            <div
              key={med.id}
              className="bg-card rounded-xl p-4 border border-border hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg text-foreground">{med.name}</h3>
                  <p className="text-sm text-muted-foreground">{med.dose}</p>
                </div>
                <button
                  onClick={() => onDelete(med.id)}
                  className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors flex-shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Fréquence: {med.frequency}</span>
                  <span className="text-muted-foreground">Heures: {med.times.join(', ')}</span>
                </div>

                {total > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-muted-foreground">
                        Adhérence (7 jours)
                      </span>
                      <span className="text-sm font-bold text-primary">
                        {Math.round(percentage)}%
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-secondary to-accent h-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}
