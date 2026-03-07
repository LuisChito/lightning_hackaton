import { create } from 'zustand'

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
      return { xp: newXP, level: newLevel }
    })
  },

  completeMission: (missionId: string) => {
    const state = get()
    const mission = state.missions.find((m) => m.id === missionId)
    
    if (mission && !state.completedMissions.includes(missionId)) {
      set({
        missions: state.missions.map((m) =>
          m.id === missionId ? { ...m, completed: true } : m
        ),
        completedMissions: [...state.completedMissions, missionId],
      })
      
      // Agregar XP
      state.addXP(mission.xpReward)
      
      // Actualizar misión actual a la siguiente no completada
      const nextMission = state.missions.find(
        (m) => !m.completed && m.id !== missionId
      )
      set({ currentMission: nextMission || null })
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
