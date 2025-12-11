import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../state/AuthContext.jsx'
import sproutUrl from '../assets/sprout.svg'
import { FcGoogle } from 'react-icons/fc'
import './Login.css'
import './Landing.css'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isSignup, setIsSignup] = useState(false)
  const [error, setError] = useState('')
  const [activeNav, setActiveNav] = useState('features')
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isAuthenticated } = useAuth()

  const from = location.state?.from?.pathname || '/dashboard'

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, from, navigate])

  const onSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (!email) {
      setError('Please enter your email')
      return
    }
    // Simple demo login/signup; accept any credentials
    login(email, password, isSignup ? name : undefined)
    navigate(from, { replace: true })
  }

  return (
    <>
      <nav className="landing-navbar">
        <div className="landing-navbar-inner">
          <div className="nav-segment">
            <a href="#top" className={`landing-nav-link ${activeNav === 'home' ? 'active' : ''}`} onClick={() => setActiveNav('home')}>Home</a>
            <a href="#features" className={`landing-nav-link ${activeNav === 'features' ? 'active' : ''}`} onClick={() => setActiveNav('features')}>Features</a>
            <a href="#about" className={`landing-nav-link ${activeNav === 'about' ? 'active' : ''}`} onClick={() => setActiveNav('about')}>About</a>
          </div>
        </div>
      </nav>
      <div className="hero">
        <div className="container hero-inner grid grid--2col">
          <div className="hero-copy">
            <h1 className="hero-title">Grow happier plants, effortlessly</h1>
            <p className="hero-subtitle">Gentle, nature-inspired tools to keep watering and fertilizing on track.</p>
            <div className="hero-art">
              <img className="hero-img" src={sproutUrl} alt="Sprout" style={{ width: 200 }} />
            </div>
          </div>

          <div className="hero-form-wrapper">
            <div className="card card--elevated card--ok card--form">
              <div className="auth-toggle-wrapper">
                <div className="segmented" role="tablist" aria-label="Auth mode">
                  <button
                    type="button"
                    className={`segmented-btn ${!isSignup ? 'active' : ''}`}
                    onClick={() => setIsSignup(false)}
                    role="tab"
                    aria-selected={!isSignup}
                  >
                    Log in
                  </button>
                  <button
                    type="button"
                    className={`segmented-btn ${isSignup ? 'active' : ''}`}
                    onClick={() => setIsSignup(true)}
                    role="tab"
                    aria-selected={isSignup}
                  >
                    Sign up
                  </button>
                </div>
              </div>
              <p className="text-muted small auth-subtitle">Use any email to continue</p>
              <form className="form" onSubmit={onSubmit}>
                {isSignup && (
                  <div>
                    <label htmlFor="name">Name</label>
                    <input id="name" type="text" className="input" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                )}
                <div>
                  <label htmlFor="email">Email</label>
                  <input id="email" type="email" className="input" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                  <label htmlFor="password">Password</label>
                  <input id="password" type="password" className="input" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                {error ? <div className="badge badge--danger" role="alert">{error}</div> : null}
                <div className="form-actions form-actions--centered">
                  <button type="submit" className="btn btn-primary btn--full">{isSignup ? 'Create account' : 'Continue'}</button>
                </div>
              </form>
              <div className="divider-label"><span>or</span></div>
              <div className="oauth">
                <button type="button" className="oauth-btn" title="Continue with Google">
                  <FcGoogle />
                  Continue with Google
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section id="features" className="features">
        <h2 className="section-title">What PlantPal Can Do</h2>
        <div className="grid grid--features">
          <div className="feature-card">
            <div className="feature-icon">🌱</div>
            <h3>Track Your Plants</h3>
            <p>Keep detailed records of each plant with species, location, and care schedule.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⏰</div>
            <h3>Smart Reminders</h3>
            <p>Get notified when your plants need watering, feeding, or other care tasks.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📅</div>
            <h3>Schedule Care</h3>
            <p>Set up custom care schedules for each plant based on its specific needs.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Monitor Health</h3>
            <p>Track overdue tasks and see at a glance which plants need attention.</p>
          </div>
        </div>
      </section>

      <section id="about" className="about">
        <h2 className="section-title">About PlantPal</h2>
        <div className="about-content">
          <p>PlantPal is your personal plant care assistant. Whether you're a seasoned gardener or just starting your plant journey, PlantPal helps you keep your green friends healthy and thriving.</p>
          <p>With an intuitive interface and smart reminders, you'll never forget to water, fertilize, or repot your plants again. Keep track of multiple plants effortlessly and enjoy the satisfaction of watching them grow.</p>
          <p>Start building your plant collection today and become the best plant parent you can be!</p>
        </div>
      </section>
    </>
  )
}
