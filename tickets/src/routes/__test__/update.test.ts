import request from 'supertest'
import { app } from '../../app'
import { generateId } from './../../utils/generate-id'
import { createTicket } from './../../utils/create-ticket'
import { updateTicket } from './../../utils/update-ticket'
import { natsWrapper } from '../../nats-wrapper'

it('returns a 404 if the provided id does not exists', async () => {
  const id = generateId()

  await updateTicket(id, 404)
})

it('returns a 401 if the user is not authenticated', async () => {
  const id = generateId()

  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: 'title',
      price: 20,
    })
    .expect(401)
})

it('returns a 401 if the user does not own the ticket', async () => {
  const response = await createTicket()
  const id = response.body.id

  await updateTicket(id, 401)

  const updatedResponse = await request(app).get(`/api/tickets/${id}`).send()

  expect(updatedResponse.body.title).toEqual(response.body.title)
})

it('returns a 400 if the user provides invalid inputs', async () => {
  const cookie = signin()
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'what ever',
      price: 20,
    })

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 20,
    })
    .expect(400)

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'title',
      price: -10,
    })
    .expect(400)
})

it('updates the ticket provided valid inputs', async () => {
  const cookie = signin()

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'what ever',
      price: 20,
    })

  const title = 'new title'
  const price = 10

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title,
      price,
    })
    .expect(200)

  const updatedResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()

  expect(updatedResponse.body.title).toEqual(title)
  expect(updatedResponse.body.price).toEqual(price)
})

it('publishes an event', async () => {
  const cookie = signin()

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'what ever',
      price: 20,
    })

  const title = 'new title'
  const price = 10

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title,
      price,
    })
  
    expect(natsWrapper.client.publish).toHaveBeenCalled()  
})
