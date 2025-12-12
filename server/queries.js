import { getAsync, allAsync, runAsync } from './db.js'

export async function loginUser(email, password) {
  const user = await getAsync('SELECT id, email, name FROM users WHERE email = ? AND password = ?', [email, password])
  return user || null
}

export async function signupUser(email, password, name) {
  try {
    await runAsync('INSERT INTO users (email, password, name) VALUES (?, ?, ?)', [email, password, name])
    const user = await getAsync('SELECT id, email, name FROM users WHERE email = ?', [email])
    return user
  } catch (err) {
    throw new Error('Email already exists')
  }
}

export async function getUserPlants(userId) {
  const plants = await allAsync('SELECT * FROM plants WHERE user_id = ?', [userId])
  
  for (let plant of plants) {
    const logs = await allAsync('SELECT task, date FROM logs WHERE plant_id = ? ORDER BY date DESC', [plant.id])
    plant.logs = logs
  }
  
  return plants
}

export async function addPlant(userId, plantData) {
  const { id, name, type, wateringIntervalDays, fertilizingIntervalDays, notes, nextWatering, nextFertilizing } = plantData
  
  await runAsync(
    `INSERT INTO plants (id, user_id, name, type, watering_interval_days, fertilizing_interval_days, notes, next_watering, next_fertilizing)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, userId, name, type, wateringIntervalDays, fertilizingIntervalDays, notes, nextWatering, nextFertilizing]
  )
  
  return await getAsync('SELECT * FROM plants WHERE id = ?', [id])
}

export async function updatePlant(plantId, plantData) {
  const { name, type, wateringIntervalDays, fertilizingIntervalDays, notes, nextWatering, nextFertilizing } = plantData
  
  await runAsync(
    `UPDATE plants SET name = ?, type = ?, watering_interval_days = ?, fertilizing_interval_days = ?, notes = ?, next_watering = ?, next_fertilizing = ?
     WHERE id = ?`,
    [name, type, wateringIntervalDays, fertilizingIntervalDays, notes, nextWatering, nextFertilizing, plantId]
  )
  
  return await getAsync('SELECT * FROM plants WHERE id = ?', [plantId])
}

export async function deletePlant(plantId) {
  await runAsync('DELETE FROM plants WHERE id = ?', [plantId])
}

export async function logTask(plantId, task, date) {
  await runAsync('INSERT INTO logs (plant_id, task, date) VALUES (?, ?, ?)', [plantId, task, date])
  
  const logs = await allAsync('SELECT task, date FROM logs WHERE plant_id = ? ORDER BY date DESC', [plantId])
  return logs
}
