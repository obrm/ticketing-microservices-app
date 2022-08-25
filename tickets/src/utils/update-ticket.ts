import request from 'supertest'
import { app } from '../app'

export const updateTicket = (id: string, statusCode: number) => {
  return request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', signin())
    .send({
      title: 'valid title',
      price: 20,
    })
    .expect(statusCode)
}
