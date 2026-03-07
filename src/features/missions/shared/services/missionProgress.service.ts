import type { Node, Edge } from '@xyflow/react'

interface GameProgress {
  sessionId: string
  playerName: string
  nodes: Node[]
  edges: Edge[]
  hasCreatedNode: boolean
  hasClickedNode: boolean
  modalsCompleted: boolean
  xp: number
  completedMissions: string[]
  createdAt: string
  lastUpdated: string
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
export const saveGameProgress = (progress: Partial<GameProgress>): void => {
  const sessionId = getOrCreateSession()
  const playerName = localStorage.getItem('playerName') || ''
  
  const currentProgress = loadGameProgress()
  
  const updatedProgress: GameProgress = {
    sessionId,
    playerName,
    nodes: progress.nodes || currentProgress?.nodes || [],
    edges: progress.edges || currentProgress?.edges || [],
    hasCreatedNode: progress.hasCreatedNode ?? currentProgress?.hasCreatedNode ?? false,
    hasClickedNode: progress.hasClickedNode ?? currentProgress?.hasClickedNode ?? false,
    modalsCompleted: progress.modalsCompleted ?? currentProgress?.modalsCompleted ?? false,
    xp: progress.xp ?? currentProgress?.xp ?? 0,
    completedMissions: progress.completedMissions || currentProgress?.completedMissions || [],
    createdAt: currentProgress?.createdAt || new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
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
  localStorage.removeItem(STORAGE_KEY)
  localStorage.removeItem('currentSessionId')
  localStorage.removeItem('playerName')
}

// Verificar si hay progreso guardado
export const hasGameProgress = (): boolean => {
  return loadGameProgress() !== null
}
