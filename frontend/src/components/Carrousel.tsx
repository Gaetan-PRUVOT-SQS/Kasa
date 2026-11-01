import { useState } from 'react'
import './Carrousel.css'

interface CarrouselProps {
  pictures: readonly string[]
  title: string
}

function Carrousel(props: CarrouselProps) {
  const [index, setIndex] = useState(0)
  const total = props.pictures.length

  if (total === 0) {
    return null
  }

  const picture = props.pictures[index]
  if (picture === undefined) {
    return null
  }

  function prev() {
    setIndex((current) => (current === 0 ? total - 1 : current - 1))
  }

  function next() {
    setIndex((current) => (current === total - 1 ? 0 : current + 1))
  }

  return (
    <div className="kasa-carrousel">
      <img
        className="kasa-carrousel-image"
        src={picture}
        alt={`${props.title}, photo ${String(index + 1)} sur ${String(total)}`}
      />

      {total > 1 ? (
        <>
          <button
            type="button"
            className="kasa-carrousel-arrow kasa-carrousel-left"
            onClick={prev}
            aria-label="Photo précédente"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M15 18l-6-6 6-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            className="kasa-carrousel-arrow kasa-carrousel-right"
            onClick={next}
            aria-label="Photo suivante"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M9 6l6 6-6 6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <span className="kasa-carrousel-counter">
            {index + 1}/{total}
          </span>
        </>
      ) : null}
    </div>
  )
}

export default Carrousel
