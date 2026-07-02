import './Banner.scss'

function Banner({ image, title }) {
  return (
    <section
      className="kasa-banner"
      style={image ? { backgroundImage: `url(${image})` } : undefined}
    >
      <span className="kasa-banner-overlay" aria-hidden="true" />
      {title && <h1 className="kasa-banner-title">{title}</h1>}
    </section>
  )
}

export default Banner
