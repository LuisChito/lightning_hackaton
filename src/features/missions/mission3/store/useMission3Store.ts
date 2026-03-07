import { create } from 'zustand'

interface Mission3UiState {
  showLevel3ReachedModal: boolean
  showSelectDestinationModal: boolean
  showInvoiceExplanationModal: boolean
  startFlow: () => void
  continueToSelectDestination: () => void
  onDestinationSelected: () => void
  closeAll: () => void
}

export const useMission3Store = create<Mission3UiState>((set) => ({
  showLevel3ReachedModal: false,
  showSelectDestinationModal: false,
  showInvoiceExplanationModal: false,

  startFlow: () =>
    set({
      showLevel3ReachedModal: true,
      showSelectDestinationModal: false,
      showInvoiceExplanationModal: false,
    }),

  continueToSelectDestination: () =>
    set({
      showLevel3ReachedModal: false,
      showSelectDestinationModal: true,
      showInvoiceExplanationModal: false,
    }),

  onDestinationSelected: () =>
    set({
      showLevel3ReachedModal: false,
      showSelectDestinationModal: false,
      showInvoiceExplanationModal: true,
    }),

  closeAll: () =>
    set({
      showLevel3ReachedModal: false,
      showSelectDestinationModal: false,
      showInvoiceExplanationModal: false,
    }),
}))
