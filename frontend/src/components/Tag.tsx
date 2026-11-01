import './Tag.css'

interface TagProps {
  label: string
}

function Tag(props: TagProps) {
  return <li className="kasa-tag">{props.label}</li>
}

export default Tag
