import { formatDistanceToNow, isBefore } from 'date-fns'
import { usePlants } from '../state/PlantContext.jsx'
import { Link } from 'react-router-dom'
import waterUrl from '../assets/water.svg'
import fertUrl from '../assets/fertilizer.svg'
import './PlantCard.css'

export default function PlantCard({ plant }) {
  const { dispatch } = usePlants()
  const nextWater = new Date(plant.nextWatering)
  const nextFert = new Date(plant.nextFertilizing)
  const now = new Date()
  const waterOverdue = isBefore(nextWater, now)
  const fertOverdue = isBefore(nextFert, now)
  const anyOverdue = waterOverdue || fertOverdue

  return (
    <div className={`card card--elevated ${anyOverdue ? 'card--danger' : 'card--ok'}`}>
      <div className="plant-icon-header">🌱</div>
      <div className="row-between">
        <div>
          <h3>{plant.name}</h3>
          <p className="text-muted small">{plant.type}</p>
        </div>
        <div className="row-between" style={{ gap: '.5rem' }}>
          <span className={`badge ${anyOverdue ? 'badge--danger' : 'badge--ok'}`}>{anyOverdue ? 'Overdue' : 'On track'}</span>
          <Link to={`/plants/${plant.id}`} className="link">Details ▸</Link>
        </div>
      </div>

      <hr className="divider" />

      <div className="grid grid--two small">
        <div className={`meta ${waterOverdue ? 'text-danger' : ''}`}>
          <img className="meta-icon" src={waterUrl} alt="Water" />
          <span>Next Water: {formatDistanceToNow(nextWater, { addSuffix: true })}</span>
        </div>
        <div className={`meta ${fertOverdue ? 'text-danger' : ''}`}>
          <img className="meta-icon" src={fertUrl} alt="Fertilize" />
          <span>Next Fertilize: {formatDistanceToNow(nextFert, { addSuffix: true })}</span>
        </div>
      </div>

      <div className="actions">
        <button className="btn btn-info" onClick={() => dispatch({ type: 'LOG_TASK', payload: { id: plant.id, task: 'water' } })}>
          Watered Now
        </button>
        <button className="btn btn-primary" onClick={() => dispatch({ type: 'LOG_TASK', payload: { id: plant.id, task: 'fertilize' } })}>
          Fertilized Now
        </button>
        <button
          className="btn btn-warn"
          onClick={() => {
            if (window.confirm(`Delete ${plant.name}? This cannot be undone.`)) {
              dispatch({ type: 'DELETE_PLANT', payload: { id: plant.id } })
            }
          }}
          aria-label={`Delete ${plant.name}`}
        >
          Delete
        </button>
      </div>
    </div>
  )
}
