import { Outlet } from 'react-router-dom'
import Header from './components/Header.jsx'

function App() {
  return (
    <div className="app">
      <Header />
      <main className="container">
        <Outlet />
      </main>
    </div>
  )
}

export default App
