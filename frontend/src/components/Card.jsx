import { Link } from 'react-router-dom'
import './Card.scss'

function Card({ id, title, cover }) {
  return (
    <Link to={`/logement/${id}`} className="kasa-card">
      <img className="kasa-card-cover" src={cover} alt={title} />
      <h2 className="kasa-card-title">{title}</h2>
    </Link>
  )
}

export default Card
