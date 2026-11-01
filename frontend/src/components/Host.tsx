import './Host.css'

interface HostProps {
  name: string
  picture: string
}

function Host(props: HostProps) {
  return (
    <div className="kasa-host">
      <span className="kasa-host-name">{props.name}</span>
      <img className="kasa-host-picture" src={props.picture} alt={props.name} />
    </div>
  )
}

export default Host
