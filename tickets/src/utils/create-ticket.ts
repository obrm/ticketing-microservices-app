import request from 'supertest'
import { app } from '../app'

export const createTicket = () => {
  return request(app).post('/api/tickets').set('Cookie', signin()).send({
    title: 'what ever',
    price: 20,
  })
}
