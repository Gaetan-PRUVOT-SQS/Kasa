import './Host.css'

function Host(props) {
  return (
    <div className="kasa-host">
      <span className="kasa-host-name">{props.name}</span>
      <img className="kasa-host-picture" src={props.picture} alt={props.name} />
    </div>
  )
}

export default Host