import { useParams, Navigate } from 'react-router-dom'
import Carrousel from '../components/Carrousel'
import Tag from '../components/Tag'
import Rating from '../components/Rating'
import Host from '../components/Host'
import Collapse from '../components/Collapse'
import logements from '../logements.json'
import './FicheLogement.scss'

function FicheLogement() {
  const { id } = useParams()
  const property = logements.find((logement) => logement.id === id)

  if (!property) return <Navigate to="/404" replace />

  return (
    <article className="kasa-fiche">
      <Carrousel pictures={property.pictures} title={property.title} />

      <div className="kasa-fiche-head">
        <div className="kasa-fiche-title-block">
          <h1 className="kasa-fiche-title">{property.title}</h1>
          <p className="kasa-fiche-location">{property.location}</p>
          <ul className="kasa-fiche-tags">
            {property.tags.map((tag) => (
              <Tag key={tag} label={tag} />
            ))}
          </ul>
        </div>

        <div className="kasa-fiche-aside">
          <Host name={property.host.name} picture={property.host.picture} />
          <Rating rating={property.rating} />
        </div>
      </div>

      <div className="kasa-fiche-details">
        <Collapse title="Description">
          <p>{property.description}</p>
        </Collapse>
        <Collapse title="Équipements">
          <ul>
            {property.equipments.map((equipment) => (
              <li key={equipment}>{equipment}</li>
            ))}
          </ul>
        </Collapse>
      </div>
    </article>
  )
}

export default FicheLogement
