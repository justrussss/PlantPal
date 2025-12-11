import { createContext, useContext, useReducer, useEffect } from 'react'
import { addDays, isBefore } from 'date-fns'
import { computeNextSchedule } from '../utils/schedule.js'

const PlantContext = createContext()

const initialState = {
  plants: [],
}

function loadState() {
  try {
    const raw = localStorage.getItem('plantpal.state')
    if (!raw) return initialState
    const parsed = JSON.parse(raw)
    return parsed
  } catch {
    return initialState
  }
}

function saveState(state) {
  try {
    localStorage.setItem('plantpal.state', JSON.stringify(state))
  } catch {}
}

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_PLANT': {
      const plant = {
        id: crypto.randomUUID(),
        name: action.payload.name,
        type: action.payload.type,
        wateringIntervalDays: Number(action.payload.wateringIntervalDays || 7),
        fertilizingIntervalDays: Number(action.payload.fertilizingIntervalDays || 30),
        notes: action.payload.notes || '',
        logs: [],
      }
      const scheduled = computeNextSchedule(plant)
      return { ...state, plants: [...state.plants, { ...plant, ...scheduled }] }
    }
    case 'LOG_TASK': {
      const { id, task, date = new Date().toISOString() } = action.payload
      const plants = state.plants.map((p) => {
        if (p.id !== id) return p
        const logs = [{ task, date }, ...p.logs]
        const updated = { ...p, logs }
        const scheduled = computeNextSchedule(updated)
        return { ...updated, ...scheduled }
      })
      return { ...state, plants }
    }
    case 'DELETE_PLANT': {
      const { id } = action.payload
      return { ...state, plants: state.plants.filter((p) => p.id !== id) }
    }
    default:
      return state
  }
}

export function PlantProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState)

  useEffect(() => {
    saveState(state)
  }, [state])

  const overdueCount = state.plants.filter((p) => {
    const now = new Date()
    return (
      (p.nextWatering && isBefore(new Date(p.nextWatering), now)) ||
      (p.nextFertilizing && isBefore(new Date(p.nextFertilizing), now))
    )
  }).length

  return (
    <PlantContext.Provider value={{ state, dispatch, overdueCount }}>
      {children}
    </PlantContext.Provider>
  )
}

export function usePlants() {
  const ctx = useContext(PlantContext)
  if (!ctx) throw new Error('usePlants must be used within PlantProvider')
  return ctx
}
