import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import './Layout.css'

function Layout() {
  return (
    <div className="kasa-app">
      <div className="kasa-container">
        <Header />
        <main className="kasa-main">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  )
}

export default Layout
