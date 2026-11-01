import './Logo.css'

interface LogoProps {
  variant?: 'red' | 'white'
}

function Logo(props: LogoProps) {
  const variant = props.variant ?? 'red'
  const src = variant === 'white' ? '/logo-white.svg' : '/logo.svg'
  return <img className="kasa-logo" src={src} alt="Kasa" />
}

export default Logo
