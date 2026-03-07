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
    title: 'Misión 1: Configurar tu Red',
    description: 'Crea tu primer nodo y configúralo',
    xpReward: 40,
    completed: false,
  },
  {
    id: 'create-first-channel',
    title: 'Misión 2: Crear Canal',
    description: 'Abre un canal entre tus dos nodos',
    xpReward: 100,
    completed: false,
  },
  {
    id: 'create-invoice',
    title: 'Misión 3: Crear Invoice',
    description: 'Crea tu primer invoice para recibir pagos',
    xpReward: 50,
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
      const safeAmount = Number.isFinite(amount) ? Math.max(0, amount) : 0
      const newXP = state.xp + safeAmount
      const maxMissionIndex = Math.max(0, state.missions.length - 1)
      const newMissionCounter = Math.min(Math.floor(newXP / 100), maxMissionIndex)
      const newLevel = Math.floor(newXP / 100) + 1
      const nextMission = state.missions[newMissionCounter] || null
      
      // Guardar en localStorage
      saveGameProgress({
        missionCounter: newMissionCounter,
        xp: newXP,
        completedMissions: state.completedMissions,
      })
      
      console.log(`✨ +${safeAmount} XP! Total: ${newXP} XP (Misión ${newMissionCounter}, Nivel ${newLevel})`)
      
      return { missionCounter: newMissionCounter, xp: newXP, level: newLevel, currentMission: nextMission }
    })
  },

  completeMission: (missionId: string) => {
    set((state) => {
      const mission = state.missions.find((m) => m.id === missionId)

      console.log(`🎯 Intentando completar misión: ${missionId}`)
      console.log('   Misión encontrada:', mission)
      console.log('   Ya completada:', state.completedMissions.includes(missionId))

      if (!mission || state.completedMissions.includes(missionId)) {
        return state
      }

      const updatedMissions = state.missions.map((m) =>
        m.id === missionId ? { ...m, completed: true } : m
      )
      const newCompletedMissions = [...state.completedMissions, missionId]
      const rewardXP = Math.max(0, mission.xpReward || 0)
      const newXP = state.xp + rewardXP
      const maxMissionIndex = Math.max(0, updatedMissions.length - 1)
      const newMissionCounter = Math.min(Math.floor(newXP / 100), maxMissionIndex)
      const newLevel = Math.floor(newXP / 100) + 1
      const nextMission = updatedMissions[newMissionCounter] || null

      // Guardar en localStorage de forma atómica
      saveGameProgress({
        missionCounter: newMissionCounter,
        completedMissions: newCompletedMissions,
        xp: newXP,
      })

      console.log(`✅ Completando misión: ${mission.title}`)
      console.log(`   Recompensa: +${rewardXP} XP`)
      console.log('✅ Misión completada:', missionId)
      console.log('🎯 Siguiente misión:', nextMission?.id || 'ninguna')

      return {
        missions: updatedMissions,
        completedMissions: newCompletedMissions,
        missionCounter: newMissionCounter,
        xp: newXP,
        level: newLevel,
        currentMission: nextMission,
      }
    })
  },

  setMissions: (missions: Mission[]) => {
    set({ missions })
  },

  loadProgress: (xp: number, missionCounter: number, completedMissions: string[]) => {
    const normalizedCompletedMissions = Array.isArray(completedMissions) ? completedMissions : []
    const safeXP = Number.isFinite(xp) ? Math.max(0, xp) : 0
    const maxMissionIndex = Math.max(0, initialMissions.length - 1)
    const computedMissionCounter = Math.min(Math.floor(safeXP / 100), maxMissionIndex)
    const level = Math.floor(safeXP / 100) + 1
    const updatedMissions = initialMissions.map((m) => ({
      ...m,
      completed: normalizedCompletedMissions.includes(m.id),
    }))
    const currentMission = updatedMissions[computedMissionCounter] || null
    
    set({
      missionCounter: computedMissionCounter,
      xp: safeXP,
      level,
      completedMissions: normalizedCompletedMissions,
      missions: updatedMissions,
      currentMission,
    })
  },
}))
