import './Logo.scss'

function Logo({ variant = 'red' }) {
  const src = variant === 'white' ? '/logo-white.svg' : '/logo.svg'
  return <img className="kasa-logo" src={src} alt="Kasa" />
}

export default Logo
