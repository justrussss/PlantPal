import { NavLink, useNavigate } from 'react-router-dom'
import logoUrl from '../assets/leaf-logo.svg'
import { useAuth } from '../state/AuthContext.jsx'
import './Header.css'

export default function Header() {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }
  return (
    <header className="header">
      <div className="header-inner">
        <div className="brand">
          <img src={logoUrl} alt="PlantPal" className="brand-logo" />
          <h1 className="title">PlantPal</h1>
        </div>
        {isAuthenticated ? (
          <nav className="nav">
            <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'nav-link--active' : ''}`}>Dashboard</NavLink>
            <button className="btn" onClick={handleLogout} title={user ? `Log out ${user.name}` : 'Log out'}>Logout</button>
          </nav>
        ) : (
          <nav className="nav">
            <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'nav-link--active' : ''}`}>Log in</NavLink>
          </nav>
        )}
      </div>
    </header>
  )
}
