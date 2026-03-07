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
  missionCounter: number
  xp: number
  level: number
  missions: Mission[]
  completedMissions: string[]
  currentMission: Mission | null
  resetProgress: () => void
  addXP: (amount: number) => void
  completeMission: (missionId: string) => void
  setMissions: (missions: Mission[]) => void
  loadProgress: (xp: number, missionCounter: number, completedMissions: string[]) => void
}

const initialMissions: Mission[] = [
  {
    id: 'create-first-node',
    title: 'Misión 1: Crear tu Nodo',
    description: 'Haz doble clic en el mapa para crear tu primer nodo',
    xpReward: 40,
    completed: false,
  },
  {
    id: 'create-destination-and-channel',
    title: 'Misión 2: Crear Canal Entre Nodos',
    description: 'Crea un nodo destino y abre un canal válido entre origen y destino',
    xpReward: 75,
    completed: false,
  },
]

export const useMissionStore = create<MissionState>((set, get) => ({
  missionCounter: 0,
  xp: 0,
  level: 1,
  missions: initialMissions,
  completedMissions: [],
  currentMission: initialMissions[0],

  resetProgress: () => {
    set({
      missionCounter: 0,
      xp: 0,
      level: 1,
      missions: initialMissions,
      completedMissions: [],
      currentMission: initialMissions[0],
    })
  },

  addXP: (amount: number) => {
    set((state) => {
      const totalXP = state.xp + amount
      const missionAdvance = Math.floor(totalXP / 100)
      const newXP = totalXP
      const newMissionCounter = state.missionCounter + missionAdvance
      const newLevel = newMissionCounter + 1
      const nextMission = state.missions[newMissionCounter] || null
      
      // Guardar en localStorage
      saveGameProgress({
        missionCounter: newMissionCounter,
        xp: newXP,
        completedMissions: state.completedMissions,
      })
      
      console.log(`✨ +${amount} XP! Misión ${newMissionCounter}, XP actual ${newXP} (Nivel ${newLevel})`)
      
      return { missionCounter: newMissionCounter, xp: newXP, level: newLevel, currentMission: nextMission }
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
        currentMission: state.missions[state.missionCounter] || nextMission || null,
      })
      
      // Guardar en localStorage
      saveGameProgress({
        missionCounter: state.missionCounter,
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

  loadProgress: (xp: number, missionCounter: number, completedMissions: string[]) => {
    const level = missionCounter + 1
    const updatedMissions = initialMissions.map((m) => ({
      ...m,
      completed: completedMissions.includes(m.id),
    }))
    const currentMission = updatedMissions[missionCounter] || null
    
    set({
      missionCounter,
      xp,
      level,
      completedMissions,
      missions: updatedMissions,
      currentMission,
    })
  },
}))
