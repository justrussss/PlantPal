import { useEffect, useState } from 'react'
import { usePlants } from '../state/PlantContext.jsx'
import './ReminderNotification.css'

export default function ReminderNotification() {
  const { overdueCount } = usePlants()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (overdueCount > 0) {
      setVisible(true)
      const t = setTimeout(() => setVisible(false), 5000)
      return () => clearTimeout(t)
    }
  }, [overdueCount])

  if (!visible || overdueCount === 0) return null
  return (
    <div className="toast">
      {overdueCount} plant task(s) overdue. Check dashboard!
    </div>
  )
}
