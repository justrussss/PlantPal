import { createContext, useContext, useReducer, useEffect } from 'react'
import { isBefore } from 'date-fns'
import { computeNextSchedule } from '../utils/schedule.js'
import { useAuth } from './AuthContext'

const PlantContext = createContext()

// Use current domain for API, or localhost:5000 for development
const API_URL = typeof window !== 'undefined' && window.location.hostname === 'localhost'
  ? 'http://localhost:5000/api'
  : `${window.location.origin}/api`

const initialState = {
  plants: [],
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_PLANTS': {
      return { ...state, plants: action.payload }
    }
    case 'ADD_PLANT': {
      return { ...state, plants: [...state.plants, action.payload] }
    }
    case 'LOG_TASK': {
      const plants = state.plants.map((p) => {
        if (p.id !== action.payload.plantId) return p
        const updated = { ...p, logs: action.payload.logs }
        return computeNextSchedule(updated)
      })
      return { ...state, plants }
    }
    case 'DELETE_PLANT': {
      return { ...state, plants: state.plants.filter((p) => p.id !== action.payload) }
    }
    default:
      return state
  }
}

export function PlantProvider({ children }) {
  const { user } = useAuth()
  const [state, dispatch] = useReducer(reducer, initialState)

  // Load plants when user changes
  useEffect(() => {
    if (user?.id) {
      fetch(`${API_URL}/plants/${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            const plantsWithSchedule = data.plants.map(p => 
              computeNextSchedule({
                ...p,
                wateringIntervalDays: p.watering_interval_days,
                fertilizingIntervalDays: p.fertilizing_interval_days,
                nextWatering: p.next_watering,
                nextFertilizing: p.next_fertilizing,
              })
            )
            dispatch({ type: 'SET_PLANTS', payload: plantsWithSchedule })
          }
        })
        .catch((err) => console.error('Failed to load plants:', err))
    } else {
      dispatch({ type: 'SET_PLANTS', payload: [] })
    }
  }, [user?.id])

  const addPlant = async (plantData) => {
    if (!user?.id) throw new Error('No user logged in')
    try {
      const res = await fetch(`${API_URL}/plants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, plant: plantData }),
      })
      const data = await res.json()
      if (data.success) {
        const plantWithSchedule = computeNextSchedule({
          ...data.plant,
          wateringIntervalDays: data.plant.watering_interval_days,
          fertilizingIntervalDays: data.plant.fertilizing_interval_days,
        })
        dispatch({ type: 'ADD_PLANT', payload: plantWithSchedule })
        return plantWithSchedule
      } else {
        throw new Error(data.error)
      }
    } catch (err) {
      throw err
    }
  }

  const deletePlant = async (plantId) => {
    try {
      const res = await fetch(`${API_URL}/plants/${plantId}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        dispatch({ type: 'DELETE_PLANT', payload: plantId })
      } else {
        throw new Error(data.error)
      }
    } catch (err) {
      throw err
    }
  }

  const logTask = async (plantId, task, date) => {
    try {
      const res = await fetch(`${API_URL}/plants/${plantId}/logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task, date }),
      })
      const data = await res.json()
      if (data.success) {
        dispatch({ type: 'LOG_TASK', payload: { plantId, logs: data.logs } })
      } else {
        throw new Error(data.error)
      }
    } catch (err) {
      throw err
    }
  }

  const overdueCount = state.plants.filter((p) => {
    const now = new Date()
    return (
      (p.nextWatering && isBefore(new Date(p.nextWatering), now)) ||
      (p.nextFertilizing && isBefore(new Date(p.nextFertilizing), now))
    )
  }).length

  return (
    <PlantContext.Provider value={{ state, dispatch, overdueCount, addPlant, deletePlant, logTask }}>
      {children}
    </PlantContext.Provider>
  )
}

export function usePlants() {
  const ctx = useContext(PlantContext)
  if (!ctx) throw new Error('usePlants must be used within PlantProvider')
  return ctx
}
