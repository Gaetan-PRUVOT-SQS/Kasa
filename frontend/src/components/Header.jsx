import { NavLink } from 'react-router-dom'
import Logo from './Logo'
import './Header.css'

function Header() {
  return (
    <header className="kasa-header">
      <NavLink to="/" aria-label="Accueil Kasa">
        <Logo variant="red" />
      </NavLink>
      <nav className="kasa-header-nav">
        <NavLink to="/" end className="kasa-header-link">
          Accueil
        </NavLink>
        <NavLink to="/about" className="kasa-header-link">
          À Propos
        </NavLink>
      </nav>
    </header>
  )
}

export default Header
