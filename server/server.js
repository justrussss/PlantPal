import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { initializeDatabase } from './db.js'
import { loginUser, signupUser, getUserPlants, addPlant, deletePlant, logTask } from './queries.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(bodyParser.json())

// Middleware to log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`)
  next()
})

// Initialize database
console.log('Initializing database...')
await initializeDatabase()
console.log('Database initialized.')

// Auth Routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body
    console.log(`Login attempt: ${email}`)
    const user = await loginUser(email, password)
    
    if (user) {
      console.log(`Login successful for ${email}`)
      res.json({ success: true, user })
    } else {
      console.log(`Login failed for ${email} - invalid credentials`)
      res.status(401).json({ success: false, error: 'Invalid credentials' })
    }
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ success: false, error: err.message })
  }
})

app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body
    console.log(`Signup attempt: ${email}`)
    const user = await signupUser(email, password, name)
    console.log(`Signup successful for ${email}`)
    res.json({ success: true, user })
  } catch (err) {
    console.error('Signup error:', err)
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

// Serve React build
const distPath = join(__dirname, '../dist')
app.use(express.static(distPath))

// Fallback to index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile(join(distPath, 'index.html'))
})

app.listen(PORT, () => {
  console.log(`PlantPal server running on port ${PORT}`)
})
