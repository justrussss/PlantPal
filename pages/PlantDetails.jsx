import { useNavigate, useParams } from 'react-router-dom'
import { usePlants } from '../state/PlantContext.jsx'
import { format } from 'date-fns'
import './PlantDetails.css'

export default function PlantDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { state, dispatch } = usePlants()
  const plant = state.plants.find((p) => p.id === id)

  if (!plant) return <p>Plant not found.</p>

  return (
    <div className="stack">
      <div className="row-between">
        <h2 className="title-xl">{plant.name}</h2>
        <button
          className="btn btn-warn"
          onClick={() => {
            if (window.confirm(`Delete ${plant.name}? This cannot be undone.`)) {
              dispatch({ type: 'DELETE_PLANT', payload: { id: plant.id } })
              navigate('/dashboard', { replace: true })
            }
          }}
        >
          Delete Plant
        </button>
      </div>
      <div className="grid grid--2col">
        <div className="card">
          <div className="small text-muted">Type</div>
          <div className="semibold">{plant.type}</div>
        </div>
        <div className="card">
          <div className="small text-muted">Notes</div>
          <div className="pre-wrap">{plant.notes || '—'}</div>
        </div>
      </div>

      <section>
        <h3 className="section-title">History Logs</h3>
        {plant.logs.length === 0 ? (
          <p className="text-muted">No logs yet.</p>
        ) : (
          <ul className="stack small">
            {plant.logs.map((l, i) => (
              <li key={i} className="card">
                <span className="semibold capitalize">{l.task}</span>{' '}
                on {format(new Date(l.date), 'PPpp')}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
