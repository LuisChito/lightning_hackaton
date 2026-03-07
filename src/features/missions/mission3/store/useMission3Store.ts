import { create } from 'zustand'

interface Mission3UiState {
  showLevel3ReachedModal: boolean
  startFlow: () => void
  closeAll: () => void
}

export const useMission3Store = create<Mission3UiState>((set) => ({
  showLevel3ReachedModal: false,

  startFlow: () =>
    set({
      showLevel3ReachedModal: true,
    }),

  closeAll: () =>
    set({
      showLevel3ReachedModal: false,
    }),
}))
