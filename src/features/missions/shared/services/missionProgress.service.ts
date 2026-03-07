import type { Node, Edge } from '@xyflow/react'

interface GameProgress {
  sessionId: string
  playerName: string
  missionCounter: number
  nodes: Node[]
  edges: Edge[]
  hasCreatedNode: boolean
  hasClickedNode: boolean
  modalsCompleted: boolean
  xp: number
  completedMissions: string[]
  createdAt: string
  lastUpdated: string
  // Progreso específico por misión
  mission1?: {
    nodes: Node[]
    edges: Edge[]
    hasCreatedNode: boolean
    hasClickedNode: boolean
  }
  mission2?: {
    nodes: Node[]
    edges: Edge[]
    hasCreatedNode: boolean
    hasClickedNode: boolean
  }
}

const STORAGE_KEY = 'lightning-quest-progress'

// Generar ID único para la sesión
export const generateSessionId = (): string => {
  return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Obtener o crear sesión
export const getOrCreateSession = (): string => {
  let sessionId = localStorage.getItem('currentSessionId')
  if (!sessionId) {
    sessionId = generateSessionId()
    localStorage.setItem('currentSessionId', sessionId)
  }
  return sessionId
}

// Guardar progreso del juego
export const saveGameProgress = (progress: Partial<GameProgress>, missionId?: 'mission1' | 'mission2'): void => {
  const sessionId = getOrCreateSession()
  const playerName = localStorage.getItem('playerName') || ''
  
  const currentProgress = loadGameProgress()
  
  const updatedProgress: GameProgress = {
    sessionId,
    playerName,
    missionCounter: progress.missionCounter ?? currentProgress?.missionCounter ?? 0,
    nodes: progress.nodes || currentProgress?.nodes || [],
    edges: progress.edges || currentProgress?.edges || [],
    hasCreatedNode: progress.hasCreatedNode ?? currentProgress?.hasCreatedNode ?? false,
    hasClickedNode: progress.hasClickedNode ?? currentProgress?.hasClickedNode ?? false,
    modalsCompleted: progress.modalsCompleted ?? currentProgress?.modalsCompleted ?? false,
    xp: progress.xp ?? currentProgress?.xp ?? 0,
    completedMissions: progress.completedMissions || currentProgress?.completedMissions || [],
    createdAt: currentProgress?.createdAt || new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    mission1: currentProgress?.mission1,
    mission2: currentProgress?.mission2,
  }
  
  // Si se especifica un missionId, guardar el progreso específico de esa misión
  if (missionId && (progress.nodes || progress.edges || progress.hasCreatedNode !== undefined || progress.hasClickedNode !== undefined)) {
    updatedProgress[missionId] = {
      nodes: progress.nodes ?? currentProgress?.[missionId]?.nodes ?? [],
      edges: progress.edges ?? currentProgress?.[missionId]?.edges ?? [],
      hasCreatedNode: progress.hasCreatedNode ?? currentProgress?.[missionId]?.hasCreatedNode ?? false,
      hasClickedNode: progress.hasClickedNode ?? currentProgress?.[missionId]?.hasClickedNode ?? false,
    }
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProgress))
}

// Cargar progreso del juego
export const loadGameProgress = (): GameProgress | null => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return null
    
    const progress: GameProgress = JSON.parse(saved)
    
    // Validar que el playerName coincida
    const currentPlayerName = localStorage.getItem('playerName')
    if (progress.playerName !== currentPlayerName) {
      // Si cambió el jugador, resetear progreso
      return null
    }
    
    return progress
  } catch (error) {
    console.error('Error loading game progress:', error)
    return null
  }
}

// Resetear todo el progreso
export const resetGameProgress = (): void => {
  const unlockKeys: string[] = []
  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i)
    if (key && key.startsWith('mission2-unlock-modal-shown:')) {
      unlockKeys.push(key)
    }
  }

  unlockKeys.forEach((key) => localStorage.removeItem(key))
  localStorage.removeItem(STORAGE_KEY)
  localStorage.removeItem('currentSessionId')
  localStorage.removeItem('playerName')
}

// Verificar si hay progreso guardado
export const hasGameProgress = (): boolean => {
  return loadGameProgress() !== null
}
