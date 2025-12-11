import { usePlants } from '../state/PlantContext.jsx'
import PlantForm from '../components/PlantForm.jsx'
import PlantCard from '../components/PlantCard.jsx'
import ReminderNotification from '../components/ReminderNotification.jsx'
import './Dashboard.css'

export default function Dashboard() {
  const { state, overdueCount } = usePlants()

  return (
    <>
      <div className="stack">
      <ReminderNotification />
      <section className="grid grid--stats">
        <div className="stat stat--success">
          <div className="stat-label">Total Plants</div>
          <div className="stat-value">{state.plants.length}</div>
        </div>
        <div className={`stat ${overdueCount > 0 ? 'stat--danger' : 'stat--success'}`}>
          <div className="stat-label">Overdue Tasks</div>
          <div className="stat-value">{overdueCount}</div>
        </div>
      </section>

      <section id="add">
        <h2 className="section-title">Add a Plant</h2>
        <PlantForm />
      </section>

      <section>
        <h2 className="section-title">Your Plants</h2>
        {state.plants.length === 0 ? (
          <div className="empty">No plants yet. Add one above.</div>
        ) : (
          <div className="grid grid--cards">
            {state.plants.map((p) => (
              <PlantCard key={p.id} plant={p} />
            ))}
          </div>
        )}
      </section>
    </div>
    </>
  )
}
