import { useState } from 'react'
import { usePlants } from '../state/PlantContext.jsx'
import './PlantForm.css'

export default function PlantForm() {
  const { dispatch } = usePlants()
  const [form, setForm] = useState({ name: '', type: '', wateringIntervalDays: 7, fertilizingIntervalDays: 30, notes: '' })

  function submit(e) {
    e.preventDefault()
    if (!form.name) return
    dispatch({ type: 'ADD_PLANT', payload: form })
    setForm({ name: '', type: '', wateringIntervalDays: 7, fertilizingIntervalDays: 30, notes: '' })
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
      <div className="form-actions">
        <button className="btn btn-primary">Add Plant</button>
      </div>
    </form>
  )
}
