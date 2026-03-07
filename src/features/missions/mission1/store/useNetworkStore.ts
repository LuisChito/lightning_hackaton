import { create } from 'zustand'
import type { Node } from '@xyflow/react'

interface NetworkState {
  selectedNode: Node | null
  setSelectedNode: (node: Node | null) => void
}

export const useNetworkStore = create<NetworkState>((set) => ({
  selectedNode: null,
  setSelectedNode: (node) => set({ selectedNode: node }),
}))
