'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

interface Medication {
  id: string
  name: string
  dose: string
  frequency: string
  times: string[]
  days: string[]
  color: string
  createdAt: number
}

interface MedicationFormProps {
  onSubmit: (medication: any) => void
  onCancel: () => void
  initialData?: Medication
}

const COLORS = ['bg-blue-100', 'bg-green-100', 'bg-purple-100', 'bg-pink-100', 'bg-yellow-100', 'bg-orange-100', 'bg-red-100', 'bg-cyan-100', 'bg-indigo-100']
const COLOR_NAMES = ['Bleu', 'Vert', 'Violet', 'Rose', 'Jaune', 'Orange', 'Rouge', 'Cyan', 'Indigo']
const DAYS = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche']
const DAY_LABELS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']

export function MedicationForm({ onSubmit, onCancel, initialData }: MedicationFormProps) {
  const [name, setName] = useState(initialData?.name || '')
  const [dose, setDose] = useState(initialData?.dose || '')
  const [frequency, setFrequency] = useState(initialData?.frequency || '1')
  const [times, setTimes] = useState<string[]>(initialData?.times || ['08:00'])
  const [selectedDays, setSelectedDays] = useState<string[]>(initialData?.days || [...DAYS])
  const [selectedColor, setSelectedColor] = useState(initialData?.color || COLORS[0])

  const frequencyOptions = [
    { value: '1', label: '1x par jour' },
    { value: '2', label: '2x par jour' },
    { value: '3', label: '3x par jour' },
    { value: 'custom', label: 'Personnalisé' },
  ]

  const handleFrequencyChange = (value: string) => {
    setFrequency(value)
    if (value === '1') setTimes(['08:00'])
    if (value === '2') setTimes(['08:00', '20:00'])
    if (value === '3') setTimes(['08:00', '14:00', '20:00'])
  }

  const updateTime = (index: number, newTime: string) => {
    const newTimes = [...times]
    newTimes[index] = newTime
    setTimes(newTimes)
  }

  const addTime = () => {
    setTimes([...times, '12:00'])
  }

  const removeTime = (index: number) => {
    setTimes(times.filter((_, i) => i !== index))
  }

  const toggleDay = (day: string) => {
    setSelectedDays(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !dose.trim() || selectedDays.length === 0) return

    const createdAt = initialData?.createdAt || Date.now()

    onSubmit({
      name,
      dose,
      frequency,
      times: times.sort(),
      days: selectedDays,
      color: selectedColor,
      createdAt, // Save creation date
    })

    setName('')
    setDose('')
    setFrequency('1')
    setTimes(['08:00'])
    setSelectedDays([...DAYS])
  }

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-card rounded-xl shadow-lg max-w-md w-full p-6 border border-border max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-foreground">
            {initialData ? 'Modifier le médicament' : 'Ajouter un médicament'}
          </h2>
          <button
            onClick={onCancel}
            className="p-1 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Nom du médicament
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ex: Paracétamol"
              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          {/* Dose */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Dose
            </label>
            <input
              type="text"
              value={dose}
              onChange={(e) => setDose(e.target.value)}
              placeholder="ex: 500mg"
              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          {/* Frequency */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Fréquence
            </label>
            <select
              value={frequency}
              onChange={(e) => handleFrequencyChange(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {frequencyOptions.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Times */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Heures de prise
            </label>
            <div className="space-y-2">
              {times.map((time, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => updateTime(idx, e.target.value)}
                    className="flex-1 px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {times.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTime(idx)}
                      className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {frequency === 'custom' && (
              <button
                type="button"
                onClick={addTime}
                className="mt-2 text-sm text-primary hover:text-primary/80 font-medium"
              >
                + Ajouter une heure
              </button>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Jours de prise
            </label>
            <div className="grid grid-cols-4 gap-2">
              {DAYS.map((day, idx) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  className={`py-2 px-1 rounded-lg text-xs font-medium transition-all ${
                    selectedDays.includes(day)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                  title={DAY_LABELS[idx]}
                >
                  {DAY_LABELS[idx].substring(0, 3)}
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Couleur
            </label>
            <div className="grid grid-cols-9 gap-2">
              {COLORS.map((color, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded-lg ${color} border-2 transition-all ${
                    selectedColor === color ? 'border-primary scale-110' : 'border-border'
                  }`}
                  title={COLOR_NAMES[idx]}
                />
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 rounded-lg border border-border bg-background text-foreground hover:bg-muted transition-colors font-medium"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
            >
              {initialData ? 'Mettre à jour' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
