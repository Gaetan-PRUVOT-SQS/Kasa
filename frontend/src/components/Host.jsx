import './Host.css'

function Host({ name, picture }) {
  return (
    <div className="kasa-host">
      <span className="kasa-host-name">{name}</span>
      <img className="kasa-host-picture" src={picture} alt={name} />
    </div>
  )
}

export default Host
