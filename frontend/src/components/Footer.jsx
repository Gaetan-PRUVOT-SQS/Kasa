import Logo from './Logo'
import './Footer.scss'

function Footer() {
  return (
    <footer className="kasa-footer">
      <Logo variant="white" />
      <p className="kasa-footer-copyright">© 2020 Kasa. All rights reserved</p>
    </footer>
  )
}

export default Footer
