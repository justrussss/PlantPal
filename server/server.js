import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import { initializeDatabase } from './db.js'
import { loginUser, signupUser, getUserPlants, addPlant, deletePlant, logTask } from './queries.js'

const app = express()
const PORT = 5000

app.use(cors())
app.use(bodyParser.json())

// Initialize database
await initializeDatabase()

// Auth Routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await loginUser(email, password)
    
    if (user) {
      res.json({ success: true, user })
    } else {
      res.status(401).json({ success: false, error: 'Invalid credentials' })
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body
    const user = await signupUser(email, password, name)
    res.json({ success: true, user })
  } catch (err) {
    res.status(400).json({ success: false, error: err.message })
  }
})

// Plant Routes
app.get('/api/plants/:userId', async (req, res) => {
  try {
    const { userId } = req.params
    const plants = await getUserPlants(parseInt(userId))
    res.json({ success: true, plants })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

app.post('/api/plants', async (req, res) => {
  try {
    const { userId, plant } = req.body
    const newPlant = await addPlant(parseInt(userId), plant)
    res.json({ success: true, plant: newPlant })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

app.delete('/api/plants/:plantId', async (req, res) => {
  try {
    const { plantId } = req.params
    await deletePlant(plantId)
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

app.post('/api/plants/:plantId/logs', async (req, res) => {
  try {
    const { plantId } = req.params
    const { task, date } = req.body
    const logs = await logTask(plantId, task, date)
    res.json({ success: true, logs })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

app.listen(PORT, () => {
  console.log(`PlantPal server running on http://localhost:${PORT}`)
})
