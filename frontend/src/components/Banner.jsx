import './Banner.css'

function Banner(props) {
  return (
    <section
      className="kasa-banner"
      style={props.image ? { backgroundImage: `url(${props.image})` } : undefined}
    >
      <span className="kasa-banner-overlay" aria-hidden="true" />
      {props.title && <h1 className="kasa-banner-title">{props.title}</h1>}
    </section>
  )
}

export default Banner