import { useState } from 'react'
import { usePlants } from '../state/PlantContext.jsx'
import './PlantForm.css'

export default function PlantForm() {
  const { addPlant } = usePlants()
  const [form, setForm] = useState({ name: '', type: '', wateringIntervalDays: 7, fertilizingIntervalDays: 30, notes: '' })
  const [error, setError] = useState('')

  async function submit(e) {
    e.preventDefault()
    if (!form.name) return
    setError('')
    try {
      await addPlant({ 
        id: crypto.randomUUID(),
        name: form.name, 
        type: form.type, 
        wateringIntervalDays: parseInt(form.wateringIntervalDays), 
        fertilizingIntervalDays: parseInt(form.fertilizingIntervalDays), 
        notes: form.notes,
        logs: [],
      })
      setForm({ name: '', type: '', wateringIntervalDays: 7, fertilizingIntervalDays: 30, notes: '' })
    } catch (err) {
      setError(err.message || 'Failed to add plant')
    }
  }

  return (
    <form onSubmit={submit} className="card card--elevated form form--2col">
      <div>
        <label>Name</label>
        <input className="input" value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} />
      </div>
      <div>
        <label>Type</label>
        <input className="input" value={form.type} onChange={(e)=>setForm({...form, type:e.target.value})} />
      </div>
      <div>
        <label>Watering Interval (days)</label>
        <input type="number" className="input" value={form.wateringIntervalDays} onChange={(e)=>setForm({...form, wateringIntervalDays:e.target.value})} />
      </div>
      <div>
        <label>Fertilizing Interval (days)</label>
        <input type="number" className="input" value={form.fertilizingIntervalDays} onChange={(e)=>setForm({...form, fertilizingIntervalDays:e.target.value})} />
      </div>
      <div style={{ gridColumn: '1 / -1' }}>
        <label>Notes</label>
        <textarea className="textarea" rows={3} value={form.notes} onChange={(e)=>setForm({...form, notes:e.target.value})} />
      </div>
      {error && <div className="badge badge--danger">{error}</div>}
      <div className="form-actions">
        <button className="btn btn-primary">Add Plant</button>
      </div>
    </form>
  )
}
