import { useEffect, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import Carrousel from '../components/Carrousel'
import Tag from '../components/Tag'
import Rating from '../components/Rating'
import Host from '../components/Host'
import Collapse from '../components/Collapse'
import { getProperty, type Property } from '../api/api'
import './FicheLogement.css'

function FicheLogement() {
  const params = useParams()
  const id = params.id
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id === undefined) {
      return
    }

    setLoading(true)
    setError(null)

    void getProperty(id)
      .then((item) => {
        setProperty(item)
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Impossible de charger le logement')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [id])

  if (id === undefined) {
    return <Navigate to="/404" replace />
  }
  if (loading) {
    return <p className="kasa-loading">Chargement…</p>
  }
  if (error !== null) {
    return <p className="kasa-error">{error}</p>
  }
  if (property === null) {
    return <Navigate to="/404" replace />
  }

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
