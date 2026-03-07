import { create } from 'zustand'
import { saveGameProgress } from '../services/missionProgress.service'

export interface Mission {
  id: string
  title: string
  description: string
  xpReward: number
  completed: boolean
}

interface MissionState {
  xp: number
  level: number
  missions: Mission[]
  completedMissions: string[]
  currentMission: Mission | null
  addXP: (amount: number) => void
  completeMission: (missionId: string) => void
  setMissions: (missions: Mission[]) => void
  loadProgress: (xp: number, completedMissions: string[]) => void
}

const initialMissions: Mission[] = [
  {
    id: 'create-first-node',
    title: 'Misión 1: Crear tu Nodo',
    description: 'Haz doble clic en el mapa para crear tu primer nodo',
    xpReward: 75,
    completed: false,
  },
  {
    id: 'configure-node',
    title: 'Misión 2: Configurar tu Nodo',
    description: 'Selecciona tu nodo y personaliza su nombre y balance',
    xpReward: 0, // XP se suma al editar (10 + 15 = 25 XP)
    completed: false,
  },
]

export const useMissionStore = create<MissionState>((set, get) => ({
  xp: 0,
  level: 1,
  missions: initialMissions,
  completedMissions: [],
  currentMission: initialMissions[0],

  addXP: (amount: number) => {
    set((state) => {
      const newXP = state.xp + amount
      const newLevel = Math.floor(newXP / 100) + 1
      
      // Guardar en localStorage
      saveGameProgress({
        xp: newXP,
        completedMissions: state.completedMissions,
      })
      
      console.log(`✨ +${amount} XP! Total: ${newXP} XP (Nivel ${newLevel})`)
      
      return { xp: newXP, level: newLevel }
    })
  },

  completeMission: (missionId: string) => {
    const state = get()
    const mission = state.missions.find((m) => m.id === missionId)
    
    if (mission && !state.completedMissions.includes(missionId)) {
      // Actualizar misiones marcando como completada
      const updatedMissions = state.missions.map((m) =>
        m.id === missionId ? { ...m, completed: true } : m
      )
      
      // Agregar XP (esto también guarda en localStorage)
      if (mission.xpReward > 0) {
        state.addXP(mission.xpReward)
      }
      
      // Actualizar misión actual a la siguiente no completada
      const nextMission = updatedMissions.find(
        (m) => !m.completed && m.id !== missionId
      )
      
      const newCompletedMissions = [...state.completedMissions, missionId]
      
      set({
        missions: updatedMissions,
        completedMissions: newCompletedMissions,
        currentMission: nextMission || null,
      })
      
      // Guardar en localStorage
      saveGameProgress({
        completedMissions: newCompletedMissions,
        xp: state.xp,
      })
      
      console.log('✅ Misión completada:', missionId)
      console.log('🎯 Siguiente misión:', nextMission?.id || 'ninguna')
    }
  },

  setMissions: (missions: Mission[]) => {
    set({ missions })
  },

  loadProgress: (xp: number, completedMissions: string[]) => {
    const level = Math.floor(xp / 100) + 1
    const updatedMissions = initialMissions.map((m) => ({
      ...m,
      completed: completedMissions.includes(m.id),
    }))
    const currentMission = updatedMissions.find((m) => !m.completed) || null
    
    set({
      xp,
      level,
      completedMissions,
      missions: updatedMissions,
      currentMission,
    })
  },
}))
