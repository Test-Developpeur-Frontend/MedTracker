'use client'

import { useState, useEffect } from 'react'
import { MedicationForm } from '@/components/medication-form'
import { MedicationCard } from '@/components/medication-card'
import { Header } from '@/components/header'
import { TodaySchedule } from '@/components/today-schedule'
import { Auth } from '@/components/auth'

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

interface DoseRecord {
  id: string
  medicationId: string
  date: string
  time: string
  completed: boolean
}

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState<string | null>(null)
  const [medications, setMedications] = useState<Medication[]>([])
  const [doseRecords, setDoseRecords] = useState<DoseRecord[]>([])
  const [showForm, setShowForm] = useState(false)
  const [activeTab, setActiveTab] = useState<'today' | 'all'>('today')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    const savedUser = localStorage.getItem('medtracker_currentUser')
    if (savedUser) {
      setCurrentUser(savedUser)
      setIsAuthenticated(true)
      loadUserData(savedUser)
    }
  }, [])

  const loadUserData = (username: string) => {
    const userMedicationsKey = `medtracker_medications_${username}`
    const userDoseRecordsKey = `medtracker_doserecords_${username}`
    
    const savedMedications = localStorage.getItem(userMedicationsKey)
    const savedDoseRecords = localStorage.getItem(userDoseRecordsKey)
    
    setMedications(savedMedications ? JSON.parse(savedMedications) : [])
    setDoseRecords(savedDoseRecords ? JSON.parse(savedDoseRecords) : [])
  }

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      const userMedicationsKey = `medtracker_medications_${currentUser}`
      localStorage.setItem(userMedicationsKey, JSON.stringify(medications))
    }
  }, [medications, isAuthenticated, currentUser])

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      const userDoseRecordsKey = `medtracker_doserecords_${currentUser}`
      localStorage.setItem(userDoseRecordsKey, JSON.stringify(doseRecords))
    }
  }, [doseRecords, isAuthenticated, currentUser])

  useEffect(() => {
    if (!isAuthenticated || !currentUser) return
    
    ensureTodayDoses()
  }, [activeTab, isAuthenticated, currentUser])

  const handleLogout = () => {
    localStorage.removeItem('medtracker_currentUser')
    setIsAuthenticated(false)
    setCurrentUser(null)
    setMedications([])
    setDoseRecords([])
    setShowForm(false)
    setEditingId(null)
  }

  const addMedication = (medication: Omit<Medication, 'id' | 'createdAt'>) => {
    let updatedMedications: Medication[]
    
    if (editingId) {
      updatedMedications = medications.map(m =>
        m.id === editingId
          ? { ...m, ...medication }
          : m
      )
      setEditingId(null)
    } else {
      const newMedication: Medication = {
        ...medication,
        id: Date.now().toString(),
        createdAt: Date.now(),
      }
      updatedMedications = [...medications, newMedication]
    }
    
    setMedications(updatedMedications)
    setShowForm(false)
    
    const today = new Date()
    const dayOfWeek = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'][today.getDay() === 0 ? 6 : today.getDay() - 1]
    const todayStr = today.toISOString().split('T')[0]
    
    let updatedDoses = [...doseRecords]
    updatedMedications.forEach(med => {
      const daysArray = med.days || []
      const timesArray = med.times || []
      
      if (daysArray.includes(dayOfWeek)) {
        timesArray.forEach(time => {
          const existingRecord = updatedDoses.find(
            d => d.medicationId === med.id && d.date === todayStr && d.time === time
          )
          
          if (!existingRecord) {
            const newRecord: DoseRecord = {
              id: `${med.id}-${todayStr}-${time}`,
              medicationId: med.id,
              date: todayStr,
              time,
              completed: false,
            }
            updatedDoses = [...updatedDoses, newRecord]
          }
        })
      } else {
        updatedDoses = updatedDoses.filter(dose => 
          !(dose.medicationId === med.id && dose.date === todayStr)
        )
      }
    })
    
    setDoseRecords(updatedDoses)
    setRefreshKey(prev => prev + 1)
    
    if (activeTab !== 'today') {
      setActiveTab('today')
    }
  }

  const deleteMedication = (id: string) => {
    setMedications(medications.filter(m => m.id !== id))
    setDoseRecords(doseRecords.filter(d => d.medicationId !== id))
    setRefreshKey(prev => prev + 1)
  }

  const toggleDoseCompletion = (doseRecordId: string) => {
    setDoseRecords(doseRecords.map(record =>
      record.id === doseRecordId
        ? { ...record, completed: !record.completed }
        : record
    ))
    setRefreshKey(prev => prev + 1)
  }

  const ensureTodayDosesImmediate = (medsToCheck: Medication[], dosesToCheck: DoseRecord[]) => {
    const today = new Date()
    const dayOfWeek = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'][today.getDay() === 0 ? 6 : today.getDay() - 1]
    const todayStr = today.toISOString().split('T')[0]
    
    let updatedDoses = [...dosesToCheck]
    
    medsToCheck.forEach(med => {
      const daysArray = med.days || []
      const timesArray = med.times || []
      
      if (daysArray.includes(dayOfWeek)) {
        timesArray.forEach(time => {
          const existingRecord = updatedDoses.find(
            d => d.medicationId === med.id && d.date === todayStr && d.time === time
          )
          
          if (!existingRecord) {
            const newRecord: DoseRecord = {
              id: `${med.id}-${todayStr}-${time}`,
              medicationId: med.id,
              date: todayStr,
              time,
              completed: false,
            }
            updatedDoses = [...updatedDoses, newRecord]
          }
        })
      } else {
        updatedDoses = updatedDoses.filter(dose => 
          !(dose.medicationId === med.id && dose.date === todayStr)
        )
      }
    })
    
    setDoseRecords(updatedDoses)
  }

  const ensureTodayDoses = () => {
    const today = new Date()
    const dayOfWeek = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'][today.getDay() === 0 ? 6 : today.getDay() - 1]
    const todayStr = today.toISOString().split('T')[0]
    
    const currentMeds = medications
    const currentDoses = doseRecords
    
    let hasChanges = false
    let updatedDoses = [...currentDoses]
    
    currentMeds.forEach(med => {
      const daysArray = med.days || []
      const timesArray = med.times || []
      
      if (daysArray.includes(dayOfWeek)) {
        timesArray.forEach(time => {
          const existingRecord = updatedDoses.find(
            d => d.medicationId === med.id && d.date === todayStr && d.time === time
          )
          
          if (!existingRecord) {
            const newRecord: DoseRecord = {
              id: `${med.id}-${todayStr}-${time}`,
              medicationId: med.id,
              date: todayStr,
              time,
              completed: false,
            }
            updatedDoses = [...updatedDoses, newRecord]
            hasChanges = true
          }
        })
      } else {
        const beforeLength = updatedDoses.length
        updatedDoses = updatedDoses.filter(dose => 
          !(dose.medicationId === med.id && dose.date === todayStr)
        )
        if (beforeLength !== updatedDoses.length) hasChanges = true
      }
    })
    
    if (hasChanges) {
      setDoseRecords(updatedDoses)
    }
  }

  useEffect(() => {
    if (medications.length > 0) {
      ensureTodayDoses()
    }
  }, [medications])

  useEffect(() => {
    if (!isAuthenticated) return
    
    const interval = setInterval(() => {
      setRefreshKey(prev => prev + 1)
    }, 60000) // Refresh every minute to update late status
    
    return () => clearInterval(interval)
  }, [isAuthenticated])

  if (!isAuthenticated) {
    return <Auth onAuthSuccess={(username) => {
      setCurrentUser(username)
      setIsAuthenticated(true)
      loadUserData(username)
    }} />
  }

  const today = new Date().toISOString().split('T')[0]
  const todayDoses = doseRecords.filter(d => d.date === today)

  const editingMedication = editingId ? medications.find(m => m.id === editingId) : null

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Header currentUser={currentUser} onLogout={handleLogout} />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('today')}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'today'
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'bg-card text-foreground border border-border hover:bg-muted'
            }`}
          >
            Aujourd'hui
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'all'
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'bg-card text-foreground border border-border hover:bg-muted'
            }`}
          >
            Tous les médicaments
          </button>
        </div>

        {activeTab === 'today' ? (
          <TodaySchedule
            key={refreshKey}
            todayDoses={todayDoses}
            medications={medications}
            onToggleDose={toggleDoseCompletion}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {medications.length === 0 ? (
              <div className="col-span-full bg-card rounded-xl p-12 border border-border text-center">
                <p className="text-muted-foreground text-lg">Aucun médicament ajouté</p>
              </div>
            ) : (
              medications.map(med => (
                <MedicationCard
                  key={med.id}
                  medication={med}
                  doseRecords={doseRecords}
                  onDelete={() => deleteMedication(med.id)}
                  onEdit={() => {
                    setEditingId(med.id)
                    setShowForm(true)
                  }}
                />
              ))
            )}
          </div>
        )}

        {!showForm && (
          <button
            onClick={() => {
              setEditingId(null)
              setShowForm(true)
            }}
            className="mt-8 w-full px-6 py-3 bg-accent text-accent-foreground rounded-lg font-medium hover:bg-accent/90 transition-colors shadow-md"
          >
            + Ajouter un médicament
          </button>
        )}

        {showForm && (
          <MedicationForm
            initialData={editingMedication || undefined}
            onSubmit={addMedication}
            onCancel={() => {
              setShowForm(false)
              setEditingId(null)
            }}
          />
        )}
      </main>
    </div>
  )
}
