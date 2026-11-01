import './Banner.css'

interface BannerProps {
  image?: string
  title?: string
}

function Banner(props: BannerProps) {
  const image = props.image
  const title = props.title
  const style = image === undefined ? undefined : { backgroundImage: `url(${image})` }

  return (
    <section className="kasa-banner" {...(style === undefined ? {} : { style })}>
      <span className="kasa-banner-overlay" aria-hidden="true" />
      {title ? <h1 className="kasa-banner-title">{title}</h1> : null}
    </section>
  )
}

export default Banner
