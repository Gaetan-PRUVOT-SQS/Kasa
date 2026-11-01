import { useEffect, useState } from 'react'
import Banner from '../components/Banner'
import Card from '../components/Card'
import { getProperties, type Property } from '../api/api'
import './Home.css'

function Home() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    void getProperties()
      .then((items) => {
        setProperties(items)
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Impossible de charger les logements')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <p className="kasa-loading">Chargement…</p>
  }
  if (error !== null) {
    return <p className="kasa-error">{error}</p>
  }

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
