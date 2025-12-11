import { addDays } from 'date-fns'

export function computeNextSchedule(plant) {
  const lastWater = plant.logs.find((l) => l.task === 'water')
  const lastFert = plant.logs.find((l) => l.task === 'fertilize')
  const base = new Date()

  const nextWatering = addDays(
    lastWater ? new Date(lastWater.date) : base,
    plant.wateringIntervalDays || 7,
  ).toISOString()

  const nextFertilizing = addDays(
    lastFert ? new Date(lastFert.date) : base,
    plant.fertilizingIntervalDays || 30,
  ).toISOString()

  return { nextWatering, nextFertilizing }
}
