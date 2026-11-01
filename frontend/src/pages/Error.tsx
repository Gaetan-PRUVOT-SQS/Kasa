import { Link } from 'react-router-dom'
import './Error.css'

function ErrorPage() {
  return (
    <div className="kasa-error">
      <h1 className="kasa-error-code">404</h1>
      <p className="kasa-error-message">Oups! La page que vous demandez n'existe pas.</p>
      <Link to="/" className="kasa-error-link">
        Retourner sur la page d'accueil
      </Link>
    </div>
  )
}

export default ErrorPage
