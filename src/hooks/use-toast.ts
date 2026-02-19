"use client"
// Marks this file as client-side only.
// Required because this logic runs in the browser (state, effects, UI events).

// Inspired by react-hot-toast library
import * as React from "react"
// Imports React for state management and lifecycle hooks.

import type {
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast"
// Imports the shape (types) of a toast UI component.
// These define what a toast can display and how it behaves.

/* ----------------------------------
   Configuration limits
---------------------------------- */

const TOAST_LIMIT = 1
// Maximum number of toasts shown at once.
// Prevents clutter or spammy notifications.

const TOAST_REMOVE_DELAY = 1000000
// Delay (in milliseconds) before a dismissed toast is fully removed.
// Large value keeps it in memory until explicitly cleared.

/* ----------------------------------
   Toast data structure
---------------------------------- */

type ToasterToast = ToastProps & {
  id: string
  // Unique identifier for each toast.

  title?: React.ReactNode
  // Optional title content.

  description?: React.ReactNode
  // Optional description content.

  action?: ToastActionElement
  // Optional action button (e.g., Undo, Retry).
}

/* ----------------------------------
   Toast action types
---------------------------------- */

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const
// Defines all valid actions that can affect toast state.

/* ----------------------------------
   ID generation
---------------------------------- */

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}
// Generates a unique ID for each toast.
// Prevents collisions and ensures reliable updates.

/* ----------------------------------
   Reducer action definitions
---------------------------------- */

type ActionType = typeof actionTypes

type Action =
  | {
      type: ActionType["ADD_TOAST"]
      toast: ToasterToast
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType["DISMISS_TOAST"]
      toastId?: ToasterToast["id"]
    }
  | {
      type: ActionType["REMOVE_TOAST"]
      toastId?: ToasterToast["id"]
    }
// Defines every possible action that can modify toast state.

/* ----------------------------------
   Global state shape
---------------------------------- */

interface State {
  toasts: ToasterToast[]
}
// Stores all active toasts.

/* ----------------------------------
   Toast removal timing
---------------------------------- */

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()
// Tracks scheduled toast removals to avoid duplicate timers.

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return
  }
  // Prevents scheduling multiple removals for the same toast.

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)
  // Removes the toast after the delay.

  toastTimeouts.set(toastId, timeout)
}

/* ----------------------------------
   Reducer (state transitions)
---------------------------------- */

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }
      // Adds a new toast and enforces the toast limit.

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }
      // Updates an existing toast by ID.

    case "DISMISS_TOAST": {
      const { toastId } = action

      // Schedules toast removal when dismissed.
      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id)
        })
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? { ...t, open: false }
            : t
        ),
      }
      // Visually closes the toast before removal.
    }

    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return { ...state, toasts: [] }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
      // Fully removes the toast from memory.
  }
}

/* ----------------------------------
   Global state listeners
---------------------------------- */

const listeners: Array<(state: State) => void> = []
// Stores subscribers that react to toast state changes.

let memoryState: State = { toasts: [] }
// In-memory global toast state.

/* ----------------------------------
   Dispatch function
---------------------------------- */

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}
// Updates state and notifies all listeners.

/* ----------------------------------
   Public toast API
---------------------------------- */

type Toast = Omit<ToasterToast, "id">
// Toast input without ID (system generates it).

function toast({ ...props }: Toast) {
  const id = genId()

  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    })
  // Allows updating an existing toast.

  const dismiss = () =>
    dispatch({ type: "DISMISS_TOAST", toastId: id })
  // Allows dismissing a toast programmatically.

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss()
      },
    },
  })
  // Creates and shows the toast.

  return { id, dismiss, update }
}

/* ----------------------------------
   React hook for components
---------------------------------- */

function useToast() {
  const [state, setState] = React.useState<State>(memoryState)
  // Syncs React components with global toast state.

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) listeners.splice(index, 1)
    }
  }, [state])
  // Subscribes/unsubscribes component to toast updates.

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) =>
      dispatch({ type: "DISMISS_TOAST", toastId }),
  }
  // Exposes toast controls to the UI.
}

export { useToast, toast }
// Exports the hook and toast function for use across the app.
