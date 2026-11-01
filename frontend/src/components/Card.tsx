import { Link } from 'react-router-dom'
import './Card.css'

interface CardProps {
  id: string
  title: string
  cover: string
}

function Card(props: CardProps) {
  return (
    <Link to={`/logement/${props.id}`} className="kasa-card">
      <img className="kasa-card-cover" src={props.cover} alt={props.title} />
      <h2 className="kasa-card-title">{props.title}</h2>
    </Link>
  )
}

export default Card
