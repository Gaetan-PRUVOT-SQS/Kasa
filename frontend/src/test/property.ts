import type { Property } from '../api/api'

export const sampleProperty: Property = {
  id: 'c67ab8a7',
  title: 'Appartement cosy',
  cover: '/cover.jpg',
  pictures: ['/a.jpg', '/b.jpg', '/c.jpg'],
  description: 'Un appartement calme.',
  host: { name: 'Nathalie Jean', picture: '/host.jpg' },
  rating: '4',
  location: 'Ile de France - Paris 17e',
  equipments: ['WIFI', 'Frigo'],
  tags: ['Batignolle', 'Montmartre'],
}
