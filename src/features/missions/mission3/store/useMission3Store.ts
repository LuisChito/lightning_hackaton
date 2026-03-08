import { create } from 'zustand'

interface Mission3UiState {
  showLevel3ReachedModal: boolean
  showSelectDestinationModal: boolean
  showInvoiceExplanationModal: boolean
  showSourceNodeAutofillModal: boolean
  startFlow: () => void
  continueToSelectDestination: () => void
  onDestinationSelected: () => void
  onInvoiceHashCopied: () => void
  closeSourceNodeAutofillModal: () => void
  closeAll: () => void
}

export const useMission3Store = create<Mission3UiState>((set) => ({
  showLevel3ReachedModal: false,
  showSelectDestinationModal: false,
  showInvoiceExplanationModal: false,
  showSourceNodeAutofillModal: false,

  startFlow: () =>
    set({
      showLevel3ReachedModal: true,
      showSelectDestinationModal: false,
      showInvoiceExplanationModal: false,
      showSourceNodeAutofillModal: false,
    }),

  continueToSelectDestination: () =>
    set({
      showLevel3ReachedModal: false,
      showSelectDestinationModal: true,
      showInvoiceExplanationModal: false,
      showSourceNodeAutofillModal: false,
    }),

  onDestinationSelected: () =>
    set({
      showLevel3ReachedModal: false,
      showSelectDestinationModal: false,
      showInvoiceExplanationModal: true,
      showSourceNodeAutofillModal: false,
    }),

  onInvoiceHashCopied: () =>
    set({
      showLevel3ReachedModal: false,
      showSelectDestinationModal: false,
      showInvoiceExplanationModal: false,
      showSourceNodeAutofillModal: true,
    }),

  closeSourceNodeAutofillModal: () =>
    set({
      showSourceNodeAutofillModal: false,
    }),

  closeAll: () =>
    set({
      showLevel3ReachedModal: false,
      showSelectDestinationModal: false,
      showInvoiceExplanationModal: false,
      showSourceNodeAutofillModal: false,
    }),
}))
