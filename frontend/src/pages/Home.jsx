import { useEffect, useState } from 'react'
import Banner from '../components/Banner'
import Card from '../components/Card'
import { getProperties } from '../services/api'
import './Home.css'

function Home() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getProperties()
      .then(setProperties)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="kasa-loading">Chargement…</p>
  if (error) return <p className="kasa-error">{error}</p>

  return (
    <>
      <Banner image="/banner-home.jpg" title="Chez vous, partout et ailleurs" />
      <section className="kasa-home-grid">
        {properties.map((property) => (
          <Card
            key={property.id}
            id={property.id}
            title={property.title}
            cover={property.cover}
          />
        ))}
      </section>
    </>
  )
}

export default Home