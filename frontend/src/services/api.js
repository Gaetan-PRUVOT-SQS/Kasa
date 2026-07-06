const API_BASE =
  import.meta.env.VITE_API_URL ?? (import.meta.env.DEV ? '' : 'http://localhost:8080')

export async function getProperties() {
  const response = await fetch(`${API_BASE}/api/properties`)

  if (!response.ok) {
    throw new Error('Impossible de charger les logements')
  }

  return response.json()
}

export async function getProperty(id) {
  const response = await fetch(`${API_BASE}/api/properties/${id}`)

  if (response.status === 404) {
    return null
  }

  if (!response.ok) {
    throw new Error('Impossible de charger le logement')
  }

  return response.json()
}