import request from 'supertest'
import { app } from '../../app'
import { createTicket } from './../../utils/create-ticket';

it('can fetch a list of tickets', async () => {
  await createTicket()
  await createTicket()
  await createTicket()

  const response = await request(app)
    .get('/api/tickets')
    .send()
  .expect(200)

  expect(response.body.length).toEqual(3)
})
