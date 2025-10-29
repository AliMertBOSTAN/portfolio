import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { FaHome, FaScroll } from 'react-icons/fa'
import './BottomNav.css'

function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <nav className="bottom-nav">
      <div className="bottom-nav-container">
        <button 
          className={`nav-item ${isActive('/') ? 'active' : ''}`}
          onClick={() => navigate('/')}
          aria-label="Ana Sayfa"
          title="Ana Sayfa"
        >
          <FaHome className="nav-icon" />
        </button>
        
        <button 
          className={`nav-item ${isActive('/blog') ? 'active' : ''}`}
          onClick={() => navigate('/blog')}
          aria-label="Makaleler"
          title="Makaleler"
        >
          <FaScroll className="nav-icon" />
        </button>
      </div>
    </nav>
  )
}

export default BottomNav
