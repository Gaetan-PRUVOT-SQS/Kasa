import Banner from '../components/Banner'
import Card from '../components/Card'
import logements from '../logements.json'
import './Home.scss'

function Home() {
  return (
    <>
      <Banner image="/banner-home.jpg" title="Chez vous, partout et ailleurs" />
      <section className="kasa-home-grid">
        {logements.map((property) => (
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
