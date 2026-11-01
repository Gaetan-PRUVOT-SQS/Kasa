import { useState, type ReactNode } from 'react'
import './Collapse.css'

interface CollapseProps {
  title: string
  children: ReactNode
}

function Collapse(props: CollapseProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="kasa-collapse">
      <button
        type="button"
        className="kasa-collapse-header"
        onClick={() => {
          setIsOpen((open) => !open)
        }}
        aria-expanded={isOpen}
      >
        <span className="kasa-collapse-title">{props.title}</span>
        <svg
          className={`kasa-collapse-chevron ${isOpen ? 'kasa-collapse-open' : ''}`}
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            d="M6 15l6-6 6 6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <div className={`kasa-collapse-content ${isOpen ? 'kasa-collapse-open' : ''}`}>
        <div className="kasa-collapse-inner">{props.children}</div>
      </div>
    </div>
  )
}

export default Collapse
