import { useState } from 'react'
import { NavLink } from 'react-router'

function Navbar() {
  const [isExpanded, setIsExpanded] = useState(false)

  function closeMenu() {
    setIsExpanded(false)
  }

  function linkClassName({ isActive }) {
    return `nav-link${isActive ? ' active' : ''}`
  }

  return (
    <nav className="navbar navbar-expand-lg bg-dark mb-4 navbar-full-width" data-bs-theme="dark">
      <div className="container">
        <NavLink className="navbar-brand" to="/" onClick={closeMenu}>
          My Online Garage
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          aria-controls="garageNavbar"
          aria-expanded={isExpanded}
          aria-label="Toggle navigation"
          onClick={() => setIsExpanded((expanded) => !expanded)}
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div
          className={`collapse navbar-collapse${isExpanded ? ' show' : ''}`}
          id="garageNavbar"
        >
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <NavLink className={linkClassName} to="/" end onClick={closeMenu}>
                My Garage
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={linkClassName} to="/expenses" onClick={closeMenu}>
                Expenses
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={linkClassName} to="/maintenance" onClick={closeMenu}>
                Maintenance
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
